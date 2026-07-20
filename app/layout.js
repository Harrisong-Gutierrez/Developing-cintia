// app/layout.js
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // <-- ESTILOS OBLIGATORIOS
import './globals.css'

export const metadata = {
  title: 'Inventario de Productos Celeni',
  description: 'Gestión profesional de stock en tiempo real',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Evita que el navegador fuerce el zoom en los inputs
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-pink-300 text-slate-900">
        {children}
        
        {/* Contenedor único donde se renderizan las alertas */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" 
        />
      </body>
    </html>
  )
}