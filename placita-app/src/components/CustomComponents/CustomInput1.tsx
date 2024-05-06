/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */
import { InputHTMLAttributes, FC } from 'react';

// Propiedades que recibe el componente
interface CustomProps extends InputHTMLAttributes<HTMLInputElement> {
    onChange: (e: any) => void;
    label: string;
};

const CustomInput1: FC<CustomProps> = ({ label, type, name, value, required, onChange, ...rest }) => {
    function innerOnChange(e: any) {
        e.target.className = '';
        onChange(e);
    }
    return (
        <label htmlFor={name} className="input-container">
            {`${label} ${required ? '*' : ''}`}
            <input type={type} id={name} name={name} value={value} onChange={innerOnChange} required={required} {...rest} />
        </label>

    )
}

export default CustomInput1;