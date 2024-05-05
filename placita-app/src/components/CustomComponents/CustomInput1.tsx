/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */
import { InputHTMLAttributes } from 'react';

// Propiedades que recibe el componente
interface CustomProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
};

const CustomInput1: React.FC<CustomProps> = ({ label, type, name, value, required, onChange, ...rest }) => {
    return (
        <label htmlFor={name} className="input-container">
            {`${label} ${required ? '*' : ''}`}
            <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} {...rest} />
        </label>

    )
}

export default CustomInput1;