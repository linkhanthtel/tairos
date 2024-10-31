import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash } from 'react-icons/fa'

export default function ToDoLists() {
  const [tasks, setTasks] = useState("")
  const [toDoLists, setToDoLists] = useState([])

  const addTasks = () => {
    if (tasks.trim() !== "") {
      const newTasks = {
        id: toDoLists.length === 0 ? 1 : toDoLists[toDoLists.length - 1].id + 1,
        taskName: tasks,
      }
      setToDoLists([...toDoLists, newTasks])
      setTasks("")
    }
  }

  const deleteTasks = (id) => {
    setToDoLists(toDoLists.filter((list) => list.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
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
        className="z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-4xl font-bold mb-6 text-white text-center">To Do Lists</h1>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-l-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a task..."
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTasks()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-blue-500 text-white rounded-r-lg flex items-center justify-center"
            onClick={addTasks}
          >
            <FaPlus className="mr-2" />
            Add Task
          </motion.button>
        </div>

        <AnimatePresence>
          {toDoLists.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white bg-opacity-20 rounded-lg mb-3 p-3 flex justify-between items-center"
            >
              <span className="text-white">{task.taskName}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-500 text-white p-2 rounded-full"
                onClick={() => deleteTasks(task.id)}
              >
                <FaTrash />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}