/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */

import { FC } from 'react';
// Propiedades que recibe el componente
/* TODO: Define the values */
type CustomProps = {
    values: string[];
    label: string;
    name: string;
    value: string;
    required?: boolean;
    onChange: (e: any) => void;
};

const CustomSelect1: FC<CustomProps> = ({ values, label, value, name, required, onChange }) => {
    
    function innerOnChange(e: any) {
        e.target.classList.remove('invalid');
        onChange(e);
    }
    return (
        <label className="input-container custom-select">
            {`${label} ${required ? '*' : ''}`}
            <select id={name} name={name} value={value} onChange={innerOnChange} required={required} className="select-1">
                <option value="" disabled>Selecciona un municipio</option>
                {values.map((value, index) => (
                    <option key={index} value={value}>{value}</option>
                ))}
            </select>
        </label>
    )
}

export default CustomSelect1;