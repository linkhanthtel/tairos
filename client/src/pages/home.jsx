import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className='bg-white h-screen flex flex-col items-center text-center text-blue-900'
    >
      <h1 className='text-3xl my-2'>Tairos</h1>
      <p className='w-100 md:w-[800px] text-xl text-center my-4'>Welcome to Tairos Productivity App. In this app, you can make to do lists and expense tracker. To do lists tab will help you list your to do list for your daily life. Expense Tracker tab will help you track your daily expense by managing your income and expense.</p>
      <div className='flex flex-col md:flex-row'>
        <div className='mx-4 my-5'>
          <Link to="/todolists" className='p-3 border border-blue-900 text-blue-900 rounded-full hover:bg-blue-900 hover:text-white'>Go to To Do Lists Tab</Link>
        </div>
        <div className='mx-4 my-5'>
          <Link to="/expensetracker" className='p-3 border border-blue-900 text-blue-900 rounded-full hover:bg-blue-900 hover:text-white'>Go to Expense Tracker Tab</Link>
        </div>
      </div>
    </motion.div>
  )
}

export default Home
