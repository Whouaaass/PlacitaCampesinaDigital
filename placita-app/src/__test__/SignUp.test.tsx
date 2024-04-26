/**
 * @file SignUp.test.tsx
 * @brief Archivo de pruebas unitarias para el componente SignUp * 
 * @jest-environment jsdom
 */

// Importa las funciones necesarias de Testing Library y React
import { render,fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
 // Importa las extensiones de expect de Jest

// Importa el componente Login que deseas probar
import SignUp from '../components/SignUp/SignUp';
import { BrowserRouter } from 'react-router-dom';

document.body.innerHTML = '<div id="popup-root"></div>';


  test('renders SignUp component', () => { 
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
    const userPasswordInput = getByLabelText('Contraseña');
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
  test('Guild code number wrong',async()=>{
    const { getByText, getByLabelText } = render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>  
      );
      const userNameInput = getByLabelText('Nombre');
      const userLastNameInput = getByLabelText('Apellido');
      const userPasswordInput = getByLabelText('Contraseña');
      const userIdInput = getByLabelText('Cédula');
      const userTelInput = getByLabelText('Teléfono');
      const userAdressInput = getByLabelText('Dirección');
      const submitButton = getByText('Registrarse');
      
      //Insert all the required values
      fireEvent.change(userNameInput,{target:{value:'Jorge'}});
      fireEvent.change(userLastNameInput,{target:{value:'Perez'}});
      fireEvent.change(userPasswordInput,{target:{value:'papitas'}});
      fireEvent.change(userIdInput,{target:{value:'1058666148'}});
      fireEvent.change(userTelInput,{target:{value:'3158479160'}});
      fireEvent.change(userAdressInput,{target:{value:'Santa Elena'}});
      const yesRadioButton = getByLabelText('Si');
      
      //Click on "Si" to enable Agrocode´s input
      fireEvent.click(yesRadioButton);

      const agrocodeInput = getByLabelText('Codigo Agrocauca');
      fireEvent.change(agrocodeInput,{target:{value:'0'}});

      fireEvent.click(submitButton);
      await waitFor(() => {
        const errorMessage = getByText('Codigo de gremio incorrecto');
        expect(errorMessage).toBeInTheDocument();
      }); 
  }

  );
  test('Sign in with Agrocode but with empty fields (information)',async()=>{
    const { getByText, getByLabelText } = render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>  
    );
    const yesRadioButton = getByLabelText('Si');
    const submitButton = getByText('Registrarse');  
    //Click on "Si" to enable Agrocode´s input
    fireEvent.click(yesRadioButton);

    const agrocodeInput = getByLabelText('Codigo Agrocauca');
    //Enter a value in the code
    fireEvent.change(agrocodeInput,{target:{value:'0'}});
    //Click on "Registrarse"
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = getByText('Por favor ingrese toda la información solicitada');
      expect(errorMessage).toBeInTheDocument();
    }); 
  }
  );
  test('Sign in with empty fields (information)',async()=>{
    const { getByText } = render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>  
    );
    const submitButton = getByText('Registrarse');  
    //Click on "Registrarse"
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = getByText('Por favor ingrese toda la información solicitada');
      expect(errorMessage).toBeInTheDocument();
    }); 
  }
  );
  