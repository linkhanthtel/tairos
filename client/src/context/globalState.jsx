import { createContext, useReducer, useEffect, useCallback } from "react"
import { apiGet, apiPost, apiDelete } from "../lib/api"

const initialState = {
  transaction: [],
  transactionsLoaded: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "Set_Transactions":
      return {
        ...state,
        transaction: action.payload,
        transactionsLoaded: true,
      }
    case "Delete_Transaction":
      return {
        ...state,
        transaction: state.transaction.filter((t) => t.id !== action.payload),
      }
    case "Add_Transaction":
      return {
        ...state,
        transaction: [action.payload, ...state.transaction],
      }
    default:
      throw new Error("Unknown Action " + action.type)
  }
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    let cancelled = false
    apiGet("/api/transactions")
      .then((rows) => {
        if (!cancelled) dispatch({ type: "Set_Transactions", payload: rows })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "Set_Transactions", payload: [] })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    await apiDelete(`/api/transactions/${id}`)
    dispatch({ type: "Delete_Transaction", payload: id })
  }, [])

  const addTransaction = useCallback(
    async (payload) => {
      const body = {
        text: payload.text,
        amount: Number(payload.amount),
        date: payload.date,
        category: payload.category || null,
        paymentMethod: payload.paymentMethod || null,
        tags: payload.tags ?? [],
      }
      const created = await apiPost("/api/transactions", body)
      dispatch({ type: "Add_Transaction", payload: created })
      return created
    },
    [],
  )

  return (
    <GlobalContext.Provider value={{ transaction: state.transaction, transactionsLoaded: state.transactionsLoaded, deleteTransaction, addTransaction }}>
      {children}
    </GlobalContext.Provider>
  )
}
