/**
 * @file SignUp.test.tsx
 * @brief Archivo de pruebas unitarias para el componente SignUp * 
 * @jest-environment jsdom
 */

// Importa las funciones necesarias de Testing Library y React
import { render,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
 // Importa las extensiones de expect de Jest

// Importa el componente Login que deseas probar
import SignUp from '../components/SignUp.tsx';
import { BrowserRouter } from 'react-router-dom';

// Prueba para verificar si el componente SignUp se renderiza correctamente
test('renders SignUp component', () => { //El error se encuentra en SignUp.css al hacer #input
    // Renderiza el componente Login
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>  
    );
  
    // Busca elementos en el componente renderizado
    const titleElement = getByText('REGISTRO');
    const userNameInput = getByLabelText('Nombre');
    const userLastNameInput = getByLabelText('Apellido');
    const userPasswordInput = getByLabelText('Constraseña');
    const userIdInput = getByLabelText('Cédula');
    const userTelInput = getByLabelText('Teléfono');
    const userAdressInput = getByLabelText('Dirección');
    const submitButton = getByText('Registrarse');
  
    // Asegúrate de que los elementos esperados estén presentes en el DOM
    expect(titleElement).toBeInTheDocument();
    expect(userNameInput).toBeInTheDocument();
    expect(userLastNameInput).toBeInTheDocument();
    expect(userPasswordInput).toBeInTheDocument();
    expect(userIdInput).toBeInTheDocument();
    expect(userTelInput).toBeInTheDocument();
    expect(userAdressInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
  /*test('Guild code number wrong',()=>{
    const { getByText, getByLabelText } = render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>  
      );
  }

  );*/
  test('enables Agrocode input when "Sí" is selected', () => {
    const { getByLabelText } = render(
    <BrowserRouter>
        <SignUp />
    </BrowserRouter>  
    );
  
    // Busca el radio button "Sí" y selecciónalo
    const yesRadioButton = getByLabelText('Si');
    fireEvent.click(yesRadioButton);
  
    // Verifica que el input de Agrocode esté habilitado
    const agrocodeInput = getByLabelText('Codigo Agrocauca');
    expect(agrocodeInput).toBeEnabled();
  });