/**
 * @file InputContainer1.tsx
 * @brief Archivo de definición de un componente funcional que representa un contenedor de entrada de texto
 */


// Propiedades que recibe el componente
type InputContainer1Props = {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    required?: boolean;
};

const CustomInput1 = ({ label, type, name, value, required, onChange }: InputContainer1Props) => {
    return (
        <label htmlFor={name} className="input-container">
            {`${label} ${required ? '*' : ''}`}
            <input type={type} id={name} name={name} value={value} onChange={onChange} required={required}/>
        </label>

    )
}

export default CustomInput1;