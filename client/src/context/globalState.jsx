import { createContext, useReducer } from "react";

const initialState = {
    transaction: []
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
    } throw Error('Unknown Action ' + action.type);
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