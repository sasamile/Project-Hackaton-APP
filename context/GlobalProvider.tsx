import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

interface User {
  id: string;
  name: string;
  email: string;
}

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe ser usado dentro de un GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await getCurrentUser();
      if (res) {
        setIsLogged(true);
        setUser({
          id: res.$id,
          name: res.username, // Ajustado para coincidir con tu estructura de datos
          email: res.email,
        });
      } else {
        setIsLogged(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Auth check error:", error);
      setIsLogged(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <GlobalContext.Provider value={{ isLogged, setIsLogged, user, setUser, loading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;