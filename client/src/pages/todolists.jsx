import React, { useState } from 'react'

function ToDoLists() {
  const [tasks, setTasks] = useState("");
  const [toDoLists, setToDoLists] = useState([]);

  const addTasks = () => {
    const newTasks = {
      id: toDoLists.length === 0 ? 1 : toDoLists[toDoLists.length - 1].id + 1,
      taskName: tasks,
    };
    setToDoLists([...toDoLists, newTasks]);
  }

  const deleteTasks = (id) => {
    setToDoLists(toDoLists.filter((list) => list.id !== id));
  }

  return (
    <div className='bg-white h-screen flex flex-col items-center text-center'>
      <h1 className='text-3xl my-2 text-blue-900'>To Do Lists App</h1>
      {/* <span className='text-md my-5 text-red-500'>* Since this is hosted on free platform, your changes may not be saved.</span> */}
      <div>
        <input type="text" className='w-96 p-3 my-10 border-2 border-blue-900' value={tasks} onChange={e => setTasks(e.target.value)}/>
        <button className='p-3 mx-2 bg-blue-900 text-white' onClick={() => addTasks()}>Add Tasks</button>
      </div>

      <div className='w-full flex justify-center text-center text-slate-950'>
        <ul className='w-[500px]'>
          {toDoLists.map(newtask => 
            <li className='flex justify-between items-center bg-blue-900 hover:bg-blue-800 text-white my-3 px-3 py-3'>
              {newtask.taskName}<button className='bg-red-500 p-3' onClick={() => deleteTasks(newtask.id)}>X</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ToDoLists
