// components/ProductCardReadOnly.js
'use client'

export default function ProductCardReadOnly({ producto, onOpenImage }) {
  const nombreCategoria = producto.categorias?.nombre || 'Sin Categoría'
  const estaAgotado = producto.cantidad <= 0

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/80 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)] hover:-translate-y-1.5 overflow-hidden">
      
      {/* Contenedor Imagen con altura corregida para estabilidad en Tailwind v4 */}
      <div 
        onClick={() => producto.imagen_url && onOpenImage(producto.imagen_url, producto.articulo)}
        className={`h-80 w-full bg-gradient-to-br from-slate-50 to-slate-100/50 relative flex items-center justify-center overflow-hidden select-none ${producto.imagen_url ? 'cursor-zoom-in' : ''}`}
        title={producto.imagen_url ? "Click para ampliar imagen" : "Sin fotografía"}
      >
        {producto.imagen_url ? (
          <>
            <img src={producto.imagen_url} alt={producto.articulo} className="w-full h-full object-cover transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300 transform transition-transform duration-500 group-hover:scale-110">
            <div className="p-4 bg-white rounded-full shadow-xs border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sin foto</span>
          </div>
        )}
        
        {/* Badge de Stock */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide px-3 py-1.5 rounded-xl shadow-xs border backdrop-blur-md transition-all duration-300
            ${estaAgotado ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-slate-900/90 text-white border-slate-800'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${estaAgotado ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
            {estaAgotado ? 'AGOTADO' : `STOCK: ${producto.cantidad}`}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-5 bg-gradient-to-b from-white to-slate-50/30">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center gap-2">
            <span className="inline-block bg-slate-100/80 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-200/40">
              {nombreCategoria}
            </span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-100/60 px-2 py-0.5 rounded-md">
              #{producto.id.slice(-6).toUpperCase()}
            </span>
          </div>
          <h3 className="font-black text-slate-800 text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-slate-900 transition-colors">
            {producto.articulo}
          </h3>
        </div>

        {/* Precios Limpios sin Botones */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100/70">
          <div className="space-y-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">${producto.precio_tienda_usd || '0.00'}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase ml-1">usd</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50/80 border border-emerald-100/40 px-2.5 py-0.5 rounded-lg">
              <span>C$</span>
              <span>{producto.precio_tienda_nio || '0.00'}</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Disponible</span>
        </div>
      </div>
    </div>
  )
}