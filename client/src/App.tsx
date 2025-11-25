import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import CalculationTree from './components/CalculationTree';
import NewCalculation from './components/NewCalculation';
import { User, Calculation, calculationAPI } from './api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    try {
      setLoading(true);
      const data = await calculationAPI.getTree();
      setCalculations(data);
    } catch (error) {
      console.error('Failed to load calculations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: { token: string; user: User }) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleNewCalculation = (calculation: Calculation) => {
    setCalculations([calculation, ...calculations]);
  };

  const handleNewOperation = (calculation: Calculation) => {
    setCalculations([calculation, ...calculations]);
  };

  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="app">
      <header>
        <h1>🔢 Calculation Tree</h1>
        <div className="user-info">
          {user ? (
            <>
              <span>Welcome, {user.username}!</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span>Viewing as guest</span>
              <button className="btn btn-primary" onClick={() => setShowAuth(true)}>
                Login / Register
              </button>
            </>
          )}
        </div>
      </header>

      {showAuth && !user && (
        <div style={{ marginBottom: '20px' }}>
          <Auth onLogin={(userData) => {
            handleLogin(userData);
            setShowAuth(false);
          }} />
        </div>
      )}

      {user && <NewCalculation onCalculationCreated={handleNewCalculation} />}

      {loading ? (
        <div className="loading">Loading calculations...</div>
      ) : (
        <CalculationTree
          calculations={calculations}
          onOperationAdded={handleNewOperation}
          isLoggedIn={!!user}
        />
      )}
    </div>
  );
};

export default App;
