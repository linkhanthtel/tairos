import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LuMenuSquare } from "react-icons/lu"
import { AiFillCloseSquare } from "react-icons/ai"

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'To Do Lists', path: '/todolists' },
  { title: 'Expense Tracker', path: '/expensetracker' },
]

const menuVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
}

const menuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-4 left-4 z-50 p-2 rounded-full bg-blue-900 text-white shadow-lg'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <AiFillCloseSquare className='text-3xl' />
        ) : (
          <LuMenuSquare className='text-3xl' />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-20 border-b border-blue-800">
                  <h1 className="text-2xl font-bold">Tairos</h1>
                </div>
                <motion.ul
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex-grow py-8 px-4 space-y-2"
                >
                  {menuItems.map((item) => (
                    <motion.li key={item.path} variants={menuItemVariants}>
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="block py-3 px-4 rounded-lg text-lg font-medium transition-colors duration-200 hover:bg-blue-800 hover:text-white"
                      >
                        {item.title}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}