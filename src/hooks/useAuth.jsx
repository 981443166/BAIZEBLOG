import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, getStoredUser, logout as authLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的用户
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // 验证 token 并获取最新用户信息
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      })
      .catch(() => {
        // Token 无效，已自动清除
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}
