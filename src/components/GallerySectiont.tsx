import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import { GalleryImage } from '../types/indext';

interface GallerySectionProps {
  gallery: GalleryImage[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const categories = [
    'All',
    'ENT Facilities',
    'Dental Operatory',
    'Reception & Lounge',
    'Clinic Infrastructure',
    'Advanced Equipment',
  ];

  const filtered = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F6F2] text-[#16A6A1] text-xs font-semibold uppercase">
            <Camera className="w-3.5 h-3.5" />
            Modern Clinical Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#123B5D]">
            Clinic Facilities &amp; Photographs
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Explore our state-of-the-art diagnostic suites, ergonomic dental operatories, and sterile healthcare environments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#123B5D] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-4/3 bg-slate-100 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full text-slate-700 shadow-md">
                <ZoomIn className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold mt-1.5 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-6 bg-white space-y-1">
                <div className="text-xs font-bold text-[#16A6A1] uppercase tracking-wider">
                  {activeImage.category}
                </div>
                <h3 className="text-xl font-bold text-[#123B5D]">{activeImage.title}</h3>
                <p className="text-xs text-slate-600">{activeImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
