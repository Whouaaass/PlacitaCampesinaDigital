import { useState, useRef, FormEvent, useEffect } from 'react';
import { validateAgrocode } from '../../validators';
import PopUp, { PopUpRef } from '../PopUp';
import YesNoRadioButton from '../CustomComponents/YesNoRadioButton';
import SimpleFrame1 from '../SimpleFrame1';
import CustomInput1 from '../CustomComponents/CustomInput1';
import CustomSelect1 from '../CustomComponents/CustomSelect1';


const DummyMUNICIPIOS = ['San Salvador', 'Santa Tecla', 'Santa Ana', 'San Miguel', 'Soyapango'];

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
        municipio: '',
        agrocauca: '',
        agrocode: ''
    });
    const submitButton = useRef<HTMLButtonElement>(null);
    const popUpRef = useRef<HTMLDivElement & PopUpRef>(null);

    const isAgrocauca = user.agrocauca === 'yes' ? true : false;

    // Effects
    useEffect(() => {
        // TODO: fetch to the api server the list of municipalities
    }, []);

    // Functions
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

    // Render
    return (
        <>
            <PopUp ref={popUpRef} />
            <SimpleFrame1>
                <form id="signup" onSubmit={handleFormSubmit}>
                    <h2>REGISTRARSE</h2>
                    <div id="inputs-container">
                        <CustomInput1 
                            label='Nombre'
                            type='name'
                            name='firstname'
                            value={user.firstname}
                            onChange={handleChange}
                            required
                        />
                        <CustomInput1 
                            label='Apellido'
                            type='name'
                            name='lastname'
                            value={user.lastname}
                            onChange={handleChange}
                            required
                        />
                        <CustomInput1 
                            label='Contraseña'
                            type='password'
                            name='password'
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        <CustomInput1 
                            label='Cédula'
                            type='id'
                            name='id'
                            value={user.id}
                            onChange={handleChange}
                            required
                        />
                        <CustomInput1 
                            label='Teléfono'
                            type='tel'
                            name='telnumber'
                            value={user.telnumber}
                            onChange={handleChange}
                            required
                        />
                        <CustomInput1 
                            label='Dirección'
                            type='text'
                            name='dir'
                            value={user.dir}
                            onChange={handleChange}
                        />
                        <CustomSelect1 
                            values={DummyMUNICIPIOS}
                            label='Municipio'                            
                            name='municipio'
                            value={user.municipio}
                            onChange={handleChange}
                            required                            
                        />
                    </div>
                    <hr />
                    <label className='input-question'>
                        <p className='no-margin'>Perteneces a Agrocauca?</p>
                        <div className='inline'>
                            <YesNoRadioButton
                                yesLabel="Si"
                                noLabel="No"
                                handleChange={handleChange}
                                name="agrocauca"
                                htmlFor="agrocauca"
                            />
                        </div>
                    </label>
                    {isAgrocauca &&
                        <CustomInput1 
                            label='Codigo Agrocauca'
                            type='text'
                            name='agrocode'
                            value={user.agrocode}
                            onChange={handleChange}
                        />
                    }
                    <button ref={submitButton} type="submit">Registrarse</button>
                    <hr />
                    <p>¿Ya tienes cuenta? <a href="/login">Inicia Sesion</a></p>
                </form>
            </SimpleFrame1>

        </>

    );
}

export default SignUp;