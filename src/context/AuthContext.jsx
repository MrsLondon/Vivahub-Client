import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log("Stored user:", storedUser);
    console.log("Stored token:", storedToken);
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("Current user state:", user);
    console.log("Is authenticated:", !!user);
  }, [user]);

  const login = (userData) => {
    console.log("Login called with:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    console.log("Logout called");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  console.log("AuthContext value:", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
