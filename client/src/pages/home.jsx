import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaListUl, FaChartLine, FaLightbulb, FaPlus } from 'react-icons/fa'

const productivityTips = [
  "Connect with Lin to gain more industrial knowledge",
  "Break large tasks into smaller, manageable steps.",
  "Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Prioritize your tasks using the Eisenhower Matrix.",
  "Eliminate distractions by turning off notifications during work sessions.",
  "Start your day by tackling your most important task first.",
]

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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full mix-blend-overlay filter blur-sm"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 max-w-4xl w-full shadow-2xl"
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
          Welcome to Tairos Productivity App. Manage your tasks and expenses efficiently to boost your productivity and financial health.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/todolists">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg text-white hover:bg-opacity-70 transition-all duration-300"
            >
              <FaListUl className="text-4xl mb-4" />
              <h2 className="text-2xl font-semibold mb-2">To-Do Lists</h2>
              <p>Organize your tasks and boost your productivity</p>
            </motion.div>
          </Link>
          <Link to="/expensetracker">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-700 bg-opacity-50 p-6 rounded-lg text-white hover:bg-opacity-70 transition-all duration-300"
            >
              <FaChartLine className="text-4xl mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Expense Tracker</h2>
              <p>Monitor your finances and make informed decisions</p>
            </motion.div>
          </Link>
        </div>

        <motion.div 
          className="bg-yellow-500 bg-opacity-20 p-6 rounded-lg mb-8"
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 70 }}
        >
          <div className="flex items-center mb-4">
            <FaLightbulb className="text-yellow-300 text-2xl mr-3" />
            <h3 className="text-xl font-semibold text-white">Productivity Tip</h3>
          </div>
          <p className="text-blue-100 mb-4">{tip}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTip}
            className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300"
          >
            New Tip
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => setShowQuickInput(!showQuickInput)}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Quick Add
          </button>
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
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter a task or expense"
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="mt-2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300"
              >
                Add
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}