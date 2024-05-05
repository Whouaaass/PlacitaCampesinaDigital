/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */

// Propiedades que recibe el componente
/* TODO: Define the values */
type InputContainer1Props = {
    values: string[];
    label: string;
    name: string;    
    value: string;
    required?: boolean;
    onChange: (e: any) => void;
};

const CustomSelect1 = ({ values, label, value, name, required, onChange }: InputContainer1Props) => {

    return (
        <label className="input-container custom-select">
            {`${label} ${required ? '*' : ''}`}
            <select id={name} name={name} value={value} onChange={onChange} required={required}>
                {values.map((value, index) => (
                    <option key={index} value={index}>{value}</option>
                ))}
            </select>
        </label>
    )
}

export default CustomSelect1;