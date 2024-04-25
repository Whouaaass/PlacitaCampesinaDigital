import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

type PopUpProps = {
    children: React.ReactNode;
};

export interface PopUpRef {
    show: (msg: string) => void;
}

const PopUp = forwardRef<PopUpRef, PopUpProps>(({ }, ref) => {
    const [visible, setVisible] = useState("hidden");
    const [msg, setMsg] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const show = (msg: string) => {
        setMsg(msg);
        setVisible("hidden");
        setTimeout(() => {
            setVisible("");
        }, 100);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setVisible("hidden");
        }, 5000);
    };

    useImperativeHandle(ref, () => ({
        show
    }));

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return createPortal(
        <div id="popup" className={visible}>
            <p>{msg}</p>
        </div>,
        document.getElementById('popup-root') as HTMLElement
    );
});

export default PopUp;