// Create a component of OffersContainer that will display the offers of the market
import React, { useContext } from 'react';
import OfferCardSmall from './OfferCardSmall';
import { OffersContext } from '../../hooks/OffersProvider';

interface CustomProps extends React.HTMLAttributes<HTMLDivElement> {
    editing?: boolean;
    onRefresh?: () => void;
}


const OffersContainer: React.FC<CustomProps> = ({editing}) => { 
    const { offers } = useContext(OffersContext);    
    return (
        <ul id="offers-container">
            {offers.map((offer) => (
                <li key={offer.OFEID}>
                    <OfferCardSmall
                        offerData={{
                            offerid: offer.OFEID,
                            userId: offer.USUID,
                            name: offer.NOMBRE,
                            type: offer.TIPO,
                            price: offer.PRECIO,
                            quantity: offer.CANTIDAD,
                            expirationDate: offer.FECHACADUCIDAD,
                            description: offer.DESCRIPCION
                        }}
                        editing={editing}                        
                    />
                </li>
            ))}
        </ul>
    );
};

export default OffersContainer;