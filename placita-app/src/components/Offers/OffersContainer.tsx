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
                <li key={offer.ID}>
                    <OfferCardSmall
                        offerData={{
                            offerid: offer.ID,
                            name: offer.NOMBRE,
                            price: offer.PRECIO,
                            amount: offer.CANTIDAD,
                            expDate: offer.FECHACADUCIDAD,
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