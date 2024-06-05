/**
 * @file AuthProvider.tsx
 * @brief Controla la autorización y autenticación de los usuarios.
 */

import { FC, ReactNode, useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Interface representing the authentication context.
 */
interface AuthContextInterface {
  token: string;
  user: string; /*!< User */
  userName: string; /*!< Username */
  rol: string; /*!< Rol */
  loginAction: (data: loginData) => Promise<any>;
  logOut: () => void;
  verify: () => Promise<any>;
}

const AuthContext = createContext<AuthContextInterface>({
  token: "",
  user: "",
  userName: "",
  rol: "",
  loginAction: async (data: loginData) => {},
  logOut: () => {},
  verify: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Component that provides authentication context to its children.
 */
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [rol, setRol] = useState(localStorage.getItem("rol") || "");
  const navigate = useNavigate();

  /**
   * Function to perform login action.
   * @param data - The login data.
   * @returns A promise that resolves to the login response.
   */
  const loginAction = async (data: loginData) => {    
    const response = await fetch("http://localhost:3000/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    if (res.data) {
      setUser(res.data.userid);
      setRol(res.data.rol);
      setToken(res.token);
      localStorage.setItem("user", res.data.userid);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("site", res.token);
      navigate("/market");
    }
    return res;
  };

  /**
   * Function to verify the authentication token.
   * @returns A promise that resolves to the verification response.
   */
  const verify = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios/verify", {
        headers: {
          token: `session=${token}`,
        },
      });
      if (response.status !== 200) {
        return logOut();
      }
      const res = await response.json();
      setUserName(`${res.user.USUNOMBRE} ${res.user.USUAPELLIDO}`);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Function to perform logout action.
   */
  const logOut = () => {
    if (!token) return;
    setUser("");
    setToken("");
    setRol("");
    localStorage.removeItem("user");
    localStorage.removeItem("site");
    localStorage.removeItem("rol");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, userName, rol, loginAction, logOut, verify }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

/**
 * Interface representing the login data.
 */
export interface loginData {
  id: string;
  password: string;
}

/**
 * Hook to access the authentication context.
 * @returns The authentication context.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};