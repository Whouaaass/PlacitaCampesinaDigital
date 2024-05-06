/**
 * @file Login.test.tsx
 * @brief Archivo de pruebas unitarias para el componente Login * 
 * @jest-environment jsdom
 */

// Importa las funciones necesarias de Testing Library y React
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Importa las extensiones de expect de Jest

// Importa el componente Login que deseas probar
import Login from '../components/Login/Login';
import { BrowserRouter } from 'react-router-dom';

// Prueba para verificar si el componente Login se renderiza correctamente
document.body.innerHTML = '<div id="popup-root"></div>';

test('renders Login component', () => {
  // Renderiza el componente Login
  const { getByText, getByLabelText } = render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>  
  );

  // Busca elementos en el componente renderizado
  const titleElement = getByText('Iniciar Sesión');  
  const usernameInput = getByLabelText('Cédula *');
  const passwordInput = getByLabelText('Contraseña *');
  const submitButton = getByText('Entrar');

  // Asegúrate de que los elementos esperados estén presentes en el DOM
  expect(titleElement).toBeInTheDocument();
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
test('Render Login and proove correct operation when credentials are not complete',async() =>{    
     const {getByText,getByLabelText} = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter> 
     );
     const userIdInput = getByLabelText('Cédula *');
     const submitButton = getByText('Entrar');
    
    //Put a string in the id input
     fireEvent.change(userIdInput,{target:{value:'1999'}});
    //Click on 'Entrar'
    fireEvent.click(submitButton);
    //Error Message expected
    await waitFor(() => {
      const errorMessage = getByText('Por favor, ingrese la información solicitada');
      expect(errorMessage).toBeInTheDocument();
    }); 
}
);
test('Render Login and proove correct operation when credentials are incorrect',async() =>{
  fetchMock.mockResponseOnce(JSON.stringify({ ok: false, status: 'error', message: 'Invalid credentials'}));
  const {getByText,getByLabelText} = render(
   <BrowserRouter>
     <Login />
   </BrowserRouter> 
  );
  const userIdInput = getByLabelText('Cédula *');
  const userPasswordInput = getByLabelText('Contraseña *');
  const submitButton = getByText('Entrar');
 
//The following data is incorrect(they are not in the data base).
 //Put a string in the id input
  fireEvent.change(userIdInput,{target:{value:'1999'}});
  //Put a string in the password input
  fireEvent.change(userPasswordInput,{target:{value:'aaa'}});
 
  //Click on 'Entrar'
  fireEvent.click(submitButton);
 //Error Message expected
 await waitFor(() => {
   const errorMessage = getByText('Usuario o contraseña inválidos');
   expect(errorMessage).toBeInTheDocument();
 }); 
}
);