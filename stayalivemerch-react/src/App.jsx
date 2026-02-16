// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
//hook
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// 📄 Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import MyOrders from "./pages/MisOrdenes";

// 🧩 Componentes
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";

import "./App.css";
// 🔹 Componente de carga mientras Firebase responde
function Loading() {
  return <p style={{ textAlign: "center", padding: "40px" }}>Cargando...</p>;
}

function App() {
  // ==============================
  //  ESTADOS GLOBALES
  // ==============================

  //los estados principales de la app aquí
  const [user, setUser] = useState(null); // usuario autenticado
  const [role, setRole] = useState(null); // rol del usuario
  const [loading, setLoading] = useState(true); // estado de carga, evita que la app se rompa mientras carga

  // 🛒 Estado del carrito (persistido en localStorage)
  const [cart, setCart] = useState(() => {
    //Busca si existe "cart" en localStorage -Si existe → lo convierte a objeto -Si no → empieza vacío
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Lógica de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      //Detecta si el usuario entra o sale
      setUser(currentUser); // Guarda el usuario en el estado
      if (currentUser) {
        //Si hay usuario logueado…
        //Verificar si es admin en Firestore
        //Busca en Firestore:
        //Colección: usuarios
        //Documento: ID del usuario
        const ref = doc(db, "usuarios", currentUser.uid);
        const snap = await getDoc(ref);
        //Si existe:
        //Lee el rol
        //👉 Si no existe:
        //Asume que es cliente
        setRole(snap.exists() ? snap.data().rol : "cliente");
      } else {
        setRole(null);
      }
      setLoading(false); // termina la carga
    });
    return () => unsubscribe(); // Limpia el listener al desmontar
  }, []);

  //  Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
  };
  // ==============================
  // 🛒 LÓGICA DEL CARRITO
  // ==============================
  //  Funciones del carrito(agregar, eliminar,vaiar,)
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.id === product.id);

      // 🚨 Si no hay stock, no hacer nada
      if (product.stock === 0) {
        return prevCart;
      }

      if (existing) {
        // 🚨 No permitir superar stock
        if (existing.cantidad >= product.stock) {
          return prevCart;
        }

        return prevCart.map((p) =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p,
        );
      }

      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.cantidad >= item.stock) return item;
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      }),
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  // 🔄 Mientras valida sesión
  if (loading) return <Loading />;

  // ==============================
  // 🏗 LAYOUT PRINCIPAL
  // ==============================

  return (
    //activa las rutas
    <Router>
      <div className="app-layout">
        {/* Navbar visible en toda la app */}
        <Navbar
          cartCount={totalItems}
          user={user}
          handleLogout={handleLogout}
        />

        {/* Contenedor central del contenido */}
        <main className="main-content">
          <Routes>
            {/* Tienda principal localhost:5173/ */}

            <Route
              path="/"
              element={<Home addToCart={addToCart} />} // pasamos la función para agregar al carrito
            />

            {/*  Detalle producto */}
            <Route
              path="/producto/:id"
              element={<ProductDetail addToCart={addToCart} />}
            />

            {/* Carrito */}
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                />
              }
            />

            {/* Registro */}
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            {/* Login (solo para admin) 
        Si NO hay usuario → login
        Si ya está logueado → dashboard */}
            <Route
              //
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />

            {/* Mis órdenes (solo usuarios logueados) */}
            <Route
              path="/mis-ordenes"
              element={user ? <MyOrders /> : <Navigate to="/login" />}
            />

            {/* Dashboard (solo admin esto esta protegido no podra entrar un cliente normal) */}
            <Route
              //solo entra si esta logueado , es admin
              path="/dashboard"
              element={
                user && role === "admin" ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Ruta por defecto  cuando va un /loquesea */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
    //Si la ruta no existe → vuelve a la tienda
  );
}

export default App;
