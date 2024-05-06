import { FormEvent, useState, useRef } from 'react';
import PopUp from '../PopUp';
import { PopUpRef } from '../PopUp';
import SimpleFrame1 from '../SimpleFrame1';
import CustomInput1 from '../CustomComponents/CustomInput1';

const MARKETDIR ="../market";

/** 
 * @brief Login component that renders a page to login an existing user.
 */
function Login() {
    const [user, setUser] = useState({
        id: '',
        password: ''
    });
    const popUpRef = useRef<HTMLDivElement & PopUpRef>(null);

    // Functions
    function handleChange(e: any) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Prevent the default form submission
        e.preventDefault();

        //TODO: fetch to the api server...
        await fetch("http://localhost:3000/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: user.id, password: user.password })
        }).then(response => {
            console.log(response)
            
            if (response.ok) {
                window.location.href = MARKETDIR;
            } else {
                popUpRef.current?.show('Usuario o contraseña inválidos');
            }
        })
    }
    function handleInvalid(e: FormEvent<HTMLFormElement>) {
        const control = e.target as HTMLFormElement;
        control.className = 'invalid';
        if (control.validity.valueMissing) {
            popUpRef.current?.show('Por favor ingrese toda la información solicitada');
            return;
        }
        if (control.validity.patternMismatch) {
            popUpRef.current?.show('Formato de entrada incorrecto');
            return;
        }
    }
    // Render
    return (
        <>
            <PopUp ref={popUpRef} />
            <SimpleFrame1>
                <form id="login" onSubmit={handleSubmit} onInvalid={handleInvalid}>
                    <h2>Iniciar Sesión</h2>
                    <CustomInput1
                        label="Cédula"
                        type='text'
                        name="id"
                        value={user.id}
                        onChange={handleChange}
                        required
                    />
                    <CustomInput1
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Entrar</button>
                    <hr />
                    <p>¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
                </form>
            </SimpleFrame1>
        </>
    );
}

export default Login;