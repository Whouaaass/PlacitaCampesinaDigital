import { FC } from 'react';
import { Link } from "react-router-dom";

const Home: FC = () => {
    return <div style={{ padding: "20px", display:"block"}}>
        <h1>Hola, este es el indice!!</h1>
        <h3><Link to="/login">Login</Link></h3>
        <h3><Link to="/signup">Registro</Link></h3>
    </div>
}

export default Home;
