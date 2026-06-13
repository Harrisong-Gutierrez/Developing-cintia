// components/ProductForm.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-toastify'

export default function ProductForm({ isOpen, productoEditando, onSave, onCancel }) {
  const [articulo, setArticulo] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [precioCosto, setPrecioCosto] = useState('')
  const [precioTiendaUsd, setPrecioTiendaUsd] = useState('')
  const [precioTiendaNio, setPrecioTiendaNio] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  
  const [categoriaTexto, setCategoriaTexto] = useState('')
  const [listaCategorias, setListaCategorias] = useState([])
  const [sugerencias, setSugerencias] = useState([])

  const cargarCategorias = async () => {
    const { data } = await supabase.from('categorias').select('*')
    if (data) setListaCategorias(data)
  }

  useEffect(() => {
    if (isOpen) cargarCategorias()
  }, [isOpen])

  useEffect(() => {
    if (productoEditando && isOpen) {
      setArticulo(productoEditando.articulo)
      setCantidad(productoEditando.cantidad)
      setPrecioCosto(productoEditando.precio_costo_usd || '')
      setPrecioTiendaUsd(productoEditando.precio_tienda_usd || '')
      setPrecioTiendaNio(productoEditando.precio_tienda_nio || '')
      setImagenUrl(productoEditando.imagen_url || '')
      
      if (productoEditando.categoria_id) {
        const cat = listaCategorias.find(c => c.id === productoEditando.categoria_id)
        setCategoriaTexto(cat ? cat.nombre : '')
      } else {
        setCategoriaTexto('')
      }
    } else {
      limpiarFormulario()
    }
  }, [productoEditando, isOpen, listaCategorias])

  const limpiarFormulario = () => {
    setArticulo('')
    setCantidad(0)
    setPrecioCosto('')
    setPrecioTiendaUsd('')
    setPrecioTiendaNio('')
    setImagenUrl('')
    setCategoriaTexto('')
    setSugerencias([])
  }

  const handleCategoriaChange = (e) => {
    const valor = e.target.value
    setCategoriaTexto(valor)
    if (valor.trim() === '') {
      setSugerencias([])
    } else {
      const filtradas = listaCategorias.filter(cat => 
        cat.nombre.toLowerCase().includes(valor.toLowerCase())
      )
      setSugerencias(filtradas)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setSubiendoImagen(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('fotos-inventario')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('fotos-inventario').getPublicUrl(fileName)
      setImagenUrl(data.publicUrl)
      toast.success('¡Imagen lista!')
    } catch (error) {
      toast.error('Error imagen: ' + error.message)
    } finally {
      setSubiendoImagen(false)
    }
  }

  // Función para remover la foto cargada en el estado actual del formulario
  const handleRemoverImagen = () => {
    setImagenUrl('')
    toast.info('Fotografía removida. Guarda para aplicar los cambios.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!articulo) return toast.warning('Nombre requerido')

    try {
      let catId = null
      if (categoriaTexto.trim() !== '') {
        const encontrada = listaCategorias.find(
          c => c.nombre.toLowerCase() === categoriaTexto.trim().toLowerCase()
        )

        if (encontrada) {
          catId = encontrada.id
        } else {
          const { data: nuevaCat, error: errCat } = await supabase
            .from('categorias')
            .insert([{ nombre: categoriaTexto.trim() }])
            .select()
            .single()

          if (errCat) throw errCat
          catId = nuevaCat.id
        }
      }

      const datosProducto = {
        articulo,
        cantidad: parseInt(cantidad),
        precio_costo_usd: precioCosto ? parseFloat(precioCosto) : null,
        precio_tienda_usd: precioTiendaUsd ? parseFloat(precioTiendaUsd) : null,
        precio_tienda_nio: precioTiendaNio ? parseFloat(precioTiendaNio) : null,
        imagen_url: imagenUrl || null, // Si está vacío se guarda explícitamente como NULL
        categoria_id: catId
      }

      if (productoEditando) {
        const { error } = await supabase.from('productos').update(datosProducto).eq('id', productoEditando.id)
        if (error) throw error
        toast.success('Actualizado correctamente')
      } else {
        const { error } = await supabase.from('productos').insert([datosProducto])
        if (error) throw error
        toast.success('Creado exitosamente')
      }

      limpiarFormulario()
      onSave()
    } catch (error) {
      toast.error('Error al guardar: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            {productoEditando ? '✏️ Editar Artículo' : '📦 Nuevo Artículo'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Artículo</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-sm"
              value={articulo}
              onChange={(e) => setArticulo(e.target.value)}
              placeholder="Ej. Reloj George"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-sm"
              value={categoriaTexto}
              onChange={handleCategoriaChange}
              placeholder="Ej. Cremas, Calzado..."
            />
            {sugerencias.length > 0 && (
              <div className="absolute z-10 w-full bg-white mt-1 border border-slate-200 rounded-xl shadow-lg max-h-32 overflow-y-auto">
                {sugerencias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoriaTexto(cat.nombre)
                      setSugerencias([])
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad</label>
              <input
                type="number"
                className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Costo (USD)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={precioCosto}
                onChange={(e) => setPrecioCosto(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Venta (USD)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={precioTiendaUsd}
                onChange={(e) => setPrecioTiendaUsd(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Venta (C$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={precioTiendaNio}
                onChange={(e) => setPrecioTiendaNio(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fotografía del Artículo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
            
            {/* Contenedor de la miniatura con botón de eliminación Nivel Dios */}
            {imagenUrl && (
              <div className="relative mt-3 w-20 h-20 group/img">
                <img 
                  src={imagenUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-xs" 
                />
                <button
                  type="button"
                  onClick={handleRemoverImagen}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition-transform active:scale-90 cursor-pointer"
                  title="Quitar imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subiendoImagen}
              className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}