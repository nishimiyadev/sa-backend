import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import "./Home.css";
import CollectionList from "../components/CollectionList";

export default function Home({ addToCart }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const collections = [
    {
      slug: "nuevos-lanzamientos",
      titulo: "Nuevos lanzamientos",
      imagen:
        "https://i.pinimg.com/736x/6f/3f/0f/6f3f0f4067719ed573fd38b257f27f0d.jpg",
    },
    {
      slug: "ediciones-limitadas",
      titulo: "Ediciones limitadas",
      imagen:
        "https://i.pinimg.com/736x/8c/0f/2c/8c0f2c0b4e1e5f8a7b2e1c3d4e5f6a7b.jpg",
    },
    {
      slug: "lo-mas-vendido",
      titulo: "Lo más vendido",
      imagen:
        "https://i.pinimg.com/736x/6f/3f/0f/6f3f0f4067719ed573fd38b257f27f0d.jpg",
    },
    {
      slug: "ofertas",
      titulo: "Ofertas",
      imagen:
        "https://i.pinimg.com/736x/6f/3f/0f/6f3f0f4067719ed573fd38b257f27f0d.jpg",
    },
    {
      slug: "populares",
      titulo: "Más vendidos",
      imagen:
        "https://i.pinimg.com/736x/6f/3f/0f/6f3f0f4067719ed573fd38b257f27f0d.jpg",
    },
  ];

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const q = query(
          collection(db, "productos"),
          where("activo", "==", true),
          orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(q);

        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  if (loading) {
    return <p className="empty-message">Cargando productos...</p>;
  }

  if (productos.length === 0) {
    return <p className="empty-message">No hay productos disponibles</p>;
  }

  const destacados = productos.slice(0, 6);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>STAYALIVE</h1>
          <p>Streetwear minimalista para quienes viven intenso.</p>
          <button>Comprar ahora</button>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="section">
        <h2>Destacados</h2>
        <Carousel products={destacados} addToCart={addToCart} />
      </section>

      {/* 👉 COLLECTION LIST */}
      <CollectionList collections={collections} />

      {/* TODOS LOS PRODUCTOS */}
      <section className="section">
        <h2>Todos los productos</h2>

        <div className="products-grid">
          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              product={producto}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      {/* BANNER FINAL */}
      <section className="promo-banner">
        <h3>Envío gratis en compras mayores a S/150</h3>
      </section>
    </div>
  );
}
