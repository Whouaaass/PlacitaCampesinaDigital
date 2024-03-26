import './Login.css';

function Login() {
    return (
        <div id="login">
            <header>
                <h1>AGROCAUCA</h1>            
            </header>
            <main>
                <div id="floating-box">
                    <h2>Iniciar Sesión</h2>
                    <div className='input-container'>
                        <label htmlFor="email">Usuario</label>
                        <input type="email" id="email" name="email" />
                    </div>
                    <div className='input-container'>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" />
                    </div>
                    <button type="submit">Entrar</button>
                    <hr></hr>
                    <p>¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
                </div>
            </main>
        </div>
    );
}

export default Login;