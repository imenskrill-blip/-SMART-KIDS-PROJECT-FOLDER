import { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, Save, Settings, Bot, CheckCircle } from 'lucide-react'

export function Simulator() {
  const [code, setCode] = useState(`# روبوت يتحرك للأمام
import robot
robot.move_forward(100)
robot.turn_right(90)
for i in range(4):
    robot.move_forward(50)
    robot.turn_right(90)
robot.led_on("green")`)
  const [isRunning, setIsRunning] = useState(false)
  const [robotPosition, setRobotPosition] = useState({ x: 150, y: 150, angle: 0 })
  const [output, setOutput] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#333355'; ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke() }
    for (let i = 0; i < canvas.height; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke() }
    ctx.save(); ctx.translate(robotPosition.x, robotPosition.y); ctx.rotate((robotPosition.angle * Math.PI) / 180)
    ctx.beginPath(); ctx.fillStyle = '#4f46e5'; ctx.moveTo(15, 0); ctx.lineTo(-10, -10); ctx.lineTo(-10, 10); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#818cf8'; ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI * 2); ctx.fill(); ctx.arc(-5, 5, 3, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }, [robotPosition])

  const handleRun = () => {
    setIsRunning(true); setOutput(['تشغيل الكود...', 'تم تشغيل الروبوت!'])
    let angle = 0, x = 150, y = 150, steps = 0
    const interval = setInterval(() => {
      if (steps >= 50) { clearInterval(interval); setIsRunning(false); setOutput(p => [...p, 'اكتمل!']); return }
      x += Math.cos((angle * Math.PI) / 180) * 3; y += Math.sin((angle * Math.PI) / 180) * 3
      if (steps % 10 === 5) angle += 90
      setRobotPosition({ x, y, angle }); steps++
    }, 100)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-gradient-to-l from-green-600 to-green-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Bot className="w-8 h-8" />محاكي الروبوت</h1>
        <p className="text-green-100">اكتب الكود وشاهد الروبوت يتحرك</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
            <span className="text-sm text-gray-600">main.py</span>
            <div className="flex items-center gap-2">
              <button onClick={isRunning ? () => { setIsRunning(false); setOutput(p => [...p, 'تم الإيقاف']) } : handleRun} className={`p-2 rounded-lg ${isRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
              <button onClick={() => { setRobotPosition({ x: 150, y: 150, angle: 0 }); setOutput([]); setIsRunning(false) }} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"><RotateCcw className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"><Save className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full h-80 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none" dir="ltr" spellCheck={false} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b"><h3 className="font-medium">معاينة</h3></div>
          <canvas ref={canvasRef} width={400} height={300} className="w-full" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <h3 className="font-medium mb-3">المخرجات</h3>
        <div className="bg-gray-900 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm" dir="ltr">{output.length === 0 ? <span className="text-gray-500">في انتظار التنفيذ...</span> : output.map((l, i) => <div key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-400 mt-0.5" /><span className="text-green-400">{l}</span></div>)}</div>
      </div>
    </div>
  )
}
