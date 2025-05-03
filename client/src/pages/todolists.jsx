import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaFilter,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaRegClock,
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
    const particleCount = 150 // Reduced for better performance
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5, // Smaller particles
          baseSize: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          color: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, ${200 + Math.random() * 55}, ${Math.random() * 0.4 + 0.1})`,
          hue: Math.random() * 60 + 200, // Blue to purple range
          pulse: Math.random() * 2 * Math.PI, // Random starting phase for pulsing
          pulseSpeed: 0.01 + Math.random() * 0.02, // Random pulse speed
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
        const maxDistance = 100

        // Interactive effects based on mouse proximity
        if (distance < maxDistance) {
          // Repel particles from mouse
          const force = (1 - distance / maxDistance) * 0.2
          particle.x += dx * force
          particle.y += dy * force

          // Increase size and brightness near mouse
          particle.size = particle.baseSize * (1 + (1 - distance / maxDistance) * 1.5) * pulseFactor

          // Shift color toward warmer tones near mouse
          const hueShift = (1 - distance / maxDistance) * 40 // Shift toward yellow/orange
          ctx.fillStyle = `hsla(${particle.hue - hueShift}, 80%, 60%, ${particle.opacity + (1 - distance / maxDistance) * 0.2})`
        } else {
          // Normal movement
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.size = particle.baseSize * pulseFactor
          ctx.fillStyle = `hsla(${particle.hue}, 70%, 50%, ${particle.opacity})`
        }

        // Boundary check
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw subtle glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, ctx.fillStyle)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
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

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onMoveLeft, onMoveRight, onProgressUpdate, columnId, isDraggable }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.taskName)
  const controls = useDragControls()

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
    if (task.estimatedDays <= 1) return "Today"
    if (task.estimatedDays <= 3) return "Soon"
    return `${task.estimatedDays} days`
  }

  const handleSaveEdit = () => {
    if (editText.trim() !== "") {
      onEdit(task.id, editText)
      setIsEditing(false)
    }
  }

  const startDrag = (event) => {
    controls.start(event)
  }

  return (
    <motion.div
      layout
      drag={isDraggable}
      dragControls={controls}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      whileDrag={{ scale: 1.05, zIndex: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
      onDragEnd={(e, info) => {
        // Determine direction of drag
        if (info.offset.x > 100 && onMoveRight) {
          onMoveRight(task.id)
        } else if (info.offset.x < -100 && onMoveLeft) {
          onMoveLeft(task.id)
        }
      }}
      className="mb-3 rounded-lg overflow-hidden bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-lg"
      style={{
        background: `linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)`,
        border: `1px solid ${priorityColor}40`,
        boxShadow: `0 4px 12px ${priorityColor}30`,
      }}
    >
      {/* Card header with drag handle */}
      <div
        className="p-3 cursor-grab active:cursor-grabbing border-b border-gray-700 flex justify-between items-center"
        onPointerDown={startDrag}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: priorityColor }} />
          <span className="text-xs font-medium text-gray-400 capitalize">{task.priority}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 flex items-center">
            <FaRegClock className="mr-1" size={10} />
            {getDaysIndicator()}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="ml-2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
          >
            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Card content */}
      <div className="p-3">
        {isEditing ? (
          <div className="mb-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
              autoFocus
            />
            <div className="flex justify-end mt-2 gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <h3 className="text-white text-sm font-medium mb-2">{task.taskName}</h3>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
          <div
            className="h-full rounded-full"
            style={{
              width: `${task.progress || 0}%`,
              background: `linear-gradient(to right, ${priorityColor}80, ${priorityColor})`,
              boxShadow: `0 0 5px ${priorityColor}80`,
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{task.progress || 0}% complete</span>
          {isExpanded && (
            <div className="flex gap-1">
              <button
                onClick={() => onProgressUpdate(task.id, Math.max(0, (task.progress || 0) - 10))}
                className="text-xs px-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                -10%
              </button>
              <button
                onClick={() => onProgressUpdate(task.id, Math.min(100, (task.progress || 0) + 10))}
                className="text-xs px-1 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                +10%
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-700 overflow-hidden"
          >
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 flex items-center">
                  <FaCheckCircle size={10} className="mr-1" />
                  Complexity: <span className="ml-1 text-white">{task.complexity}</span>
                </span>
                <div className="flex gap-1">
                  <span className="text-xs text-gray-400 flex items-center">
                    <FaClock size={10} className="mr-1" />
                    Est. Days: <span className="ml-1 text-white">{task.estimatedDays}</span>
                  </span>
                  <button
                    onClick={() =>
                      onEdit(task.id, task.taskName, { estimatedDays: Math.max(1, task.estimatedDays - 1) })
                    }
                    className="text-xs px-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => onEdit(task.id, task.taskName, { estimatedDays: task.estimatedDays + 1 })}
                    className="text-xs px-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    +1
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <div className="flex gap-1">
                  {columnId !== "todo" && (
                    <button
                      onClick={() => onMoveLeft(task.id)}
                      className="flex items-center px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      <FaArrowLeft size={10} className="mr-1" /> Move
                    </button>
                  )}
                  {columnId !== "done" && (
                    <button
                      onClick={() => onMoveRight(task.id)}
                      className="flex items-center px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      Move <FaArrowRight size={10} className="ml-1" />
                    </button>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Column Component
const Column = ({
  title,
  tasks,
  columnId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onProgressUpdate,
  color,
}) => {
  const [newTaskText, setNewTaskText] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleAddTask = async () => {
    if (newTaskText.trim() !== "") {
      await onAddTask(newTaskText, columnId)
      setNewTaskText("")
      setIsAddingTask(false)
    }
  }

  return (
    <motion.div
      layout
      className="flex-shrink-0 w-80 bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-md rounded-lg shadow-xl overflow-hidden flex flex-col"
      style={{
        border: `1px solid ${color}30`,
        boxShadow: `0 4px 20px ${color}20`,
      }}
    >
      {/* Column header */}
      <div
        className="p-3 border-b border-gray-700 flex justify-between items-center"
        style={{
          background: `linear-gradient(to right, ${color}20, transparent)`,
        }}
      >
        <h2 className="text-white font-bold flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
          {title}
        </h2>
        <div className="text-xs text-gray-400">{tasks.length} tasks</div>
      </div>

      {/* Task list */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-13rem)]">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}
              onEdit={(id, text, additionalData) => onEditTask(id, text, additionalData)}
              onDelete={onDeleteTask}
              onMoveLeft={columnId !== "todo" ? (id) => onMoveTask(id, columnId, getPrevColumn(columnId)) : null}
              onMoveRight={columnId !== "done" ? (id) => onMoveTask(id, columnId, getNextColumn(columnId)) : null}
              onProgressUpdate={onProgressUpdate}
              isDraggable={true}
            />
          ))}
        </AnimatePresence>

        {/* Add task form */}
        <AnimatePresence>
          {isAddingTask ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 p-3 bg-gray-800 rounded-lg"
            >
              <input
                type="text"
                placeholder="Enter task name..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm mb-2"
                onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Add
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingTask(true)}
              className="mt-2 w-full p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <FaPlus size={12} className="mr-2" />
              Add a task
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Helper functions for column navigation
const getPrevColumn = (columnId) => {
  const columns = ["todo", "inProgress", "review", "done"]
  const currentIndex = columns.indexOf(columnId)
  return columns[Math.max(0, currentIndex - 1)]
}

const getNextColumn = (columnId) => {
  const columns = ["todo", "inProgress", "review", "done"]
  const currentIndex = columns.indexOf(columnId)
  return columns[Math.min(columns.length - 1, currentIndex + 1)]
}

// Main Component
export default function TrelloTodoList() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterComplexity, setFilterComplexity] = useState("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Task state organized by columns
  const [columns, setColumns] = useState(() => {
    if (typeof window !== "undefined") {
      const savedColumns = localStorage.getItem("trelloColumns")
      if (savedColumns) {
        return JSON.parse(savedColumns)
      }
    }

    // Default columns with sample tasks
    return {
      todo: [
        {
          id: 1,
          taskName: "Complete project proposal",
          priority: "urgent",
          complexity: "medium",
          estimatedDays: 3,
          createdAt: new Date().toISOString(),
          progress: 0,
        },
        {
          id: 2,
          taskName: "Research new technologies",
          priority: "normal",
          complexity: "quick",
          estimatedDays: 1,
          createdAt: new Date().toISOString(),
          progress: 0,
        },
      ],
      inProgress: [
        {
          id: 3,
          taskName: "Prepare presentation",
          priority: "important",
          complexity: "complex",
          estimatedDays: 5,
          createdAt: new Date().toISOString(),
          progress: 30,
        },
      ],
      review: [
        {
          id: 4,
          taskName: "Review documentation",
          priority: "normal",
          complexity: "medium",
          estimatedDays: 2,
          createdAt: new Date().toISOString(),
          progress: 80,
        },
      ],
      done: [
        {
          id: 5,
          taskName: "Schedule team meeting",
          priority: "normal",
          complexity: "quick",
          estimatedDays: 1,
          createdAt: new Date().toISOString(),
          progress: 100,
        },
      ],
    }
  })

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

  // Save columns to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trelloColumns", JSON.stringify(columns))
    }
  }, [columns])

  // Simplified mock analysis function
  const analyzeTask = async (taskText) => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 600))

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

  // Add task
  const handleAddTask = async (taskText, columnId) => {
    if (taskText.trim() !== "") {
      const analysis = await analyzeTask(taskText)

      // Find the highest ID across all columns
      const allTasks = Object.values(columns).flat()
      const maxId = allTasks.length > 0 ? Math.max(...allTasks.map((t) => t.id)) : 0

      const newTask = {
        id: maxId + 1,
        taskName: taskText,
        priority: analysis.priority,
        complexity: analysis.complexity,
        estimatedDays: analysis.estimatedDays,
        createdAt: new Date().toISOString(),
        progress: columnId === "todo" ? 0 : columnId === "inProgress" ? 30 : columnId === "review" ? 80 : 100,
      }

      setColumns((prev) => ({
        ...prev,
        [columnId]: [...prev[columnId], newTask],
      }))
    }
  }

  // Edit task
  const handleEditTask = (taskId, newText, additionalData = {}) => {
    setColumns((prev) => {
      const newColumns = { ...prev }

      // Find which column contains the task
      for (const [columnId, tasks] of Object.entries(newColumns)) {
        const taskIndex = tasks.findIndex((t) => t.id === taskId)

        if (taskIndex !== -1) {
          // Update the task
          newColumns[columnId] = [
            ...tasks.slice(0, taskIndex),
            {
              ...tasks[taskIndex],
              taskName: newText,
              ...additionalData,
              lastEdited: new Date().toISOString(),
            },
            ...tasks.slice(taskIndex + 1),
          ]
          break
        }
      }

      return newColumns
    })
  }

  // Delete task
  const handleDeleteTask = (taskId) => {
    setColumns((prev) => {
      const newColumns = { ...prev }

      // Find which column contains the task
      for (const columnId of Object.keys(newColumns)) {
        newColumns[columnId] = newColumns[columnId].filter((t) => t.id !== taskId)
      }

      return newColumns
    })
  }

  // Move task between columns
  const handleMoveTask = (taskId, fromColumnId, toColumnId) => {
    if (fromColumnId === toColumnId) return

    setColumns((prev) => {
      const newColumns = { ...prev }

      // Find the task
      const taskIndex = newColumns[fromColumnId].findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const task = { ...newColumns[fromColumnId][taskIndex] }

      // Update progress based on column
      if (toColumnId === "todo") task.progress = 0
      else if (toColumnId === "inProgress") task.progress = 30
      else if (toColumnId === "review") task.progress = 80
      else if (toColumnId === "done") task.progress = 100

      // Remove from old column and add to new column
      newColumns[fromColumnId] = newColumns[fromColumnId].filter((t) => t.id !== taskId)
      newColumns[toColumnId] = [...newColumns[toColumnId], task]

      return newColumns
    })
  }

  // Update task progress
  const handleProgressUpdate = (taskId, newProgress) => {
    setColumns((prev) => {
      const newColumns = { ...prev }

      // Find which column contains the task
      for (const [columnId, tasks] of Object.entries(newColumns)) {
        const taskIndex = tasks.findIndex((t) => t.id === taskId)

        if (taskIndex !== -1) {
          // Update the task progress
          newColumns[columnId] = [
            ...tasks.slice(0, taskIndex),
            {
              ...tasks[taskIndex],
              progress: newProgress,
            },
            ...tasks.slice(taskIndex + 1),
          ]

          // If progress is 100%, move to done
          if (newProgress === 100 && columnId !== "done") {
            const task = { ...newColumns[columnId][taskIndex] }
            newColumns[columnId] = newColumns[columnId].filter((t) => t.id !== taskId)
            newColumns.done = [...newColumns.done, task]
          }

          break
        }
      }

      return newColumns
    })
  }

  // Filter tasks
  const filterTasks = (tasks) => {
    return tasks.filter((task) => {
      // Filter by search term
      const matchesSearch = !searchTerm || task.taskName.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by priority
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority

      // Filter by complexity
      const matchesComplexity = filterComplexity === "all" || task.complexity === filterComplexity

      return matchesSearch && matchesPriority && matchesComplexity
    })
  }

  // Get filtered columns
  const getFilteredColumns = () => {
    const filteredColumns = {}

    for (const [columnId, tasks] of Object.entries(columns)) {
      filteredColumns[columnId] = filterTasks(tasks)
    }

    return filteredColumns
  }

  const filteredColumns = getFilteredColumns()

  // Column colors
  const columnColors = {
    todo: "#3b82f6", // Blue
    inProgress: "#8b5cf6", // Purple
    review: "#f59e0b", // Amber
    done: "#10b981", // Green
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col overflow-hidden">
      {/* Particle background */}
      <ParticleCanvas width={windowSize.width} height={windowSize.height} mousePosition={mousePosition} />

      {/* Header */}
      <div className="p-4 flex justify-between items-center text-center z-10 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white"></h1>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 py-2 px-3 pl-9 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>

          {/* Filter button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg flex items-center ${showFilters ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
          >
            <FaFilter size={14} className="mr-2" />
            Filters
          </motion.button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-800 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm z-10"
          >
            <div className="p-4 flex items-center gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Priority</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterPriority("all")}
                    className={`px-3 py-1 text-xs rounded-full ${filterPriority === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterPriority("urgent")}
                    className={`px-3 py-1 text-xs rounded-full ${filterPriority === "urgent" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Urgent
                  </button>
                  <button
                    onClick={() => setFilterPriority("important")}
                    className={`px-3 py-1 text-xs rounded-full ${filterPriority === "important" ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Important
                  </button>
                  <button
                    onClick={() => setFilterPriority("normal")}
                    className={`px-3 py-1 text-xs rounded-full ${filterPriority === "normal" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Normal
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Complexity</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterComplexity("all")}
                    className={`px-3 py-1 text-xs rounded-full ${filterComplexity === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterComplexity("quick")}
                    className={`px-3 py-1 text-xs rounded-full ${filterComplexity === "quick" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Quick
                  </button>
                  <button
                    onClick={() => setFilterComplexity("medium")}
                    className={`px-3 py-1 text-xs rounded-full ${filterComplexity === "medium" ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setFilterComplexity("complex")}
                    className={`px-3 py-1 text-xs rounded-full ${filterComplexity === "complex" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"}`}
                  >
                    Complex
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full">
          <Column
            title="To Do"
            tasks={filteredColumns.todo}
            columnId="todo"
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onProgressUpdate={handleProgressUpdate}
            color={columnColors.todo}
          />
          <Column
            title="In Progress"
            tasks={filteredColumns.inProgress}
            columnId="inProgress"
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onProgressUpdate={handleProgressUpdate}
            color={columnColors.inProgress}
          />
          <Column
            title="Review"
            tasks={filteredColumns.review}
            columnId="review"
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onProgressUpdate={handleProgressUpdate}
            color={columnColors.review}
          />
          <Column
            title="Done"
            tasks={filteredColumns.done}
            columnId="done"
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onProgressUpdate={handleProgressUpdate}
            color={columnColors.done}
          />
        </div>
      </div>

      {/* Stats footer */}
      <div className="p-3 border-t border-gray-800 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm z-10">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Total: {Object.values(columns).flat().length} tasks</span>
          <span>To Do: {columns.todo.length}</span>
          <span>In Progress: {columns.inProgress.length}</span>
          <span>Review: {columns.review.length}</span>
          <span>Done: {columns.done.length}</span>
          <span>
            Completion: {Math.round((columns.done.length / Object.values(columns).flat().length) * 100) || 0}%
          </span>
        </div>
      </div>
    </div>
  )
}
