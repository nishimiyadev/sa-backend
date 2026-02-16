// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//permite usar este componente en otros archivos
export default function Dashboard() {
  //creando un estado para almacenar los productos, empieza en un array vacío y setProductos es la función para actualizar ese estado
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    descripcion: "",
    categoria: "",
    stock: "",
    activo: true,
  });
  const navigate = useNavigate(); // función para cambiar de página , es un hook de react-router-dom porque permite navegar entre rutas
  // Función para cargar productos desde Firestore
  const cargarProductos = async () => {
    const querySnapshot = await getDocs(collection(db, "productos")); //obtiene los documentos de la colección "productos"
    setProductos(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))); //mapear los documentos a un array de productos con id y datos
    //querySnapshot.docs → lista de documentos
    //d.id → id del documento
    //d.data() → datos del documento
    //setProductos → actualiza el estado de productos
    //({ id: d.id, ...d.data() }) → crea un objeto con id y datos del documento, Los junta en un solo objeto usando el operador spread (...)
    // los ... se usan para copiar las propiedades de un objeto a otro, en este caso se copia el id del documento y todos los campos del documento (nombre, precio, imagen) en un nuevo objeto que representa un producto.
    //...d.data() es una forma de decir mete acá todo lo que venga de d.data(), que es un objeto con las propiedades del producto (nombre, precio, imagen). Entonces el resultado final es un nuevo objeto que tiene la forma { id: "123", nombre: "Camiseta", precio: 50, imagen: "url" } por ejemplo.
  };

  useEffect(() => {
    //cargar productos al montar el componente
    cargarProductos();
  }, []); //el array vacío [] indica que se ejecuta solo una vez al montar solo al iniciar

  const agregarProducto = async (e) => {
    //agregar nuevo producto a Firestore
    e.preventDefault(); //evita que el formulario recargue la página
    if (!nuevo.nombre || !nuevo.precio || !nuevo.imagen || !nuevo.stock) return; //valida que los campos no estén vacíos
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nuevo.nombre,
        precio: Number(nuevo.precio),
        imagen: nuevo.imagen,
        descripcion: nuevo.descripcion || "",
        categoria: nuevo.categoria || "",
        stock: Number(nuevo.stock),
        activo: true,
        createdAt: serverTimestamp(),
      });

      setNuevo({
        nombre: "",
        precio: "",
        imagen: "",
        descripcion: "",
        categoria: "",
        stock: "",
        activo: true,
      });

      cargarProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    //eliminar producto de Firestore
    await deleteDoc(doc(db, "productos", id)); //elimina el documento con el id especificado de la colección "productos"
    cargarProductos(); //recarga la lista de productos
  };

  const handleLogout = async () => {
    //cerrar sesión
    await signOut(auth); //cierra la sesión del usuario actual
    navigate("/login"); //redirecciona a la página de login
  };

  return (
    <div className="p-6">
      {" "}
      // contenedor principal con padding
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Panel Administrador 🖤</h2>
        <button // botón de cerrar sesión
          onClick={handleLogout}
          className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Cerrar sesión
        </button>
      </header>
      <form onSubmit={agregarProducto} className="flex gap-2 mb-6">
        {" "}
        // formulario para agregar nuevo producto
        <input
          // input para el nombre del producto
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre} // valor del input vinculado al estado, osea muestra el valor actual
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} // actualiza el estado al cambiar el input,
          className="border p-2 rounded w-40" // estilos del input
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          className="border p-2 rounded w-28"
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={nuevo.imagen}
          onChange={(e) => setNuevo({ ...nuevo, imagen: e.target.value })}
          className="border p-2 rounded w-60"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          className="border p-2 rounded w-60"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={nuevo.categoria}
          onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
          className="border p-2 rounded w-40"
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={(e) =>
            setNuevo({ ...nuevo, stock: Number(e.target.value) })
          }
          className="border p-2 rounded w-24"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 rounded hover:bg-gray-800"
        >
          Agregar
        </button>
      </form>
      <ul>
        {productos.map(
          (
            p, // lista de productos
          ) => (
            <li
              key={p.id} // clave única para cada producto
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {p.nombre} - S/ {p.precio} | Stock: {p.stock} |
                {p.activo ? "Activo" : "Inactivo"}
              </span>
              <button
                onClick={() => eliminarProducto(p.id)} // botón para eliminar producto
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
