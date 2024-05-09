/**
 * @file MarketFrame.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en la pagina principal
 */
import { FC, ReactNode } from 'react';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const MarketFrame: FC<CustomProps> = ({ children }) => {
    return <>
        <header className="thick pine-background flex flex-row">
            <h1>AGROCAUCA</h1>
            <button>
            <span className="material-symbols-outlined">
                shopping_cart
            </span>
            </button>
            
        </header>
        <main>
            {children}
        </main>
    </>
}


export default MarketFrame;