import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory / file-based storage for server state fallback
const DB_FILE = path.join(__dirname, 'server-dbt.json');

interface ServerDb {
  appointments: any[];
  doctors: any[];
  services: any[];
  settings: any;
}

function loadDb(): ServerDb {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading server DB file:', err);
  }
  return {
    appointments: [],
    doctors: [],
    services: [],
    settings: {},
  };
}

function saveDb(db: ServerDb): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing server DB file:', err);
  }
}

// Initialize DB
let currentDb = loadDb();

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AuraCare Clinic API', timestamp: new Date().toISOString() });
});

// Appointments API
app.get('/api/appointments', (req: Request, res: Response) => {
  const { department, status, search } = req.query;
  let result = [...currentDb.appointments];

  if (department && department !== 'ALL') {
    result = result.filter((a) => a.department === department);
  }
  if (status && status !== 'ALL') {
    result = result.filter((a) => a.status === status);
  }
  if (typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (a) =>
        (a.patientName && a.patientName.toLowerCase().includes(q)) ||
        (a.referenceNumber && a.referenceNumber.toLowerCase().includes(q)) ||
        (a.mobileNumber && a.mobileNumber.includes(q))
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.patientName || !body.mobileNumber || !body.department || !body.preferredDate) {
    res.status(400).json({ success: false, error: 'Missing required appointment fields' });
    return;
  }

  const newAppt = {
    ...body,
    id: `appt-${Date.now()}`,
    referenceNumber: body.referenceNumber || `AC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  currentDb.appointments.unshift(newAppt);
  saveDb(currentDb);

  res.status(201).json({ success: true, data: newAppt });
});

app.patch('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes, doctorId, doctorName, patientName, department } = req.body;

  const index = currentDb.appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    const newEntry = {
      id,
      patientName: patientName || 'Patient',
      department: department || 'ENT',
      status: status || 'Confirmed',
      adminNotes: adminNotes || '',
      doctorId: doctorId || '',
      doctorName: doctorName || '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    currentDb.appointments.unshift(newEntry);
    saveDb(currentDb);
    res.json({ success: true, data: newEntry });
    return;
  }

  currentDb.appointments[index] = {
    ...currentDb.appointments[index],
    ...(status ? { status } : {}),
    ...(adminNotes !== undefined ? { adminNotes } : {}),
    ...(doctorId ? { doctorId } : {}),
    ...(doctorName ? { doctorName } : {}),
    updatedAt: new Date().toISOString(),
  };

  saveDb(currentDb);
  res.json({ success: true, data: currentDb.appointments[index] });
});

// Admin stats
app.get('/api/stats', (req: Request, res: Response) => {
  const appts = currentDb.appointments;
  const pending = appts.filter((a) => a.status === 'Pending').length;
  const confirmed = appts.filter((a) => a.status === 'Confirmed').length;
  const ent = appts.filter((a) => a.department === 'ENT').length;
  const dental = appts.filter((a) => a.department === 'Dental').length;

  res.json({
    success: true,
    data: {
      totalAppointments: appts.length,
      pendingRequests: pending,
      confirmedAppointments: confirmed,
      entAppointments: ent,
      dentalAppointments: dental,
    },
  });
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Clinic server running at http://0.0.0.0:${PORT} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
