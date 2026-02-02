import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const backendURL = "http://localhost:5000";

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
  
    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
          value={{ user, setUser, token, setToken, logout, backendURL}}>
          {children}
        </AuthContext.Provider>
    );
}