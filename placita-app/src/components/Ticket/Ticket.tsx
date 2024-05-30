import { FC } from "react";
import Modal from "../Modals/Modal";
import placitaLogo from "/PlacitaLogo.png";
import {MONTH_NAMES} from "../../CONSTANTS";
import MaterialSymbolsIcon from "../Icons/MaterialSymbolsIcon";

export const TicketModal: FC<ModalTicketProps> = ({ ticketData = [{}], onClose }) => {
    return <Modal>
        <div id="ticket-modal">
            <Ticket ticketData={ticketData} />
            <button id="ticket-exit-button" onClick={onClose} className="button-t">
                <MaterialSymbolsIcon name="close" size="1.5rem" color='black' />
            </button>
        </div>

    </Modal>
}

const Ticket: FC<{ ticketData: any }> = ({ ticketData }) => {
    
    const { FACID, TOTAL, FECHACOMPRA, USUID } = ticketData[0] as TicketData ?? {};
    const buyDateFrac = FECHACOMPRA?.substring(0, 10).split('-');
    const buyDate = `${buyDateFrac[2]}/${MONTH_NAMES[+buyDateFrac[1]]}/${buyDateFrac[0]}`;    
    return <>
        <div id="ticket-header">
            <label>
                <img src={placitaLogo} />
                <h1>Factura</h1>
            </label>
            <label>
                <p>N° {FACID ?? '0000000'}</p>
                <p>{buyDate ?? 'DD/MM/YYYY'}</p>
            </label>
        </div>
        <div id="ticket-content">
            <p id="id-cliente">Cliente: {USUID ?? '00000'}</p>
            <h2 className="underline">Mi Compra</h2>
            <table>
                <tr><td colSpan={4} className="horizontal-line"></td></tr>
                <tr>
                    <th>Nombre</th>
                    <th>ID</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
                <tr><td colSpan={4} className="horizontal-line"></td></tr>
                <tbody>
                    {ticketData.map((data: TicketData) => 
                        <tr key={data.OFEID}>
                            <td>{data.PRODUCTO}</td>
                            <td>{data.OFEID}</td>
                            <td>{data.UNIDADES}</td>
                            <td>{data.SUBTOTAL}</td>
                        </tr>
                    )}
                </tbody>
                <tr><td colSpan={4} className="horizontal-line"></td></tr>
                <tfoot>
                    <td colSpan={4}>Total: ${TOTAL ?? "0000"}</td>
                </tfoot>
            </table>
            <p id="ticket-info-1">
                Contactese con el siguiente número para continuar con la transacción (Por favor tomar foto a su Factura)
                <br />
                <br />
                {"<Numero de Gremio>"}
            </p>
        </div>
    </>
}

export default Ticket;

export interface ModalTicketProps {
    onClose: () => void;
    ticketData?: Array<TicketData>;
}

export interface TicketData {
    FACID: number;
    USUID: number;
    COMPRADOR: string;
    OFEID: number;
    PRODUCTO: string;
    UNIDADES: number;
    SUBTOTAL: number;
    FECHACOMPRA: string;
    TOTAL: number;
}
