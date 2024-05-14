/**
 * @file MarketFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina principal
 */
import { FC, ReactNode } from 'react';

import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import SearchBar from '../CustomComponents/SearchBar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthProvider';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const MarketFrame: FC<CustomProps> = ({ children }) => {
    const auth = useAuth();

    return <>
        <header id="market-header" className="thick flex flex-row" >
            <button className='button-2'>
                <MaterialSymbolsIcon name="shopping_cart" opsz="48" weight='600' size='3rem' />
                Carrito
            </button>
            <Link to="/products" id="go-products">
                <button className='button-2'>
                    <MaterialSymbolsIcon name="store" opsz="48" weight='600' size="3rem" color="#000000" />
                    Mis productos
                </button>
            </Link>
            <div id="page-title">
                <img id="placita-logo" src={placitaLogo} alt='placita-logo' />
                <h1>Marketplace</h1>
            </div>
            <SearchBar />

            <button id="close-session-button" onClick={() => auth.logOut()}>
                <MaterialSymbolsIcon name="close" opsz="48" weight='600' size='2.5rem' color="black" />
                Cerrar sesion
            </button>
        </header>
        <main id="market-container">

            {children}

        </main>

    </>
}


export default MarketFrame;