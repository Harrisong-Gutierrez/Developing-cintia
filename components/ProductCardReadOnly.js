// components/ProductCardReadOnly.js
'use client'

export default function ProductCardReadOnly({ producto, onOpenImage }) {
    const nombreCategoria = producto.categorias?.nombre || 'Sin Categoría'
    const estaAgotado = producto.cantidad <= 0

    // 🚨 REEMPLAZA ESTO: Pon tu número de Nicaragua (sin el signo +, solo el 505 seguido de tu número)
    const TELEFONO_WHATSAPP = '50575342731' 

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
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

                {/* Precios y Disponibilidad */}
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
                    
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${estaAgotado ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-100 text-slate-400'}`}>
                        {estaAgotado ? 'No disponible' : 'Disponible'}
                    </span>
                </div>

                {/* Botón de WhatsApp con Formato de Texto Avanzado e Imagen */}
                <div className="pt-2">
                    {estaAgotado ? (
                        <button
                            disabled
                            className="w-full py-2.5 bg-slate-200 text-slate-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            Artículo Agotado
                        </button>
                    ) : (
                        <a
                            href={`https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(
                                `- ¡Hola! Me interesa este producto:\n\n` +
                                `- Articulo: ${producto.articulo}\n` +
                                `- ID: #${producto.id.slice(-6).toUpperCase()}\n` +
                                `- Precio: $${producto.precio_tienda_usd || '0.00'} USD\n` +
                                `${producto.imagen_url ? `- Foto del producto: ${producto.imagen_url}` : ''}\n\n` +
                                `¿Está disponible?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                            {/* Icono oficial de WhatsApp SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.69-4.98c-.202-.101-1.194-.588-1.379-.653-.185-.066-.32-.099-.455.101-.134.2-.522.653-.64.784-.118.131-.235.148-.438.047a6.134 6.134 0 0 1-1.63-1.006 7.174 7.174 0 0 1-1.127-1.4c-.118-.202-.012-.311.089-.412.09-.09.2-.234.3-.35.099-.117.133-.198.198-.33a.465.465 0 0 0-.024-.442c-.066-.135-.455-1.099-.623-1.503-.164-.397-.33-.343-.455-.349-.115-.005-.247-.005-.38-.005-.133 0-.35.05-.533.25-.183.2-.699.683-.699 1.666 0 .983.715 1.931.815 2.064.1.133 1.4 2.143 3.393 3.004.474.205.845.328 1.134.42.476.151.91.13 1.253.08.383-.057 1.194-.488 1.362-1.03.168-.543.168-1.01.118-1.106-.05-.098-.185-.148-.387-.249z" />
                            </svg>
                            Consultar por WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}