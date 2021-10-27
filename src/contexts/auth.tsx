import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthProviderProps = {
  children: ReactNode;
}

export type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInURL: string;
  signOut: () => void;
}

type AuthResponse = {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData); 

const GITHUB_CLIENT_ID = '1323593476a10d38d44d';
const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${GITHUB_CLIENT_ID}`;

const setToken = (token: string) => {
  api.defaults.headers.common.authorization = `Bearer ${token}`;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  
  async function signIn(githubCode: string) {
    try {
      const response = await api.post<AuthResponse>('/authenticate', {
        code: githubCode,
      });

      const { token, user } = response.data;

      localStorage.setItem('@dowhile:token', token);

      setToken(token);

      setUser(user);
    } catch (err) {
      console.log(err);
      alert('Failed to signIn with Github. Try again later.')
    }
  }

  async function signOut() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      setToken(token);

      api.get<User>('/profile').then(response => {
        const { data } = response;

        setUser(data);
      }).catch(err => {
        console.log(err);
        alert('Failed to load user data. Try again later.');
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      signIn(githubCode);

      window.history.pushState({}, '', urlWithoutCode);
    }
  }, [])

  return (
    <AuthContext.Provider 
      value={{
        signInURL,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export {
  AuthProvider,
  useAuth
};