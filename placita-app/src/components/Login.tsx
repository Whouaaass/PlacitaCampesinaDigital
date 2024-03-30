import { Link } from 'react-router-dom';
import { FormEvent, useState } from 'react';

/** 
 * @brief Login component that renders a page to login an existing user.
 */
function Login() {
    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(user);

        /* Code to handle the login action when submit button is pressed */
        
        e.currentTarget.reset(); /* i think it doesn't work */
    }

    return (
        <>
            <header className="thick">
                <h1>AGROCAUCA</h1>            
            </header>
            <main className='pine-background login' onSubmit={handleSubmit}>
                <form className="floating-box login">
                    <h2>Iniciar Sesión</h2>
                    <div className='input-container'>
                        <label htmlFor="username">Usuario</label>
                        <input type="username" id="username" name="username" value={user.username} onChange={handleChange}/>
                    </div>
                    <div className='input-container'>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" value={user.password} onChange={handleChange}/>
                    </div>
                    <button type="submit">Entrar</button>
                    <hr />                    
                    <p>¿No tienes cuenta? <Link to="/signup">Regístrate</Link></p>
                </form>
            </main>
    
        </>
    );
}

export default Login;