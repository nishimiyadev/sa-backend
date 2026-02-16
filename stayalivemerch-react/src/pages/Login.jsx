// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

// Iconos simples (puedes usar lucide-react o react-icons)
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.47-2.13 4.68-1.26 1.2-3.27 2.08-6.19 2.08-4.74 0-8.67-3.83-8.67-8.57s3.93-8.57 8.67-8.57c2.51 0 4.39 1 5.8 2.35l2.36-2.36C17.8 1.63 15.3 0 12 0 5.37 0 0 5.37 0 12s5.37 12 12 12c3.5 0 6.55-1.15 8.94-3.5 2.4-2.35 3.69-5.46 3.69-8.94 0-.61-.05-1.21-.15-1.78H12.48z"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, "usuarios", res.user.uid);
      const snap = await getDoc(ref);
      const rol = snap.exists() ? snap.data().rol : "cliente";

      rol === "admin" ? navigate("/dashboard") : navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no existe.");
    }
  };

  return (
    <div className="min-h-screen bg-[#D1D1D1] flex items-center justify-center p-4">
      {/* Contenedor Principal Estilo Card */}
      <div className="bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden p-4 md:p-8 gap-8">
        {/* Columna Izquierda: Imagen Artística */}
        <div className="hidden md:block w-1/2 bg-[#E5E3E0] rounded-[30px] overflow-hidden relative min-h-[500px]">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
            alt="Arte Abstracto"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Aquí podrías poner tu logo flotante */}
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 md:px-12">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rotate-45"></div>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Stayalive
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Inicia sesión en tu cuenta
            </h2>
            <p className="text-gray-400 mt-2">
              ¡Bienvenido de nuevo! Introduce tus datos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-500">Recordar mi cuenta</span>
              </label>
              <a
                href="#"
                className="text-purple-700 font-semibold hover:underline"
              >
                Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5E3B9E] text-white py-3 rounded-full font-semibold text-lg hover:bg-[#4D3082] transition-colors shadow-lg shadow-purple-200"
            >
              Acceder
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-center mt-4 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">
                O continuar con
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-medium">
              <span className="mr-2"></span> Sign in with Apple
            </button>
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-medium">
              <GoogleIcon /> Sign in with Google
            </button>
          </div>

          <p className="text-center mt-8 text-gray-500">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-purple-700 font-bold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
