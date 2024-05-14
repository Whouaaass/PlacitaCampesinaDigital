
import { createContext, useState, FC, PropsWithChildren, Reducer, useReducer } from 'react';


export const SearchContext = createContext({
    search: '',
    order: '',
    direction: 'desc',
    setOrder: (order: string) => { },
    toggleDirection: () => { },
    setSearch: (search: string) => { },

});

export const ORDEROPTIONS = [
    "Precio",
    "Nombre",
    "Cantidad",
    "Fecha",
];

const reducer: Reducer<SearchProps, any> = (state: SearchProps, action: any) => {
    switch (action.type) {
        case "order":
            return { ...state, order: action.payload };
        case "toggle-direction":
            const newDirection = state.direction === "asc" ? "desc" : "asc";
            return { ...state, direction: newDirection };
        case "search":
            return { ...state, search: action.payload };
        default:
            return state;
    }
}

const SearchProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { order: ORDEROPTIONS[0], direction: "desc", search: "" });
    const methods = {
        toggleDirection: () => dispatch({ type: "toggle-direction" }),
        setOrder: (order: string) => dispatch({ type: "order", payload: order }),
        setSearch: (search: string) => dispatch({ type: "search", payload: search }),
    }
    return (
        <SearchContext.Provider value={{
            ...state,
            ...methods
        }}>
            {children}
        </SearchContext.Provider >
    );
};


export default SearchProvider;


/**
 * Represents the search properties for the search provider.
 */
export interface SearchProps {
    order: string;
    direction: 'asc' | 'desc';
    search: string;
}