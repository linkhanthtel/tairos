import { createContext, useReducer } from "react"
import { IS_DEMO_BUILD } from "../config.js"

function demoTransactions() {
  const d = (daysAgo) => {
    const x = new Date()
    x.setDate(x.getDate() - daysAgo)
    return x.toISOString().split("T")[0]
  }
  return [
    { id: 1001, text: "Salary deposit", amount: 3200, date: d(14), category: "Income", paymentMethod: "Bank", tags: ["payroll"] },
    { id: 1002, text: "Rent", amount: -1200, date: d(10), category: "Housing", paymentMethod: "Bank", tags: [] },
    { id: 1003, text: "Groceries", amount: -86.4, date: d(6), category: "Food", paymentMethod: "Credit", tags: [] },
    { id: 1004, text: "Transit pass", amount: -45, date: d(5), category: "Transportation", paymentMethod: "Credit", tags: [] },
    { id: 1005, text: "Team lunch", amount: -32.5, date: d(3), category: "Food", paymentMethod: "Cash", tags: [] },
    { id: 1006, text: "Software subscription", amount: -29, date: d(2), category: "Technology", paymentMethod: "Credit", tags: ["saas"] },
    { id: 1007, text: "Freelance payout", amount: 450, date: d(1), category: "Income", paymentMethod: "Bank", tags: [] },
    { id: 1008, text: "Coffee", amount: -6.5, date: d(0), category: "Food", paymentMethod: "Cash", tags: [] },
  ]
}

const initialState = {
  transaction: IS_DEMO_BUILD ? demoTransactions() : [],
}

function reducer(state,action) {
    switch(action.type) {
        case 'Delete_Transaction': {
            return {
                ...state,
                transaction: state.transaction.filter(transaction => transaction.id !== action.payload)
            }
        }
        case 'Add_Transaction': {
            return {
                ...state,
                transaction: [action.payload, ...state.transaction]
            };
        }
    }
    throw new Error("Unknown Action " + action.type)
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    function deleteTransaction(id) {
        dispatch({
            type: "Delete_Transaction",
            payload: id
        });
    }

    function addTransaction(transaction) {
        dispatch({
            type: "Add_Transaction",
            payload: transaction
        });
    }

    return(
        <GlobalContext.Provider value={{transaction: state.transaction, deleteTransaction, addTransaction}}>
            {children}
        </GlobalContext.Provider>
    );
}