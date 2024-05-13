/**
 * @file ProductsFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina de productos
 */
import { FC, ReactNode } from 'react';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { Link } from 'react-router-dom';
import SearchBar from '../CustomComponents/SearchBar';


// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const ProductsFrame: FC<CustomProps> = ({ children }) => {
    return <>
        <header id="products-header" className="thick flex flex-row">
            <Link to="/market" >
                <img id="placita-logo" src={placitaLogo} alt='placita-logo' />
            </Link>

            <h1 id="page-title">Mis productos</h1>
            <SearchBar />

            <Link id="go-market" to="/market">
                <button id="go-market-button">
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