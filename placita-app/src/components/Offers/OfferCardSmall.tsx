/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import { useContext, useState, FC, HTMLAttributes } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { useAuth } from '../../hooks/AuthProvider';
import OfferModal from '../Modals/OfferModal';
import { OffersContext } from '../../hooks/OffersProvider';
import BuyModal from '../Modals/BuyModal';

interface OfferCardProps extends HTMLAttributes<HTMLDivElement> {
    offerData: any;
    editing?: boolean;
    expired?: boolean;    
}

const OfferCardSmall: FC<OfferCardProps> = ({ offerData, editing, expired}) => {
    const {offerid, name, price, quantity} = offerData;
    const [cardOpen, setCardOpen] = useState(false);
    const [buyOpen, setBuyOpen] = useState(false);
    const { token } = useAuth();
    const { deleteOffer } = useContext(OffersContext);

    function handleDelete() {
        console.log("Deleting");
        deleteOffer(offerid, token).then((data) => {
            if (data.error) return console.log(data.error);            
        });
    }    
    const buyTop = <>
        <button onClick={() => setBuyOpen(true)}><MaterialSymbolsIcon name="shopping_cart" size='3rem' /></button>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="visibility" size='3rem' /></button>
    </>
    const editTop = <>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="edit" size='3rem' /></button>
        <button onClick={handleDelete} id="delete-offer-button" ><MaterialSymbolsIcon name="delete" size="3rem" /></button>
    </>
    return (<>
        {cardOpen && <OfferModal offerData={offerData} onClose={() => setCardOpen(false)} editing={editing}/>}
        {buyOpen && <BuyModal offerData={offerData} onClose={() => setBuyOpen(false)}/>}
        <div className="offer-card-small" >
            {editing ? editTop : buyTop}
            <h3>{name}</h3>
            <p>{`x  ${quantity} Unidades`}</p>
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