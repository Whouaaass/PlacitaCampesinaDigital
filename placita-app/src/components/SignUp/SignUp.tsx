import { useState, useRef, FormEvent, useEffect, InvalidEvent } from 'react';
import { RegexValidators, validateAgrocode } from '../../validators';
import PopUp, { PopUpRef } from '../PopUp';
import YesNoRadioButton from '../CustomComponents/YesNoRadioButton';
import SimpleFrame1 from '../Frames/SimpleFrame1';
import CustomInput1 from '../CustomComponents/CustomInput1';
import CustomSelect1 from '../CustomComponents/CustomSelect1';


const DUMMY_MUNICIPIOS = ['---', 'San Salvador', 'Santa Tecla', 'Santa Ana', 'San Miguel', 'DUMMYVALUES'];
let MUNICIPIOS: string[] | null = null;

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
    console.log(user);
    const submitButton = useRef<HTMLButtonElement>(null);
    const popUpRef = useRef<HTMLDivElement & PopUpRef>(null);

    const isAgrocauca = user.agrocauca === 'yes' ? true : false;

    // Effects
    useEffect(() => {
        fetch("http://localhost:3000/municipios"
        ).then((res) => {
            console.log('res: ', res)
            res.json().then((data) => {                
                MUNICIPIOS = data.map((m: any) => m.MUNNOMBRE);

                setUser({
                    ...user,
                    municipio: MUNICIPIOS? MUNICIPIOS[0] : ''
                });
                // TODO: posible error en la asignacion de MUNICIPIOS si un municipio falta en la consecucion de la tabla
            })
            //MUNICIPIOS = res;
        }).catch((err) => {
            console.log('something went wrong with the fetch')
            console.log(err)
        })
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
            form.municipioid.className = 'invalid';
            popUpRef.current?.show('Por favor, seleccione un municipio');
            return;
        }

        // sends the data to the api server
        fetch("http://localhost:3000/usuarios/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((res) => {
            console.log('res: ', res)
            if (res.ok) {
                popUpRef.current?.show('Usuario registrado exitosamente', 'blue');
                setTimeout(() => window.location.href = '/login', 2000);                
            } else {
                res.json().then((data) => {                    
                    if (data.errorNum === 1) {
                        popUpRef.current?.show('La cedula ya se encuentra registrada');
                    } else if (data.errorNum === 20001) {
                        popUpRef.current?.show('La cedula tiene una longuitud menor a 8');
                    }
                    else {
                        console.log('Error interno', data.errorNum);
                        popUpRef.current?.show('Error al registrar el usuario');
                    }
                });
            }
        }).catch((err) => {
            console.log('something went wrong with the insert fetch')
            console.log(err)
        });
    }
    // handle invalid executes every time an input is invalid
    const handleInvalid = (e: InvalidEvent<HTMLFormElement>) => {
        const control = e.target as HTMLFormElement;
        control.className = 'invalid';        
        if (control.validity.valueMissing) {
            popUpRef.current?.show('Por favor, ingrese la información solicitada');
            return;
        }
        if (control.validity.patternMismatch) {
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
                            type='id'
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
                    <button ref={submitButton} type="submit">Registrarse</button>
                    <hr />
                    <p>¿Ya tienes cuenta? <a href="/login">Inicia Sesion</a></p>
                </form>
            </SimpleFrame1>

        </>

    );
}

export default SignUp;