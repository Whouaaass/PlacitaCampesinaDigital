/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import React from 'react';

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    price: number;
    amount: number;
    editing?: boolean;
    key?: number;
}

const OfferCardSmall: React.FC<OfferCardProps> = ({ name, price, editing, amount, key }) => {
    const buyTop = <>
        <button>Comprar</button>
        <button>Agregar al carrito</button>
    </>
    const editTop = <>
        <button>Editar</button>
        <button>Eliminar</button>
    </>
    return (
        <div key={key} className="offer-card-small" >
            <div className="buttons">
                {editing ? editTop : buyTop}
            </div>
            <label>
                <h3>{`${name} x${amount} Kg`}</h3>
                <p>Precio: ${price}</p>
            </label>

        </div>
    );
};

export default OfferCardSmall;