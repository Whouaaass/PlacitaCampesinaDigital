/**
 * @file ProductsFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina de productos
 */
import { FC, PropsWithChildren } from 'react';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { Link } from 'react-router-dom';
import SearchBar from '../CustomComponents/SearchBar';

const ProductsFrame: FC<PropsWithChildren> = ({ children }) => {    
    return <>
        <header id="products-header" className="thick flex flex-row">
            <Link to="/market" >
                <img id="placita-logo" className="prevent-select" src={placitaLogo} alt='placita-logo' />
            </Link>

            <h1 id="page-title">Mis productos</h1>
            <SearchBar />

            <Link id="go-market" to="/market">
                <button id="go-market-button" className='button-2'>
                    <MaterialSymbolsIcon name="storefront" opsz="48" weight='600' size='2.5rem' color="black" />
                    Mercado
                </button>
            </Link>
        </header>

        <main id="products-container">
            {children}
        </main>
        
    </>
}


export default ProductsFrame;