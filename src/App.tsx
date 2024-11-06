import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Home from './components/Home';


const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para el Login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta para el Registro */}
          <Route path="/register" element={<Register />} />

          {/* Ruta para la Perfil */}
          <Route path="/profile" element={<Profile />} />

          {/* Ruta por defecto (Login) */}
          <Route path="/" element={<Login />} />

          {/* Ruta para la Home */}
          <Route path="/home" element={<Home />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
