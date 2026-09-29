// components/MarqueeTitle.js
'use client'
import { useEffect, useRef, useState } from 'react'

export default function MarqueeTitle({ text, className = '' }) {
  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const [overflow, setOverflow] = useState(false)

  // 🔍 Detectar si el texto no cabe en el contenedor
  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !measureRef.current) return
      const textW = measureRef.current.offsetWidth
      const boxW = containerRef.current.clientWidth
      setOverflow(textW > boxW)
    }

    check()
    const t = setTimeout(check, 150)

    const ro = new ResizeObserver(check)
    if (containerRef.current) ro.observe(containerRef.current)

    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [text])

  // 🎚️ Duración proporcional al largo del texto
  const duration = Math.max(8, Math.min(30, text.length * 0.5 + 3))

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full">
      {/* Medidor invisible */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className={`invisible absolute top-0 left-0 whitespace-nowrap pointer-events-none ${className}`}
      >
        {text}
      </span>

      {overflow ? (
        // 🔑 w-max hace que el track mida SOLO lo que miden los 2 textos juntos
        //    Así -50% cae exactamente al inicio de la segunda copia → loop perfecto
        <div
          className="flex w-max whitespace-nowrap marquee-track"
          style={{ animationDuration: `${duration}s` }}
        >
          <span className={`pr-12 shrink-0 ${className}`}>{text}</span>
          <span className={`pr-12 shrink-0 ${className}`} aria-hidden="true">{text}</span>
        </div>
      ) : (
        <span className={`block truncate ${className}`}>{text}</span>
      )}
    </div>
  )
}