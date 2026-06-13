// app/layout.js
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // <-- ESTILOS OBLIGATORIOS
import './globals.css'

export const metadata = {
  title: 'Inventario de la Tienda v2',
  description: 'Gestión profesional de stock en tiempo real',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50 text-slate-900">
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