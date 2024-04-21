import { FormEvent, useState, useRef } from 'react';
import PopUp from './PopUp';
import { PopUpRef } from './PopUp';
import { validatePassword, validateUsername } from '../validators';

/** 
 * @brief Login component that renders a page to login an existing user.
 */
function Login() {
    const [user, setUser] = useState({
        username: '',
        password: ''
    });
    const popUpRef = useRef<HTMLDivElement & PopUpRef>(null);

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
        if (user.username.length === 0 || user.password.length === 0) {            
            popUpRef.current?.show('Por favor, ingrese la información solicitada');
            return;
        }
        if (!validateUsername(user.username) || !validatePassword(user.password)) {            
            popUpRef.current?.show('Usuario o contraseña inválidos');
            return;
        }       
        
        //TODO: fetch to the api server...
        fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user.username })
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <>
            <PopUp ref={popUpRef}>*</PopUp>
            <header className="thick">
                <h1>AGROCAUCA</h1>            
            </header>
            <main className='pine-background' onSubmit={handleSubmit}>
                <form className="floating-box login">
                    <h2>Iniciar Sesión</h2>
                    <div className='input-container'>
                        <label htmlFor="id">Cédula</label>
                        <input type="username" id="id" name="id" value={user.username} onChange={handleChange} className='invalid'/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" value={user.password} onChange={handleChange}/>
                    </div>
                    <button type="submit">Entrar</button>
                    <hr/>                    
                    <p>¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
                </form>
            </main>            
        </>
    );
}

export default Login;