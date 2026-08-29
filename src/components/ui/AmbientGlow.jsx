import { useEffect, useRef, useState } from 'react'

function AmbientGlow() {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: '50%', y: '40%' })

  useEffect(() => {
    function handleMouseMove(e) {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setPos({
        x: `${e.clientX - rect.left}px`,
        y: `${e.clientY - rect.top}px`,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={ref}
      data-testid="ambient-glow"
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      <div
        className="absolute h-[420px] w-[420px] rounded-full blur-3xl transition-[left,top] duration-300 ease-out"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(139,123,255,0.20), rgba(37,201,208,0.10) 60%, transparent 80%)',
        }}
      />
    </div>
  )
}

export default AmbientGlow
