// app/page.js
'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCardReadOnly from '@/components/ProductCardReadOnly'
import ImageModal from '@/components/ImageModal'

export default function HomePublica() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalImagen, setModalImagen] = useState({ isOpen: false, url: '', alt: '' })

  const cargarInventario = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error al sincronizar datos:', error.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarInventario()

    const canalRealtime = supabase
      .channel('cambios-publicos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        cargarInventario()
      })
      .subscribe()

    return () => {
      canalRealtime.unsubscribe()
    }
  }, [])

  // 🔹 Agrupar productos por categoría (colección)
  const productosAgrupados = useMemo(() => {
    const grupos = {}
    productos.forEach((prod) => {
      const nombre = prod.categorias?.nombre || 'Sin Categoría'
      if (!grupos[nombre]) grupos[nombre] = []
      grupos[nombre].push(prod)
    })

    return Object.entries(grupos).sort(([a], [b]) => {
      if (a === 'Sin Categoría') return 1
      if (b === 'Sin Categoría') return -1
      return a.localeCompare(b, 'es')
    })
  }, [productos])

  const abrirVisorImagen = (url, alt) => { setModalImagen({ isOpen: true, url, alt }) }
  const cerrarVisorImagen = () => { setModalImagen({ isOpen: false, url: '', alt: '' }) }

  return (
    <main className="min-h-screen bg-pink-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* Encabezado */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Inventario de la Tienda Cintia Celeni</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Explora nuestra selección de productos y encuentra la opción perfecta para ti. Calidad, confianza y excelentes beneficios en cada compra.</p>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="w-9 h-9 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6">
            <p className="text-slate-400 text-sm font-semibold">No hay artículos disponibles temporalmente.</p>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {productosAgrupados.map(([categoria, items], idx) => (
              <section key={`${categoria}-${idx}`} className="space-y-6">

                {/* 🎀 Banda de Colección Premium */}
                <div className="relative flex items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-white via-white to-pink-50/60 border border-slate-200/80 shadow-[0_4px_25px_rgba(244,63,94,0.08)] overflow-hidden">

                  {/* Glows decorativos de fondo */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Lado izquierdo: barra + título */}
                  <div className="flex items-center gap-3 md:gap-4 relative z-10 min-w-0">

                    {/* Barra vertical con glow */}
                    <span className="w-1.5 h-11 md:h-12 rounded-full bg-gradient-to-b from-pink-500 via-rose-500 to-rose-600 shadow-[0_0_18px_rgba(244,63,94,0.55)] shrink-0" />

                    <div className="min-w-0">
                      {/* Micro-etiqueta superior */}
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 mb-0.5">
                        Colección
                      </p>
                      {/* Título con gradient text */}
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                        {categoria}
                      </h2>
                    </div>
                  </div>

                  {/* Lado derecho: contador tipo badge oscuro */}
                  <div className="relative z-10 flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg shadow-slate-900/20 shrink-0">
                    <span className="text-lg md:text-2xl font-black leading-none tabular-nums">
                      {items.length}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none">
                      {items.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                  </div>

                  {/* Línea decorativa inferior con degradado */}
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent" />
                </div>

                {/* Grid de productos de la colección */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((prod) => (
                    <ProductCardReadOnly
                      key={prod.id}
                      producto={prod}
                      onOpenImage={abrirVisorImagen}
                    />
                  ))}
                </div>

              </section>
            ))}
          </div>
        )}

        <ImageModal isOpen={modalImagen.isOpen} imageUrl={modalImagen.url} imageAlt={modalImagen.alt} onClose={cerrarVisorImagen} />
      </div>
    </main>
  )
}