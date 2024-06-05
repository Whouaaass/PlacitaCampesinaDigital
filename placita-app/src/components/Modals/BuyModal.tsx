import React, { useContext, useRef, useState } from 'react';
import Modal from './Modal';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import PopUp, { PopUpRef } from '../PopUp';
import { OffersContext } from '../../hooks/OffersProvider';
import CustomInput1 from '../CustomComponents/CustomInput1';
import { controlIntInput } from '../../controllers/InputTypesControl';

interface BuyModalProps {
    offerData: any;
    buying?: boolean;
    onClose: () => void;
}
const BuyModal: React.FC<BuyModalProps> = ({ offerData, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, popUpRef } = useContext(OffersContext);    

    const handleOnChange = (e: any) => {        
        let value = e.target.value;        
        setQuantity(controlIntInput(value, 10));
    }
    const handleClose = () => {
        onClose();
    }
    const handleAdd = async () => {
        // Check if data has changed  
        if (quantity < 1) {
            popUpRef?.show('La cantidad debe ser mayor a 0');            
            return;
        }
        try {
            await addToCart(offerData.name, offerData.price, offerData.offerid, +quantity);
        } catch (error: any) {
            popUpRef?.show(error.message);
            return;
        }
        
        popUpRef?.show('Añadido al carrito', 'blue');
        onClose();
    }
    return (<>        
        <Modal>
            <div id="buy-modal" className='modal'>
                <img src={placitaLogo} alt="Placita Logo" className='prevent-select' />
                <h2>{offerData.name}</h2>


                <CustomInput1 label="Indique la cantidad que desea" type='text' name='quantity' value={quantity} onChange={handleOnChange} />


                <button type="button" onClick={handleAdd} className='button-3'>Añadir</button>
                <button id="close-buy-modal-button" type='button' onClick={handleClose}>
                    <MaterialSymbolsIcon name='close' size='2.5rem' color='black' />
                </button>
            </div>
            <div id="modal-mask" onClick={handleClose}></div>
        </Modal>
    </>);
};

export default BuyModal;