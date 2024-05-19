
import { createContext, useState, FC, PropsWithChildren} from 'react';
import { PopUpRef } from '../components/PopUp';

export const OffersContext = createContext({
    offers: [] as any[],
    loadOffers: async () => { },
    loadOffersByUser: async (id: number) => {},
    deleteOffer: async (id: number, token: string) => { return {} as any},
    addOffer: async (offer: any) => { return {} as any},
    refreshOffers: (() => { }),
    setFilters: (filters: OffersFilters) => { },
    clearFilters: () => { }
});

const loadMethod = {
    method: 'loadOffers',
    args: [] as any[]   
}
const OffersProvider: FC<PropsWithChildren> = ({ children }) => {
    const [offers, setOffers] = useState<Array<RawOfferProps>>([]);
    const [filters, setFilters] = useState<OffersFilters | null>(null);

    const filteredOffers = filters? offers.sort((offerA, offerB) => {
        if (filters.orderby === 'Nombre') 
            return offerA.NOMBRE > offerB.NOMBRE ? 1 : -1;
        if (filters.orderby === 'Precio') 
            return offerA.PRECIO > offerB.PRECIO ? 1 : -1;
        if (filters.orderby === 'Tipo') 
            return offerA.TIPO > offerB.TIPO ? 1 : -1;
        return 0;
    }).filter((offer) => {
        return offer.NOMBRE.startsWith(filters.search)
            || offer.TIPO.startsWith(filters.search)
            || offer.DESCRIPCION.startsWith(filters.search);        
    }) : offers;

    const methods = {
        loadOffers: async () => {
            const response = await fetch('http://localhost:3000/ofertas');
            console.log(response);
            const data = await response.json();
            console.log(data.error);
            if (data.error) throw new Error(data.error);
            setOffers(data.data);
            loadMethod.method = 'loadOffers';
            loadMethod.args = [];
            return data;
        },
        loadOffersByUser: async (id: number) => {
            const response = await fetch(`http://localhost:3000/ofertas/user/${id}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setOffers(data.data);
            loadMethod.method = 'loadOffersByUser';
            loadMethod.args = [id];            
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
            methods.refreshOffers();
            return data;
            
        },
        refreshOffers: () => {                         
            if (loadMethod.method === 'loadOffers')
                methods.loadOffers();
            else if (loadMethod.method === 'loadOffersByUser')
                methods.loadOffersByUser(loadMethod.args[0]);
        },
        addOffer: async (offer: any) => {
            const response = await fetch(`http://localhost:3000/ofertas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(offer)
            });
            const data = await response.json();        
            methods.refreshOffers();       
            return data;
        },
        clearFilters: () => {
            setFilters(null);
        }
    }    
    

    // ...

    return (
        <OffersContext.Provider value={{
            offers: filteredOffers,            
            setFilters,
            ...methods,            
        }}>
            {children}
        </OffersContext.Provider >
    );
};


export default OffersProvider;


/**
 * Represents the search properties for the search provider.
 */
export interface OffersFilters {
    orderby: string;    
    search: string;
}

export interface RawOfferProps {
    ID: number;
    USUID: number;
    NOMBRE: string;
    TIPO: string;
    PRECIO: number;
    DESCRIPCION: string;
    CANTIDAD: number;
    FECHACADUCIDAD: string;
}
export interface OfferProps {
    id: number;
    userId: number;
    name: string;
    type: string;
    price: number;
    description: string;
    quantity: number;
    expirationDate: string;
}