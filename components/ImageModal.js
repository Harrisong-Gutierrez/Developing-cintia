// components/ImageModal.js
'use client'

export default function ImageModal({ isOpen, imageUrl, imageAlt, onClose }) {
  if (!isOpen || !imageUrl) return null

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
    >
      {/* Botón de cerrar flotante */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-slate-900/50 p-3 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
      </button>

      {/* Contenedor de la imagen */}
      <div 
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic en la foto misma
        className="relative max-w-3xl max-h-[80vh] w-full flex flex-col items-center cursor-default animate-in zoom-in-95 duration-200"
      >
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />
        {/* Título inferior del producto */}
        <p className="text-white text-sm font-black mt-4 text-center bg-slate-900/80 px-4 py-2 rounded-xl backdrop-blur-xs max-w-md line-clamp-1">
          {imageAlt}
        </p>
      </div>
    </div>
  )
}