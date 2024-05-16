
import { createContext, useState, FC, PropsWithChildren} from 'react';
import { PopUpRef } from '../components/PopUp';


export const OffersContext = createContext({
    offers: [],
    loadOffers: () => { },
    loadOffersByUser: (id: number) => { },
    deleteOffer: (id: number) => { },
    addOffer: (offer: any) => { }
});

const SearchProvider: FC<PropsWithChildren> = ({ children }) => {
    const [offers, setOffers] = useState([]);

    const methods = {
        loadOffers: async () => {
            const response = await fetch('http://localhost:3000/ofertas');
            const data = await response.json();
            setOffers(data);            
            return data;
        },
        loadOffersByUser: async (id: number) => {
            const response = await fetch(`http://localhost:3000/ofertas/user/${id}`);
            const data = await response.json();
            setOffers(data);
            return data;
        },
        deleteOffer: async (id: number) => {
            const response = await fetch(`http://localhost:3000/ofertas/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();                        
            return data;
        },
        addOffer: async (offer: any, popup?: PopUpRef) => {
            const response = await fetch(`http://localhost:3000/ofertas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(offer)
            });
            const data = await response.json();            
            return data;
        }
    }    
    return (
        <OffersContext.Provider value={{
            offers,
            ...methods
        }}>
            {children}
        </OffersContext.Provider >
    );
};


export default SearchProvider;


/**
 * Represents the search properties for the search provider.
 */
export interface OffersProps {
    order: string;
    direction: 'asc' | 'desc';
    search: string;
}