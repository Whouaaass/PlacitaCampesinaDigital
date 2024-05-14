

// No use yet
import React from 'react';

interface ProductCardProps {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

const OfferModal: React.FC<ProductCardProps> = ({ name, price, description, imageUrl }) => {
    return (
        <div className="product-card">
            <img src={imageUrl} alt={name} className="product-card__image" />
            <div className="product-card__content">
                <h3 id="product-card__name">{name}</h3>
                <p id="product-card__price">${price}</p>
                <p id="product-card__description">{description}</p>
            </div>
        </div>
    );
};

export default OfferModal;