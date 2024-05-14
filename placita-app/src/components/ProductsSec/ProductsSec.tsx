import React, { useEffect, useState } from 'react';
import ProductsFrame from '../Frames/ProductsFrame';
import OffersContainer from '../Offers/OffersContainer';
import { useAuth } from '../../hooks/AuthProvider';
import { DUMMYOFFERS } from './dummyOffers';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';
import SearchProvider from '../../hooks/SearchProvider';
import AddOfferModal from '../Modals/AddOfferModal';

const getUserOffers = async (user: string) => {
    const response = await fetch(`http://localhost:3000/ofertas/user/${user}`);
    if (response.status !== 200) throw new Error("Internal server error");
    return await response.json();
}



const ProductsSec: React.FC = () => {
    const [offers, setOffers] = useState([]);
    const [inOfferAdding, setInOfferAdding] = useState(false);
    const { user } = useAuth();
    useEffect(() => {
        refreshOffers();
    }, []);

    function refreshOffers() {
        getUserOffers(user).then((offers) => {
            if (offers.data) setOffers(offers.data);
        });
    }

    return <>
        <AddOfferModal open={inOfferAdding} onClose={() => setInOfferAdding(false)} onSuccess={refreshOffers}></AddOfferModal>
        <SearchProvider>
            <ProductsFrame>
                <OffersContainer offers={offers} editing onRefresh={refreshOffers}/>
            </ProductsFrame>

        </SearchProvider>
        <button id="add-offer-button" className='button-2' onClick={() => setInOfferAdding(true)}>
            <MaterialSymbolsIcon name="add" size='2rem' /> Agregar Oferta
        </button>

    </>
};

export default ProductsSec;