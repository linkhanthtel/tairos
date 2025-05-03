"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { format, parse, startOfWeek, getDay, addMinutes, isSameDay } from "date-fns"
import enUS from "date-fns/locale/en-US"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion"
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaRegBell,
  FaUsers,
  FaLocationArrow,
  FaTag,
  FaEllipsisH,
  FaRegCalendarCheck,
  FaRegCalendarAlt,
  FaRegClock,
  FaRegCalendarTimes,
  FaRegMoon,
  FaRegSun,
} from "react-icons/fa"

// Date-fns configuration
const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Holographic Particle System
const HolographicParticles = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Create particles
    const particleCount = 150
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 60 + 200, // Blue to purple range
          pulse: Math.random() * 2 * Math.PI,
          pulseSpeed: 0.01 + Math.random() * 0.02,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update pulse
        particle.pulse += particle.pulseSpeed
        const pulseFactor = 0.2 * Math.sin(particle.pulse) + 1

        // Calculate distance from mouse
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Interactive effects based on mouse proximity
        if (distance < maxDistance) {
          // Repel particles from mouse
          const force = (1 - distance / maxDistance) * 0.2
          particle.x += dx * force
          particle.y += dy * force

          // Increase size and brightness near mouse
          particle.size = (Math.random() * 2 + 0.5) * (1 + (1 - distance / maxDistance) * 1.5) * pulseFactor

          // Shift color toward cyan/teal near mouse
          const hueShift = (1 - distance / maxDistance) * 40
          ctx.fillStyle = `hsla(${particle.hue - hueShift}, 90%, 70%, ${particle.opacity + (1 - distance / maxDistance) * 0.3})`
        } else {
          // Normal movement
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.size = (Math.random() * 2 + 0.5) * pulseFactor
          ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`
        }

        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = window.innerWidth
        if (particle.x > window.innerWidth) particle.x = 0
        if (particle.y < 0) particle.y = window.innerHeight
        if (particle.y > window.innerHeight) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw subtle glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, ctx.fillStyle)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  )
}

// Futuristic Grid Background
const FuturisticGrid = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 15s ease infinite",
        }}
      />

      {/* Animated nebula-like elements */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 155) + 200}, 0.8) 0%, rgba(${Math.floor(Math.random() * 50) + 20}, ${Math.floor(Math.random() * 50) + 20}, ${Math.floor(Math.random() * 100) + 155}, 0.2) 100%)`,
            width: `${Math.random() * 600 + 300}px`,
            height: `${Math.random() * 600 + 300}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(80px)",
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            x: ["-50%", `${Math.random() * 10 - 5}%`, "-50%"],
            y: ["-50%", `${Math.random() * 10 - 5}%`, "-50%"],
            scale: [1, Math.random() * 0.3 + 0.9, 1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Horizontal grid lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-cyan-500"
            style={{
              top: `${(i + 1) * 5}%`,
              opacity: 0.1,
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.7) 50%, transparent 100%)",
            }}
            animate={{
              opacity: [0.05, 0.2, 0.05],
              backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Vertical grid lines */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-blue-500"
            style={{
              left: `${(i + 1) * 5}%`,
              opacity: 0.1,
              backgroundImage: "linear-gradient(0deg, transparent 0%, rgba(59, 130, 246, 0.7) 50%, transparent 100%)",
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"],
            }}
            transition={{
              duration: 15 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Holographic Event Card
const HolographicEvent = ({ event, onClick }) => {
  const controls = useAnimation()
  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const scale = useMotionValue(1)
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 })
  const glow = useMotionValue(0)
  const springGlow = useSpring(glow, { stiffness: 300, damping: 30 })

  useEffect(() => {
    controls.start({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, type: "spring" },
    })
  }, [controls])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    const offsetX = ((mouseX - centerX) / (rect.width / 2)) * 10
    const offsetY = ((mouseY - centerY) / (rect.height / 2)) * 10

    rotateY.set(offsetX)
    rotateX.set(-offsetY)
    glow.set(1)
  }

  const handleMouseLeave = () => {
    rotateY.set(0)
    rotateX.set(0)
    glow.set(0)
  }

  const handleMouseEnter = () => {
    scale.set(1.05)
  }

  const handleMouseOut = () => {
    scale.set(1)
  }

  // Get priority color
  const getPriorityColor = () => {
    switch (event.priority) {
      case "high":
        return { primary: "#ef4444", secondary: "#f87171" }
      case "medium":
        return { primary: "#f59e0b", secondary: "#fbbf24" }
      case "low":
        return { primary: "#10b981", secondary: "#34d399" }
      default:
        return { primary: "#3b82f6", secondary: "#60a5fa" }
    }
  }

  const { primary, secondary } = getPriorityColor()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(event)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseOut={handleMouseOut}
      style={{
        scale: springScale,
        rotateY: springRotateY,
        rotateX: springRotateX,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        height: "100%",
        position: "relative",
      }}
      className="cursor-pointer"
    >
      {/* Holographic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: useTransform(springGlow, [0, 1], [`0 0 0px ${primary}00`, `0 0 20px ${primary}aa`]),
          opacity: useTransform(springGlow, [0, 1], [0, 1]),
          zIndex: -1,
        }}
      />

      {/* Main card content */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primary}cc 0%, ${secondary}cc 100%)`,
          borderRadius: "8px",
          color: "white",
          padding: "4px 8px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: `0 4px 12px ${primary}40`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Holographic lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              ${primary}00 0px,
              ${primary}22 1px,
              ${primary}00 2px,
              ${primary}00 10px
            )`,
            opacity: useTransform(springGlow, [0, 1], [0.1, 0.4]),
          }}
        />

        {/* Event title */}
        <div className="flex-1 truncate font-medium text-white text-shadow z-10">{event.title}</div>

        {/* Event time */}
        <div className="flex items-center justify-between mt-1 text-xs text-white text-opacity-90">
          <div className="flex items-center">
            <FaRegClock className="mr-1" size={10} />
            {format(event.start, "h:mm a")}
          </div>

          {/* Priority indicator */}
          {event.priority && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: primary,
                boxShadow: `0 0 5px ${primary}`,
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Futuristic Time Indicator
const FuturisticTimeIndicator = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="absolute top-4 right-4 bg-black bg-opacity-40 backdrop-filter backdrop-blur-md rounded-lg p-3 text-cyan-400 font-mono flex items-center z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <FaRegClock className="mr-2" />
      <div className="text-lg">{format(time, "HH:mm:ss")}</div>
      <div className="ml-3 text-xs text-cyan-300 opacity-80">{format(time, "MMM dd, yyyy")}</div>
    </motion.div>
  )
}

// 3D Floating Navigation
const FloatingNavigation = ({ view, onViewChange }) => {
  return (
    <motion.div
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-md rounded-full p-1 flex items-center">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full flex items-center justify-center ${view === "month" ? "bg-cyan-600 text-white" : "text-cyan-400"}`}
          onClick={() => onViewChange("month")}
        >
          <FaRegCalendarAlt size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full flex items-center justify-center ${view === "week" ? "bg-cyan-600 text-white" : "text-cyan-400"}`}
          onClick={() => onViewChange("week")}
        >
          <FaRegCalendarCheck size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full flex items-center justify-center ${view === "day" ? "bg-cyan-600 text-white" : "text-cyan-400"}`}
          onClick={() => onViewChange("day")}
        >
          <FaRegCalendarTimes size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full flex items-center justify-center ${view === "agenda" ? "bg-cyan-600 text-white" : "text-cyan-400"}`}
          onClick={() => onViewChange("agenda")}
        >
          <FaEllipsisH size={18} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Holographic Date Navigation
const HolographicDateNav = ({ date, onNavigate }) => {
  return (
    <motion.div
      className="absolute top-4 left-4 z-20 flex items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-md text-cyan-400 mr-2"
        onClick={() => onNavigate("PREV")}
      >
        <FaChevronLeft />
      </motion.button>

      <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-md rounded-lg px-4 py-2 text-cyan-300 font-medium">
        {format(date, "MMMM yyyy")}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-md text-cyan-400 ml-2"
        onClick={() => onNavigate("NEXT")}
      >
        <FaChevronRight />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-md text-cyan-400 ml-4"
        onClick={() => onNavigate("TODAY")}
      >
        <FaCalendarAlt />
      </motion.button>
    </motion.div>
  )
}

// Futuristic Add Event Button
const AddEventButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)" }}
      whileTap={{ scale: 0.95 }}
      className="absolute bottom-6 right-6 z-20 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <FaPlus size={24} />
    </motion.button>
  )
}

// Holographic Event Details Modal
const HolographicEventModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-cyan-500 border-opacity-30"
      style={{
        boxShadow: "0 0 40px rgba(6, 182, 212, 0.3)",
      }}
    >
      {/* Holographic header effect */}
      <div className="absolute -top-10 left-0 right-0 h-20 overflow-hidden pointer-events-none">
        <div
          className="w-full h-40 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0) 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      <div className="relative">
        {/* Event header */}
        <div className="flex justify-between items-start mb-6">
          <div
            className="w-2 h-16 rounded-full mr-3"
            style={{
              background: `linear-gradient(to bottom, ${event.color}, ${event.secondaryColor})`,
              boxShadow: `0 0 10px ${event.color}`,
            }}
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
            <div className="flex items-center text-cyan-300 text-sm">
              <FaRegCalendarAlt className="mr-2" />
              <span className="mr-3">{format(event.start, "MMM dd, yyyy")}</span>
              <FaRegClock className="mr-2" />
              <span>
                {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
              </span>
            </div>
          </div>
          {event.priority && (
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background:
                  event.priority === "high"
                    ? "rgba(239, 68, 68, 0.2)"
                    : event.priority === "medium"
                      ? "rgba(245, 158, 11, 0.2)"
                      : "rgba(16, 185, 129, 0.2)",
                color: event.priority === "high" ? "#ef4444" : event.priority === "medium" ? "#f59e0b" : "#10b981",
              }}
            >
              {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
            </div>
          )}
        </div>

        {/* Event details */}
        {event.description && (
          <div className="mb-6 bg-white bg-opacity-10 p-4 rounded-xl border border-white border-opacity-10">
            <p className="text-gray-200 whitespace-pre-line">{event.description}</p>
          </div>
        )}

        {/* Additional event metadata */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center">
            <FaUsers className="text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-cyan-300">Attendees</div>
              <div className="text-white text-sm">3 People</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center">
            <FaLocationArrow className="text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-cyan-300">Location</div>
              <div className="text-white text-sm">Virtual</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center">
            <FaRegBell className="text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-cyan-300">Reminder</div>
              <div className="text-white text-sm">15 minutes before</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center">
            <FaTag className="text-cyan-400 mr-3" />
            <div>
              <div className="text-xs text-cyan-300">Category</div>
              <div className="text-white text-sm">Meeting</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(event)}
            className="px-4 py-2 rounded-lg text-red-400 border border-red-500 border-opacity-30 bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-colors"
          >
            <FaTrash className="mr-2 inline-block" /> Delete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(event)}
            className="px-4 py-2 rounded-lg text-cyan-400 border border-cyan-500 border-opacity-30 bg-cyan-500 bg-opacity-10 hover:bg-opacity-20 transition-colors"
          >
            <FaEdit className="mr-2 inline-block" /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Holographic Event Form
const HolographicEventForm = ({ event, onClose, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start: event?.start || new Date(),
    end: event?.end || addMinutes(new Date(), 60),
    color: event?.color || "#06b6d4",
    secondaryColor: event?.secondaryColor || "#22d3ee",
    priority: event?.priority || "medium",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...event,
      ...formData,
      id: event?.id || Date.now().toString(),
    })
  }

  const colorPairs = [
    { primary: "#06b6d4", secondary: "#22d3ee" }, // Cyan
    { primary: "#3b82f6", secondary: "#60a5fa" }, // Blue
    { primary: "#8b5cf6", secondary: "#a78bfa" }, // Purple
    { primary: "#ec4899", secondary: "#f472b6" }, // Pink
    { primary: "#10b981", secondary: "#34d399" }, // Green
    { primary: "#f59e0b", secondary: "#fbbf24" }, // Amber
    { primary: "#ef4444", secondary: "#f87171" }, // Red
    { primary: "#6366f1", secondary: "#818cf8" }, // Indigo
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-cyan-500 border-opacity-30"
      style={{
        boxShadow: "0 0 40px rgba(6, 182, 212, 0.3)",
      }}
    >
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
        {isEditing ? "Edit Event" : "Create New Event"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Title</label>
            <motion.input
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-white bg-opacity-10 border border-cyan-500 border-opacity-30 rounded-xl text-white focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Description</label>
            <motion.textarea
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-white bg-opacity-10 border border-cyan-500 border-opacity-30 rounded-xl text-white focus:outline-none transition-all duration-200"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Start Time</label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.3)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                type="datetime-local"
                name="start"
                value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start: new Date(e.target.value),
                    end: new Date(e.target.value) > prev.end ? addMinutes(new Date(e.target.value), 60) : prev.end,
                  }))
                }
                className="w-full p-3 bg-white bg-opacity-10 border border-cyan-500 border-opacity-30 rounded-xl text-white focus:outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">End Time</label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.3)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                type="datetime-local"
                name="end"
                value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end: new Date(e.target.value),
                  }))
                }
                className="w-full p-3 bg-white bg-opacity-10 border border-cyan-500 border-opacity-30 rounded-xl text-white focus:outline-none transition-all duration-200"
                required
                min={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Priority</label>
            <div className="flex gap-3">
              {["low", "medium", "high"].map((priority) => (
                <motion.button
                  key={priority}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                    formData.priority === priority
                      ? "border-transparent text-white"
                      : "border border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                  }`}
                  style={{
                    backgroundColor:
                      formData.priority === priority
                        ? priority === "high"
                          ? "rgba(239, 68, 68, 0.3)"
                          : priority === "medium"
                            ? "rgba(245, 158, 11, 0.3)"
                            : "rgba(16, 185, 129, 0.3)"
                        : "transparent",
                    boxShadow:
                      formData.priority === priority
                        ? `0 0 15px ${priority === "high" ? "rgba(239, 68, 68, 0.3)" : priority === "medium" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`
                        : "none",
                  }}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cyan-300">Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {colorPairs.map((pair, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, boxShadow: `0 0 10px ${pair.primary}` }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      color: pair.primary,
                      secondaryColor: pair.secondary,
                    }))
                  }
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    formData.color === pair.primary ? "ring-2 ring-offset-2 ring-cyan-400" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${pair.primary} 0%, ${pair.secondary} 100%)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-white bg-opacity-10 text-white rounded-xl hover:bg-opacity-20 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-lg"
          >
            {isEditing ? "Update Event" : "Add Event"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

// Main Calendar Component
const Calendar = () => {
  const [events, setEvents] = useState([])
  const [modalType, setModalType] = useState(null) // "create", "view", "edit"
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState("month")
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Generate some sample events on first render
  useEffect(() => {
    const today = new Date()
    const sampleEvents = [
      {
        id: "1",
        title: "Team Sync Meeting",
        description: "Weekly team sync to discuss project progress and roadblocks.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
        color: "#06b6d4",
        secondaryColor: "#22d3ee",
        priority: "medium",
      },
      {
        id: "2",
        title: "Product Launch",
        description: "Final preparation for the new feature release. Make sure all documentation is ready.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0),
        color: "#ec4899",
        secondaryColor: "#f472b6",
        priority: "high",
      },
      {
        id: "3",
        title: "Client Call",
        description: "Quarterly review with the client to discuss performance and future plans.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 9, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 0),
        color: "#10b981",
        secondaryColor: "#34d399",
        priority: "low",
      },
      {
        id: "4",
        title: "Design Review",
        description: "Review the latest UI designs with the design team.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        color: "#8b5cf6",
        secondaryColor: "#a78bfa",
        priority: "medium",
      },
      {
        id: "5",
        title: "Tech Interview",
        description: "Interview candidate for senior developer position.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 12, 0),
        color: "#3b82f6",
        secondaryColor: "#60a5fa",
        priority: "high",
      },
    ]
    setEvents(sampleEvents)
  }, [])

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(start)
    setSelectedEvent({
      start,
      end: end || addMinutes(start, 60),
    })
    setModalType("create")
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setModalType("view")
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedEvent(null)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setModalType("edit")
  }

  const handleDeleteEvent = (event) => {
    setEvents(events.filter((e) => e.id !== event.id))
    setModalType(null)
  }

  const handleSaveEvent = (event) => {
    if (modalType === "edit") {
      setEvents(events.map((e) => (e.id === event.id ? event : e)))
    } else {
      setEvents([...events, event])
    }
    setModalType(null)
  }

  const handleNavigate = (action) => {
    const newDate = new Date(currentDate)

    if (action === "PREV") {
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (currentView === "week") {
        newDate.setDate(newDate.getDate() - 7)
      } else if (currentView === "day") {
        newDate.setDate(newDate.getDate() - 1)
      }
    } else if (action === "NEXT") {
      if (currentView === "month") {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (currentView === "week") {
        newDate.setDate(newDate.getDate() + 7)
      } else if (currentView === "day") {
        newDate.setDate(newDate.getDate() + 1)
      }
    } else if (action === "TODAY") {
      newDate.setTime(new Date().getTime())
    }

    setCurrentDate(newDate)
  }

  const calendarCustomStyles = {
    style: {
      height: 650,
      background: "rgba(15, 23, 42, 0.6)",
      borderRadius: "16px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      border: "1px solid rgba(6, 182, 212, 0.2)",
      padding: "20px",
      position: "relative",
      zIndex: 10,
      color: "white",
    },
    dayPropGetter: (date) => ({
      style: {
        backgroundColor: isSameDay(date, new Date()) ? "rgba(6, 182, 212, 0.2)" : "rgba(30, 41, 59, 0.5)",
        borderRadius: "8px",
        margin: "2px",
        transition: "all 0.2s ease",
        color: "white",
      },
    }),
    eventPropGetter: (event) => ({
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    }),
    components: {
      event: (props) => <HolographicEvent {...props} onClick={handleSelectEvent} />,
    },
  }

  // Custom CSS styles
  const customStyles = `
    .rbc-calendar {
      font-family: "Inter", sans-serif;
      color: white;
    }

    .rbc-header {
      padding: 12px 3px;
      font-weight: 600;
      font-size: 0.9rem;
      background: rgba(30, 41, 59, 0.7);
      border-radius: 8px 8px 0 0;
      border: none !important;
      color: #06b6d4;
    }

    .rbc-month-view {
      border-radius: 16px;
      border: none !important;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .rbc-day-bg {
      transition: all 0.3s ease;
    }

    .rbc-day-bg:hover {
      background-color: rgba(6, 182, 212, 0.1) !important;
    }

    .rbc-off-range-bg {
      background-color: rgba(15, 23, 42, 0.7) !important;
    }

    .rbc-today {
      background-color: rgba(6, 182, 212, 0.2) !important;
    }

    .rbc-event {
      border: none !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
    }

    .rbc-event:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .rbc-toolbar button {
      border-radius: 8px !important;
      transition: all 0.2s ease;
      color: white;
      border: 1px solid rgba(6, 182, 212, 0.3) !important;
      background: rgba(30, 41, 59, 0.7);
      padding: 8px 16px;
      font-weight: 500;
    }

    .rbc-toolbar button:hover {
      background-color: rgba(6, 182, 212, 0.2) !important;
      color: white;
    }

    .rbc-toolbar button.rbc-active {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
      border: none !important;
    }

    .rbc-toolbar {
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
      color: white;
    }

    .rbc-btn-group {
      margin: 0 !important;
    }

    .rbc-time-view {
      border-radius: 16px;
      overflow: hidden;
      border: none !important;
    }

    .rbc-time-header {
      border-radius: 16px 16px 0 0;
      overflow: hidden;
    }

    .rbc-time-content {
      border-radius: 0 0 16px 16px;
      overflow: hidden;
    }

    .rbc-day-slot .rbc-events-container {
      margin-right: 0 !important;
    }

    .rbc-current-time-indicator {
      background-color: #06b6d4 !important;
      height: 2px;
      box-shadow: 0 0 5px #06b6d4;
    }

    .rbc-time-slot {
      color: rgba(255, 255, 255, 0.7);
    }

    .rbc-label {
      color: #06b6d4;
    }

    .rbc-agenda-view table.rbc-agenda-table {
      color: white;
      background: rgba(30, 41, 59, 0.7);
      border-radius: 8px;
    }

    .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
      color: #06b6d4;
      background: rgba(15, 23, 42, 0.9);
      border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    }

    .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
      border-bottom: 1px solid rgba(6, 182, 212, 0.1);
    }

    .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
      background-color: rgba(6, 182, 212, 0.1);
    }

    @keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .text-shadow {
      text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    }
  `

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen overflow-hidden relative p-6">
        {/* Background Elements */}
        <FuturisticGrid />
        <HolographicParticles />

        {/* Dark/Light Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(6, 182, 212, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-20 z-20 p-3 rounded-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-md text-cyan-400"
          onClick={() => setIsDarkMode(!isDarkMode)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isDarkMode ? <FaRegSun size={18} /> : <FaRegMoon size={18} />}
        </motion.button>

        {/* Time Indicator */}
        <FuturisticTimeIndicator />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-16 mt-12 text-center"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 drop-shadow-lg">
            Tairos Calendar
          </h1>
          <p className="text-cyan-300 max-w-2xl mx-auto opacity-80">
            Navigate time and space with our advanced holographic calendar interface
          </p>
        </motion.div>

        {/* Date Navigation */}
        <HolographicDateNav date={currentDate} onNavigate={handleNavigate} />

        {/* Calendar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <BigCalendar
            selectable
            localizer={localizer}
            events={events}
            view={currentView}
            views={["month", "week", "day", "agenda"]}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            onView={(view) => setCurrentView(view)}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            popup
            {...calendarCustomStyles}
          />
        </motion.div>

        {/* View Navigation */}
        <FloatingNavigation view={currentView} onViewChange={setCurrentView} />

        {/* Add Event Button */}
        <AddEventButton
          onClick={() => {
            setSelectedEvent({
              start: new Date(),
              end: addMinutes(new Date(), 60),
            })
            setModalType("create")
          }}
        />

        {/* Modal Overlay */}
        <AnimatePresence>
          {modalType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={handleCloseModal}
            >
              <div onClick={(e) => e.stopPropagation()}>
                {modalType === "view" && selectedEvent && (
                  <HolographicEventModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onEdit={() => handleEditEvent(selectedEvent)}
                    onDelete={handleDeleteEvent}
                  />
                )}

                {(modalType === "create" || modalType === "edit") && (
                  <HolographicEventForm
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvent}
                    isEditing={modalType === "edit"}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Calendar
