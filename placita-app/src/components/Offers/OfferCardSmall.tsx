/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import React, { useState } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { useAuth } from '../../hooks/AuthProvider';
import OfferModal from '../Modals/OfferModal';

async function deleteOffer(token: string, offerid: number) {
    const response = await fetch(`http://localhost:3000/ofertas/${offerid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            token: `session=${token}`
        }
    });
    return await response.json();
}

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
    offerid: number;
    name: string;
    price: number;
    amount: number;
    editing?: boolean;
    expired?: boolean;
    onRefresh?: () => void;
}

const OfferCardSmall: React.FC<OfferCardProps> = ({ offerid, name, price, editing, amount, expired, onRefresh }) => {
    const [cardOpen, setCardOpen] = useState(false);
    const { token } = useAuth();

    function handleDelete() {
        console.log("Deleting");
        deleteOffer(token, offerid).then((data) => {
            if (data.error) return console.log(data.error);
            onRefresh && onRefresh();
        });
    }    
    const buyTop = <>
        <button><MaterialSymbolsIcon name="shopping_cart" size='3rem' /></button>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="visibility" size='3rem' /></button>
    </>
    const editTop = <>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="edit" size='3rem' /></button>
        <button onClick={handleDelete}><MaterialSymbolsIcon name="delete" size="3rem" /></button>
    </>
    return (<>
        <OfferModal open={cardOpen} onClose={() => setCardOpen(false)}/>
        <div className="offer-card-small" >
            {editing ? editTop : buyTop}
            <h3>{name}</h3>
            <p>{`${amount} Unidades`}</p>
            <p id="tag-caducidad">
                {expired &&
                    <>
                        <span className="dot"> </span>
                        Caducado
                    </>}
            </p>
            <h3>{`${price}$`}</h3>
        </div>
    </>);
};

export default OfferCardSmall;