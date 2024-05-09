

// No use yet
import React from 'react';

interface ProductCardProps {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

const OfferCardLarge: React.FC<ProductCardProps> = ({ name, price, description, imageUrl }) => {
    return (
        <div className="product-card">
            <img src={imageUrl} alt={name} className="product-card__image" />
            <div className="product-card__content">
                <h3 className="product-card__name">{name}</h3>
                <p className="product-card__price">${price}</p>
                <p className="product-card__description">{description}</p>
            </div>
        </div>
    );
};

export default OfferCardLarge;