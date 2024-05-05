/**
 * @file SimpleFrame1.tsx
 * @brief Archivo de definición de un componente no funcional que representa un marco simple usado en el Login y SignUp (Registro)
 */

// Propiedades que recibe el componente
type SimpleFrame1Props = {
    children: React.ReactNode;
};

const SimpleFrame1 = ({ children }: SimpleFrame1Props) => {
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