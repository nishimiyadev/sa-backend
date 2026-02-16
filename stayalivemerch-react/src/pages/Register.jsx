import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Guardar como cliente
    await setDoc(doc(db, "usuarios", res.user.uid), {
      rol: "cliente",
      email,
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Registrarse</button>
    </form>
  );
}
