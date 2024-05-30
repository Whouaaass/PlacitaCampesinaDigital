import { FC, useContext } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { OffersContext, OffersFilters } from '../../hooks/OffersProvider';

export interface SearchBarProps {
    onSubmit?: (e: Event) => void;
}

const ORDEROPTIONS = ['Nombre', 'Precio', 'Tipo'];

const SearchBar1: FC<SearchBarProps> = ({ onSubmit = () => { } }) => {    
    const { filters, setFilters } = useContext(OffersContext);

    function handleChange(e: any) {
        const {name, value} = e.target as HTMLInputElement;
        setFilters({ ...(filters as OffersFilters), [name]: value } );
    }

    function handleOnSubmit(e: any) {
        e.preventDefault();        
        onSubmit(e);        
    }
    return <form id="searchbar" onSubmit={handleOnSubmit} className='prevent-select'>
        <button type="submit">
            <MaterialSymbolsIcon name="search" opsz="48" weight='900' color='black' />
        </button>
        <label title="search" id="input-label">
            <input type="search" name="search" value={filters.search} onChange={handleChange}/>
        </label>
        <div id="orderby-section">
            <span className="vertical-line" />
            <div id="search-orderby">
                Ordenar por:
                <select title="orderby" value={filters.orderby} name="orderby" onChange={handleChange} >
                    {ORDEROPTIONS.map((value, index) => (
                        <option key={index} value={value}>{value}</option>
                    ))}

                </select>                    
            </div>
        </div>
    </form>
}

export default SearchBar1;
// Interface que define las propiedades del componente SearchBar

// Inteface que define las propiedades de la busqueda
