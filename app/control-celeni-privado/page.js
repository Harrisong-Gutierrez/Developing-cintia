// app/control-celeni-privado/page.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-toastify'
import ProductForm from '@/components/ProductForm'
import ProductCard from '@/components/ProductCard'
import ImageModal from '@/components/ImageModal'

export default function AdminPage() {
  const [productos, setProductos] = useState([])
  const [productoEditando, setProductoEditando] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [modalImagen, setModalImagen] = useState({ isOpen: false, url: '', alt: '' })

  // --- CONTROL DE SEGURIDAD ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  // Puedes cambiar 'Celeni2026' por la clave que tú prefieras
  const CONTRASEÑA_SECRETA = 'Celeni2026' 

  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === CONTRASEÑA_SECRETA) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_session_active', 'true')
      toast.success('¡Acceso concedido!')
    } else {
      toast.error('Contraseña incorrecta')
    }
  }

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('admin_session_active')
    if (sesionGuardada === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

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

  const handleEliminarProducto = async (id) => {
    try {
      const { error } = await supabase.from('productos').delete().eq('id', id)
      if (error) throw error
      toast.error('Artículo eliminado del inventario')
      await cargarInventario()
    } catch (error) {
      toast.error('No se pudo eliminar: ' + error.message)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    cargarInventario()

    const canalRealtime = supabase
      .channel('cambios-reales')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        cargarInventario()
      })
      .subscribe()

    return () => {
      canalRealtime.unsubscribe()
    }
  }, [isAuthenticated])

  const abrirVisorImagen = (url, alt) => { setModalImagen({ isOpen: true, url, alt }) }
  const cerrarVisorImagen = () => { setModalImagen({ isOpen: false, url: '', alt: '' }) }

  // --- PANTALLA DE BLOQUEO SI NO ESTÁ AUTENTICADO ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm text-center animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Acceso Privado</h2>
          <p className="text-xs text-slate-500 font-medium mb-6">Sección de administración del inventario Celeni.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-base text-center font-bold tracking-widest"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer">
              Entrar al Panel
            </button>
          </form>
        </div>
      </main>
    )
  }

  // --- TU VISTA ORIGINAL EDITABLE ---
  return (
    <main className="min-h-screen bg-pink-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-xs gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Panel Administrador - Cintia Celeni</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Gestión y control total de stock.</p>
          </div>
          <button
            onClick={() => { setProductoEditando(null); setIsModalOpen(true); }}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 self-stretch sm:self-auto justify-center active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            Agregar Artículo
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center py-20"><div className="w-9 h-9 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6"><p className="text-slate-400 text-sm font-semibold">Catálogo vacío.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((prod) => (
              <ProductCard
                key={prod.id}
                producto={prod}
                onEdit={(p) => { setProductoEditando(p); setIsModalOpen(true); }}
                onDelete={handleEliminarProducto}
                onOpenImage={abrirVisorImagen}
              />
            ))}
          </div>
        )}

        <ProductForm
          isOpen={isModalOpen}
          productoEditando={productoEditando}
          onSave={async () => { setIsModalOpen(false); setProductoEditando(null); await cargarInventario(); }}
          onCancel={() => { setIsModalOpen(false); setProductoEditando(null); }}
        />

        <ImageModal isOpen={modalImagen.isOpen} imageUrl={modalImagen.url} imageAlt={modalImagen.alt} onClose={cerrarVisorImagen} />
      </div>
    </main>
  )
}