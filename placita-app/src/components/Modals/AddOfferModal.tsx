import { FC, FormEvent, useEffect, useState, useRef } from 'react';
import Modal from './Modal'; // Replace './path/to/Modal' with the actual path to the Modal component
import CustomInput1 from '../CustomComponents/CustomInput1';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import CustomSelect1 from '../CustomComponents/CustomSelect1';
import { useAuth } from '../../hooks/AuthProvider';
import PopUp, { PopUpRef } from '../PopUp';

async function getProducts() {
    const response = await fetch('http://localhost:3000/productos');
    if (response.status !== 200) throw new Error("Internal server error");
    return await response.json();
}

async function addOffer(offer: Offer, token: string) {
    const response = await fetch('http://localhost:3000/ofertas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token: `session=${token}`
        },
        body: JSON.stringify(offer)
    });
    return await response.json();
}

export interface Offer {
    name: string;
    quantity: string;
    price: string;
    expirationDate: string;
    description: string;
}

export interface AddOfferModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddOfferModal: FC<AddOfferModalProps> = ({ open, onClose, onSuccess }) => {
    const popUpRef = useRef<PopUpRef>(null);
    const [offer, setOffer] = useState({
        name: '',
        quantity: '',
        price: '',
        expirationDate: '',
        description: ''
    });
    const [products, setProducts] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        getProducts().then((products) => {
            if (!products.data) return;
            setProducts(products.data?.map((product: any) => product.PRONOMBRE));
            setOffer((offer) => ({ ...offer, name: products.data[0].PRONOMBRE }))
        });
    }, []);

    function handleChange(e: any) {
        e.target.setCustomValidity('');
        if (e.target.name === 'expirationDate' && e.target.value && !checkExpirationDate(e.target.value)) {
            e.target.setCustomValidity('La fecha de caducaidad debe de ser posterior a la fecha actual');                        
        }
        setOffer({
            ...offer,
            [e.target.name]: e.target.value
        });
    }
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();        
        addOffer(offer, token).then((response) => {
            console.log(response);
            if (response.message) {
                popUpRef.current?.show("Oferta agregada exitosamente", "blue");
                setOffer({
                    name: '',
                    quantity: '',
                    price: '',
                    expirationDate: '',
                    description: ''
                });
                onSuccess();
            }
            if (response.error) {
                popUpRef.current?.show("Error al agregar la oferta", "red");
            }
        });;
    }

    function handleInvalid(e: FormEvent<HTMLFormElement>) {
        const control = e.target as HTMLFormElement;
        control.classList.add('invalid');
        if (control.validity.valueMissing) {
            popUpRef.current?.show('Por favor ingrese toda la información solicitada');
            return;
        }
        if (control.validity.patternMismatch) {
            popUpRef.current?.show('Formato de entrada incorrecto');
            return;
        }
    }

    function checkExpirationDate(value: string) {        
        const date = new Date(value);        
        const today = new Date();    
        console.log(today.getTimezoneOffset());
        return date.getTime() >= today.getTime() - today.getTimezoneOffset()*60*1000;        
    }

    return (<>
        {open &&
            <Modal>
                <form id="add-offer-modal" className="modal" onSubmit={handleSubmit} onInvalid={handleInvalid}>
                    <h1>Ingresar Datos de la oferta</h1>
                    <CustomSelect1 values={products} label="Nombre" name="name" value={offer.name} required
                        onChange={handleChange}
                    />
                    <CustomInput1 label="Cantidad" type="number" name="quantity" value={offer.quantity} required
                        onChange={handleChange}
                    />
                    <CustomInput1 label="Precio ($COP)" type="number" name="price" value={offer.price} required
                        onChange={handleChange}
                    />
                    <CustomInput1 label="Caducidad" type="date" name="expirationDate" value={offer.expirationDate} required
                        onChange={handleChange}
                    />
                    <label id="label-desc">
                        Descripción
                        <textarea name="description" value={offer.description} onChange={handleChange} className="textarea-1"></textarea>
                    </label>
                    <button id="close-modal-button" onClick={onClose}><MaterialSymbolsIcon name="close" color="black" size='3rem' /></button>
                    <button type="submit" className="button-1">Agregar</button>
                </form>
                <div id="modal-mask" onClick={onClose}></div>
            </Modal>}
        <PopUp ref={popUpRef} />
    </>
    );
};

export default AddOfferModal;