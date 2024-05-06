import './App.css'
import './styles/SignUp.css';
import './styles/Login.css';
import './styles/Animations.css'
import './styles/FloatingBox.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Market from './components/Market/Market';

function App() {  
  
  return (    
    <BrowserRouter>
      <Routes>        
        <Route path='/' element={<Home/>} />         
        <Route path='/login' element={<Login/>} />   
        <Route path='/signup' element={<SignUp/>} />             
        <Route path='/Market' element={<Market/>}></Route>
        <Route path="*">404 Not Found</Route>        
      </Routes>    
    </BrowserRouter>
  )
  
}

export default App
