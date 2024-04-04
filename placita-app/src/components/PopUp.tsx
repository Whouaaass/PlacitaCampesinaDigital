import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

type PopUpProps = {
    children: React.ReactNode;
};

export interface PopUpRef {
    show: (msg: string) => void;
}

const PopUp = forwardRef<PopUpRef, PopUpProps>(({ children }, ref) => {
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState('');
    const timeoutRef = useRef<number | null>(null);

    const show = (msg: string) => {
        setMsg(msg);
        setVisible(false);
        setTimeout(() => {
            setVisible(true);
        }, 100);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setVisible(false);
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

    return (
        <div id="popup" className={visible ? "" : "hidden"}>
            <p>{msg}</p>
        </div>
    );
});

export default PopUp;