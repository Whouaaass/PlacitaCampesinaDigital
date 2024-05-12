/**
 * @brief Componente que representa una oferta en la pagina principal
 */
import React from 'react';
import MaterialSymbolsIcon from '../Icons/MaterialSymbolsIcon';

interface OfferCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    price: number;
    amount: number;
    editing?: boolean;
    key?: number;
    expired?: boolean;
}

const OfferCardSmall: React.FC<OfferCardProps> = ({ name, price, editing, amount, key, expired }) => {
    const buyTop = <>
        <button>
            <MaterialSymbolsIcon name="shopping_cart" size='3rem'/>
        </button>
        <button>
            <MaterialSymbolsIcon name="visibility" size='3rem'/>
        </button>
    </>
    const editTop = <>
        <button>Editar</button>
        <button>Eliminar</button>
    </>
    return (
        <div key={key} className="offer-card-small" >

            {editing ? editTop : buyTop}


            <h3>{name}</h3>            
            <p>{`${amount} Unidades`}</p>
            <p id="tag-caducidad">
                {expired && 
                <>
                    <span className="dot"> </span>
                    Caducado
                </>}
            </p>
            <h3>{`${price}$`}</h3>


        </div>
    );
};

export default OfferCardSmall;