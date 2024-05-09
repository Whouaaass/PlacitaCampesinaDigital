/**
 * @file SimpleFrame1.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en el Login y SignUp (Registro)
 */
import {FC, ReactNode} from 'react';

// Propiedades que recibe el componente
type CustomProps = {
    children: ReactNode;
};

const SimpleFrame1: FC<CustomProps> = ({ children }) => {
    return <>
        <header className="thick">
            <h1>AGROCAUCA</h1>
        </header>
        <main className='pine-background'>
            <div className="floating-box">
                {children}
            </div>            
        </main>
    </>
}


export default SimpleFrame1;