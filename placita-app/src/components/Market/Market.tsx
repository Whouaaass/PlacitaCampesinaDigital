/**
 * @brief interfaz del mercado donde aparecen todas las ofertas
 */

import {FC} from 'react';
import MarketFrame from '../Frames/MarketFrame';
import { useEffect, useState } from 'react';

const Market: FC = () => {
    const [ofertas, setOfertas] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/ofertas"
        ).then((res) => {
            res.json().then((data) => {
                setOfertas(data);
            })
        }).catch((err) => {
            console.log('something went wrong with the fetch')
            console.log(err)
        })
    }, []);

    
    return (
        <MarketFrame>
            <div></div>
        </MarketFrame>
    );
};

export default Market;