import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {  
  return (    
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home} />         
        <Route path='/login' Component={Login} />         
        <Route path='/signup' Component={SignUp} />         
      </Routes>      
    </BrowserRouter>
  )
}

export default App
