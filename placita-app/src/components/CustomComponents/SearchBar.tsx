import { FC } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';

interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = () => {
    return <div id="searchbar">
        <input>

        </input>
        <button>
            <MaterialSymbolsIcon name="search" opsz="48" weight='900' color='black' />
        </button>
        <span className="vertical-line" />
        <label id="search-orderby">
            Ordenar por:

            <select>
                <option>
                    precio
                </option>
                <option>
                    nombre
                </option>
            </select>
        </label>

    </div>


}


export default SearchBar;