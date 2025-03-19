import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaTrash, FaLightbulb, FaEdit, FaSave, FaClock } from 'react-icons/fa'
import { HfInference } from '@huggingface/inference'

export default function ToDoLists() {
  const [tasks, setTasks] = useState("")
  const [toDoLists, setToDoLists] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")

  const hf = new HfInference("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")

  const analyzeTask = async (taskText) => {
    setIsAnalyzing(true)
    try {
      const [priority, complexity] = await Promise.all([
        hf.zeroShotClassification({
          model: 'facebook/bart-large-mnli',
          inputs: taskText,
          parameters: {
            candidate_labels: ['urgent', 'important', 'normal', 'low-priority']
          }
        }),
        hf.zeroShotClassification({
          model: 'facebook/bart-large-mnli',
          inputs: taskText,
          parameters: {
            candidate_labels: ['quick', 'medium', 'complex']
          }
        })
      ])

      setIsAnalyzing(false)
      return {
        priority: priority.labels[0],
        complexity: complexity.labels[0],
        estimatedDays: complexity.labels[0] === 'quick' ? 1 : 
                      complexity.labels[0] === 'medium' ? 3 : 7
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      setIsAnalyzing(false)
      return { priority: 'normal', complexity: 'medium', estimatedDays: 3 }
    }
  }

  const generateSuggestions = async () => {
    if (toDoLists.length === 0) return

    setIsAnalyzing(true)
    try {
      const prompt = `Based on these tasks: ${toDoLists.map(t => t.taskName).join(', ')}, suggest 3 related tasks.`
      const result = await hf.textGeneration({
        model: 'gpt2',
        inputs: prompt,
        parameters: {
          max_length: 100,
          num_return_sequences: 1
        }
      })
      
      const suggestedTasks = result.generated_text
        .split('.')
        .filter(task => task.trim().length > 5)
        .slice(0, 3)
        .map(task => task.trim())

      setSuggestions(suggestedTasks)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    }
    setIsAnalyzing(false)
  }

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

  const deleteTasks = (id) => {
    setToDoLists(toDoLists.filter((list) => list.id !== id))
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setEditText(task.taskName)
  }

  const saveEdit = async (id) => {
    if (editText.trim() !== "") {
      const analysis = await analyzeTask(editText)
      setToDoLists(toDoLists.map(task => 
        task.id === id ? {
          ...task,
          taskName: editText,
          priority: analysis.priority,
          complexity: analysis.complexity,
          estimatedDays: analysis.estimatedDays,
          lastEdited: new Date().toISOString()
        } : task
      ))
      setEditingId(null)
      setEditText("")
    }
  }

  const updateTaskDueDate = (id, days) => {
    setToDoLists(toDoLists.map(task =>
      task.id === id ? {
        ...task,
        estimatedDays: task.estimatedDays + days
      } : task
    ))
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
        <h1 className="text-4xl font-bold mb-6 text-white text-center">AI-Powered To Do Lists</h1>
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
            disabled={isAnalyzing}
          >
            <FaPlus className="mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Add Task'}
          </motion.button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-4 mb-6 p-4 bg-white bg-opacity-20 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Suggested Tasks:</h3>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => setTasks(suggestion)}
              >
                • {suggestion}
              </div>
            ))}
          </div>
        )}

        {toDoLists.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mb-6 p-3 bg-purple-500 text-white rounded-lg flex items-center justify-center"
            onClick={generateSuggestions}
            disabled={isAnalyzing}
          >
            <FaLightbulb className="mr-2" />
            Get AI Suggestions
          </motion.button>
        )}

        <AnimatePresence>
          {toDoLists.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={`bg-white bg-opacity-20 rounded-lg mb-3 p-3 ${
                task.priority === 'urgent' ? 'border-l-4 border-red-500' :
                task.priority === 'important' ? 'border-l-4 border-yellow-500' :
                task.priority === 'normal' ? 'border-l-4 border-green-500' :
                'border-l-4 border-gray-500'
              }`}
            >
              <div className="flex flex-col w-full">
                {editingId === task.id ? (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow p-2 rounded bg-white bg-opacity-20 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-green-500 text-white p-2 rounded-full"
                      onClick={() => saveEdit(task.id)}
                    >
                      <FaSave />
                    </motion.button>
                  </div>
                ) : (
                  <span className="text-white text-lg">{task.taskName}</span>
                )}
                
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-sm text-gray-300">Priority: {task.priority}</span>
                  <span className="text-sm text-gray-300">Complexity: {task.complexity}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">Est. Days: {task.estimatedDays}</span>
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-blue-500 text-white p-1 rounded-full text-xs"
                        onClick={() => updateTaskDueDate(task.id, -1)}
                      >
                        -1
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-blue-500 text-white p-1 rounded-full text-xs"
                        onClick={() => updateTaskDueDate(task.id, 1)}
                      >
                        +1
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-blue-500 text-white p-2 rounded-full"
                    onClick={() => startEditing(task)}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 text-white p-2 rounded-full"
                    onClick={() => deleteTasks(task.id)}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}