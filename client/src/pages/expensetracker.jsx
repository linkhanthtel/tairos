import { useState, useContext, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { GlobalContext } from "../context/globalState.jsx"
import {
  FaPlus,
  FaTrash,
  FaFilter,
  FaChartPie,
  FaChartLine,
  FaChartBar,
  FaCalendarAlt,
  FaSearch,
  FaSortAmountUp,
  FaSortAmountDown,
  FaTags,
  FaWallet,
  FaCreditCard,
  FaMoneyBillWave,
  FaShoppingBag,
  FaUtensils,
  FaHome,
  FaCar,
  FaPlane,
  FaLaptop,
  FaQuestion,
} from "react-icons/fa"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const ParticleCanvas = ({ width, height, mousePosition, theme }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const gradientRef = useRef([])
  const animationFrameRef = useRef(null)

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
    const particleCount = Math.min(300, Math.floor((width * height) / 5000))
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
          pulse: Math.random() * 2 * Math.PI,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          trail: [], // Add trail for particles
          trailLength: Math.floor(Math.random() * 10) + 5,
        })
      }
    }

    // Create animated gradient blobs
    if (gradientRef.current.length === 0) {
      for (let i = 0; i < 5; i++) {
        gradientRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 300 + 200,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          hue: Math.random() * 60 + (theme === "blue" ? 200 : theme === "green" ? 120 : 270),
          opacity: 0.05 + Math.random() * 0.05,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      // Draw gradient blobs
      gradientRef.current.forEach((blob) => {
        // Update position
        blob.x += blob.speedX
        blob.y += blob.speedY

        // Boundary check
        if (blob.x < -blob.size / 2) blob.x = width + blob.size / 2
        if (blob.x > width + blob.size / 2) blob.x = -blob.size / 2
        if (blob.y < -blob.size / 2) blob.y = height + blob.size / 2
        if (blob.y > height + blob.size / 2) blob.y = -blob.size / 2

        // Draw blob
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.size)
        gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 50%, ${blob.opacity})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2)
        ctx.fill()
      })

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

        // Store current position in trail
        particle.trail.unshift({ x: particle.x, y: particle.y, size: particle.size })
        if (particle.trail.length > particle.trailLength) {
          particle.trail.pop()
        }

        // Interactive effects based on mouse proximity
        if (distance < maxDistance) {
          // Repel particles from mouse
          const force = (1 - distance / maxDistance) * 0.2
          particle.x += dx * force
          particle.y += dy * force

          // Increase size and brightness near mouse
          particle.size = particle.baseSize * (1 + (1 - distance / maxDistance) * 2) * pulseFactor

          // Set color based on theme
          let hue, saturation, lightness
          if (theme === "blue") {
            hue = 210 + Math.random() * 30
            saturation = 70 + Math.random() * 20
            lightness = 50 + Math.random() * 20
          } else if (theme === "green") {
            hue = 120 + Math.random() * 30
            saturation = 70 + Math.random() * 20
            lightness = 50 + Math.random() * 20
          } else if (theme === "purple") {
            hue = 270 + Math.random() * 30
            saturation = 70 + Math.random() * 20
            lightness = 50 + Math.random() * 20
          } else {
            hue = 200 + Math.random() * 60
            saturation = 70 + Math.random() * 20
            lightness = 50 + Math.random() * 20
          }

          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity + (1 - distance / maxDistance) * 0.3})`
        } else {
          // Normal movement
          particle.x += particle.speedX
          particle.y += particle.speedY
          particle.size = particle.baseSize * pulseFactor

          // Set color based on theme
          let hue, saturation, lightness
          if (theme === "blue") {
            hue = 210 + Math.random() * 30
            saturation = 70
            lightness = 50
          } else if (theme === "green") {
            hue = 120 + Math.random() * 30
            saturation = 70
            lightness = 50
          } else if (theme === "purple") {
            hue = 270 + Math.random() * 30
            saturation = 70
            lightness = 50
          } else {
            hue = 200 + Math.random() * 60
            saturation = 70
            lightness = 50
          }

          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${particle.opacity})`
        }

        // Boundary check
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1

        // Draw particle trail
        particle.trail.forEach((pos, index) => {
          const trailOpacity = (1 - index / particle.trail.length) * particle.opacity * 0.5
          ctx.beginPath()
          ctx.fillStyle = ctx.fillStyle.replace(/[\d.]+\)$/, `${trailOpacity})`)
          ctx.arc(pos.x, pos.y, pos.size * (1 - index / particle.trail.length), 0, Math.PI * 2)
          ctx.fill()
        })

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

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [width, height, theme])

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

// 3D Transaction Card
const TransactionCard = ({ transaction, onDelete, isSelected, onClick }) => {
  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 })
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 })
  const scale = useSpring(isSelected ? 1.05 : 1, { stiffness: 300, damping: 15 })

  // Get category icon
  const getCategoryIcon = () => {
    if (!transaction.category) return <FaQuestion size={16} />

    switch (transaction.category.toLowerCase()) {
      case "food":
        return <FaUtensils size={16} />
      case "shopping":
        return <FaShoppingBag size={16} />
      case "housing":
        return <FaHome size={16} />
      case "transportation":
        return <FaCar size={16} />
      case "travel":
        return <FaPlane size={16} />
      case "technology":
        return <FaLaptop size={16} />
      case "income":
        return <FaWallet size={16} />
      default:
        return <FaQuestion size={16} />
    }
  }

  // Get payment method icon
  const getPaymentIcon = () => {
    if (!transaction.paymentMethod) return null

    switch (transaction.paymentMethod.toLowerCase()) {
      case "cash":
        return <FaMoneyBillWave size={14} className="ml-1" />
      case "credit":
        return <FaCreditCard size={14} className="ml-1" />
      case "bank":
        return <FaWallet size={14} className="ml-1" />
      default:
        return null
    }
  }

  // Hover effect
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
  }

  const handleMouseLeave = () => {
    rotateY.set(0)
    rotateX.set(0)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      style={{
        scale,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg mb-3 p-4 cursor-pointer ${
        transaction.amount < 0 ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
      } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
    >
      <motion.div
        style={{
          rotateY: springRotateY,
          rotateX: springRotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-white bg-opacity-20">{getCategoryIcon()}</div>
            <div>
              <div className="text-white font-medium">{transaction.text}</div>
              <div className="text-xs text-gray-300 flex items-center">
                {transaction.date && (
                  <>
                    <FaCalendarAlt size={10} className="mr-1" />
                    {formatDate(transaction.date)}
                  </>
                )}
                {transaction.paymentMethod && (
                  <span className="ml-2 flex items-center">
                    via {transaction.paymentMethod}
                    {getPaymentIcon()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`mr-4 font-bold ${transaction.amount < 0 ? "text-red-400" : "text-green-400"}`}>
              {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-500 text-white p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(transaction.id)
              }}
            >
              <FaTrash size={14} />
            </motion.button>
          </div>
        </div>

        {/* Tags */}
        {transaction.tags && transaction.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap">
            {transaction.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1 mr-1 mb-1 flex items-center"
              >
                <FaTags size={8} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 3D effect elements */}
        <div
          className="absolute inset-0 rounded-lg opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
            transform: "translateZ(1px)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// 3D Balance Card
const BalanceCard = ({ title, amount, icon, color }) => {
  const rotateY = useMotionValue(0)
  const rotateX = useMotionValue(0)
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 })
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 })

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

  return (
    <motion.div
      className="bg-white bg-opacity-20 rounded-lg p-6 mb-6 cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          rotateY: springRotateY,
          rotateX: springRotateX,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <h3 className={`text-3xl font-bold ${color}`}>${Number.parseFloat(amount).toFixed(2)}</h3>
          </div>
          <div className={`p-3 rounded-full ${color.replace("text-", "bg-")} bg-opacity-20`}>{icon}</div>
        </div>

        {/* 3D effect elements */}
        <div
          className="absolute inset-0 rounded-lg opacity-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)",
            transform: "translateZ(2px)",
          }}
        />

        {/* Decorative elements */}
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${color.includes("green") ? "rgba(74,222,128,0.8)" : color.includes("red") ? "rgba(248,113,113,0.8)" : "rgba(96,165,250,0.8)"} 0%, rgba(0,0,0,0) 70%)`,
            transform: "translateZ(1px)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// Replace the entire EnhancedExpenseTracker component with this new version
export default function EnhancedExpenseTracker() {
  const { transaction, addTransaction, deleteTransaction } = useContext(GlobalContext)
  const [text, setText] = useState("")
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [tags, setTags] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })
  const [chartType, setChartType] = useState("line")
  const [timeRange, setTimeRange] = useState("week")
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterTimeRange, setFilterTimeRange] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState(null)
  const [colorTheme, setColorTheme] = useState("blue")
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Available categories
  const categories = ["Food", "Shopping", "Housing", "Transportation", "Travel", "Technology", "Income", "Other"]

  // Available payment methods
  const paymentMethods = ["Cash", "Credit", "Bank"]

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

  // Calculate financial data
  const amounts = transaction.map((transaction) => transaction.amount)
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2)

  // Get transactions for the selected time range
  const getTransactionsForTimeRange = (transactions, range) => {
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "day":
        startDate.setDate(now.getDate() - 1)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        // Return all transactions
        return transactions
    }

    return transactions.filter((t) => {
      if (!t.date) return true // Include transactions without dates
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= now
    })
  }

  // Update chart data when transactions change
  useEffect(() => {
    // Get transactions for the selected time range
    const filteredTransactions = getTransactionsForTimeRange(transaction, timeRange)

    // Sort transactions by date
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(a.date) - new Date(b.date)
    })

    // Prepare data for line/bar chart
    const labels = sortedTransactions.map((t) => {
      if (!t.date) return t.text.substring(0, 10)
      const date = new Date(t.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    const data = sortedTransactions.map((t) => t.amount)
    const cumulativeData = []
    let sum = 0
    sortedTransactions.forEach((t) => {
      sum += t.amount
      cumulativeData.push(sum)
    })

    // Get theme colors
    let primaryColor, secondaryColor
    switch (colorTheme) {
      case "blue":
        primaryColor = "rgb(59, 130, 246)"
        secondaryColor = "rgb(99, 102, 241)"
        break
      case "green":
        primaryColor = "rgb(34, 197, 94)"
        secondaryColor = "rgb(16, 185, 129)"
        break
      case "purple":
        primaryColor = "rgb(168, 85, 247)"
        secondaryColor = "rgb(139, 92, 246)"
        break
      default:
        primaryColor = "rgb(59, 130, 246)"
        secondaryColor = "rgb(99, 102, 241)"
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Transaction Amount",
          data,
          borderColor: primaryColor,
          backgroundColor: primaryColor.replace("rgb", "rgba").replace(")", ", 0.5)"),
          tension: 0.3,
        },
        {
          label: "Balance",
          data: cumulativeData,
          borderColor: secondaryColor,
          backgroundColor: secondaryColor.replace("rgb", "rgba").replace(")", ", 0.5)"),
          tension: 0.3,
          borderDash: [5, 5],
        },
      ],
    })

    // Prepare data for category pie chart
    const categoryAmounts = {}
    transaction.forEach((t) => {
      const category = t.category || "Uncategorized"
      if (t.amount < 0) {
        // Only count expenses
        if (!categoryAmounts[category]) {
          categoryAmounts[category] = 0
        }
        categoryAmounts[category] += Math.abs(t.amount)
      }
    })

    const categoryLabels = Object.keys(categoryAmounts)
    const categoryValues = Object.values(categoryAmounts)

    // Generate colors for categories
    const backgroundColors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(199, 199, 199, 0.7)",
      "rgba(83, 102, 255, 0.7)",
      "rgba(40, 159, 64, 0.7)",
    ]

    setCategoryData({
      labels: categoryLabels,
      datasets: [
        {
          label: "Expenses by Category",
          data: categoryValues,
          backgroundColor: backgroundColors.slice(0, categoryLabels.length),
          borderColor: backgroundColors.slice(0, categoryLabels.length).map((color) => color.replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    })
  }, [transaction, timeRange, colorTheme])

  // Filter and sort transactions
  const getFilteredTransactions = () => {
    return transaction
      .filter((t) => {
        // Search term filter
        if (searchTerm && !t.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false
        }

        // Category filter
        if (filterCategory !== "all" && t.category !== filterCategory) {
          return false
        }

        // Time range filter
        if (filterTimeRange !== "all") {
          if (!t.date) return false

          const transactionDate = new Date(t.date)
          const now = new Date()
          const startDate = new Date()

          switch (filterTimeRange) {
            case "today":
              startDate.setHours(0, 0, 0, 0)
              return transactionDate >= startDate
            case "week":
              startDate.setDate(now.getDate() - 7)
              return transactionDate >= startDate
            case "month":
              startDate.setMonth(now.getMonth() - 1)
              return transactionDate >= startDate
            case "year":
              startDate.setFullYear(now.getFullYear() - 1)
              return transactionDate >= startDate
          }
        }

        return true
      })
      .sort((a, b) => {
        // Sort by selected field
        switch (sortBy) {
          case "amount":
            return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
          case "date":
            if (!a.date) return sortOrder === "asc" ? -1 : 1
            if (!b.date) return sortOrder === "asc" ? 1 : -1
            return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
          case "name":
            return sortOrder === "asc" ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text)
          default:
            return 0
        }
      })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) {
      alert("Please enter a description")
      return
    }

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount,
      date,
      category,
      paymentMethod,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }

    addTransaction(newTransaction)
    setText("")
    setAmount(0)
    setCategory("")
    setPaymentMethod("")
    setTags("")
    setDate(new Date().toISOString().split("T")[0])

    // Close add transaction form on mobile
    if (windowSize.width < 768) {
      setShowAddTransaction(false)
    }
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Change chart type
  const cycleChartType = () => {
    setChartType((prev) => {
      switch (prev) {
        case "line":
          return "bar"
        case "bar":
          return "pie"
        case "pie":
          return "line"
        default:
          return "line"
      }
    })
  }

  // Get chart icon
  const getChartIcon = () => {
    switch (chartType) {
      case "line":
        return <FaChartLine size={18} />
      case "bar":
        return <FaChartBar size={18} />
      case "pie":
        return <FaChartPie size={18} />
      default:
        return <FaChartLine size={18} />
    }
  }

  // Render the appropriate chart
  const renderChart = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "white",
            font: {
              size: windowSize.width < 768 ? 10 : 12,
            },
          },
          position: windowSize.width < 768 ? "bottom" : "top",
        },
        title: {
          display: false,
        },
      },
      scales:
        chartType !== "pie"
          ? {
              x: {
                ticks: {
                  color: "white",
                  font: {
                    size: windowSize.width < 768 ? 8 : 10,
                  },
                  maxRotation: 45,
                  minRotation: 45,
                },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
              },
              y: {
                ticks: {
                  color: "white",
                  font: {
                    size: windowSize.width < 768 ? 8 : 10,
                  },
                },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
              },
            }
          : undefined,
    }

    switch (chartType) {
      case "line":
        return (
          <div className="w-full h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        )
      case "bar":
        return (
          <div className="w-full h-[300px]">
            <Bar data={chartData} options={options} />
          </div>
        )
      case "pie":
        return (
          <div className="w-full h-[300px]">
            <Doughnut
              data={categoryData}
              options={{
                ...options,
                cutout: "60%",
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    position: "right",
                  },
                },
              }}
            />
          </div>
        )
      default:
        return (
          <div className="w-full h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        )
    }
  }

  // Change color theme
  const cycleColorTheme = () => {
    setColorTheme((prev) => {
      switch (prev) {
        case "blue":
          return "green"
        case "green":
          return "purple"
        case "purple":
          return "blue"
        default:
          return "blue"
      }
    })
  }

  // Get theme gradient
  const getThemeGradient = () => {
    switch (colorTheme) {
      case "blue":
        return "from-slate-950 to-blue-950"
      case "green":
        return "from-slate-950 to-green-950"
      case "purple":
        return "from-slate-950 to-purple-950"
      default:
        return "from-slate-950 to-blue-950"
    }
  }

  // Get theme accent color
  const getThemeAccentColor = () => {
    switch (colorTheme) {
      case "blue":
        return "bg-blue-500"
      case "green":
        return "bg-green-500"
      case "purple":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get theme text color
  const getThemeTextColor = () => {
    switch (colorTheme) {
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "purple":
        return "text-purple-500"
      default:
        return "text-blue-500"
    }
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    if (!category) return <FaQuestion size={16} />

    switch (category.toLowerCase()) {
      case "food":
        return <FaUtensils size={16} />
      case "shopping":
        return <FaShoppingBag size={16} />
      case "housing":
        return <FaHome size={16} />
      case "transportation":
        return <FaCar size={16} />
      case "travel":
        return <FaPlane size={16} />
      case "technology":
        return <FaLaptop size={16} />
      case "income":
        return <FaWallet size={16} />
      default:
        return <FaQuestion size={16} />
    }
  }

  // Render dashboard tab
  const renderDashboard = () => (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-300">Balance</h3>
              <p className="text-2xl font-bold text-white">${total}</p>
            </div>
            <div className="p-2 rounded-full bg-white bg-opacity-20">
              <FaWallet size={20} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20 bg-white"></div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-300">Income</h3>
              <p className="text-2xl font-bold text-green-400">${income}</p>
            </div>
            <div className="p-2 rounded-full bg-green-500 bg-opacity-20">
              <FaPlus size={20} className="text-green-400" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20 bg-green-500"></div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-300">Expenses</h3>
              <p className="text-2xl font-bold text-red-400">${expense}</p>
            </div>
            <div className="p-2 rounded-full bg-red-500 bg-opacity-20">
              <FaTrash size={20} className="text-red-400" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20 bg-red-500"></div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Financial Overview</h3>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 ${getThemeAccentColor()} text-white rounded-lg`}
              onClick={cycleChartType}
            >
              {getChartIcon()}
            </motion.button>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-1 text-sm rounded-md bg-white bg-opacity-20 text-white focus:outline-none"
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {renderChart()}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 ${getThemeAccentColor()} text-white rounded-lg`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter size={16} />
            </motion.button>
          </div>
        </div>

        {/* Search and filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-3">
                <div className="flex items-center mb-3">
                  <FaSearch className="text-gray-300 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-transparent border-b border-gray-500 text-white focus:outline-none"
                    placeholder="Search transactions..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Sort by</label>
                    <div className="flex">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-grow p-1 text-sm rounded-l-md bg-white bg-opacity-20 text-white focus:outline-none"
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="name">Name</option>
                      </select>
                      <button onClick={toggleSortOrder} className={`p-1 ${getThemeAccentColor()} rounded-r-md`}>
                        {sortOrder === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full p-1 text-sm rounded-md bg-white bg-opacity-20 text-white focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Time Range</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setFilterTimeRange("all")}
                      className={`p-1 text-xs rounded ${filterTimeRange === "all" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterTimeRange("today")}
                      className={`p-1 text-xs rounded ${filterTimeRange === "today" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setFilterTimeRange("week")}
                      className={`p-1 text-xs rounded ${filterTimeRange === "week" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setFilterTimeRange("month")}
                      className={`p-1 text-xs rounded ${filterTimeRange === "month" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setFilterTimeRange("year")}
                      className={`p-1 text-xs rounded ${filterTimeRange === "year" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                    >
                      Year
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction list */}
        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {getFilteredTransactions().length > 0 ? (
              getFilteredTransactions()
                .slice(0, 5)
                .map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg mb-3 p-4 cursor-pointer ${
                      t.amount < 0 ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
                    } ${selectedTransactionId === t.id ? "ring-2 ring-blue-400" : ""}`}
                    onClick={() => setSelectedTransactionId((prev) => (prev === t.id ? null : t.id))}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3 p-2 rounded-full bg-white bg-opacity-20">
                          {getCategoryIcon(t.category)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{t.text}</div>
                          <div className="text-xs text-gray-300 flex items-center">
                            {t.date && (
                              <>
                                <FaCalendarAlt size={10} className="mr-1" />
                                {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </>
                            )}
                            {t.paymentMethod && <span className="ml-2 flex items-center">via {t.paymentMethod}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-4 font-bold ${t.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                          {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-red-500 text-white p-2 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTransaction(t.id)
                          }}
                        >
                          <FaTrash size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Tags */}
                    {t.tags && t.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap">
                        {t.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1 mr-1 mb-1 flex items-center"
                          >
                            <FaTags size={8} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-400">
                No transactions found
              </motion.div>
            )}
          </AnimatePresence>

          {getFilteredTransactions().length > 5 && (
            <div className="text-center mt-2">
              <button
                className={`text-sm ${getThemeTextColor()} hover:underline`}
                onClick={() => setActiveTab("transactions")}
              >
                View all transactions
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )

  // Render transactions tab
  const renderTransactions = () => (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">All Transactions</h3>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 ${getThemeAccentColor()} text-white rounded-lg`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={16} />
          </motion.button>
        </div>
      </div>

      {/* Search and filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-3">
              <div className="flex items-center mb-3">
                <FaSearch className="text-gray-300 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow bg-transparent border-b border-gray-500 text-white focus:outline-none"
                  placeholder="Search transactions..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Sort by</label>
                  <div className="flex">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-grow p-1 text-sm rounded-l-md bg-white bg-opacity-20 text-white focus:outline-none"
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                      <option value="name">Name</option>
                    </select>
                    <button onClick={toggleSortOrder} className={`p-1 ${getThemeAccentColor()} rounded-r-md`}>
                      {sortOrder === "asc" ? <FaSortAmountUp size={14} /> : <FaSortAmountDown size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-1 text-sm rounded-md bg-white bg-opacity-20 text-white focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Time Range</label>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setFilterTimeRange("all")}
                    className={`p-1 text-xs rounded ${filterTimeRange === "all" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterTimeRange("today")}
                    className={`p-1 text-xs rounded ${filterTimeRange === "today" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setFilterTimeRange("week")}
                    className={`p-1 text-xs rounded ${filterTimeRange === "week" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setFilterTimeRange("month")}
                    className={`p-1 text-xs rounded ${filterTimeRange === "month" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setFilterTimeRange("year")}
                    className={`p-1 text-xs rounded ${filterTimeRange === "year" ? getThemeAccentColor() : "bg-white bg-opacity-20"}`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction list */}
      <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {getFilteredTransactions().length > 0 ? (
            getFilteredTransactions().map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className={`bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg mb-3 p-4 cursor-pointer ${
                  t.amount < 0 ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
                } ${selectedTransactionId === t.id ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => setSelectedTransactionId((prev) => (prev === t.id ? null : t.id))}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-white bg-opacity-20">{getCategoryIcon(t.category)}</div>
                    <div>
                      <div className="text-white font-medium">{t.text}</div>
                      <div className="text-xs text-gray-300 flex items-center">
                        {t.date && (
                          <>
                            <FaCalendarAlt size={10} className="mr-1" />
                            {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </>
                        )}
                        {t.paymentMethod && <span className="ml-2 flex items-center">via {t.paymentMethod}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-4 font-bold ${t.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                      {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-500 text-white p-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTransaction(t.id)
                      }}
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </div>
                </div>

                {/* Tags */}
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap">
                    {t.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white bg-opacity-20 rounded-full px-2 py-1 mr-1 mb-1 flex items-center"
                      >
                        <FaTags size={8} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 text-gray-400">
              No transactions found
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  // Render add transaction tab/form
  const renderAddTransaction = () => (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Add New Transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Description..."
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Amount (negative for expense)..."
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tags (comma separated)..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-3 ${getThemeAccentColor()} text-white rounded-lg flex items-center justify-center`}
          type="submit"
        >
          <FaPlus className="mr-2" />
          Add Transaction
        </motion.button>
      </form>
    </div>
  )

  return (
    <div
      className={`min-h-screen pt-20 bg-gradient-to-br ${getThemeGradient()} flex flex-col items-center py-6 px-4 relative overflow-hidden`}
    >
      {/* Particle background */}
      <ParticleCanvas
        width={windowSize.width}
        height={windowSize.height}
        mousePosition={mousePosition}
        theme={colorTheme}
      />

      {/* Theme switcher */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full z-10"
        onClick={cycleColorTheme}
      >
        <div
          className={`w-5 h-5 rounded-full ${
            colorTheme === "blue" ? "bg-blue-500" : colorTheme === "green" ? "bg-green-500" : "bg-purple-500"
          }`}
        />
      </motion.button>

      {/* Mobile menu button */}
      {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="md:hidden absolute top-4 right-4 p-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full z-10"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white mb-1"></div>
        <div className="w-5 h-0.5 bg-white"></div>
      </motion.button> */}

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="md:hidden fixed top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg z-50 p-4"
          >
            <div className="flex justify-end mb-4">
              <button className="text-white p-2" onClick={() => setShowMobileMenu(false)}>
                ✕
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                className={`p-3 rounded-lg flex items-center ${activeTab === "dashboard" ? getThemeAccentColor() : "bg-white bg-opacity-10"}`}
                onClick={() => {
                  setActiveTab("dashboard")
                  setShowMobileMenu(false)
                }}
              >
                <FaChartPie className="mr-2" /> Dashboard
              </button>
              <button
                className={`p-3 rounded-lg flex items-center ${activeTab === "transactions" ? getThemeAccentColor() : "bg-white bg-opacity-10"}`}
                onClick={() => {
                  setActiveTab("transactions")
                  setShowMobileMenu(false)
                }}
              >
                <FaWallet className="mr-2" /> Transactions
              </button>
              <button
                className={`p-3 rounded-lg flex items-center ${activeTab === "add" ? getThemeAccentColor() : "bg-white bg-opacity-10"}`}
                onClick={() => {
                  setActiveTab("add")
                  setShowMobileMenu(false)
                }}
              >
                <FaPlus className="mr-2" /> Add Transaction
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">Expense Tracker</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center mb-6">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-full p-1 flex">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full flex items-center ${activeTab === "dashboard" ? getThemeAccentColor() : "hover:bg-white hover:bg-opacity-10"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaChartPie className="mr-2" /> Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full flex items-center ${activeTab === "transactions" ? getThemeAccentColor() : "hover:bg-white hover:bg-opacity-10"}`}
              onClick={() => setActiveTab("transactions")}
            >
              <FaWallet className="mr-2" /> Transactions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full flex items-center ${activeTab === "add" ? getThemeAccentColor() : "hover:bg-white hover:bg-opacity-10"}`}
              onClick={() => setActiveTab("add")}
            >
              <FaPlus className="mr-2" /> Add Transaction
            </motion.button>
          </div>
        </div>

        {/* Mobile Add Transaction Button */}
        <div className="md:hidden flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full flex items-center ${getThemeAccentColor()}`}
            onClick={() => setShowAddTransaction(!showAddTransaction)}
          >
            <FaPlus className="mr-2" /> {showAddTransaction ? "Hide Form" : "Add Transaction"}
          </motion.button>
        </div>

        {/* Mobile Add Transaction Form */}
        <AnimatePresence>
          {showAddTransaction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-6 overflow-hidden"
            >
              {renderAddTransaction()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content based on active tab */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "transactions" && renderTransactions()}
        {activeTab === "add" && <div className="hidden md:block">{renderAddTransaction()}</div>}
      </motion.div>

      {/* Floating action button for mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`md:hidden fixed bottom-6 right-6 p-4 ${getThemeAccentColor()} text-white rounded-full shadow-lg z-10`}
        onClick={() => {
          if (activeTab !== "add") {
            setActiveTab("add")
          } else {
            setActiveTab("dashboard")
          }
        }}
      >
        {activeTab !== "add" ? <FaPlus size={24} /> : <FaChartPie size={24} />}
      </motion.button>
    </div>
  )
}

