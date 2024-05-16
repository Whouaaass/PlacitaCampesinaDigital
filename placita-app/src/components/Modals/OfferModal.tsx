

// No use yet
import React, { useState } from 'react';
import Modal from './Modal';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';

interface OfferModalProps {
    offerData: any;
    editing?: boolean;
    buying?: boolean;
    open: boolean;
    onClose: () => void;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const OfferModal: React.FC<OfferModalProps> = ({ offerData, buying, editing, open, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(offerData);   

    const expDate = new Date(data.expDate);
    const expDateString = `${expDate.getDay()}-${MONTHS[expDate.getMonth()]}-${expDate.getFullYear()}`;

    const handleOnChange = (e: any) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const dataOnView = (<>
        <div id="offer-modal-data">
            <img src={placitaLogo}></img>
            <label id="offer-modal__name">{data.name}</label>
            <label id="offer-modal__price">${data.price}</label>
            <label id="offer-modal__quantity">{data.amount} Unidades</label>
            <label id="offer-modal__expiration">Caduca: {expDateString}</label>
        </div>
        <label id="offer-modal__description">
            {data.description}
        </label>
    </>)
    const dataOnEdit = (<>
        <div id="offer-modal-data">
            <img src={placitaLogo}></img>
            <label id="offer-modal__name">{data.name}</label>
            <label id="offer-modal__price">
                Precio:
                <input type="number" name="price" value={data.price} onChange={handleOnChange} className='input-t' />
            </label>
            <label id="offer-modal__quantity">
                Cantidad:
                <input type="number" name="amount" value={data.amount} onChange={handleOnChange} className='input-t' />
            </label>
            <label id="offer-modal__expiration">
                Fecha Caducidad:
                <input type="date" name="expDate" className='input-t' />
            </label>
        </div>
        <label id="offer-modal__description">
            <textarea name="description" value={data.description} onChange={handleOnChange} className='textarea-t' />
        </label>

    </>);
    const dataElements = isEditing ? dataOnEdit : dataOnView;

    return (<>
        {open && <Modal>
            <div id="offer-modal">
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
            </div>
            <div id="modal-mask" onClick={onClose} />
        </Modal>}
    </>
    );
};

export default OfferModal;