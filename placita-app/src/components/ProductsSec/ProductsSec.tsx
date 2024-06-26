import React, { useContext, useEffect, useState } from 'react';
import ProductsFrame from '../Frames/ProductsFrame';
import OffersContainer from '../Offers/OffersContainer';
import { useAuth } from '../../hooks/AuthProvider';
import { DUMMYOFFERS } from './dummyOffers';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import AddOfferModal from '../Modals/AddOfferModal';
import { OffersContext } from '../../hooks/OffersProvider';

const ProductsSec: React.FC = () => {
    const [inOfferAdding, setInOfferAdding] = useState(false);
    const { loadOffersByUser, clearFilters } = useContext(OffersContext);
    const { user } = useAuth();
    useEffect(() => {
        clearFilters();
        refreshOffers();
    }, []);

    function refreshOffers() {
        loadOffersByUser(+user).then((offers: any) => {
            if (offers.error) console.log(offers.error);
        });
    }

    return <>
        <AddOfferModal open={inOfferAdding} onClose={() => setInOfferAdding(false)} onSuccess={refreshOffers}></AddOfferModal>
        <ProductsFrame>
            <OffersContainer editing />
        </ProductsFrame>
        <button id="add-offer-button" className='button-2' onClick={() => setInOfferAdding(true)}>
            <MaterialSymbolsIcon name="add" size='2rem' /> Agregar Oferta
        </button>

    </>
};

export default ProductsSec;