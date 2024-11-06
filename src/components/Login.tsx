import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; // Importar el servicio de autenticación
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // Función para manejar el submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reiniciar el error en cada submit

    try {
      // Llamar al servicio de autenticación
      const response = await authService.login({ email, password });
      const { token } = response.data;

      // Guardar el token en el localStorage (o en el estado global, según prefieras)
      localStorage.setItem('token', token);

      navigate('/home');
      console.log('Login exitoso:', token);
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Guardar el email en el estado
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Guardar la contraseña en el estado
            />
            <label>Password</label>
          </div>
          <button type="submit" className="submit-btn">
            Ingresar
          </button>
        </form>
        <div className="register-redirect">
          <p>Don't have an account?</p>
          <a href="/register">REGISTER HERE</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
