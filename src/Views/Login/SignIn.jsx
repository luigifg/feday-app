import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../constants/Axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { future, fbg, futureGif } from "../../assets";
import FieldSignUp from "../../Components/design/FieldSignUp";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { email, password });
      // console.log("Login response:", response);

      if (response.status === 200) {
        setMessage("Login realizado com sucesso!");
        const rawUser = await api.get("/me");
        // console.log("Dados do usuário:", rawUser.data);
        navigate("/events");
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );
      setMessage("Erro ao realizar o login. Verifique suas credenciais.");
    }
  };

  return (
    <div
      className="h-[100vh] flex items-center justify-center px-5 lg:px-0"
      style={{
        backgroundImage: `url(${fbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative shadow-custom 2xl:max-w-screen-xl lg:max-w-screen-lg bg-white rounded-3xl flex flex-1 mx-auto">
        <a
          href="/"
          className="absolute left-6 md:left-8 p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-n-14"
          style={{ top: "1rem" }}
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="hidden md:inline text-base font-medium">Voltar</span>
        </a>

        <div className="flex-1 text-center hidden md:flex justify-center items-center">
          <div
            className="w-[80%] max-w-md aspect-[4/3] bg-center bg-no-repeat rounded-lg border-4"
            style={{
              backgroundImage: `url(${futureGif})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className="flex flex-col flex-1 rounded-3xl lg:mx-10 lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center mb-5 mt-8 md:mt-0">
            <h1 className="text-2xl mb-5 xl:text-4xl font-extrabold text-n-14">
              Área de Login
            </h1>
            <p className="text-[12px] text-gray-500">
              Bem-vindo ao Future Day 2025!
            </p>
          </div>

          {message && (
            <div
              className={`text-center mb-5 ${
                message.includes("sucesso") ? "text-green-600" : "text-red-600"
              }`}
            >
              <p>{message}</p>
            </div>
          )}

          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <FieldSignUp
                placeholder="Digite seu email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <FieldSignUp
                    placeholder="Senha"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="mt-5 tracking-wide font-semibold bg-green-700 text-gray-100 w-full py-4 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              >
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="ml-3">Entrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
