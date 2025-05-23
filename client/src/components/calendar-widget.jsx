import { useState } from "react"
import { motion } from "framer-motion"
import { format, addDays, startOfWeek, addWeeks, isSameDay } from "date-fns"
import { FaChevronLeft, FaChevronRight, FaRegClock } from "react-icons/fa"

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 30, 0, 0)),
    color: "#8b5cf6",
  },
  {
    id: 2,
    title: "Product Launch",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    color: "#ec4899",
  },
  {
    id: 3,
    title: "Client Call",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    color: "#10b981",
  },
]

const CalendarWidget = ({ isDarkMode = true }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState(sampleEvents)

  // Generate days for the current week
  const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i))

  // Navigate to previous/next week
  const navigateWeek = (direction) => {
    setCurrentWeekStart(addWeeks(currentWeekStart, direction))
  }

  // Get events for the selected date
  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date))
  }

  // Get events for the selected date
  const selectedDateEvents = getEventsForDate(selectedDate)

  return (
    <div
      className={`${
        isDarkMode ? "bg-white bg-opacity-10" : "bg-white"
      } backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow-lg`}
    >
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Calendar</h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateWeek(-1)}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-white hover:bg-opacity-20" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <FaChevronLeft className={isDarkMode ? "text-white" : "text-gray-600"} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateWeek(1)}
            className={`p-1 rounded-full ${
              isDarkMode ? "hover:bg-white hover:bg-opacity-20" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <FaChevronRight className={isDarkMode ? "text-white" : "text-gray-600"} />
          </motion.button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div key={i} className={`text-center ${isDarkMode ? "text-white text-opacity-70" : "text-gray-500"} text-sm`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day, i) => {
          const dayEvents = getEventsForDate(day)
          const hasEvents = dayEvents.length > 0

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center p-2 rounded-lg cursor-pointer relative ${
                isSameDay(day, selectedDate)
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-indigo-600 text-white"
                  : isDarkMode
                    ? "text-white hover:bg-white hover:bg-opacity-10"
                    : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm">{format(day, "d")}</span>

              {/* Event indicator */}
              {hasEvents && (
                <div className="flex mt-1 space-x-1">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }} />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-400"}`} />
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Month and Year */}
      <div className={`text-center ${isDarkMode ? "text-white text-opacity-70" : "text-gray-500"} text-sm mb-4`}>
        {format(currentWeekStart, "MMMM yyyy")}
      </div>

      {/* Events for Selected Date */}
      <div className="mt-4">
        <div className="flex items-center mb-3">
          <div className={`w-1 h-6 rounded-full mr-2 ${isDarkMode ? "bg-blue-500" : "bg-indigo-500"}`} />
          <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Events for {format(selectedDate, "MMMM d, yyyy")}
          </h4>
        </div>

        <div className={`space-y-2 max-h-[150px] overflow-y-auto pr-2 ${isDarkMode ? "custom-scrollbar" : ""}`}>
          {selectedDateEvents.length === 0 ? (
            <div className={`text-center py-4 ${isDarkMode ? "text-white text-opacity-50" : "text-gray-500"}`}>
              No events scheduled
            </div>
          ) : (
            selectedDateEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-white bg-opacity-5" : "bg-gray-50"} flex items-center`}
                style={{
                  borderLeft: `3px solid ${event.color}`,
                }}
              >
                <div className="flex-1">
                  <div className={isDarkMode ? "text-white" : "text-gray-800"}>{event.title}</div>
                  {isSameDay(event.start, event.end) && (
                    <div
                      className={`text-xs flex items-center mt-1 ${isDarkMode ? "text-white text-opacity-60" : "text-gray-500"}`}
                    >
                      <FaRegClock className="mr-1" size={10} />
                      {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarWidget
