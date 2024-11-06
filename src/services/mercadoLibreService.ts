// services/mercadoLibreService.ts
export const searchProducts = async (query: string) => {
    const url = `https://api.mercadolibre.com/sites/MLA/search?q=${query}&limit=20`; // Limitar a 20 productos
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.results) {
        return data.results;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };
  