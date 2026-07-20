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
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-slate-900/50 p-3 rounded-full hover:bg-rose-500 hover:shadow-lg transition-all duration-300 cursor-pointer z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
      </button>

      {/* Contenedor de la imagen y el título */}
      <div 
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic en la foto misma
        className="relative w-full max-w-4xl flex flex-col items-center cursor-default animate-in zoom-in-95 duration-300"
      >
        {/* Imagen con sombra pronunciada */}
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        />
        
        {/* Título inferior del producto - Estilo Glassmorphism Elegante */}
        <div className="mt-6 w-full max-w-2xl px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-center">
          <p className="text-white text-base sm:text-lg font-medium tracking-wide leading-relaxed drop-shadow-md">
            {imageAlt}
          </p>
        </div>
      </div>
    </div>
  )
}