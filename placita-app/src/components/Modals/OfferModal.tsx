

// No use yet
import React from 'react';
import Modal from './Modal';
import placitaLogo from '/PlacitaLogo.png';

interface OfferModalProps {
    
    open: boolean;
    onClose: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ open, onClose }) => {
    return (<>
        {open && <Modal>
            <div id="offer-modal">
                <div id="offer-modal-data">
                    <img src={placitaLogo}></img>
                    <label id="offer-modal__name">Nombre del Producto</label>
                    <label id="offer-modal__price">Precio</label>
                    <label id="offer-modal__quantity">Cantidad disponible</label>
                    <label id="offer-modal__expiration">Fecha Caducidad</label>
                </div>
                <label id="offer-modal__description">Descripcion</label>
                <div id="offer-modal-buy">
                    <label>
                        Indique la cantidad que desea
                        <input type="number" className='input-1' />
                    </label>
                    <button className="button-3">Añadir</button>
                </div>
            </div>
            <div id="modal-mask" onClick={onClose}/>
        </Modal>}
        </>
    );
};

export default OfferModal;