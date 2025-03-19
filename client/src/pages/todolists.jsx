import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import {
  FaPlus,
  FaTrash,
  FaLightbulb,
  FaEdit,
  FaSave,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa"

// Enhanced particle system with interactive effects
const ParticleCanvas = ({ width, height, mousePosition }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  // Update mouse position reference
  useEffect(() => {
    if (mousePosition) {
      mouseRef.current = mousePosition
    }
  }, [mousePosition])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1

    // Set canvas size with device pixel ratio for sharpness
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Create particles
    const particleCount = 300
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          baseSize: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, ${200 + Math.random() * 55}, ${Math.random() * 0.5 + 0.2})`,
          hue: Math.random() * 60 + 200, // Blue to purple range
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
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
          particle.size = particle.baseSize * (1 + (1 - distance / maxDistance) * 2)

          // Shift color toward warmer tones near mouse
          const hueShift = (1 - distance / maxDistance) * 60 // Shift toward yellow/orange
          ctx.fillStyle = `hsla(${particle.hue - hueShift}, 80%, 60%, ${particle.opacity + (1 - distance / maxDistance) * 0.3})`
        } else {
          // Normal movement
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.size = particle.baseSize
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 50%, ${particle.opacity})`
        }

        // Boundary check
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, ctx.fillStyle)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: "none",
      }}
    />
  )
}

// Enhanced task card with more interactive effects
const TaskCard = ({ task, index, total, layout, isSelected, onClick }) => {
  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 })
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 })
  const scale = useSpring(isSelected ? 1.2 : 1, { stiffness: 300, damping: 15 })
  const glow = useSpring(isSelected ? 1.5 : 1, { stiffness: 300, damping: 15 })

  // Position based on layout
  const getPosition = () => {
    switch (layout) {
      case "circle": {
        const angle = (index / total) * Math.PI * 2
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.2
        return {
          x: Math.sin(angle) * radius,
          y: 0,
          z: Math.cos(angle) * radius,
        }
      }
      case "grid": {
        const cols = Math.ceil(Math.sqrt(total)) || 1
        const row = Math.floor(index / cols)
        const col = index % cols
        const gridSize = Math.min(window.innerWidth, window.innerHeight) * 0.3
        const cellSize = gridSize / Math.max(cols, 1)
        return {
          x: (col - (cols - 1) / 2) * cellSize,
          y: 0,
          z: (row - Math.floor(total / cols) / 2) * cellSize,
        }
      }
      case "random": {
        // Use a seeded random based on task ID to keep positions consistent
        const seed = index * 1000
        const randomX = Math.sin(seed) * 0.5 + 0.5
        const randomZ = Math.cos(seed) * 0.5 + 0.5
        const area = Math.min(window.innerWidth, window.innerHeight) * 0.3
        return {
          x: (randomX - 0.5) * area,
          y: 0,
          z: (randomZ - 0.5) * area,
        }
      }
      default:
        return { x: 0, y: 0, z: 0 }
    }
  }

  const position = getPosition()

  // Hover effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    const offsetX = ((mouseX - centerX) / (rect.width / 2)) * 15
    const offsetY = ((mouseY - centerY) / (rect.height / 2)) * 15

    rotateY.set(offsetX)
    rotateX.set(-offsetY)
  }

  const handleMouseLeave = () => {
    rotateY.set(0)
    rotateX.set(0)
  }

  // Priority colors
  const getPriorityColor = () => {
    switch (task.priority) {
      case "urgent":
        return "#ef4444"
      case "important":
        return "#eab308"
      case "normal":
        return "#22c55e"
      default:
        return "#94a3b8"
    }
  }

  const priorityColor = getPriorityColor()

  // Calculate days indicator
  const getDaysIndicator = () => {
    if (task.estimatedDays <= 1) return "⚡ Today"
    if (task.estimatedDays <= 3) return "🔜 Soon"
    return `📅 ${task.estimatedDays} days`
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.2 : 1,
        x: position.x,
        y: position.y,
        z: position.z,
        rotateY: isSelected ? [0, 360, 0] : 0,
        transition: {
          duration: 0.8,
          rotateY: { repeat: isSelected ? Number.POSITIVE_INFINITY : 0, duration: 10, ease: "linear" },
        },
      }}
      style={{
        scale,
        transformStyle: "preserve-3d",
        perspective: 1000,
        zIndex: isSelected ? 10 : 0,
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: position.z + 30 }}
    >
      <motion.div
        className="relative w-56 h-32 rounded-lg cursor-pointer"
        style={{
          rotateY: springRotateY,
          rotateX: springRotateX,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          boxShadow: `0 0 20px ${priorityColor}80`,
          background: `linear-gradient(135deg, ${priorityColor}90, ${priorityColor}40)`,
          backdropFilter: "blur(8px)",
          border: `1px solid ${priorityColor}`,
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            boxShadow: `0 0 30px 5px ${priorityColor}`,
            filter: "blur(8px)",
            zIndex: -1,
            opacity: glow,
          }}
        />

        {/* Task content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white overflow-hidden">
          <div className="text-sm font-medium line-clamp-2">{task.taskName}</div>
          <div className="flex justify-between items-end text-xs mt-2">
            <div className="flex items-center">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: priorityColor }}
              ></span>
              {task.priority}
            </div>
            <div>{getDaysIndicator()}</div>
          </div>

          {/* Complexity indicator */}
          <div className="absolute top-2 right-2">
            {task.complexity === "quick" && <span className="text-xs">🟢</span>}
            {task.complexity === "medium" && <span className="text-xs">🟡</span>}
            {task.complexity === "complex" && <span className="text-xs">🔴</span>}
          </div>
        </div>

        {/* Reflective surface */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
            transform: "translateZ(1px)",
          }}
        />

        {/* Edge highlight */}
        <div
          className="absolute inset-0 rounded-lg border border-white opacity-20"
          style={{ transform: "translateZ(2px)" }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function FuturisticTodoList() {
  const [tasks, setTasks] = useState("")
  const [toDoLists, setToDoLists] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("toDoLists")
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [taskLayout, setTaskLayout] = useState("circle") // 'circle', 'grid', 'random'
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [sortBy, setSortBy] = useState("priority") // 'priority', 'date', 'complexity'
  const [filterPriority, setFilterPriority] = useState("all") // 'all', 'urgent', 'important', 'normal', 'low-priority'
  const [showFilters, setShowFilters] = useState(false)

  const containerRef = useRef(null)

  // Update window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initial size
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Track mouse position for particle effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toDoLists", JSON.stringify(toDoLists))
    }
  }, [toDoLists])

  // Ensure tasks are properly positioned on initial render
  useEffect(() => {
    if (toDoLists.length === 0) {
      // Add some sample tasks if none exist
      const sampleTasks = [
        {
          id: 1,
          taskName: "Complete project proposal",
          priority: "urgent",
          complexity: "medium",
          estimatedDays: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          taskName: "Review documentation",
          priority: "normal",
          complexity: "quick",
          estimatedDays: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          taskName: "Prepare presentation",
          priority: "important",
          complexity: "complex",
          estimatedDays: 5,
          createdAt: new Date().toISOString(),
        },
      ]

      // Only set sample tasks if there are none in localStorage
      if (typeof window !== "undefined" && !localStorage.getItem("toDoLists")) {
        setToDoLists(sampleTasks)
      }
    }
  }, [toDoLists.length])

  // Simplified mock analysis function (since we're removing token input)
  const analyzeTask = async (taskText) => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simple mock analysis based on text content
    const priority =
      taskText.includes("urgent") || taskText.includes("important") || taskText.includes("asap")
        ? "urgent"
        : taskText.includes("soon") || taskText.length > 30
          ? "important"
          : "normal"

    const complexity = taskText.length > 50 ? "complex" : taskText.length > 20 ? "medium" : "quick"

    const estimatedDays = complexity === "quick" ? 1 : complexity === "medium" ? 3 : 7

    setIsAnalyzing(false)
    return { priority, complexity, estimatedDays }
  }

  // Generate suggestions
  const generateSuggestions = async () => {
    if (toDoLists.length === 0) return

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock suggestions based on existing tasks
    const existingTasks = toDoLists.map((t) => t.taskName)
    const mockSuggestions = [
      `Review ${existingTasks[Math.floor(Math.random() * existingTasks.length)]}`,
      `Follow up on ${existingTasks[Math.floor(Math.random() * existingTasks.length)]}`,
      `Prepare documentation for ${existingTasks[Math.floor(Math.random() * existingTasks.length)]}`,
    ]

    setSuggestions(mockSuggestions)
    setIsAnalyzing(false)
  }

  // Add task
  const addTasks = async () => {
    if (tasks.trim() !== "") {
      const analysis = await analyzeTask(tasks)
      const newTasks = {
        id: toDoLists.length === 0 ? 1 : toDoLists[toDoLists.length - 1].id + 1,
        taskName: tasks,
        priority: analysis.priority,
        complexity: analysis.complexity,
        estimatedDays: analysis.estimatedDays,
        createdAt: new Date().toISOString(),
      }
      setToDoLists([...toDoLists, newTasks])
      setTasks("")
    }
  }

  // Delete task
  const deleteTasks = (id) => {
    setToDoLists(toDoLists.filter((list) => list.id !== id))
    if (selectedTaskId === id) {
      setSelectedTaskId(null)
    }
  }

  // Start editing task
  const startEditing = (task) => {
    setEditingId(task.id)
    setEditText(task.taskName)
  }

  // Save edited task
  const saveEdit = async (id) => {
    if (editText.trim() !== "") {
      const analysis = await analyzeTask(editText)
      setToDoLists(
        toDoLists.map((task) =>
          task.id === id
            ? {
                ...task,
                taskName: editText,
                priority: analysis.priority,
                complexity: analysis.complexity,
                estimatedDays: analysis.estimatedDays,
                lastEdited: new Date().toISOString(),
              }
            : task,
        ),
      )
      setEditingId(null)
      setEditText("")
    }
  }

  // Update task due date
  const updateTaskDueDate = (id, days) => {
    setToDoLists(
      toDoLists.map((task) =>
        task.id === id
          ? {
              ...task,
              estimatedDays: Math.max(1, task.estimatedDays + days),
            }
          : task,
      ),
    )
  }

  // Change task layout
  const cycleTaskLayout = () => {
    setTaskLayout((prev) => {
      switch (prev) {
        case "circle":
          return "grid"
        case "grid":
          return "random"
        default:
          return "circle"
      }
    })
  }

  // Sort tasks
  const sortTasks = (tasks) => {
    const sortedTasks = [...tasks]

    switch (sortBy) {
      case "priority":
        return sortedTasks.sort((a, b) => {
          const priorityOrder = { urgent: 0, important: 1, normal: 2, "low-priority": 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
      case "date":
        return sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case "complexity":
        return sortedTasks.sort((a, b) => {
          const complexityOrder = { complex: 0, medium: 1, quick: 2 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        })
      default:
        return sortedTasks
    }
  }

  // Filter tasks
  const filterTasks = (tasks) => {
    if (filterPriority === "all") return tasks
    return tasks.filter((task) => task.priority === filterPriority)
  }

  // Process tasks (sort and filter)
  const processedTasks = filterTasks(sortTasks(toDoLists))

  const selectedTask = toDoLists.find((task) => task.id === selectedTaskId)

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col items-center relative overflow-hidden">
      {/* Particle background */}
      <ParticleCanvas width={windowSize.width} height={windowSize.height} mousePosition={mousePosition} />

      {/* 3D Task Container */}
      <div
        ref={containerRef}
        className="w-full h-3/5 relative overflow-hidden flex items-center justify-center"
        style={{ perspective: 1000 }}
      >
        {/* Reflective floor */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-900/30 to-transparent"
          style={{
            transform: "rotateX(60deg) translateZ(-100px)",
            transformOrigin: "bottom",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Task cards container - this is the new wrapper */}
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {/* Task cards */}
          <AnimatePresence>
            {processedTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                total={processedTasks.length}
                layout={taskLayout}
                isSelected={selectedTaskId === task.id}
                onClick={() => setSelectedTaskId((prevId) => (prevId === task.id ? null : task.id))}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* UI Controls */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 w-full max-w-md absolute bottom-4"
      >
        <h1 className="text-3xl font-bold mb-4 text-white text-center">To-Do-Lists</h1>

        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-3 rounded-l-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a task..."
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTasks()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-blue-500 text-white rounded-r-lg flex items-center justify-center"
            onClick={addTasks}
            disabled={isAnalyzing}
          >
            <FaPlus className="mr-2" size={18} />
            {isAnalyzing ? "Adding..." : "Add"}
          </motion.button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2 mb-4 p-3 bg-white bg-opacity-20 rounded-lg">
            <h3 className="text-white font-semibold mb-2 flex items-center">
              <FaLightbulb size={16} className="mr-2" />
              Suggested Tasks:
            </h3>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="text-gray-300 cursor-pointer hover:text-white flex items-center"
                onClick={() => setTasks(suggestion)}
              >
                <FaCircle size={8} className="mr-2" />
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {toDoLists.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mb-4 p-2 bg-purple-500 text-white rounded-lg flex items-center justify-center"
            onClick={generateSuggestions}
            disabled={isAnalyzing}
          >
            <FaLightbulb className="mr-2" size={18} />
            Get AI Suggestions
          </motion.button>
        )}

        {/* Selected Task Details */}
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white bg-opacity-20 rounded-lg mb-3 p-4 border-l-4"
            style={{
              borderColor:
                selectedTask.priority === "urgent"
                  ? "#ef4444"
                  : selectedTask.priority === "important"
                    ? "#eab308"
                    : selectedTask.priority === "normal"
                      ? "#22c55e"
                      : "#94a3b8",
            }}
          >
            <div className="flex flex-col w-full">
              {editingId === selectedTask.id ? (
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow p-2 rounded bg-white bg-opacity-20 text-white"
                    onKeyPress={(e) => e.key === "Enter" && saveEdit(selectedTask.id)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-green-500 text-white p-2 rounded-full"
                    onClick={() => saveEdit(selectedTask.id)}
                  >
                    <FaSave size={16} />
                  </motion.button>
                </div>
              ) : (
                <span className="text-white text-lg font-medium">{selectedTask.taskName}</span>
              )}

              <div className="flex flex-col gap-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300 flex items-center">
                    <FaExclamationTriangle size={14} className="mr-2" />
                    Priority: <span className="ml-1 font-medium text-white">{selectedTask.priority}</span>
                  </span>
                  <span className="text-sm text-gray-300 flex items-center">
                    <FaCheckCircle size={14} className="mr-2" />
                    Complexity: <span className="ml-1 font-medium text-white">{selectedTask.complexity}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-300 flex items-center">
                    <FaClock size={14} className="mr-2" />
                    Est. Days: <span className="ml-1 font-medium text-white">{selectedTask.estimatedDays}</span>
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-blue-500 text-white p-1 rounded-full text-xs"
                      onClick={() => updateTaskDueDate(selectedTask.id, -1)}
                    >
                      -1
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-blue-500 text-white p-1 rounded-full text-xs"
                      onClick={() => updateTaskDueDate(selectedTask.id, 1)}
                    >
                      +1
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white border-opacity-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-blue-500 text-white p-2 rounded-full"
                  onClick={() => startEditing(selectedTask)}
                >
                  <FaEdit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-500 text-white p-2 rounded-full"
                  onClick={() => deleteTasks(selectedTask.id)}
                >
                  <FaTrash size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Task stats */}
        {toDoLists.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white border-opacity-10 flex justify-between text-xs text-gray-400">
            <span>Total: {toDoLists.length} tasks</span>
            <span>Urgent: {toDoLists.filter((t) => t.priority === "urgent").length}</span>
            <span>Completed: 0</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

