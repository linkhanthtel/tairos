import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ToDoLists from './pages/todolists'
import Home from './pages/home'
import ExpenseTracker from './pages/expensetracker'
import Navbar from './components/navbar'
import { GlobalProvider } from './context/globalState'

const App = () => {
  return (
    <div>
      <GlobalProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/todolists' element={<ToDoLists />} />
            <Route path='/expensetracker' element={<ExpenseTracker />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </div>
  )
}

export default App
