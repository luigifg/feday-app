import React, { useState } from "react";
import api from "../Axios";
import { future, fbg } from "../assets";
import FieldSignUp from "../Components/FieldSignUp";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const navigate = useNavigate();

  const passwordRequirements = [
    { test: (p) => p.length >= 8, text: "8+ caracteres" },
    { test: (p) => /\d/.test(p), text: "1 número" },
    { test: (p) => /[A-Z]/.test(p), text: "1 maiúscula" },
    { test: (p) => /[a-z]/.test(p), text: "1 minúscula" },
    { test: (p) => /[!@#$%^&*]/.test(p), text: "1 caractere especial" }
  ];

  const validatePassword = (password) => {
    return passwordRequirements.every(req => req.test(password));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setErrorMessage("A senha deve conter pelo menos 8 caracteres, incluindo números, letras maiúsculas e minúsculas e caracteres especiais.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }

    try {
      const response = await api.post("/user", formData);
      const loginResponse = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });
      
      if (loginResponse.status === 200) {
        const rawUser = await axios.get("https://api.futuredaybrasil.com.br/me", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        navigate("/events");
      } else {
        setErrorMessage("Erro ao fazer login após cadastro. Tente novamente.");
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        password: "",
        confirmPassword: "",
      });

      setSuccessMessage("Cadastro realizado com sucesso!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.errors?.[0] || "Erro ao criar sua conta. Tente novamente.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 lg:px-0"
      style={{
        backgroundImage: `url(${fbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="shadow-custom 2xl:max-w-screen-xl lg:max-w-screen-lg max-h-[97vh] bg-white rounded-3xl flex flex-1 mx-auto">
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div
            className="w-[80%] max-w-md aspect-[4/3] bg-center bg-no-repeat rounded-lg border-4"
            style={{
              backgroundImage: `url(${future})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className=" rounded-3xl lg:mx-10 lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <h1 className="text-2xl  xl:text-4xl font-extrabold text-n-14">
              Crie sua conta
            </h1>
            <p className="text-[12px] text-gray-500">
              Inscreva-se para o Future Day 2025
            </p>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center mb-4 text-sm">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center mb-4 text-sm">{successMessage}</div>
          )}

          <form className="w-full flex-1 mt-8" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div className="flex gap-4">
                <FieldSignUp
                  placeholder="Digite seu nome"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <FieldSignUp
                  placeholder="Digite seu telefone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <FieldSignUp
                placeholder="Digite seu email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="flex gap-4">
                <FieldSignUp
                  placeholder="Digite sua empresa"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <FieldSignUp
                  placeholder="Digite seu cargo"
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FieldSignUp
                      placeholder="Senha"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsPasswordFocused(true)}
                    />
                  </div>
                  <div className="flex-1">
                    <FieldSignUp
                      placeholder="Confirme sua senha"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Requisitos da senha em uma linha única */}
                <div className="flex flex-wrap gap-2 items-center justify-center bg-gray-50 p-2 rounded-md">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-xs ${
                        formData.password && req.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="mr-1">
                        {formData.password && req.test(formData.password) ? "✓" : "○"}
                      </span>
                      {req.text}
                      {index < passwordRequirements.length - 1 && <span className="ml-2">•</span>}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
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
                <span className="ml-3">Inscrever-se</span>
              </button>
              <p className=" text-xs text-gray-600 text-center">
                Já possui uma conta?{" "}
                <a href="/signin">
                  <span className="text-green-900 font-semibold">Entrar</span>
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;