// Create a component of OffersContainer that will display the offers of the market
import React from 'react';
import OfferCardSmall from './OfferCardSmall';

interface CustomProps extends React.HTMLAttributes<HTMLDivElement> {
 
    offers: any[] | undefined;
    edit?: boolean;
}


const OffersContainer: React.FC<CustomProps> = ({ offers = [], edit}) => {     
    //offers = [...DUMMYOFFERS, ...offers];
    console.log(offers);
    return (
        <ul id="offers-container">
            {offers.map((offer) => (
                <li key={offer.ID}>
                    <OfferCardSmall
                        name={offer.NOMBRE}
                        amount={offer.CANTIDAD}
                        price={offer.PRECIO}
                    />
                </li>
            ))}
        </ul>
    );
};

export default OffersContainer;