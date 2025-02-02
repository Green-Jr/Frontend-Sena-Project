import axios from 'axios';

// Crear la instancia de Axios con la URL base del backend
const api = axios.create({
  baseURL: 'https://backend-sena-project.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de autenticación
export const authService = {
  // Autenticación
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),

  // Solicitar cambio de contraseña
  requestResetPassword: (email: string) =>
    api.post('/auth/request-reset-password', { email }),

  // Restablecer contraseña
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.put('/auth/reset-password', data),
};

// Servicios de usuarios
export const userService = {
  createUser: (data: { name: string; email: string; password: string }) =>
    api.post('/users', data),

  // Actualizar información del usuario
  updateUserProfile: (userId: string, data: { name: string; email: string }, token: string) =>
    api.put(`/users/${userId}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  // Obtener información del usuario
  getUserProfile: (userId: string, token: string) =>
    api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

// Servicios de productos
export const productService = {
  addProductToFavorites: (productData: any, token: string) =>
    api.post('/products/favorites', productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getFavoriteProducts: (token: string) =>
    api.get('/products/Getfavorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  removeProductFromFavorites: (productId: string, token: string) =>
    api.delete(`/products/favorites/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
};

export default api;
