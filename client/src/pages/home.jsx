import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Link } from "react-router-dom"
import {
  FaListUl,
  FaChartLine,
  FaLightbulb,
  FaPlus,
  FaCalendarAlt,
  FaCheck,
  FaTrash,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
  FaRegClock,
  FaRegBell,
  FaRegSun,
  FaRegMoon,
  FaSearch,
  FaRegCalendarAlt,
  FaRegCalendarCheck,
  FaRegUser,
  FaRegChartBar,
  FaRegCreditCard,
  FaRegMoneyBillAlt,
  FaRegFileAlt,
  FaRegClipboard,
  FaRegLightbulb,
  FaTimes,
} from "react-icons/fa"
import { format, addDays, startOfWeek, addWeeks, isSameDay } from "date-fns"

// Productivity tips
const productivityTips = [
  "Connect with Lin to gain more industrial knowledge",
  "Break large tasks into smaller, manageable steps.",
  "Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Prioritize your tasks using the Eisenhower Matrix.",
  "Eliminate distractions by turning off notifications during work sessions.",
  "Start your day by tackling your most important task first.",
  "Schedule your most challenging tasks during your peak energy hours.",
  "Use the 2-minute rule: If a task takes less than 2 minutes, do it now.",
  "Batch similar tasks together to minimize context switching.",
  "Take regular breaks to maintain focus and prevent burnout.",
]

// Enhanced particle background component
const ParticleBackground = ({ isDarkMode }) => {
  const particlesRef = useRef(null)
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

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

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Create particles
    for (let i = 0; i < 120; i++) {
      const baseColor = isDarkMode ? "59, 130, 246" : "99, 102, 241"
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(${baseColor}, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 0.8 - 0.4,
        directionChangeTimer: 0,
        directionChangeDelay: Math.random() * 200 + 50,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
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
          particle.radius = (Math.random() * 3 + 1) * (1 + (1 - distance / maxDistance) * 1.5)
        }

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Random direction changes
        particle.directionChangeTimer++
        if (particle.directionChangeTimer >= particle.directionChangeDelay) {
          particle.speedX = Math.random() * 0.8 - 0.4
          particle.speedY = Math.random() * 0.8 - 0.4
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
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(particlesRef.current)
    }
  }, [isDarkMode])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
}

// Enhanced card component with 3D effect
const Card3D = ({ to, color, icon, title, description, onClick }) => {
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

  const CardContent = (
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
      className={`${color} bg-opacity-80 p-6 rounded-lg text-white hover:bg-opacity-90 transition-all duration-300 shadow-lg h-full`}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {icon}
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-white text-opacity-80">{description}</p>
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
  )

  return to ? <Link to={to}>{CardContent}</Link> : <div onClick={onClick}>{CardContent}</div>
}

// Mini Calendar Component
const MiniCalendar = ({ selectedDate, setSelectedDate }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i))

  const navigateWeek = (direction) => {
    setCurrentWeekStart(addWeeks(currentWeekStart, direction))
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <FaChevronLeft className="text-white" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <FaChevronRight className="text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div key={i} className="text-center text-white text-opacity-70 text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDate(day)}
            className={`flex items-center justify-center p-2 rounded-full cursor-pointer ${
              isSameDay(day, selectedDate) ? "bg-blue-500 text-white" : "text-white hover:bg-white hover:bg-opacity-20"
            }`}
          >
            {format(day, "d")}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center text-white text-opacity-70 text-sm">{format(currentWeekStart, "MMMM yyyy")}</div>
    </div>
  )
}

// To-Do List Component
const TodoList = ({ tasks, onToggleTask, onDeleteTask, onEditTask }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState("")

  const handleEditClick = (task) => {
    setEditingTask(task.id)
    setEditText(task.text)
  }

  const handleSaveEdit = (id) => {
    onEditTask(id, editText)
    setEditingTask(null)
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FaListUl className="mr-2" /> Tasks
      </h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-white text-opacity-70 text-center py-4">No tasks for today</div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center justify-between group"
            >
              {editingTask === task.id ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-white bg-opacity-20 rounded p-1 text-white focus:outline-none"
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit(task.id)}
                  />
                  <div className="flex mt-2 space-x-2">
                    <button
                      onClick={() => setEditingTask(null)}
                      className="text-xs bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center flex-1">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggleTask(task.id)}
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        task.completed
                          ? "bg-green-500 text-white"
                          : "border border-white border-opacity-50 text-transparent hover:border-white"
                      }`}
                    >
                      {task.completed && <FaCheck size={10} />}
                    </motion.button>
                    <span
                      className={`text-white ${task.completed ? "line-through text-opacity-50" : "text-opacity-90"}`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(task)}
                      className="text-white text-opacity-70 hover:text-opacity-100 p-1"
                    >
                      <FaEdit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteTask(task.id)}
                      className="text-white text-opacity-70 hover:text-opacity-100 p-1"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// Expense Summary Component
const ExpenseSummary = ({ expenses }) => {
  // Calculate total expenses
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0
    }
    acc[expense.category] += expense.amount
    return acc
  }, {})

  // Convert to array and sort by amount
  const categories = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)

  // Get category colors
  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-green-500",
      Transport: "bg-blue-500",
      Entertainment: "bg-purple-500",
      Shopping: "bg-pink-500",
      Bills: "bg-yellow-500",
      Other: "bg-gray-500",
    }
    return colors[category] || "bg-gray-500"
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <FaChartLine className="mr-2" /> Expenses
      </h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-opacity-70">Total Expenses</span>
          <span className="text-xl font-bold text-white">${total.toFixed(2)}</span>
        </div>
        <div className="h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {categories.length === 0 ? (
          <div className="text-white text-opacity-70 text-center py-4">No expenses recorded</div>
        ) : (
          categories.map((category) => (
            <div key={category.name} className="bg-white bg-opacity-5 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white">{category.name}</span>
                <span className="text-white font-medium">${category.amount.toFixed(2)}</span>
              </div>
              <div className="h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(category.amount / total) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${getCategoryColor(category.name)}`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Recent Activity Component
const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "task_added":
        return <FaPlus className="text-green-400" />
      case "task_completed":
        return <FaCheck className="text-green-400" />
      case "expense_added":
        return <FaRegCreditCard className="text-red-400" />
      case "event_added":
        return <FaRegCalendarAlt className="text-blue-400" />
      default:
        return <FaRegClipboard className="text-gray-400" />
    }
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-white text-opacity-70 text-center py-4">No recent activity</div>
        ) : (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white bg-opacity-5 rounded-lg p-3 flex items-center"
            >
              <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm">{activity.description}</div>
                <div className="text-white text-opacity-50 text-xs flex items-center mt-1">
                  <FaRegClock className="mr-1" size={10} />
                  {activity.time}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// Weather Widget Component
const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: "Sunny",
    location: "San Francisco",
    icon: "☀️",
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg p-4 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white text-opacity-80">{weather.location}</div>
          <div className="text-2xl font-bold">{weather.temp}°F</div>
          <div className="text-sm">{weather.condition}</div>
        </div>
        <div className="text-4xl">{weather.icon}</div>
      </div>
    </motion.div>
  )
}

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { icon: <FaPlus />, label: "New Task", color: "bg-green-600" },
    { icon: <FaRegCreditCard />, label: "Add Expense", color: "bg-red-600" },
    { icon: <FaRegCalendarAlt />, label: "New Event", color: "bg-blue-600" },
    { icon: <FaRegLightbulb />, label: "New Note", color: "bg-yellow-600" },
  ]

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar-x">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] shadow-lg`}
        >
          {action.icon}
          <span className="text-xs mt-1">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

// Dashboard Stats Component
const DashboardStats = () => {
  const stats = [
    { label: "Tasks Completed", value: "12/20", icon: <FaCheck />, color: "bg-green-600" },
    { label: "Events Today", value: "3", icon: <FaRegCalendarCheck />, color: "bg-blue-600" },
    { label: "Total Expenses", value: "$1,240", icon: <FaRegMoneyBillAlt />, color: "bg-red-600" },
    { label: "Productivity", value: "85%", icon: <FaRegChartBar />, color: "bg-purple-600" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mr-3`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-white text-opacity-70 text-xs">{stat.label}</div>
              <div className="text-white text-xl font-bold">{stat.value}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Main Component
export default function EnhancedHome() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [tip, setTip] = useState("")
  const [showQuickInput, setShowQuickInput] = useState(false)
  const [quickInput, setQuickInput] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Sample data
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", completed: false, date: new Date() },
    { id: 2, text: "Review marketing materials", completed: true, date: new Date() },
    { id: 3, text: "Schedule team meeting", completed: false, date: new Date() },
    { id: 4, text: "Update website content", completed: false, date: new Date() },
    { id: 5, text: "Prepare quarterly report", completed: false, date: addDays(new Date(), 1) },
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, description: "Groceries", amount: 85.75, category: "Food", date: new Date() },
    { id: 2, description: "Uber ride", amount: 24.5, category: "Transport", date: new Date() },
    { id: 3, description: "Movie tickets", amount: 32.0, category: "Entertainment", date: new Date() },
    { id: 4, description: "Electricity bill", amount: 120.0, category: "Bills", date: addDays(new Date(), -2) },
    { id: 5, description: "New headphones", amount: 89.99, category: "Shopping", date: addDays(new Date(), -1) },
  ])

  const [activities, setActivities] = useState([
    { id: 1, type: "task_completed", description: "Completed task: Review marketing materials", time: "10 min ago" },
    { id: 2, type: "expense_added", description: "Added expense: Groceries - $85.75", time: "1 hour ago" },
    { id: 3, type: "event_added", description: "Added event: Team Meeting", time: "3 hours ago" },
    { id: 4, type: "task_added", description: "Added task: Prepare quarterly report", time: "Yesterday" },
    { id: 5, type: "expense_added", description: "Added expense: Electricity bill - $120.00", time: "2 days ago" },
  ])

  // Filter tasks by selected date
  const filteredTasks = tasks.filter((task) => isSameDay(new Date(task.date), selectedDate))

  useEffect(() => {
    generateTip()
  }, [])

  const generateTip = () => {
    const randomTip = productivityTips[Math.floor(Math.random() * productivityTips.length)]
    setTip(randomTip)
  }

  const handleQuickInput = (e) => {
    e.preventDefault()

    if (quickInput.trim() === "") return

    // Determine if it's a task or expense based on input format
    if (quickInput.includes("$")) {
      // It's an expense
      const expenseMatch = quickInput.match(/(.+)\$(\d+\.?\d*)/)
      if (expenseMatch) {
        const description = expenseMatch[1].trim()
        const amount = Number.parseFloat(expenseMatch[2])

        const newExpense = {
          id: expenses.length + 1,
          description,
          amount,
          category: "Other",
          date: new Date(),
        }

        setExpenses([...expenses, newExpense])

        // Add to activities
        const newActivity = {
          id: activities.length + 1,
          type: "expense_added",
          description: `Added expense: ${description} - $${amount.toFixed(2)}`,
          time: "Just now",
        }
        setActivities([newActivity, ...activities])
      }
    } else {
      // It's a task
      const newTask = {
        id: tasks.length + 1,
        text: quickInput,
        completed: false,
        date: selectedDate,
      }

      setTasks([...tasks, newTask])

      // Add to activities
      const newActivity = {
        id: activities.length + 1,
        type: "task_added",
        description: `Added task: ${quickInput}`,
        time: "Just now",
      }
      setActivities([newActivity, ...activities])
    }

    setQuickInput("")
    setShowQuickInput(false)
  }

  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          // Add to activities if completing a task
          if (!task.completed) {
            const newActivity = {
              id: activities.length + 1,
              type: "task_completed",
              description: `Completed task: ${task.text}`,
              time: "Just now",
            }
            setActivities([newActivity, ...activities])
          }

          return { ...task, completed: !task.completed }
        }
        return task
      }),
    )
  }

  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    setTasks(tasks.filter((task) => task.id !== id))

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "task_deleted",
      description: `Deleted task: ${taskToDelete.text}`,
      time: "Just now",
    }
    setActivities([newActivity, ...activities])
  }

  const handleEditTask = (id, newText) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, text: newText }
        }
        return task
      }),
    )

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "task_edited",
      description: `Edited task to: ${newText}`,
      time: "Just now",
    }
    setActivities([newActivity, ...activities])
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-br from-slate-900 to-blue-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } flex flex-col p-4 relative overflow-hidden`}
    >
      {/* Enhanced animated background */}
      <ParticleBackground isDarkMode={isDarkMode} />

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkMode ? "bg-blue-500 opacity-10" : "bg-indigo-500 opacity-5"
            } filter blur-3xl`}
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

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Tairos</h1>
          <p className={`${isDarkMode ? "text-blue-200" : "text-gray-600"}`}>Your personal productivity dashboard</p>
        </motion.div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full py-2 px-3 pl-9 rounded-full ${
                      isDarkMode
                        ? "bg-white bg-opacity-10 text-white placeholder-blue-200"
                        : "bg-white text-gray-800 placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearching(false)
                      setSearchQuery("")
                    }}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? "text-white" : "text-gray-600"
                    }`}
                  >
                    <FaTimes size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearching(true)}
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  } shadow-md`}
                >
                  <FaSearch />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } shadow-md relative`}
          >
            <FaRegBell />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } shadow-md`}
          >
            {isDarkMode ? <FaRegSun /> : <FaRegMoon />}
          </motion.button>

          {/* User */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } shadow-md`}
          >
            <FaRegUser />
          </motion.button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar-x">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FaRegChartBar /> },
            { id: "tasks", label: "Tasks", icon: <FaListUl /> },
            { id: "calendar", label: "Calendar", icon: <FaRegCalendarAlt /> },
            { id: "expenses", label: "Expenses", icon: <FaRegMoneyBillAlt /> },
            { id: "reports", label: "Reports", icon: <FaRegFileAlt /> },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === tab.id
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-indigo-600 text-white"
                  : isDarkMode
                    ? "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
                    : "bg-white text-gray-700 hover:bg-gray-100"
              } shadow-md`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex-1"
      >
        {/* Dashboard Stats */}
        <div className="mb-6">
          <DashboardStats />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card3D
                to="/todolists"
                color={isDarkMode ? "bg-blue-700" : "bg-blue-600"}
                icon={<FaListUl className="text-4xl mb-4" />}
                title="To-Do Lists"
                description="Organize your tasks and boost your productivity"
              />
              <Card3D
                to="/calendar"
                color={isDarkMode ? "bg-purple-700" : "bg-purple-600"}
                icon={<FaCalendarAlt className="text-4xl mb-4" />}
                title="Calendar"
                description="Schedule your events and manage your time effectively"
              />
              <Card3D
                to="/expensetracker"
                color={isDarkMode ? "bg-green-700" : "bg-green-600"}
                icon={<FaChartLine className="text-4xl mb-4" />}
                title="Expense Tracker"
                description="Monitor your finances and make informed decisions"
              />
            </div>

            {/* Productivity Tip */}
            <motion.div
              className={`${
                isDarkMode ? "bg-yellow-500 bg-opacity-20" : "bg-yellow-100"
              } p-6 rounded-lg backdrop-filter backdrop-blur-sm border ${
                isDarkMode ? "border-yellow-500 border-opacity-20" : "border-yellow-200"
              }`}
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 70 }}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${
                    isDarkMode ? "bg-yellow-500 bg-opacity-30" : "bg-yellow-200"
                  } flex items-center justify-center mr-3`}
                >
                  <FaLightbulb className="text-yellow-500 text-xl" />
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Productivity Tip
                </h3>
              </div>
              <p className={`${isDarkMode ? "text-blue-100" : "text-gray-700"} mb-4`}>{tip}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateTip}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300 shadow-lg"
              >
                New Tip
              </motion.button>
            </motion.div>

            {/* Recent Activity */}
            <RecentActivity activities={activities} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Mini Calendar */}
            <MiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {/* Today's Tasks */}
            <TodoList
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />

            {/* Expense Summary */}
            <ExpenseSummary expenses={expenses} />
          </div>
        </div>
      </motion.div>

      {/* Quick Add Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-20"
      >
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuickInput(!showQuickInput)}
          className={`p-4 rounded-full ${
            isDarkMode ? "bg-blue-600" : "bg-indigo-600"
          } text-white shadow-lg flex items-center justify-center`}
        >
          <FaPlus size={24} />
        </motion.button>

        <AnimatePresence>
          {showQuickInput && (
            <motion.form
              initial={{ opacity: 0, y: 10, width: 0 }}
              animate={{ opacity: 1, y: 0, width: 300 }}
              exit={{ opacity: 0, y: 10, width: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleQuickInput}
              className="absolute bottom-16 right-0 overflow-hidden"
            >
              <div
                className={`${
                  isDarkMode ? "bg-white bg-opacity-10" : "bg-white"
                } backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-xl border ${
                  isDarkMode ? "border-white border-opacity-10" : "border-gray-200"
                }`}
              >
                <div className={`text-sm mb-2 ${isDarkMode ? "text-white" : "text-gray-600"}`}>
                  Add task or expense (use $ for expenses)
                </div>
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Task or Expense $00.00"
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-white bg-opacity-20 text-white placeholder-blue-200"
                      : "bg-gray-100 text-gray-800 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 ${
                    isDarkMode ? "focus:ring-blue-500" : "focus:ring-indigo-500"
                  } mb-3`}
                  autoFocus
                />
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`${
                      isDarkMode ? "bg-blue-600" : "bg-indigo-600"
                    } text-white px-4 py-2 rounded-lg font-semibold shadow-md`}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .custom-scrollbar-x::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
