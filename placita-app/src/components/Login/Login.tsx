import { FormEvent, useState, useRef } from 'react';
import PopUp from '../PopUp';
import { PopUpRef } from '../PopUp';
import { validatePassword, validateUsername } from '../../validators';
import SimpleFrame1 from '../SimpleFrame1';
import CustomInput1 from '../CustomComponents/CustomInput1';

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
    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission
        e.preventDefault();

        // Validate the form
        if (user.id.length === 0 || user.password.length === 0) {
            popUpRef.current?.show('Por favor, ingrese la información solicitada');
            return;
        }
        if (!validateUsername(user.id) || !validatePassword(user.password)) {
            popUpRef.current?.show('Usuario o contraseña inválidos');
            return;
        }

        //TODO: fetch to the api server...
        fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user.id })
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error: ', error);
            });
    }

    // Render
    return (
        <>
            <PopUp ref={popUpRef} />
            <SimpleFrame1>
                <form id="login" onSubmit={handleSubmit}>
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