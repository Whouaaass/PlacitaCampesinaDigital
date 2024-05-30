/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */
import { InputHTMLAttributes, FC, Ref, RefObject } from 'react';

// Propiedades que recibe el componente
interface CustomProps extends InputHTMLAttributes<HTMLInputElement> {
    onChange: (e: any) => void;
    label: string;    
};

const CustomInput1: FC<CustomProps> = ({ label, type, name, value, required, onChange, ...props }) => {
    function innerOnChange(e: any) {
        e.target.classList.remove('invalid');
        e.target.setCustomValidity('');
        onChange(e);
    }
    return (
        <label htmlFor={name} className="input-container">
            {`${label} ${required ? '*' : ''}`}
            <input type={type} id={name} name={name} value={value} onChange={innerOnChange} required={required} className='input-1' {...props} />
        </label>

    )
}

export default CustomInput1;