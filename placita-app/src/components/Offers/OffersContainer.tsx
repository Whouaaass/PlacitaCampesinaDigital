// Create a component of OffersContainer that will display the offers of the market
import React, { useContext } from 'react';
import OfferCardSmall from './OfferCardSmall';
import { OffersContext } from '../../hooks/OffersProvider';

interface CustomProps extends React.HTMLAttributes<HTMLDivElement> {
    editing?: boolean;
    onRefresh?: () => void;
}

const splitOffersByTipo = (offers: any[]) => {
    const offersByTipo = {} as any;
    offers.forEach((offer) => {
        if (!offersByTipo[offer.TIPO]) {
            offersByTipo[offer.TIPO] = [];
        }
        offersByTipo[offer.TIPO].push(offer);
    });
    return offersByTipo;
}


const OffersContainer: React.FC<CustomProps> = ({ editing }) => {
    const { offers, filters } = useContext(OffersContext);
    const isTipoDisplay = filters.orderby === 'Tipo';
    if (isTipoDisplay) {
        const offersByTipo = splitOffersByTipo(offers);
        const tipos = Object.keys(offersByTipo);
        return <>
            {tipos.map((tipo) => (
                <div key={tipo} className='contents'>                    
                    <SimpleOfferContainer title={tipo} offers={offersByTipo[tipo]} editing={editing} />
                </div>
            ))}
        </>;
    }
    else {
        return <SimpleOfferContainer offers={offers} editing={editing} />
    }
};

const SimpleOfferContainer: React.FC<SimpleOfferContainerProps> = ({ offers, title, editing }) => {
    return <>
        {title && <h2 className='offers-container-title'>{title}</h2>}
        <ul className="offers-container">
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
    </>
}

export default OffersContainer;


interface SimpleOfferContainerProps {
    title?: string;
    offers: any[];
    editing?: boolean;
}