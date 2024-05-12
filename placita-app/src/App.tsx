import './App.css'
import './styles/SignUp.css';
import './styles/Login.css';
import './styles/Animations.css';
import './styles/SimpleFrame1.css';
import './styles/Market.css';
import './styles/ProductsSec.css';
import './styles/SearchBar.css';
import './styles/OfferCards.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Market from './components/Market/Market';
import ProductsSec from './components/ProductsSec/ProductsSec';

function App() {    
  return (    
    <BrowserRouter>
      <Routes>        
        <Route path='/' element={<Home/>} />         
        <Route path='/login' element={<Login/>} />   
        <Route path='/signup' element={<SignUp/>} />             
        <Route path='/market' element={<Market/>} />
        <Route path='/products' element={<ProductsSec />} />
        <Route path="*">404 Not Found</Route>        
      </Routes>    
    </BrowserRouter>
  )
  
}

export default App
