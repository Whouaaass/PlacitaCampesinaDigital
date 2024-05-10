/**
 * @file MarketFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina principal
 */
import { FC, ReactNode } from 'react';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import SearchBar from '../CustomComponents/SearchBar';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const MarketFrame: FC<CustomProps> = ({ children }) => {
    return <>        
        <header id="market-header" className="thick flex flex-row">            
            <div id="navigation-buttons" >
                <button>
                    <MaterialSymbolsIcon name="shopping_cart" opsz="48" weight='600' size='3rem'/>
                    Carrito
                </button>
                <button>
                    <MaterialSymbolsIcon name="inventory_2" opsz="48" weight='600' color="#000000" size="3rem"/>
                    Mis productos
                </button>
            </div>
            <div id="logo-search-container">
                <img id="placita-logo" src={placitaLogo} alt='placita-logo' />
                <SearchBar />
            </div>
            
            
        </header>
        <main id="market-container">
            {children}
        </main>
    </>
}


export default MarketFrame;