/**
 * @brief interfaz del mercado donde aparecen todas las ofertas
 */

import { FC, useContext } from 'react';
import MarketFrame from '../Frames/MarketFrame';
import { useEffect } from 'react';
import OffersContainer from '../Offers/OffersContainer';
import SearchProvider from '../../hooks/SearchProvider';
import { OffersContext } from '../../hooks/OffersProvider';

const Market: FC = () => {
    const { loadOffers } = useContext(OffersContext);    

    useEffect(() => {
        loadOffers().then((data: any) => {
            if (data.error) throw new Error(data.error);            
        }).catch((err) => {
            console.log('something went wrong with the fetch')
            console.log(err)
        });
    }, []);

    return (
        <SearchProvider>
            <MarketFrame>
                <OffersContainer /> 
            </MarketFrame>
        </SearchProvider>
    );
};

export default Market;