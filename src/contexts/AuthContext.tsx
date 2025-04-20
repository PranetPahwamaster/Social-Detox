
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: "email" | "google" | "facebook";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function (in real app, would call an API)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo validation (would be done on server in real app)
      if (email === "demo@example.com" && password === "password") {
        const user = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
          provider: "email",
        } as User;
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
        toast.success("Welcome back!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: "google-user-1",
        name: "Google User",
        email: "google@example.com",
        avatar: "https://ui-avatars.com/api/?name=G+U&background=4285F4&color=fff",
        provider: "google",
      } as User;
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("Welcome to NeuroNest!");
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: "facebook-user-1",
        name: "Facebook User",
        email: "facebook@example.com",
        avatar: "https://ui-avatars.com/api/?name=F+U&background=1877F2&color=fff",
        provider: "facebook",
      } as User;
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("Welcome to NeuroNest!");
    } catch (error) {
      toast.error("Facebook login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: `user-${Date.now()}`,
        name,
        email,
        provider: "email",
      } as User;
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
