/**
 * @file MarketFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina principal
 */
import { FC, ReactNode } from 'react';
import placitaLogo from '/PlacitaLogo.png';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const MarketFrame: FC<CustomProps> = ({ children }) => {
    return <>
        <header id="market-header" className="thick flex flex-row">
            <img id="placita-logo" src={placitaLogo} alt='placita-logo' />
            <div className='flex flex-column'>

                <button className='flex flex-column'>
                    <span className="material-symbols-outlined">
                        carrito_icon
                    </span>
                    Carrito
                </button>
                <a href="/products">
                    <button className='flex flex-column'>
                        <span className="material-symbols-outlined">
                            productos_icon
                        </span>
                        Mis Productos
                    </button>
                </a >
            </div>
            <label className='search'>
                <input type='search' />
                <span className="material-symbols-outlined">
                    search_icon
                </span>
            </label>
            <label className="orderby">
                Ordenar por:
                <span>
                    :flechita abajo
                </span>
            </label>
        </header>
        <main id="market-container">
            {children}
        </main>
    </>
}


export default MarketFrame;