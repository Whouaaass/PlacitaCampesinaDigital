import { FC, ReactNode, useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  token: "",
  user: "", /*!< User  */
  rol: "", /*!< Rol */
  loginAction: async (data: loginData) => {},
  logOut: () => { },
  verify: async () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [token, setToken] = useState(localStorage.getItem("site") || "");  
  const [rol, setRol] = useState(localStorage.getItem("rol") || "");
  const navigate = useNavigate();
  
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
    throw new Error(res.message);

  };
  const verify = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios/verify", {
        headers: {
          token: `session=${token}`,
        },
      });
      if (response.status === 401) {
        logOut();
      } else {
        return response.json();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    if (!token)
      return;
    setUser("");
    setToken("");
    setRol("");
    localStorage.removeItem("user");
    localStorage.removeItem("site");
    localStorage.removeItem("rol");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, rol, loginAction, logOut, verify }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export interface loginData {
  id: string;
  password: string;
}


export const useAuth = () => {
  return useContext(AuthContext);
};