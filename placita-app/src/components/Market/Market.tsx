/**
 * @brief interfaz del mercado donde aparecen todas las ofertas
 */

import {FC} from 'react';
import MarketFrame from '../Frames/MarketFrame';
import { useEffect, useState } from 'react';
import OffersContainer from '../Offers/OffersContainer';

const Market: FC = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/ofertas"
        ).then((res) => {
            res.json().then((data) => {
                if (data.error) throw new Error(data.error);
                console.log(data);
                setOffers(data);
            })
        }).catch((err) => {
            console.log('something went wrong with the fetch')
            console.log(err)            
        })
    }, []);


    return (
        <MarketFrame>            
            <OffersContainer offers={offers}></OffersContainer>
        </MarketFrame>
    );
};

export default Market;