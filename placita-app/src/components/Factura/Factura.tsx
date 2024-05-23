import {FC} from "react";
import Modal from "../Modals/Modal";
import placitaLogo from "/PlacitaLogo.png";

export const ModalFactura: FC = () => {
    return <Modal>
        <Factura />
    </Modal>
}

const Factura: FC = () => {
    return <div>
        <div id="factura-header">
            <label>
                <h1>Factura</h1>
                <p>ID</p>
            </label>
            <img src={placitaLogo} />
        </div>
        <div id="factura-content">
            <h2>Mi Compra</h2>
            <ul>
                <li>
                    <label>
                        <h3>Producto</h3>
                        <p>ID</p>
                    </label>
                    <p>Precio</p>
                </li>
            </ul>
            <label id="factura-total">
                Total
            </label>
            <p>Contactese con el siguiente número para continuar con la transacción (Por favor tomar foto de su Factura)</p>
            <p>Numero de gremio</p>
        </div>
    </div>
}

export default Factura;