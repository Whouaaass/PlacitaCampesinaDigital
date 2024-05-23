import './App.css'
import './styles/SignUp.css';
import './styles/Login.css';
import './styles/Animations.css';
import './styles/SimpleFrame1.css';
import './styles/Market.css';
import './styles/ProductsSec.css';
import './styles/SearchBar.css';
import './styles/OfferCards.css';
import './styles/Modals.css';
import './styles/buyCart.css';
import './styles/Ticket.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Market from './components/Market/Market';
import ProductsSec from './components/ProductsSec/ProductsSec';
import AuthProvider from './hooks/AuthProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import OffersProvider from './hooks/OffersProvider';
import BuyCartSec from './components/Cart/buyCartSec';
import Factura from './components/Factura/Factura';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          
            <Route element={<PrivateRoute />}>
              <Route path='/cart' element={<OffersProvider><BuyCartSec /></OffersProvider>} />  
              <Route path='/market' element={<OffersProvider><Market /></OffersProvider>} />
              <Route path='/products' element={<OffersProvider><ProductsSec /></OffersProvider>} />
            </Route>
          <Route path="/test" element={<Factura/>}/>
          <Route path="*">404 Not Found</Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )

}

export default App
