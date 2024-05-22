/**
 * @file MarketFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina principal
 */
import { FC, ReactNode, useContext } from 'react';

import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import SearchBar1 from '../CustomComponents/SearchBar1';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthProvider';
import { OffersContext } from '../../hooks/OffersProvider';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const CartFrame: FC<CustomProps> = ({ children }) => {
    const { setFilters } = useContext(OffersContext);
    const navigate = useNavigate();

    return <>
        <header id="cart-header" className="thick flex flex-row" >

            <button id="go-market" type="button" className='button-2' onClick={() => navigate("/market")}>
                <MaterialSymbolsIcon name="storefront" opsz="48" weight='600' size='3rem' color='black' />
                Mercado
            </button>
            <h1 id="page-title">Mi Carrito</h1>


        </header>
        <main id="cart-container">

            {children}

        </main>

    </>
}


export default CartFrame;