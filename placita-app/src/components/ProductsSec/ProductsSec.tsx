
import React from 'react';
import ProductsFrame from '../Frames/ProductsFrame';
import OffersContainer from '../Offers/OffersContainer';

import { DUMMYOFFERS } from './dummyOffers';

const ProductsSec: React.FC = () => {

    return (
        <ProductsFrame>
            <OffersContainer offers={DUMMYOFFERS}/>
        </ProductsFrame>
    );
};

export default ProductsSec;