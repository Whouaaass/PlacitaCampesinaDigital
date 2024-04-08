import './SignUp.css';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { validateAgrocode } from '../validators';
import PopUp, { PopUpRef } from './PopUp';
import YesNoRadioButton from './YesNoRadioButton';




/** 
 * @brief SingUp component that renders a page to register a new user.
 */
function SignUp() {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        password: '',
        id: '',
        telnumber: '',
        dir: '',
        agrocauca: '',
        agrocode: ''
    });           
    const submitButton = useRef<HTMLButtonElement>(null);    
    const popUpRef = useRef<HTMLDivElement & PopUpRef>(null);

    const isAgrocauca = user.agrocauca === 'yes' ? true : false;
    
    const handleChange = (e: any) => {
        console.log("me ejecute");
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }   
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        // Disable the submit button to avoid multiple requests
        submitButton.current?.blur();
        submitButton.current?.setAttribute('disabled', 'true');
        submitButton.current?.setAttribute('autocomplete', 'off');
        setTimeout(() => submitButton.current?.removeAttribute('disabled'), 2000);
        
        // Validate the form        
        if (user.agrocauca === "yes" && !validateAgrocode(user.agrocode)) {
            popUpRef.current?.show('Codigo de gremio incorrecto');       
            return;
        }
        
        // sends the data to the api server
        fetch("http://localhost:3000/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message)            
        }).catch((err) => {
            console.log('something went wrong with the insert fetch')                
            console.log(err)            
        });
    }
    
    return (
        <>
            <PopUp ref={popUpRef}>*</PopUp>
            <header className='thick'>
                <h1>AGROCAUCA</h1>            
            </header>
            <main className='pine-background'>
                <form className="floating-box signup" onSubmit={handleFormSubmit}>
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
                    <hr />
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
                        <input type="text" id="agrocode" name="agrocode" value={user.agrocode} onChange={handleChange}/>
                    </div>
                    }
                    <button ref={submitButton} type="submit">Registrarse</button>
                    <hr />
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesion</Link></p>
                </form>
            </main>
        </>
        
    );
}

export default SignUp;