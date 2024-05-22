import React, { useContext, useRef, useState } from 'react';
import Modal from './Modal';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { useAuth } from '../../hooks/AuthProvider';
import PopUp, { PopUpRef } from '../PopUp';
import { OffersContext } from '../../hooks/OffersProvider';

const editOffer = async (offer: any, token: string) => {
    const response = await fetch('http://localhost:3000/ofertas/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token: `session=${token}`
        },
        body: JSON.stringify(offer)
    });    
    return await response.json();
}


interface OfferModalProps {
    offerData: any;
    editing?: boolean;
    buying?: boolean;    
    onClose: () => void;
}

const MONTHS = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const OfferModal: React.FC<OfferModalProps> = ({ offerData, buying, editing, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const [data, setData] = useState(offerData);
    const { token } = useAuth();
    const { refreshOffers } = useContext(OffersContext);
    const popUpRef = useRef<PopUpRef>(null);

    const [year, month, day] = data.expirationDate.substring(0, 10).split("-");   

    const expDateString = `${day}-${MONTHS[+month]}-${year}`;

    const handleOnChange = (e: any) => {
        const { name, value, type } = e.target;        
        /*
        if (type === 'number' && (+value < 1 && value !== '')) {
            popUpRef.current?.show("El valor debe ser mayor a 0");
            return;
        }
        */
        setData({ ...data, [name]: value });
    }
    const handleClose = () => {
        onClose();
    }
    const handleSave = async () => {        
        // Check if data has changed
        if (JSON.stringify(offerData) === JSON.stringify(data)) {
            setIsEditing(false);
            return;
        }
        const res = await editOffer(data, token);
        if (res.errorNum === 20011)
            return popUpRef.current?.show("Error de formato al insertar oferta");
        if (res.errorNum === 20012) 
            return popUpRef.current?.show("Error al actualizar: La fecha de caducidad no puede ser menor a la fecha actual");            
        if (res.errorNum === 20013)           
            return popUpRef.current?.show("Error al actualizar: La cantidad no puede ser menor a 1");;        
        if (res.errorNum === 20014)
            return popUpRef.current?.show("Error al actualizar: El precio no puede ser menor a 1");

        if (res.error) {
            popUpRef.current?.show("Error al actualizar: " + res.error);
            return;
        }
        refreshOffers();
        setIsEditing(false);
    }

    const dataOnView = (<>
        <div id="offer-modal-data">
            <img src={placitaLogo} className='prevent-select'></img>
            <label id="offer-modal__name">{data.name}</label>
            <label id="offer-modal__price">${data.price}</label>
            <label id="offer-modal__quantity">{data.quantity} Unidades</label>
            <label id="offer-modal__expiration">Caduca: {expDateString}</label>
        </div>
        <label id="offer-modal__description">
            {data.description}
        </label>
    </>)
    const dataOnEdit = (<>
        <div id="offer-modal-data">
            <img src={placitaLogo} className='prevent-select'></img>
            <label id="offer-modal__name">{data.name}</label>
            <label id="offer-modal__price">
                Precio:
                <input type="number" name="price" value={data.price} onChange={handleOnChange} className='input-t blink' />
            </label>
            <label id="offer-modal__quantity">
                Cantidad:
                <input type="number" name="quantity" value={data.quantity} onChange={handleOnChange} className='input-t blink' />
            </label>
            <label id="offer-modal__expiration">
                Fecha Caducidad:
                <input type="date" name="expirationDate" value={`${year}-${month}-${day}`} className='input-t blink' onChange={handleOnChange} />
            </label>
        </div>
        <label id="offer-modal__description">
            <textarea name="description" value={data.description} onChange={handleOnChange} className='textarea-t blink' />
        </label>
        <button type="submit" id="save-offer-button" onClick={handleSave}>
            <MaterialSymbolsIcon name="save" size='3rem' color='black' />
        </button>
    </>);
    const dataElements = isEditing ? dataOnEdit : dataOnView;

    return (<>
        <PopUp ref={popUpRef} />
        <Modal>
            <div id="offer-modal" className='modal'>
                {dataElements}
                {buying &&
                    <div id="offer-modal-buy">
                        <label>
                            Indique la cantidad que desea
                            <input type="number" className='input-1' />
                        </label>
                        <button className="button-3">Añadir</button>
                    </div>}
                {editing && !isEditing &&
                    <button id="edit-offer-button" onClick={() => setIsEditing(true)}>
                        <MaterialSymbolsIcon name="edit" size='3rem' color='black' />
                    </button>
                }
                {buying && <>
                </>
                }
                <button id="close-offer-modal-button" onClick={handleClose}>
                    <MaterialSymbolsIcon name="close" size='3rem' color='black' />
                </button>
            </div>
            <div id="modal-mask" onClick={handleClose} />

        </Modal>
    </>);
};

export default OfferModal;