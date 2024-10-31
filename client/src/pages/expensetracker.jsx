import React, { useState, useContext, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlobalContext } from '../context/globalState.jsx'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ExpenseTracker() {
  const { transaction, addTransaction, deleteTransaction } = useContext(GlobalContext)
  const [text, setText] = useState('')
  const [amount, setAmount] = useState(0)
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  const amounts = transaction.map(transaction => transaction.amount)
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2)

  useEffect(() => {
    const labels = transaction.map(t => t.text).slice(-5)
    const data = transaction.map(t => t.amount).slice(-5)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    })
  }, [transaction])

  const onSubmit = (e) => {
    e.preventDefault()

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount,
    }

    addTransaction(newTransaction)
    setText('')
    setAmount(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400 rounded-full mix-blend-screen filter blur-sm"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-4xl"
      >
        <h1 className="text-4xl font-bold mb-6 text-white text-center">My Expense Tracker</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Your Balance</h3>
              <h3 className="text-3xl font-bold text-white">${total}</h3>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Income & Expenses</h3>
              <div className="flex justify-between">
                <div>
                  <h4 className="text-green-400">Income</h4>
                  <p className="text-2xl font-bold text-green-400">${income}</p>
                </div>
                <div>
                  <h4 className="text-red-400">Expenses</h4>
                  <p className="text-2xl font-bold text-red-400">${expense}</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Transaction</h3>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                  placeholder="Enter description..."
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                  placeholder="Enter amount..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center"
                  type="submit"
                >
                  <FaPlus className="mr-2" />
                  Add Transaction
                </motion.button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
              <AnimatePresence>
                {transaction.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white bg-opacity-20 rounded-lg mb-3 p-3 flex justify-between items-center ${
                      t.amount < 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                    }`}
                  >
                    <span className="text-white">{t.text}</span>
                    <div className="flex items-center">
                      <span className={`mr-4 ${t.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-red-500 text-white p-2 rounded-full"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Transaction Trend</h3>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: 'white',
                      },
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: 'white' },
                    },
                    y: {
                      ticks: { color: 'white' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}