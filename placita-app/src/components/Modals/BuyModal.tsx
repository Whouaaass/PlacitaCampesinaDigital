import React, { useContext, useRef, useState } from 'react';
import Modal from './Modal';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import PopUp, { PopUpRef } from '../PopUp';
import { OffersContext } from '../../hooks/OffersProvider';
import CustomInput1 from '../CustomComponents/CustomInput1';


interface BuyModalProps {
    offerData: any;
    buying?: boolean;
    onClose: () => void;
}
const BuyModal: React.FC<BuyModalProps> = ({ offerData, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(OffersContext);
    const popUpRef = useRef<PopUpRef>(null);    

    const handleOnChange = (e: any) => {
        setQuantity(e.target.value);
    }
    const handleClose = () => {
        onClose();
    }
    const handleAdd = async () => {
        // Check if data has changed  
        if (quantity < 1) {
            popUpRef.current?.show('La cantidad debe ser mayor a 0');            
            return;
        }
        try {
            addToCart(offerData.name, offerData.price, offerData.offerid, +quantity);
        } catch (error: any) {
            popUpRef.current?.show(error.message);
            return;
        }
        
        onClose();
    }
    return (<>
        <PopUp ref={popUpRef} />
        <Modal>
            <div id="buy-modal" className='modal'>
                <img src={placitaLogo} alt="Placita Logo" className='prevent-select' />
                <h2>{offerData.name}</h2>


                <CustomInput1 label="Indique la cantidad que desea" type='number' name='quantity' value={quantity} onChange={handleOnChange} />


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