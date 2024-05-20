/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import React, { useContext, useState } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { useAuth } from '../../hooks/AuthProvider';
import OfferModal from '../Modals/OfferModal';
import { OffersContext } from '../../hooks/OffersProvider';

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
    offerData: any;
    editing?: boolean;
    expired?: boolean;    
}

const OfferCardSmall: React.FC<OfferCardProps> = ({ offerData, editing, expired}) => {
    const {offerid, name, price, amount} = offerData;
    const [cardOpen, setCardOpen] = useState(false);
    const { token } = useAuth();
    const { deleteOffer } = useContext(OffersContext);

    function handleDelete() {
        console.log("Deleting");
        deleteOffer(offerid, token).then((data) => {
            if (data.error) return console.log(data.error);            
        });
    }    
    const buyTop = <>
        <button><MaterialSymbolsIcon name="shopping_cart" size='3rem' /></button>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="visibility" size='3rem' /></button>
    </>
    const editTop = <>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="edit" size='3rem' /></button>
        <button onClick={handleDelete} id="delete-offer-button" ><MaterialSymbolsIcon name="delete" size="3rem" /></button>
    </>
    return (<>
        {cardOpen && <OfferModal offerData={offerData} open={cardOpen} onClose={() => setCardOpen(false)} editing={editing}/>}
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
            <h3>{`$${price}`}</h3>  
        </div>
    </>);
};

export default OfferCardSmall;