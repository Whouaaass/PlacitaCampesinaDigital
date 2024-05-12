import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { isHtmlElement } from 'react-router-dom/dist/dom';

const ORDEROPTIONS = [
    "Precio",
    "Nombre",
    "Cantidad",
    "Fecha",
];

interface SearchBarProps {

}


const SearchBar: FC<SearchBarProps> = () => {

    return <div id="searchbar">
        <button>
            <MaterialSymbolsIcon name="search" opsz="48" weight='900' color='black' />
        </button>
        <input />
        <div id="orderby-section">
            <span className="vertical-line" />
            <Orderby />
        </div>
    </div>
}

const Orderby: FC = () => {
    const [order, setOrder] = useState(ORDEROPTIONS[0]);
    const [direction, setDirection] = useState("desc");
    const divRef = useRef<HTMLDivElement>(null);
    //const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const toggleDirection = () => setDirection((curr) => (curr === "asc" ? "desc" : "asc"))

    const handleDirectionChange = (e: any) => {
        const target = e.target as HTMLElement;
        toggleDirection();
        if (target && direction === "desc") {
            target.classList.add("upside-down");
        }
        if (target && direction === "asc") {
            target.classList.remove("upside-down");
        }

        console.log('direction changed')
    }
    useEffect(() => {


    }, [direction]);

    return <>
        <div id="search-orderby">
            Ordenar por:
            <select value={order} onChange={(e) => setOrder(() => e.target.value)}>
                {ORDEROPTIONS.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
        </div>
        <div ref={divRef} id="direction-symbol-container" className="prevent-select" onClick={(e) => { handleDirectionChange(e); }}>
            <MaterialSymbolsIcon name="arrow_downward" opsz="48" weight='900' color='black' />
        </div>

    </>
}




export default SearchBar;