/**
 * SearchBar component that allows users to search and order items.
 * @component
 */
import { ChangeEvent, Dispatch, FC, Reducer, useContext, useReducer } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { SearchProps, SearchContext, ORDEROPTIONS } from '../../hooks/SearchProvider';



/**
 * SearchBar component.
 * @param action - The action to be performed when the search button is clicked.
 * @returns The SearchBar component.
 * @note it has to be wrapped in a SearchContext.Provider
 */
const SearchBar: FC<SearchBarProps> = ({ onSubmit = () => { } }) => {
    const { search, setSearch } = useContext(SearchContext);
    /**
     * Handles the change event of the search input.
     * @param e - The change event.
     */
    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function handleOnSubmit(e: any) {
        e.preventDefault();
        onSubmit();
    }

    return <form id="searchbar" onSubmit={handleOnSubmit}>
        <button>
            <MaterialSymbolsIcon name="search" opsz="48" weight='900' color='black' />
        </button>
        <input onChange={handleSearchChange} value={search} />
        <div id="orderby-section">
            <span className="vertical-line" />
            <Orderby />
        </div>
    </form>
}


const Orderby: FC = ({ }) => {
    const { order, direction, setOrder, toggleDirection } = useContext(SearchContext);

    const handleDirectionChange = (e: any) => {
        const target = e.target as HTMLElement;
        toggleDirection();
        if (target && direction === "desc") {
            target.classList.add("upside-down");
        }
        if (target && direction === "asc") {
            target.classList.remove("upside-down");
        }
        console.log('direction changed');
    }

    return <>
        <div id="search-orderby">
            Ordenar por:
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
                {ORDEROPTIONS.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
        </div>
        <div id="direction-symbol-container" className="prevent-select" onClick={handleDirectionChange}>
            <MaterialSymbolsIcon name="arrow_downward" opsz="48" weight='900' color='black' />
        </div>
    </>
}

export default SearchBar;
// Interface que define las propiedades del componente SearchBar
export interface SearchBarProps {
    onSubmit?: () => void;
}
// Inteface que define las propiedades de la busqueda
