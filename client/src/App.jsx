import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ToDoLists from './pages/todolists'
import Home from './pages/home'
import ExpenseTracker from './pages/expensetracker'
import Calendar from './pages/calendar'
import Navbar from './components/navbar'
import DemoBanner from './components/DemoBanner'
import { GlobalProvider } from './context/globalState'
import { IS_DEMO_BUILD } from './config'

const App = () => {
  return (
    <div className={`min-h-screen ${IS_DEMO_BUILD ? 'pt-[2.75rem]' : ''}`}>
      <GlobalProvider>
        <BrowserRouter>
          {IS_DEMO_BUILD && <DemoBanner />}
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/todolists' element={<ToDoLists />} />
            <Route path='/expensetracker' element={<ExpenseTracker />} />
            <Route path='/calendar' element={<Calendar />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </div>
  )
}

export default App
