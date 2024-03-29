import './SingUp.css';
import { useState, useRef, useEffect } from 'react';
import YesNoRadioButton from './YesNoRadioButton';



function SingUp() {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        password: '',
        id: '',
        telnumber: '',
        dir: '',
        agrocauca: ''
    });           

    const isAgrocauca = user.agrocauca === 'yes' ? true : false;
    
    const handleChange = (e: any) => {
        console.log("me ejecute");
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }    
    const handleSendData = () => {
        console.log(user);
        fetch("http://localhost:3000/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((res) => res.json())
        .then((data) => {
            console.log(data.message)            
        }).catch(() => {
            console.log('something went wrong with the insert fetch')                
        });
    }
    
    return (
        <>
            <header>
                <h1>AGROCAUCA</h1>            
            </header>
            <main className='pine-background signup'>
                <form className="floating-box signup">
                    <h2>REGISTRO</h2>
                    <div id="inputs-container"> 
                        <div className='input-container'>
                            <label htmlFor="firstname">Nombre</label>
                            <input type="name" id="email" name="firstname" value={user.firstname} onChange={handleChange}/>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="lastname">Apellido</label>
                            <input type="name" id="lastname" name="lastname" value={user.lastname} onChange={handleChange}/>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" name="password" value={user.password} onChange={handleChange}/>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="id">ID (CC)</label>
                            <input type="id" id="id" name="id" value={user.id} onChange={handleChange}/>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="telnumber">Teléfono</label>
                            <input type="tel" id="tel" name="telnumber" value={user.telnumber} onChange={handleChange}/>
                        </div>
                        <div className='input-container'>
                            <label htmlFor="dir">Dirección</label>
                            <input type="text" id="dir" name="dir" value={user.dir} onChange={handleChange}/>
                        </div>
                    </div>
                    <hr></hr>
                    <div className='input-question'>
                        <p>Perteneces a Agrocauca?</p>
                        <div>
                            <YesNoRadioButton
                                yesLabel="Si"
                                noLabel="No"
                                handleChange={handleChange}
                                name="agrocauca"
                                htmlFor="agrocauca"                                
                            />
                        </div>
                    </div>
                    {isAgrocauca &&
                    <div className='input-container'>
                        <label htmlFor="agrocode">Codigo Agrocauca</label>
                        <input type="text" id="agrocode" name="agrocode"/>
                    </div>
                    }
                    <button type="submit" onClick={handleSendData}>Registrarse</button>
                </form>
            </main>
        </>
        
    );
}

export default SingUp;