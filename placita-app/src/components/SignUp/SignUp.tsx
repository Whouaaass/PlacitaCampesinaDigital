import { useState, useRef, FormEvent, useEffect, InvalidEvent } from 'react';
import { RegexValidators, validateAgrocode } from '../../validators';
import PopUp, { PopUpRef } from '../PopUp';
import YesNoRadioButton from '../CustomComponents/YesNoRadioButton';
import SimpleFrame1 from '../Frames/SimpleFrame1';
import CustomInput1 from '../CustomComponents/CustomInput1';
import CustomSelect1 from '../CustomComponents/CustomSelect1';
import { Link, useNavigate } from 'react-router-dom';


const DUMMY_MUNICIPIOS = ['Popayán'];
let MUNICIPIOS: string[] | null = null;

const getMunicipios = async () => {
    const response = await fetch("http://localhost:3000/municipios");
    return await response.json();
};

const signUpUser = async (user: any) => {
    const response = await fetch("http://localhost:3000/usuarios/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return response.json();
}

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
    const navigate = useNavigate();

    const isAgrocauca = user.agrocauca === 'yes' ? true : false;

    // Effects
    useEffect(() => {
        getMunicipios().then((data) => {
            if (data.error) {
                console.log(data.error);
                return;
            }
            MUNICIPIOS = data.data.map((m: any) => m.MUNNOMBRE);
            setUser({...user});
        }).catch((err) => {
            console.log(err.message)
        });

    }, []);

    // Functions
    const handleChange = (e: any) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Disable the submit button to avoid multiple requests
        submitButton.current?.blur();
        submitButton.current?.setAttribute('disabled', 'true');
        submitButton.current?.setAttribute('autocomplete', 'off');
        setTimeout(() => submitButton.current?.removeAttribute('disabled'), 2000);

        if (user.agrocauca === "yes" && !validateAgrocode(user.agrocode)) {
            popUpRef.current?.show('Codigo de gremio incorrecto');
            return;
        }

        if (user.municipio === '') {
            const form = e.target as HTMLFormElement;
            form.municipio.classList.add('invalid');
            popUpRef.current?.show('Por favor, seleccione un municipio');
            return;
        }

        // sends the sign up data to the api server
        signUpUser({
            ...user,                        
            firstname: user.firstname.trim(),
            lastname: user.lastname.trim(),
            dir: user.dir.trim(),                                      
        }).then((data) => {
            if (data.error) {
                return popUpRef.current?.show(data.error);                
            }
            
            popUpRef.current?.show('Usuario creado exitosamente', 'blue');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        }).catch((err) => {
            popUpRef.current?.show('Error del servidor');
            console.log('Error al enviar la peticion al servidor')
            console.log(err)
        });
    }
    // handle invalid executes every time an input is invalid
    const handleInvalid = (e: InvalidEvent<HTMLFormElement>) => {
        const control = e.target as HTMLFormElement;
        control.classList.add('invalid');
        if (control.validity.valueMissing) {
            popUpRef.current?.show('Por favor, ingrese la información solicitada');
            return;
        }
        if (control.validity.patternMismatch) {
            if (control.name === 'telnumber') {
                return popUpRef.current?.show('Teléfono incorrecto (Ej: 3123456789)');
            }
            popUpRef.current?.show('Formato de entrada incorrecto');
            return;
        }
    }
    // Render
    return (
        <>
            <PopUp ref={popUpRef} />
            <SimpleFrame1>
                <form id="signup" onSubmit={handleSubmit} onInvalid={handleInvalid}>
                    <h2>REGISTRARSE</h2>
                    <div id="inputs-container">
                        <CustomInput1
                            label='Nombre'
                            type='name'
                            name='firstname'
                            value={user.firstname}
                            onChange={handleChange}
                            required
                        //pattern={RegexValidators.name}

                        />
                        <CustomInput1
                            label='Apellido'
                            type='name'
                            name='lastname'
                            value={user.lastname}
                            onChange={handleChange}
                            required
                        //pattern={RegexValidators.name}
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
                            type='number'
                            name='id'
                            value={user.id}
                            onChange={handleChange}
                            required
                        //pattern={RegexValidators.cedula}
                        />
                        <CustomInput1
                            label='Teléfono'
                            type='tel'
                            inputMode='numeric'
                            name='telnumber'
                            value={user.telnumber}
                            onChange={handleChange}
                            required
                            pattern={RegexValidators.telnumber}
                        />
                        <CustomInput1
                            label='Dirección'
                            type='text'
                            name='dir'
                            value={user.dir}
                            onChange={handleChange}
                            required
                        />
                        <CustomSelect1
                            defaultValue='Seleccione un municipio'
                            values={MUNICIPIOS ?? DUMMY_MUNICIPIOS}
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
                            required={user.agrocauca === 'yes' ? true : false}
                            pattern='[0-9]{4}'
                        />
                    }
                    <button ref={submitButton} type="submit" className='button-1'>Registrarse</button>
                    <hr />
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesion</Link></p>
                </form>
            </SimpleFrame1>

        </>

    );
}

export default SignUp;