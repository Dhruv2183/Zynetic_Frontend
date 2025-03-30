const fetchProducts = async () => {
    const response = await fetch("/api/products");
    return response.json();
  };
  
  export default fetchProducts;
  
  export {}; 
  