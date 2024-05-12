// Create a component of OffersContainer that will display the offers of the market
import React from 'react';
import OfferCardSmall from './OfferCardSmall';

interface CustomProps extends React.HTMLAttributes<HTMLDivElement> {
 
    offers: any[] | undefined;
}

const DUMMYOFFERS = [
    {
        ID: 10,
        NOMBRE: "Manzanas",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 11,
        NOMBRE: "Peras",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 12,
        NOMBRE: "Platanos",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 13,
        NOMBRE: "Papayas",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 14,
        NOMBRE: "Sandias",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 15,
        NOMBRE: "Uvas",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 16,
        NOMBRE: "Fresas",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 17,
        NOMBRE: "Mangos",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 18,
        NOMBRE: "Duraznos",
        CANTIDAD: 10,
        PRECIO: 5,
    },
    {
        ID: 19,
        NOMBRE: "Cerezas",
        CANTIDAD: 10,
        PRECIO: 5,
    }
];


const OffersContainer: React.FC<CustomProps> = ({ offers = [] }) => { 
    offers = [...DUMMYOFFERS, ...offers];
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