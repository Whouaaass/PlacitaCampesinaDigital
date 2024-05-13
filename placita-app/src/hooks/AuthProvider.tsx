import { FC, ReactNode, useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  token: "",
  user: null,
  loginAction: (data: loginData) => { },
  logOut: () => { },
  verify: async () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data: loginData) => {
    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        navigate("/market");
        return "ok";
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
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
    setUser(null);    
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, verify }}>
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