"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { format, parse, startOfWeek, getDay } from "date-fns"
import enUS from "date-fns/locale/en-US"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Float, PerspectiveCamera } from "@react-three/drei"

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

// Custom Particle Animation Component
const ParticleBackground = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Create particles
    const createParticles = () => {
      particlesRef.current = []
      const particleCount = 70

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    createParticles()

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#1e3a8a")
      gradient.addColorStop(0.5, "#5b21b6")
      gradient.addColorStop(1, "#312e81")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const angle = Math.atan2(dy, dx)
          const force = 0.2
          particle.speedX -= Math.cos(angle) * force
          particle.speedY -= Math.sin(angle) * force
        }

        // Speed limit
        const maxSpeed = 1.5
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed
          particle.speedY = (particle.speedY / speed) * maxSpeed
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particlesRef.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  )
}

// 3D Text component for the header
const AnimatedText3D = ({ text }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        color="#ffffff"
        fontSize={1.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/Inter-Bold.ttf"
      >
        {text}
      </Text>
    </Float>
  )
}

// Custom event component with animation
const CustomEvent = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: `linear-gradient(135deg, ${event.color || "#3b82f6"} 0%, ${event.secondaryColor || "#60a5fa"} 100%)`,
        borderRadius: "8px",
        color: "white",
        padding: "4px 8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {event.title}
    </motion.div>
  )
}

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    color: "#3b82f6",
    secondaryColor: "#60a5fa",
  })
  const canvasRef = useRef(null)

  // Generate some sample events on first render
  useEffect(() => {
    const today = new Date()
    const sampleEvents = [
      {
        title: "Team Meeting",
        description: "Weekly team sync",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
        color: "#8b5cf6",
        secondaryColor: "#a78bfa",
      },
      {
        title: "Product Launch",
        description: "New feature release",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0),
        color: "#ec4899",
        secondaryColor: "#f472b6",
      },
      {
        title: "Client Call",
        description: "Quarterly review",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 9, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 0),
        color: "#10b981",
        secondaryColor: "#34d399",
      },
    ]
    setEvents(sampleEvents)
  }, [])

  const handleSelect = ({ start, end }) => {
    setSelectedDate(start)
    setNewEvent({
      ...newEvent,
      start,
      end: end || start,
    })
    setShowEventModal(true)
  }

  const handleEventAdd = (e) => {
    e.preventDefault()
    if (newEvent.title) {
      const event = {
        ...newEvent,
        start: newEvent.start || selectedDate,
        end: newEvent.end || selectedDate,
      }
      setEvents([...events, event])
      setShowEventModal(false)
      setNewEvent({
        title: "",
        description: "",
        start: null,
        end: null,
        color: getRandomColor(),
        secondaryColor: getRandomColor(),
      })
    }
  }

  const getRandomColor = () => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#6366f1",
      "#84cc16",
      "#14b8a6",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const calendarCustomStyles = {
    style: {
      height: 600,
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "20px",
      position: "relative",
      zIndex: 10,
    },
    dayPropGetter: (date) => ({
      style: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "8px",
        margin: "2px",
        transition: "all 0.2s ease",
      },
    }),
    eventPropGetter: (event) => ({
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    }),
    components: {
      event: CustomEvent,
    },
  }

  // Custom CSS styles
  const customStyles = `
    .rbc-calendar {
      font-family: "Inter", sans-serif;
    }

    .rbc-header {
      padding: 12px 3px;
      font-weight: 600;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px 8px 0 0;
      border: none !important;
    }

    .rbc-month-view {
      border-radius: 16px;
      border: none !important;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .rbc-day-bg {
      transition: all 0.3s ease;
    }

    .rbc-day-bg:hover {
      background-color: rgba(59, 130, 246, 0.1) !important;
    }

    .rbc-off-range-bg {
      background-color: rgba(0, 0, 0, 0.03) !important;
    }

    .rbc-today {
      background-color: rgba(59, 130, 246, 0.15) !important;
    }

    .rbc-event {
      border: none !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .rbc-event:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .rbc-toolbar button {
      border-radius: 8px !important;
      transition: all 0.2s ease;
      color: #4b5563;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      background: white;
      padding: 8px 16px;
      font-weight: 500;
    }

    .rbc-toolbar button:hover {
      background-color: #f3f4f6 !important;
      color: #1f2937;
    }

    .rbc-toolbar button.rbc-active {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      border: none !important;
    }

    .rbc-toolbar {
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
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
      background-color: #ef4444 !important;
      height: 2px;
    }
  `

  return (
    <>
      <style>{customStyles}</style>
      <div
        className="min-h-screen overflow-hidden relative p-6"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #5b21b6 50%, #312e81 100%)",
          margin: 0,
          padding: "24px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Custom Particle Background */}
        <ParticleBackground />

        {/* 3D Header */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            height: "160px",
            marginBottom: "24px",
          }}
        >
          <Canvas ref={canvasRef}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <AnimatedText3D text="Interactive Calendar" />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </div>

        {/* Calendar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "relative",
            zIndex: 10,
          }}
        >
          <BigCalendar
            selectable
            localizer={localizer}
            events={events}
            defaultView="month"
            views={["month", "week", "day"]}
            defaultDate={new Date()}
            onSelectSlot={handleSelect}
            popup
            tooltipAccessor={(event) => event.description}
            {...calendarCustomStyles}
          />
        </motion.div>

        {/* Animated Modal */}
        <AnimatePresence>
          {showEventModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(243, 244, 246, 1) 100%)",
                  borderRadius: "16px",
                  padding: "32px",
                  width: "384px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "24px",
                    color: "transparent",
                    backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Add New Event
                </h3>
                <form onSubmit={handleEventAdd}>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "#4b5563",
                      }}
                    >
                      Title
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "12px",
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "#4b5563",
                      }}
                    >
                      Description
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "12px",
                        outline: "none",
                        transition: "all 0.2s ease",
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                      rows="3"
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "#4b5563",
                      }}
                    >
                      Color Theme
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                        <motion.div
                          key={color}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setNewEvent({
                              ...newEvent,
                              color: color,
                              secondaryColor:
                                color === "#3b82f6"
                                  ? "#60a5fa"
                                  : color === "#8b5cf6"
                                    ? "#a78bfa"
                                    : color === "#ec4899"
                                      ? "#f472b6"
                                      : color === "#10b981"
                                        ? "#34d399"
                                        : color === "#f59e0b"
                                          ? "#fbbf24"
                                          : "#f87171",
                            })
                          }
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            backgroundColor: color,
                            boxShadow: newEvent.color === color ? "0 0 0 2px white, 0 0 0 4px #9ca3af" : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowEventModal(false)}
                      style={{
                        padding: "12px 20px",
                        color: "#4b5563",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "12px",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      style={{
                        padding: "12px 20px",
                        backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                        color: "white",
                        borderRadius: "12px",
                        fontWeight: "500",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                        cursor: "pointer",
                        transition: "box-shadow 0.2s ease",
                      }}
                    >
                      Add Event
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Calendar
