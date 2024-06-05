import { FC, useContext, useRef, useState } from 'react';
import CartFrame from '../Frames/CartFrame';
import { useAuth } from '../../hooks/AuthProvider';
import { OffersContext, cartItemProps } from '../../hooks/OffersProvider';
import placitaLogo from '/PlacitaLogo.png';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import PopUp, { PopUpRef } from '../PopUp';
import { TicketModal, TicketData } from '../Ticket/Ticket';

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

const BuyCartSec: FC<BuyCartSecProps> = ({}) => {
    // Implement the logic for your component here    
    const [ticketData, setTicketData] = useState<Array<TicketData> | null>(null);
    const { cart, resetCart } = useContext(OffersContext);
    const { token } = useAuth();
    const popUpRef = useRef<PopUpRef>(null);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const emptyCart = cart.length === 0;

    const handleBuy = async () => {
        const res = await sendCompra(cart, token);        
        if (cart.length === 0) {
            popUpRef.current?.show('No hay productos en el carrito');
            return;
        }
        if (res.errorNum) {
            popUpRef.current?.show(res.error);
            return;
        }
        if (res.error) {
            popUpRef.current?.show('Error al realizar la compra');
            return;
        }        
        resetCart();
        setTicketData(res.data);
        popUpRef.current?.show('Compra exitosa', 'blue');
    }
    const handleClearCart = () => {
        if (cart.length > 0) {
            resetCart();
            popUpRef.current?.show('Carrito cancelado', 'blue');                
        }
        
    }

    return (<>
        {ticketData && <TicketModal ticketData={ticketData} onClose={() => {setTicketData(null)}} />}
        <PopUp ref={popUpRef} />
        <CartFrame>
            <h1>Productos Añadidos</h1>
            <ul id="cart-items-container" className='container-2'>
                {emptyCart? 
                <p>no hay productos en el carrito</p>
                :cart.map((item: cartItemProps) =>
                    <li key={item.offerid} className='cart-item'>
                        <CartItem item={item}/>
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
            <button id="clear-cart-button" className='button-2' onClick={handleClearCart}>
                <MaterialSymbolsIcon name="delete" size="2.5rem" color='black' />
                Vaciar
            </button>
        </CartFrame>
    </>
    );
};

const CartItem: FC<{ item: cartItemProps}> = ({ item }) => {
    const { deleteFromCart, popUpRef } = useContext(OffersContext);
    const handleDelete = () => {
        popUpRef?.show('Compra eliminada', 'blue');
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