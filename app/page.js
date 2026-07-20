// app/page.js
'use client'
import { useState, useEffect } from 'react'
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

    // Sincronización en tiempo real para que los clientes vean cuando agregues stock
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

  const abrirVisorImagen = (url, alt) => { setModalImagen({ isOpen: true, url, alt }) }
  const cerrarVisorImagen = () => { setModalImagen({ isOpen: false, url: '', alt: '' }) }

  return (
    <main className="min-h-screen bg-pink-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Encabezado limpio de cara al cliente */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Inventario de la Tienda Cintia Celeni</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Explora nuestra selección de productos y encuentra la opción perfecta para ti. Calidad, confianza y excelentes beneficios en cada compra.</p>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20"><div className="w-9 h-9 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6"><p className="text-slate-400 text-sm font-semibold">No hay artículos disponibles temporalmente.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <ProductCardReadOnly
                key={prod.id}
                producto={prod}
                onOpenImage={abrirVisorImagen}
              />
            ))}
          </div>
        )}

        <ImageModal isOpen={modalImagen.isOpen} imageUrl={modalImagen.url} imageAlt={modalImagen.alt} onClose={cerrarVisorImagen} />
      </div>
    </main>
  )
}