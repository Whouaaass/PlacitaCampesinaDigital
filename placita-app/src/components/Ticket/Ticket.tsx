import { FC } from "react";
import Modal from "../Modals/Modal";
import placitaLogo from "/PlacitaLogo.png";

export const ModalTicket: FC<ModalTicketProps> = ({ ticketData, onClose }) => {
    return <Modal>
        <Ticket ticketData={{}} />
        <div id="modal-mask" onClick={onClose}></div>
    </Modal>
}

const Ticket: FC<{ ticketData: any }> = ({ ticketData }) => {
    const { FACID, TOTAL } = ticketData[0] as TicketData;
    return <div id="ticket">
        <div id="ticket-header">
            <label>
                <h1>Factura</h1>
                <p>{FACID}</p>
            </label>
            <img src={placitaLogo} />
        </div>
        <div id="ticket-content">
            <h2>Mi Compra</h2>
            <ul>
                {ticketData.map((data: TicketData) => {
                    <li key={data.OFEID}>
                        <label>
                            <h3>{data.PRODUCTO}x{data.UNIDADES}</h3>
                            <p>{data.OFEID}</p>
                        </label>
                        <p>{data.SUBTOTAL}</p>
                    </li>
                })}
                <li>
                    <label>
                        <h3>Producto</h3>
                        <p>ID</p>
                    </label>
                    <p>Precio</p>
                </li>
            </ul>
            <label id="ticket-total">
                {TOTAL}
            </label>
            <p id="ticket-info-1">Contactese con el siguiente número para continuar con la transacción (Por favor tomar foto a su Factura)</p>
            <p>{"<Numero de Gremio>"}</p>
        </div>
    </div>
}

export default Ticket;

export interface ModalTicketProps {
    onClose: () => void;
    ticketData: Array<TicketData>;
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
