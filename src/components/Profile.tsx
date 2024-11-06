import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { userService, productService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Profile.css';
import '../styles/SuccessModal.css';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;
      fetchUserData(userId, token);
      fetchFavoriteProducts(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchUserData = async (userId: string, token: string) => {
    try {
      const response = await userService.getUserProfile(userId, token);
      setUserData(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      setErrorMessage('No se pudo cargar la información del usuario.');
    }
  };

  const fetchFavoriteProducts = async (token: string) => {
    try {
      const response = await productService.getFavoriteProducts(token);
      const formattedProducts = response.data.map((product: any) => ({
        id: product.PRODUCT_ID,
        name: product.PRODUCT_NAME,
        price: product.PRODUCT_PRICE,
        url: product.PRODUCT_URL,
        image_url: product.PRODUCT_IMAGE_URL,
      }));
      setFavoriteProducts(formattedProducts);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los productos favoritos.');
    }
  };

  const handleRemoveFavorite = async (ID: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await productService.removeProductFromFavorites(ID, token);
        setFavoriteProducts((prevFavorites) =>
          prevFavorites.filter((product) => product.id !== ID)
        );
        setSuccessMessage('Producto eliminado de favoritos con éxito.');
        setShowSuccessModal(true);
        // Ocultar la modal después de 3 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } catch (error) {
        setErrorMessage('No se pudo eliminar el producto de los favoritos.');
      }
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('info del token: ', decodedToken)
        const userId = decodedToken.userId;
        await userService.updateUserProfile(userId, { name, email }, token);
        setSuccessMessage('Perfil actualizado con éxito.');
        setShowSuccessModal(true);
        // Ocultar la modal después de 3 segundos
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      } catch (error) {
        setErrorMessage('Error al actualizar el perfil.');
      }
    }
  };

  const handleResetPassword = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setErrorMessage('El usuario no está autenticado');
      return;
    }
  
    // Decodificar el token para obtener el email del usuario
    const decodedToken: any = jwtDecode(token);
    console.log('info del token: ', decodedToken)
    const email = decodedToken.email;
  
    if (!email) {
      setErrorMessage('No se pudo obtener el correo del usuario');
      return;
    }
  
    try {
      // Paso 1: Solicitar el token de reseteo de contraseña
      const resetTokenResponse = await authService.requestResetPassword(email);
      const resetToken = resetTokenResponse.data.resetToken; 
  
      console.log('Reset Token Response:', resetTokenResponse);
  
      // Paso 2: Enviar la nueva contraseña usando el token recibido
      await authService.resetPassword({ token: resetToken, newPassword });
      setSuccessMessage('Contraseña cambiada con éxito. Serás redirigido al login en 5 segundos.');
      setShowSuccessModal(true);

      // Ocultar la modal y redirigir después de 5 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 5000);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error Response:', error.response);
        setErrorMessage(`Error al cambiar la contraseña: ${error.response?.data?.message}`);
      } else {
        console.error('Error:', error);
        setErrorMessage('Error desconocido al cambiar la contraseña.');
      }
    }
  };

  const SuccessModal: React.FC<{ message: string }> = ({ message }) => {
    return (
      <div className="success-modal">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <header className="home-header">
        <div className="logo"><h1>Easy Market</h1></div>
        <nav className="navbar">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <div className="content">
        <section className="favorites-section">
          <h2>Productos Favoritos</h2>
          <div className="favorites-container">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="favorite-product-card">
                <img src={product.image_url} alt={product.name} className="product-image" />
                <h4>{product.name}</h4>
                <p>Precio: ${product.price}</p>
                <a href={product.url} target="_blank" rel="noopener noreferrer">Ver producto</a>
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="remove-button"
                >
                  Eliminar de Favoritos
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2>Perfil del Usuario</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {userData ? (
            <div className="user-info">
              <p><strong>Nombre:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
          ) : (
            <p>Cargando información del usuario...</p>
          )}
          <div className="user-info">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleProfileUpdate}>Actualizar Perfil</button>
          </div>

          <h3>Cambiar Contraseña</h3>
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Cambiar Contraseña</button>

          {showSuccessModal && <SuccessModal message={successMessage} />}
          {errorMessage && <p className="error">{errorMessage}</p>}
        </section>
      </div>
      {/* Footer */}
      <footer className="home-footer">
        <p>Easy Market hecho por Arbey Orozco &copy; 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );

};

export default Profile;
