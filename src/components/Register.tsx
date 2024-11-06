import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api'; // Importar el servicio de autenticación
import '../styles/Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Para redirigir al usuario después del registro

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reiniciar el error en cada submit

    try {
      // Llamar al servicio de registro
      const response = await userService.createUser(formData);
      console.log('Usuario registrado:', response.data);

      // Redirigir al usuario a la página de login
      navigate('/login');
    } catch (err) {
      setError('Error al registrar usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        <div className="login-redirect">
          <p>Already have an account?</p>
          <a href="/login">LOGIN HERE</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
