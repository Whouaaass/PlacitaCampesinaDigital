import { FC } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';

interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = () => {
    return <search>
        <input>

        </input>
        <button>
            <MaterialSymbolsIcon name="search" opsz="48" weight='900' color='black' />
        </button>
        <span className="vertical-line" />
        <span>
            Ordenar por:

            <select>
                <option>
                    precio
                </option>
                <option>
                    nombre
                </option>
            </select>
        </span>

    </search>


}


export default SearchBar;