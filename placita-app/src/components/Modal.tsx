
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRoot = useRef(document.createElement('div'));

    useEffect(() => {
        const root = document.getElementById('modal-root');
        if (root) {
            root.appendChild(modalRoot.current);
        }
        return () => {
            if (root) {
                root.removeChild(modalRoot.current);
            }
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        modalRoot.current
    );
};

export default Modal;