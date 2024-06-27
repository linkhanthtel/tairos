import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LuMenuSquare } from "react-icons/lu";
import { AiFillCloseSquare } from "react-icons/ai";

function Navbar() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <button onClick={() => setToggle(true)} className='m-4 text-5xl text-blue-500'>
        <LuMenuSquare />
      </button>
      { toggle ? (
        <nav className="h-screen z-10 bg-blue-800 text-white fixed top-0 left-0 md:w-64 w-full flex flex-col justify-start">
          <div className='flex justify-center items-center'>
            <button onClick={() => setToggle(false)}><AiFillCloseSquare className='text-5xl mt-3' /></button>
          </div>
          <div className="flex items-center p-4">
            <h1 className="text-xl font-bold px-2">Tairos</h1>
          </div>
          <ul className="flex flex-col mt-28 px-4">
            <li className="hover:bg-blue-900 py-4 px-2 rounded-md">
              <Link to="/" className="flex items-center">
                Home
              </Link>
            </li>
            <li className="hover:bg-blue-900 py-4 px-2 rounded-md">
              <Link to="/todolists" className="flex items-center">
                To Do Lists
              </Link>
            </li>
            <li className="hover:bg-blue-900 py-4 px-2 rounded-md">
              <Link to="/expensetracker" className="flex items-center">
                Expense Tracker
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Navbar
