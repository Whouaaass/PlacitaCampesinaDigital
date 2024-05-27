import { FC } from 'react';
import Modal from './Modal';



const SimpleAskModal: FC<SimpleAskModalProps> = ({ question, onAffirmative, onNegative }) => {

    return (
        <Modal>
            <div id="simple-ask-modal" className='modal'>
                <h2 id="modal-question">{question}</h2>
                <button id="modal-affirmative-button" className='button-1' onClick={onAffirmative}>Sí</button>
                <button id="modal-negative-button" className='button-1' onClick={onNegative}>No</button>
            </div>
            <div id="modal-mask" onClick={onNegative}></div>
        </Modal>

    );
}



export default SimpleAskModal;

export interface SimpleAskModalProps {
    question: string;
    onAffirmative: () => void;
    onNegative: () => void;
}