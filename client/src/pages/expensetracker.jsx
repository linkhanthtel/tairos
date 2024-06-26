import React, { useState, useContext } from 'react'
import { GlobalContext, GlobalProvider } from '../context/globalState.jsx'

function ExpenseTracker() {
  const { transaction, addTransaction, deleteTransaction } = useContext(GlobalContext);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState(0);

  const amounts = transaction.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const onSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
        id: Math.floor(Math.random() * 100),
        text,
        amount: +amount
    };
    
    addTransaction(newTransaction);
  }

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item),0)
    .toFixed(2);

  return (
      <div className='bg-white h-screen flex flex-col items-center text-center text-blue-500'>
        <h1 className='text-3xl my-2'>Expense Tracker</h1>

        <div>
          {/* Balance */}
          <div className='text-center'>
            <h3 className='text-xl my-5'>Your Balance</h3>
            <h3 className='text-xl'>{total}</h3>
          </div>

          {/* Transaction History */}
          <div className='w-80 h-auto py-5 text-center'>
            <h2 className='px-30 py-4 w-full border-b-2 border-blue-500'>History</h2>
              <ul className='my-2'>
                {transaction.map((transactionItem) => (
                  <li className={`flex justify-between bg-white drop-shadow-md m-4 p-3 border-r-4 ${transactionItem.amount < 0 ? 'border-red-600' : 'border-green-500'}`} key={transactionItem.id}>
                    <button className='bg-red-700 text-white px-3' onClick={() => deleteTransaction(transactionItem.id)}>x</button>
                    <span>{transactionItem.text}</span>
                    <span>{transactionItem.amount < 0 ? '-' : '+'}${Math.abs(transactionItem.amount)}</span>
                  </li>
                ))}
              </ul>
          </div>

          </div>

        {/* Income and Expenses */}
        <div className='w-96 bg-white my-5 px-16 py-10 border-none grid grid-cols-2 gap-9 drop-shadow-lg'>
          <div className='text-green-500 font-bold'>
            <h2>Income</h2>
            <h4>${income}</h4>
          </div>
        <div className='text-red-800 font-bold'>
          <h2>Expenses</h2>
          <h4>${expense}</h4>
        </div>
        </div>

        {/* Add New Transaction */}
        <div className='w-84'>
            <h3 className='border-b-2 border-blue-500 text-center pb-3 mb-3'>Add New Transaction</h3>
            <form onSubmit={onSubmit} className='border-2 border-blue-500 px-5 py-5 mb-5'>
                <h4>Expense</h4>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className='border-2 border-blue-500 my-3 p-2' placeholder='Expense' />
                <h4>Amount</h4>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className='border-2 border-blue-500 my-3 p-2' placeholder='Enter Amount' />
                <div></div>
                <input type="submit" className='p-3 mt-2 bg-blue-500 text-white hover:bg-blue-700' />
            </form>
        </div>
        

      </div>
  )
}

export default ExpenseTracker
