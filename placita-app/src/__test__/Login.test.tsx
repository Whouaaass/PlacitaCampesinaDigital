/**
 * @file Login.test.tsx
 * @brief Archivo de pruebas unitarias para el componente Login * 
 * @jest-environment jsdom
 */



// Importa las funciones necesarias de Testing Library y React
import { render } from '@testing-library/react';
 // Importa las extensiones de expect de Jest

// Importa el componente Login que deseas probar
import Login from '../components/Login';
import { BrowserRouter } from 'react-router-dom';

// Prueba para verificar si el componente Login se renderiza correctamente
test('renders Login component', () => {
  // Renderiza el componente Login
  const { getByText, getByLabelText } = render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>  
  );

  // Busca elementos en el componente renderizado
  const titleElement = getByText('Iniciar Sesión');
  const usernameInput = getByLabelText('Usuario');
  const passwordInput = getByLabelText('Contraseña');
  const submitButton = getByText('Entrar');

  // Asegúrate de que los elementos esperados estén presentes en el DOM
  expect(titleElement).not.toBeNull();
  expect(usernameInput).not.toBeNull();
  expect(passwordInput).not.toBeNull();
  expect(submitButton).not.toBeNull();
});