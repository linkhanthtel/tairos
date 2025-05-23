import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaListUl, FaCheck, FaTrash, FaEdit, FaPlus } from "react-icons/fa"

const TodoListWidget = ({ isDarkMode = true, initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskText, setNewTaskText] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTaskText.trim() === "") return

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      date: new Date(),
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
    setShowAddForm(false)
  }

  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        }
        return task
      }),
    )
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditClick = (task) => {
    setEditingTask(task.id)
    setEditText(task.text)
  }

  const handleSaveEdit = (id) => {
    if (editText.trim() === "") return

    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, text: editText }
        }
        return task
      }),
    )
    setEditingTask(null)
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-white bg-opacity-10" : "bg-white"
      } backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
          <FaListUl className="mr-2" /> Tasks
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className={`p-2 rounded-full ${
            isDarkMode ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
          } shadow-md`}
        >
          <FaPlus size={12} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleAddTask}
            className="mb-4"
          >
            <div className={`${isDarkMode ? "bg-white bg-opacity-5" : "bg-gray-50"} rounded-lg p-3 flex items-center`}>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a new task..."
                className={`flex-1 bg-transparent border-none focus:outline-none ${
                  isDarkMode
                    ? "text-white placeholder-white placeholder-opacity-50"
                    : "text-gray-800 placeholder-gray-400"
                }`}
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`ml-2 px-3 py-1 rounded-md ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                } text-sm`}
              >
                Add
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className={`text-center py-4 ${isDarkMode ? "text-white text-opacity-50" : "text-gray-500"}`}>
            No tasks yet. Add one to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`${
                isDarkMode ? "bg-white bg-opacity-5" : "bg-gray-50"
              } rounded-lg p-3 flex items-center justify-between group`}
            >
              {editingTask === task.id ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`w-full ${
                      isDarkMode ? "bg-white bg-opacity-20 text-white" : "bg-white text-gray-800 border border-gray-200"
                    } rounded p-1 focus:outline-none`}
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit(task.id)}
                  />
                  <div className="flex mt-2 space-x-2">
                    <button
                      onClick={() => setEditingTask(null)}
                      className={`text-xs ${
                        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
                      } px-2 py-1 rounded`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className={`text-xs ${
                        isDarkMode ? "bg-blue-600 text-white" : "bg-indigo-600 text-white"
                      } px-2 py-1 rounded`}
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
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        task.completed
                          ? isDarkMode
                            ? "bg-green-500 text-white"
                            : "bg-green-600 text-white"
                          : isDarkMode
                            ? "border border-white border-opacity-50 text-transparent hover:border-white"
                            : "border border-gray-400 text-transparent hover:border-gray-600"
                      }`}
                    >
                      {task.completed && <FaCheck size={10} />}
                    </motion.button>
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-800"
                      } ${task.completed ? "line-through opacity-50" : "opacity-90"}`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(task)}
                      className={`${
                        isDarkMode
                          ? "text-white text-opacity-70 hover:text-opacity-100"
                          : "text-gray-500 hover:text-gray-700"
                      } p-1`}
                    >
                      <FaEdit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className={`${
                        isDarkMode
                          ? "text-white text-opacity-70 hover:text-opacity-100"
                          : "text-gray-500 hover:text-gray-700"
                      } p-1`}
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

export default TodoListWidget
