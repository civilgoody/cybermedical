"use client"

import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { useEffect, useRef } from "react"

export default function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Draw dotted world map
    const dotSize = 2
    const dotSpacing = 12
    const mapColor = "#1F1F1F"

    // Simplified world map coordinates (you would need a more detailed set)
    for (let x = 0; x < rect.width; x += dotSpacing) {
      for (let y = 0; y < rect.height; y += dotSpacing) {
        ctx.fillStyle = mapColor
        ctx.beginPath()
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw threat points with glow effect
    const threats = [
      { x: 0.2, y: 0.3, color: "#FF29A8" },
      { x: 0.5, y: 0.2, color: "#FF29A8" },
      { x: 0.6, y: 0.3, color: "#FF29A8" },
      { x: 0.3, y: 0.4, color: "#FF29A8" },
      { x: 0.7, y: 0.6, color: "#00FFFF" }, // Blue threat point
    ]

    threats.forEach((threat) => {
      const x = threat.x * rect.width
      const y = threat.y * rect.height

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
      gradient.addColorStop(0, threat.color + "40") // 25% opacity
      gradient.addColorStop(1, "transparent")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright circle
      ctx.fillStyle = threat.color
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Threat Origin Map</h3>
          <p className="text-sm text-[#666666]">Click to see IP details</p>
        </div>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <canvas ref={canvasRef} className="w-full h-[200px]" style={{ width: "100%", height: "200px" }} />
    </Card>
  )
}

