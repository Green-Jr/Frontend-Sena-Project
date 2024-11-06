import React, { useState } from 'react';
import { searchProducts } from '../services/mercadoLibreService';
import { productService } from '../services/api'; // Importamos el servicio de productos
import { useNavigate } from 'react-router-dom'; 
import '../styles/Home.css';
import '../styles/ProductsStyles.css';

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null); // Error de favoritos
  const navigate = useNavigate(); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const results = await searchProducts(query);
    if (results.length > 0) {
      setProducts(results);
    } else {
      setError('No se encontraron productos.');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/Login'); 
  };

  const handleAddToFavorites = async (product: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFavoriteError('Debes estar autenticado para agregar productos a favoritos.');
      return;
    }

    const productData = {
      name: product.title, 
      price: product.price,
      url: product.permalink, 
      image_url: product.thumbnail, 
    };

    try {
      await productService.addProductToFavorites(productData, token); 
      alert('Producto agregado a favoritos');
    } catch (error) {
      setFavoriteError('No se pudo agregar el producto a favoritos.');
    }
  };

  return (
    <div className="home-container">
      {/* Encabezado */}
      <header className="home-header">
        <div className="logo">
          <h1>Easy Market</h1>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <a href="/profile">Perfil</a>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Cuerpo principal */}
      <main>
        <h2>Busca productos en línea</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar producto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {loading && <p>Cargando productos...</p>}
        {error && <p>{error}</p>}
        {favoriteError && <p className="error">{favoriteError}</p>} {/* Mostrar errores */}

        <div className="products-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.thumbnail} alt={product.title} className="product-image" />
              <h3>{product.title}</h3>
              <p>Precio: ${product.price}</p>
              <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                Ver producto
              </a>
              {/* Botón para agregar a favoritos */}
              <button onClick={() => handleAddToFavorites(product)}>
                Agregar a Favoritos
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Easy Market hecho por Arbey Orozco &copy; 2024. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
