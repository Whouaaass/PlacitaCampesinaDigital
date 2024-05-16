
import { createContext, useState, FC, PropsWithChildren} from 'react';
import { PopUpRef } from '../components/PopUp';


export const OffersContext = createContext({
    offers: [] as any[],
    loadOffers: async () => { },
    loadOffersByUser: async (id: number) => {},
    deleteOffer: async (id: number, token: string) => { return {} as any},
    addOffer: async (offer: any) => { return {} as any},
    refreshOffers: (() => { }),
});

let refreshOffers = () => {return Promise.resolve()};

const OffersProvider: FC<PropsWithChildren> = ({ children }) => {
    const [offers, setOffers] = useState([]);      

    const methods = {
        loadOffers: async () => {
            const response = await fetch('http://localhost:3000/ofertas');
            console.log(response);
            const data = await response.json();
            setOffers(data.data);
            refreshOffers = () => methods.loadOffers();                     
            return data;
        },
        loadOffersByUser: async (id: number) => {
            const response = await fetch(`http://localhost:3000/ofertas/user/${id}`);
            const data = await response.json();
            setOffers(data.data);
            refreshOffers = () => methods.loadOffersByUser(id);
            return data;
        },
        deleteOffer: async (id: number, token: string) => {
            const response = await fetch(`http://localhost:3000/ofertas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    token: `session=${token}`
                }});
            const data = await response.json();                        
            refreshOffers();
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
            refreshOffers();       
            return data;
        }
    }    
    

    // ...

    return (
        <OffersContext.Provider value={{
            offers,
            ...methods,
            refreshOffers: refreshOffers
        }}>
            {children}
        </OffersContext.Provider >
    );
};


export default OffersProvider;


/**
 * Represents the search properties for the search provider.
 */
export interface OffersProps {
    order: string;
    direction: 'asc' | 'desc';
    search: string;
}