// Create a component of OffersContainer that will display the offers of the market
import React from 'react';
import OfferCardSmall from './OfferCardSmall';

interface CustomProps extends React.HTMLAttributes<HTMLDivElement> {
 
    offers: any[] | undefined;
    editing?: boolean;
    onRefresh?: () => void;
}


const OffersContainer: React.FC<CustomProps> = ({ offers = [], editing, onRefresh}) => {     
    console.log(offers);
    return (
        <ul id="offers-container">
            {offers.map((offer) => (
                <li key={offer.ID}>
                    <OfferCardSmall
                        offerid={offer.ID}
                        name={offer.NOMBRE}
                        amount={offer.CANTIDAD}
                        price={offer.PRECIO}
                        editing={editing}
                        onRefresh={onRefresh}
                    />
                </li>
            ))}
        </ul>
    );
};

export default OffersContainer;