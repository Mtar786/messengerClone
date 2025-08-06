import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Messenger from './pages/Messenger';

/**
 * Root component of the client app.
 * It maintains a minimal authentication state by reading user info from localStorage.
 * When the user is logged in, the messenger view is shown; otherwise they are
 * redirected to login.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Messenger currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login setCurrentUser={setCurrentUser} />
            )
          }
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/" replace /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;