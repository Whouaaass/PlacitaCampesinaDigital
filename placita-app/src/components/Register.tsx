import './Register.css';

function Register() {
    return (
        <div id="signup">
            <main>
                <div id='floating-box'>
                    <h2>Registro</h2>
                    <form action='#'>
                        <div className='form-group'>
                            <label>Nombre</label>
                            <input type="text"/>
                        </div>
                        <div className='form-group'>
                            <label>Apellido</label>
                            <input type="text"/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" />
                        </div>
                        <div className='form-group'>
                            <label>ID</label>
                            <input type="text"/>
                        </div>
                        <div className='form-group'>
                            <label>Telefono</label>
                            <input type="text"/>
                        </div>
                        <div className='form-group'>
                            <label>Direccion</label>
                            <input type="text"/>
                        </div>
                    </form>
                    <hr></hr>
                    <div className='you-belong'>
                        <label>Perteneces a Agrocauca?</label>
                        <label><input type="radio" name='belong'/>SI</label>
                        <label><input type="radio" name='belong'/>NO</label>
                    </div>
                    <div className='guild-code'>
                        <label>Codigo gremio</label>
                        <input type="text"/>
                    </div>
                    <button type="submit">Registrar</button>
                </div>
            </main>
        </div>
    );
}

export default Register;