"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Link } from "react-router-dom"
import { FaListUl, FaChartLine, FaLightbulb, FaPlus } from "react-icons/fa"

const productivityTips = [
  "Connect with Lin to gain more industrial knowledge",
  "Break large tasks into smaller, manageable steps.",
  "Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Prioritize your tasks using the Eisenhower Matrix.",
  "Eliminate distractions by turning off notifications during work sessions.",
  "Start your day by tackling your most important task first.",
]

// Enhanced particle background component
const ParticleBackground = () => {
  const particlesRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const particles = []

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        directionChangeTimer: 0,
        directionChangeDelay: Math.random() * 200 + 50,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Random direction changes
        particle.directionChangeTimer++
        if (particle.directionChangeTimer >= particle.directionChangeDelay) {
          particle.speedX = Math.random() * 1 - 0.5
          particle.speedY = Math.random() * 1 - 0.5
          particle.directionChangeTimer = 0
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw glow
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3,
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      particlesRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(particlesRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
}

// Enhanced card component with 3D effect
const Card3D = ({ to, color, icon, title, description }) => {
  const cardRef = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 })
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    const offsetX = (mouseX - centerX) / (rect.width / 2)
    const offsetY = (mouseY - centerY) / (rect.height / 2)

    rotateY.set(offsetX * 10)
    rotateX.set(offsetY * -10)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <Link to={to}>
      <motion.div
        ref={cardRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={`${color} bg-opacity-50 p-6 rounded-lg text-white hover:bg-opacity-70 transition-all duration-300 shadow-lg`}
      >
        <div style={{ transform: "translateZ(20px)" }}>
          {icon}
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p>{description}</p>
        </div>

        {/* Reflective surface */}
        <div
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
            transform: "translateZ(5px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </Link>
  )
}

export default function Home() {
  const [tip, setTip] = useState("")
  const [showQuickInput, setShowQuickInput] = useState(false)
  const [quickInput, setQuickInput] = useState("")

  useEffect(() => {
    generateTip()
  }, [])

  const generateTip = () => {
    const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)]
    setTip(randomTip)
  }

  const handleQuickInput = (e) => {
    e.preventDefault()
    console.log("Quick input:", quickInput)
    setQuickInput("")
    setShowQuickInput(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background */}
      <ParticleBackground />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-10 filter blur-3xl"
            style={{
              width: Math.random() * 500 + 300,
              height: Math.random() * 500 + 300,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 max-w-4xl w-full shadow-2xl border border-white border-opacity-10"
      >
        <motion.h1
          className="text-5xl font-bold mb-6 text-white"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          Tairos
        </motion.h1>
        <motion.p
          className="text-xl text-blue-100 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Welcome to Tairos Productivity App. Manage your tasks and expenses efficiently to boost your productivity and
          financial health.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card3D
            to="/todolists"
            color="bg-blue-700"
            icon={<FaListUl className="text-4xl mb-4" />}
            title="To-Do Lists"
            description="Organize your tasks and boost your productivity"
          />
          <Card3D
            to="/expensetracker"
            color="bg-green-700"
            icon={<FaChartLine className="text-4xl mb-4" />}
            title="Expense Tracker"
            description="Monitor your finances and make informed decisions"
          />
        </div>

        <motion.div
          className="bg-yellow-500 bg-opacity-20 p-6 rounded-lg mb-8 backdrop-filter backdrop-blur-sm border border-yellow-500 border-opacity-20"
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 70 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500 bg-opacity-30 flex items-center justify-center mr-3">
              <FaLightbulb className="text-yellow-300 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-white">Productivity Tip</h3>
          </div>
          <p className="text-blue-100 mb-4">{tip}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTip}
            className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300 shadow-lg"
          >
            New Tip
          </motion.button>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickInput(!showQuickInput)}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300 flex items-center shadow-lg"
          >
            <FaPlus className="mr-2" />
            Quick Add
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showQuickInput && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleQuickInput}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-10">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Enter a task or expense"
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300 shadow-lg"
                >
                  Add
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

