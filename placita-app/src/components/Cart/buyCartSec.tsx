import { FC, useContext, useEffect, useRef } from 'react';
import CartFrame from '../Frames/CartFrame';
import { useAuth } from '../../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { OffersContext, cartItemProps } from '../../hooks/OffersProvider';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import PopUp, { PopUpRef } from '../PopUp';

const sendCompra = async (cart: cartItemProps[], token: string) => {
    const response = await fetch('http://localhost:3000/compras/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token: `session=${token}`
        },
        body: JSON.stringify({ cart })
    });
    return await response.json();
}

interface BuyCartSecProps {
    // Define the props for your component here
}

const BuyCartSec: FC<BuyCartSecProps> = (props) => {
    // Implement the logic for your component here
    const { cart, resetCart } = useContext(OffersContext);
    const { token } = useAuth();
    const popUpRef = useRef<PopUpRef>(null);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {

    }, []);


    const handleBuy = async () => {
        const res = await sendCompra(cart, token);
        if (res.error) {
            popUpRef.current?.show('Error al realizar la compra');
            return;
        }
        popUpRef.current?.show('Compra realizada con éxito', 'blue');
        resetCart();
    }
    return (<>
        <PopUp ref={popUpRef} />
        <CartFrame>
            <h1>Productos Añadidos</h1>
            <ul id="cart-items-container" className='container-2'>
                {cart.map((item: cartItemProps) =>
                    <li key={item.offerid} className='cart-item'>
                        <CartItem item={item} />
                    </li>
                )}
            </ul>
            <div id="buy-window" className="container-2">
                <label>
                    <h2>Compra total</h2>
                    <p>${total}</p>
                </label>
                <button className='button-1' onClick={handleBuy}>
                    Comprar
                </button >
            </div>

        </CartFrame>
    </>
    );
};

const CartItem: FC<{ item: cartItemProps }> = ({ item }) => {
    const { deleteFromCart } = useContext(OffersContext);
    const handleDelete = () => {
        deleteFromCart(item.offerid);
    }
    return <>
        <img src={placitaLogo} alt="Logo Placita" />
        <div>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>x{item.quantity}</p>
        </div>
        <button className='button-2' onClick={handleDelete}>
            <MaterialSymbolsIcon name="delete" size="2.5rem" color='black' />
        </button>
    </>
}


export default BuyCartSec;