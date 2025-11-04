

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Load from localStorage on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedRole && savedToken) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  //  Login (store everything)
  const login = ({ user, role, token }) => {
    setUser(user);
    setRole(role);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
  };

  //  Logout (clear everything)
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

