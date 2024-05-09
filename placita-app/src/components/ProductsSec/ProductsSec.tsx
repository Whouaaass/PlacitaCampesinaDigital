
import React from 'react';
import ProductsFrame from '../Frames/ProductsFrame';

const ProductsSec: React.FC = () => {
    return (
        <ProductsFrame>
            <h2>User Products</h2>
            <ul>
                {/*products.map((product) => (
                    <li key={product.id}>
                        <span>{product.name}</span>
                        <span>{product.price}</span>
                    </li>
                ))*/}
            </ul>
        </ProductsFrame>
    );
};

export default ProductsSec;