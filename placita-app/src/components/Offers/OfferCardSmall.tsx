/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import { useContext, useState, FC, HTMLAttributes, useRef } from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import { useAuth } from '../../hooks/AuthProvider';
import OfferModal from '../Modals/OfferModal';
import { OffersContext, OfferProps } from '../../hooks/OffersProvider';
import BuyModal from '../Modals/BuyModal';
import SimpleAskModal from '../Modals/simpleAskModal';

interface OfferCardProps extends HTMLAttributes<HTMLDivElement> {
    offerData: OfferProps;
    editing?: boolean;
    expired?: boolean;    
}

const OfferCardSmall: FC<OfferCardProps> = ({ offerData, editing}) => {
    const {offerid, name, price, quantity, expirationDate, vendor } = offerData;
    const [cardOpen, setCardOpen] = useState(false);
    const [buyOpen, setBuyOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { token } = useAuth();
    const { deleteOffer } = useContext(OffersContext);    
    const expired = (new Date(expirationDate)).getTime() < (new Date()).getTime() //+ 1000*60*60*24*10;

    function handleDelete() {
        console.log("Deleting");
        deleteOffer(offerid, token).then((data) => {
            if (data.error) return console.log(data.error); 
            else {
                console.log("Deleted");                
            }           
        });
        setDeleteOpen(false);
    }    
    const buyTop = <>
        <button onClick={() => setBuyOpen(true)}><MaterialSymbolsIcon name="shopping_cart" size='3rem' /></button>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="visibility" size='3rem' /></button>
    </>
    const editTop = <>
        <button onClick={() => setCardOpen(true)}><MaterialSymbolsIcon name="edit" size='3rem' /></button>
        <button onClick={() => setDeleteOpen(true)} id="delete-offer-button" ><MaterialSymbolsIcon name="delete" size="3rem" /></button>
    </>
    return (<>        
        {deleteOpen && <SimpleAskModal question={'¿Quieres eliminar la oferta?'} onAffirmative={handleDelete} onNegative={() => setDeleteOpen(false)} />}
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
            <p>{vendor}</p>
        </div>
    </>);
};

export default OfferCardSmall;