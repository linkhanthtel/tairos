import { useState, useEffect } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns"
import enUS from "date-fns/locale/en-US"
import { motion, AnimatePresence, useAnimation } from "framer-motion"

// Date-fns configuration
const locales = {
  "en-US": enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Custom Animated Background
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 15s ease infinite",
        }}
      />

      {/* Animated circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 155) + 100}, 0.8) 0%, rgba(${Math.floor(Math.random() * 50) + 50}, ${Math.floor(Math.random() * 50) + 50}, ${Math.floor(Math.random() * 100) + 155}, 0.4) 100%)`,
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(60px)",
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            x: ["-50%", `${Math.random() * 10 - 5}%`, "-50%"],
            y: ["-50%", `${Math.random() * 10 - 5}%`, "-50%"],
            scale: [1, Math.random() * 0.3 + 0.9, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  )
}

// Custom event component with animation
const CustomEvent = ({ event, onClick }) => {
  const controls = useAnimation()

  useEffect(() => {
    controls.start({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    })
  }, [controls])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        y: -2,
      }}
      onClick={() => onClick(event)}
      style={{
        background: `linear-gradient(135deg, ${event.color || "#3b82f6"} 0%, ${event.secondaryColor || "#60a5fa"} 100%)`,
        borderRadius: "8px",
        color: "white",
        padding: "4px 8px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        borderLeft: "3px solid rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="flex-1 truncate">{event.title}</div>
      {event.priority && (
        <div
          className="w-2 h-2 rounded-full ml-1 flex-shrink-0"
          style={{
            background: event.priority === "high" ? "#ef4444" : event.priority === "medium" ? "#f59e0b" : "#10b981",
            boxShadow: `0 0 5px ${
              event.priority === "high" ? "#ef4444" : event.priority === "medium" ? "#f59e0b" : "#10b981"
            }`,
          }}
        />
      )}
    </motion.div>
  )
}

// Event details modal
const EventDetailsModal = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white border-opacity-20"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-2 h-12 rounded-full mr-3"
          style={{
            background: `linear-gradient(to bottom, ${event.color}, ${event.secondaryColor})`,
            boxShadow: `0 0 10px ${event.color}`,
          }}
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <span className="mr-3">{format(event.start, "MMM dd, yyyy")}</span>
            <span>
              {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
            </span>
          </div>
        </div>
        {event.priority && (
          <div
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background:
                event.priority === "high"
                  ? "rgba(239, 68, 68, 0.1)"
                  : event.priority === "medium"
                    ? "rgba(245, 158, 11, 0.1)"
                    : "rgba(16, 185, 129, 0.1)",
              color: event.priority === "high" ? "#ef4444" : event.priority === "medium" ? "#f59e0b" : "#10b981",
            }}
          >
            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
          </div>
        )}
      </div>

      {event.description && (
        <div className="mb-6 bg-white bg-opacity-50 p-4 rounded-xl">
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(event)}
          className="px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Delete
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(event)}
          className="px-4 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Close
        </motion.button>
      </div>
    </motion.div>
  )
}

// Event form modal (for both create and edit)
const EventFormModal = ({ event, onClose, onSave, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start: event?.start || new Date(),
    end: event?.end || addMinutes(new Date(), 60),
    color: event?.color || "#3b82f6",
    secondaryColor: event?.secondaryColor || "#60a5fa",
    priority: event?.priority || "medium",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...event,
      ...formData,
      id: event?.id || Date.now().toString(),
    })
  }

  const colorPairs = [
    { primary: "#3b82f6", secondary: "#60a5fa" }, // Blue
    { primary: "#8b5cf6", secondary: "#a78bfa" }, // Purple
    { primary: "#ec4899", secondary: "#f472b6" }, // Pink
    { primary: "#10b981", secondary: "#34d399" }, // Green
    { primary: "#f59e0b", secondary: "#fbbf24" }, // Amber
    { primary: "#ef4444", secondary: "#f87171" }, // Red
    { primary: "#06b6d4", secondary: "#22d3ee" }, // Cyan
    { primary: "#6366f1", secondary: "#818cf8" }, // Indigo
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white border-opacity-20"
    >
      <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {isEditing ? "Edit Event" : "Create New Event"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Start Time</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                type="datetime-local"
                name="start"
                value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start: new Date(e.target.value),
                    end: new Date(e.target.value) > prev.end ? addMinutes(new Date(e.target.value), 60) : prev.end,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">End Time</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                type="datetime-local"
                name="end"
                value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end: new Date(e.target.value),
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200"
                required
                min={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Priority</label>
            <div className="flex gap-3">
              {["low", "medium", "high"].map((priority) => (
                <motion.button
                  key={priority}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                    formData.priority === priority
                      ? "border-transparent ring-2 ring-offset-2 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor:
                      formData.priority === priority
                        ? priority === "high"
                          ? "#ef4444"
                          : priority === "medium"
                            ? "#f59e0b"
                            : "#10b981"
                        : "transparent",
                    boxShadow:
                      formData.priority === priority
                        ? `0 0 0 2px ${priority === "high" ? "rgba(239, 68, 68, 0.2)" : priority === "medium" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}`
                        : "none",
                  }}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {colorPairs.map((pair, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      color: pair.primary,
                      secondaryColor: pair.secondary,
                    }))
                  }
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    formData.color === pair.primary ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${pair.primary} 0%, ${pair.secondary} 100%)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="px-5 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
          >
            {isEditing ? "Update Event" : "Add Event"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [modalType, setModalType] = useState(null) // "create", "view", "edit"
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  // Generate some sample events on first render
  useEffect(() => {
    const today = new Date()
    const sampleEvents = [
      {
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync to discuss project progress and roadblocks.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 30),
        color: "#8b5cf6",
        secondaryColor: "#a78bfa",
        priority: "medium",
      },
      {
        id: "2",
        title: "Product Launch",
        description: "Final preparation for the new feature release. Make sure all documentation is ready.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0),
        color: "#ec4899",
        secondaryColor: "#f472b6",
        priority: "high",
      },
      {
        id: "3",
        title: "Client Call",
        description: "Quarterly review with the client to discuss performance and future plans.",
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 9, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 0),
        color: "#10b981",
        secondaryColor: "#34d399",
        priority: "low",
      },
    ]
    setEvents(sampleEvents)
  }, [])

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate(start)
    setSelectedEvent({
      start,
      end: end || addMinutes(start, 60),
    })
    setModalType("create")
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setModalType("view")
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedEvent(null)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setModalType("edit")
  }

  const handleDeleteEvent = (event) => {
    setEvents(events.filter((e) => e.id !== event.id))
    setModalType(null)
  }

  const handleSaveEvent = (event) => {
    if (modalType === "edit") {
      setEvents(events.map((e) => (e.id === event.id ? event : e)))
    } else {
      setEvents([...events, event])
    }
    setModalType(null)
  }

  const calendarCustomStyles = {
    style: {
      height: 650,
      background: "rgba(255, 255, 255, 0.8)",
      borderRadius: "16px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      padding: "20px",
      position: "relative",
      zIndex: 10,
    },
    dayPropGetter: (date) => ({
      style: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: "8px",
        margin: "2px",
        transition: "all 0.2s ease",
      },
    }),
    eventPropGetter: (event) => ({
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    }),
    components: {
      event: (props) => <CustomEvent {...props} onClick={handleSelectEvent} />,
    },
  }

  // Custom CSS styles
  const customStyles = `
    .rbc-calendar {
      font-family: "Inter", sans-serif;
    }

    .rbc-header {
      padding: 12px 3px;
      font-weight: 600;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px 8px 0 0;
      border: none !important;
    }

    .rbc-month-view {
      border-radius: 16px;
      border: none !important;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .rbc-day-bg {
      transition: all 0.3s ease;
    }

    .rbc-day-bg:hover {
      background-color: rgba(59, 130, 246, 0.1) !important;
    }

    .rbc-off-range-bg {
      background-color: rgba(0, 0, 0, 0.03) !important;
    }

    .rbc-today {
      background-color: rgba(59, 130, 246, 0.15) !important;
    }

    .rbc-event {
      border: none !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .rbc-event:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .rbc-toolbar button {
      border-radius: 8px !important;
      transition: all 0.2s ease;
      color: #4b5563;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      background: white;
      padding: 8px 16px;
      font-weight: 500;
    }

    .rbc-toolbar button:hover {
      background-color: #f3f4f6 !important;
      color: #1f2937;
    }

    .rbc-toolbar button.rbc-active {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      border: none !important;
    }

    .rbc-toolbar {
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .rbc-btn-group {
      margin: 0 !important;
    }

    .rbc-time-view {
      border-radius: 16px;
      overflow: hidden;
      border: none !important;
    }

    .rbc-time-header {
      border-radius: 16px 16px 0 0;
      overflow: hidden;
    }

    .rbc-time-content {
      border-radius: 0 0 16px 16px;
      overflow: hidden;
    }

    .rbc-day-slot .rbc-events-container {
      margin-right: 0 !important;
    }

    .rbc-current-time-indicator {
      background-color: #ef4444 !important;
      height: 2px;
    }

    @keyframes gradientAnimation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen overflow-hidden relative p-6">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">My Calendar</h1>
          {/* <p className="text-blue-100 max-w-2xl mx-auto">
            Manage your schedule with our beautiful calendar. Create, view, edit, and delete events with ease.
          </p> */}
        </motion.div>

        {/* Calendar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <BigCalendar
            selectable
            localizer={localizer}
            events={events}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            defaultDate={new Date()}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            popup
            {...calendarCustomStyles}
          />
        </motion.div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {modalType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={handleCloseModal}
            >
              <div onClick={(e) => e.stopPropagation()}>
                {modalType === "view" && selectedEvent && (
                  <EventDetailsModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onEdit={() => handleEditEvent(selectedEvent)}
                    onDelete={handleDeleteEvent}
                  />
                )}

                {(modalType === "create" || modalType === "edit") && (
                  <EventFormModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvent}
                    isEditing={modalType === "edit"}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Calendar
