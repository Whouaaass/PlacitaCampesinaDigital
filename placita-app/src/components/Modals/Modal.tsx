
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {       
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
    const rootRef = useRef(document.getElementById('root'));
    const modalRef = useRef(document.getElementById('modal-root'));
    
    useEffect(() => {
        modalRef.current?.classList.add('active');
        rootRef.current?.classList.add('blur');
        return () => {            
            rootRef.current?.classList.remove('blur');
            modalRef.current?.classList.remove('active');            
        }
    });

    return createPortal(
        <>            
            {children}            
        </>,
        modalRef.current as HTMLElement
    );
};

export default Modal;