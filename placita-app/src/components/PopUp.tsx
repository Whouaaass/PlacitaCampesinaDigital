import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

export interface PopUpRef {
    show: (msg: string, color?: string) => void;
}

const COLORREF = {
    red: "var(--lava)",
    blue: "var(--infoblue)",
}

const PopUp = forwardRef<PopUpRef>(({ }, ref) => {
    const [visible, setVisible] = useState("hidden");
    const [props, setProps] = useState({
        msg: "",
        color: "red",
    });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const style = {
        backgroundColor: COLORREF[props.color as keyof typeof COLORREF],
        color: 'white',
        //     padding: '1rem',
        //     position: 'fixed',
        //     top: '0',
        //    left: '50%',
        //    transform: 'translateX(-50%)',
        //    zIndex: 1000,
        //    transition: 'visibility 0.5s'
    };

    const show = (msg: string, color = 'red') => {

        setProps({ msg, color});
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
        <div id="popup" className={visible} style={style}>
            <p>{props.msg}</p>
        </div>,
        document.getElementById('popup-root') as HTMLElement
    );
});

export default PopUp;