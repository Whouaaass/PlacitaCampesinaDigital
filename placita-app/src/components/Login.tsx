function Login() {
    return (
        <>
            <header id="login-header">
                <h1>AGROCAUCA</h1>            
            </header>
            <main className='pine-background login'>
                <div className="floating-box login">
                    <h2>Iniciar Sesión</h2>
                    <div className='input-container'>
                        <label htmlFor="name">Usuario</label>
                        <input type="name" id="name" name="name" />
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
        </>
    );
}

export default Login;