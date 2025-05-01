import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LuMenuSquare } from "react-icons/lu"
import { AiFillCloseSquare } from "react-icons/ai"
import { RiHome4Line, RiTodoLine, RiMoneyDollarCircleLine, RiCalendarLine, RiArrowRightSLine } from "react-icons/ri"

// Enhanced menu items with icons
const menuItems = [
  { title: "Home", path: "/", icon: <RiHome4Line className="text-xl" /> },
  { title: "To Do Lists", path: "/todolists", icon: <RiTodoLine className="text-xl" /> },
  { title: "Expense Tracker", path: "/expensetracker", icon: <RiMoneyDollarCircleLine className="text-xl" /> },
  { title: "Calendar", path: "/calendar", icon: <RiCalendarLine className="text-xl" /> },
]

// Animation variants
const menuVariants = {
  open: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const menuItemVariants = {
  open: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 1,
    },
  },
  closed: {
    y: 50,
    x: -20,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 1,
    },
  },
}

// Decorative elements variants
const circleVariants = {
  open: (i) => ({
    scale: [0, 1],
    opacity: [0, 0.2, 0.4],
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  }),
  closed: {
    scale: 0,
    opacity: 0,
  },
}

const lineVariants = {
  open: {
    width: "100%",
    transition: { duration: 0.5 },
  },
  closed: {
    width: "0%",
    transition: { duration: 0.3 },
  },
}

// Particle component for futuristic effect
const Particles = ({ isOpen }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={circleVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="absolute rounded-full bg-cyan-400"
          style={{
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(1px)",
            boxShadow: "0 0 8px 2px rgba(34, 211, 238, 0.3)",
          }}
        />
      ))}
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [time, setTime] = useState(new Date())

  // Update time for futuristic clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Animated Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-br from-indigo-600 to-blue-900 text-white shadow-lg"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 15px 2px rgba(79, 70, 229, 0.6)",
        }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: "0 0 10px rgba(79, 70, 229, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)",
        }}
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.4, type: "spring" }}>
          {isOpen ? <AiFillCloseSquare className="text-3xl" /> : <LuMenuSquare className="text-3xl" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              className="fixed top-0 left-0 h-screen w-72 z-50 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(29, 78, 216, 0.8) 100%)",
                boxShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
                backdropFilter: "blur(10px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 rounded-full filter blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600 rounded-full filter blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

              {/* Particles effect */}
              <Particles isOpen={isOpen} />

              <div className="flex flex-col h-full relative z-10">
                {/* Header with futuristic styling */}
                <div className="flex items-center justify-between h-24 px-6 border-b border-white/10">
                  <motion.h1
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    TAIROS
                  </motion.h1>

                  {/* Futuristic digital clock */}
                  <motion.div
                    className="text-cyan-300 text-sm font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </motion.div>
                </div>

                {/* Menu items with enhanced animations */}
                <motion.ul
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex-grow py-8 px-4 space-y-3"
                >
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      variants={menuItemVariants}
                      onHoverStart={() => setActiveIndex(index)}
                      onHoverEnd={() => setActiveIndex(null)}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="group block relative py-3 px-4 rounded-lg text-lg font-medium transition-all duration-300"
                      >
                        {/* Animated background on hover */}
                        <motion.div
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)",
                            boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.1)",
                          }}
                          initial={false}
                          animate={{
                            opacity: activeIndex === index ? 1 : 0,
                            x: activeIndex === index ? 0 : -10,
                          }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Glowing line indicator */}
                        <motion.div
                          className="absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
                          variants={lineVariants}
                          initial="closed"
                          animate={activeIndex === index ? "open" : "closed"}
                          style={{ boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)" }}
                        />

                        <div className="flex items-center relative z-10">
                          {/* Icon with glow effect */}
                          <motion.div
                            className="mr-3 text-cyan-400"
                            whileHover={{ scale: 1.2 }}
                            animate={{
                              filter: activeIndex === index ? "drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))" : "none",
                            }}
                          >
                            {item.icon}
                          </motion.div>

                          {/* Menu text */}
                          <span className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                            {item.title}
                          </span>

                          {/* Arrow indicator */}
                          <motion.div
                            className="ml-auto text-white/50 group-hover:text-cyan-300"
                            animate={{
                              x: activeIndex === index ? 0 : -5,
                              opacity: activeIndex === index ? 1 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <RiArrowRightSLine />
                          </motion.div>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Footer with futuristic styling */}
                <motion.div
                  className="p-6 border-t border-white/10 text-xs text-center text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="mb-2 font-mono">SYSTEM v2.4.7</div>
                  <div className="flex justify-center space-x-1">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                    <div
                      className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
