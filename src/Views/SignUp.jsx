import React, { useState } from "react";
import api from "../Axios"; // Importe a instância do Axios configurada
import { future, fbg } from "../assets";
import inputField from "../Components/inputField.jsx";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  // Estados para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Para exibir mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Para exibir mensagens de sucesso

  const navigate = useNavigate(); // Hook para redirecionar o usuário

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para enviar os dados do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }

    try {
      const response = await api.post("/user", formData);
      console.log("Cadastro realizado com sucesso:", response.data);

      // Após o cadastro, fazer o login automaticamente
      const loginResponse = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });
      
      if (loginResponse.status === 200) {
        // Armazenar o token em um cookie (dependendo da configuração da API, você pode já ter o cookie configurado pelo backend)
        const rawUser = await api.get("/me"); // Endpoint para pegar dados do usuário
        console.log("Dados do usuário:", rawUser.data);

        // Redirecionar para a página de eventos
        navigate("/events");
      } else {
        setErrorMessage("Erro ao fazer login após cadastro. Tente novamente.");
      }

      // Exemplo: limpar o formulário após o envio bem-sucedido
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        password: "",
        confirmPassword: "",
      });

      setSuccessMessage("Cadastro realizado com sucesso!"); // Mensagem de sucesso
      setErrorMessage(""); // Limpar mensagens de erro, se houver
    } catch (error) {
      console.error(
        "Erro ao enviar os dados:",
        error.response?.data || error.message
      );
      setErrorMessage("Erro ao criar sua conta. Tente novamente."); // Mensagem de erro
      setSuccessMessage(""); // Limpar a mensagem de sucesso, se houver
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
      <div className="shadow-custom 2xl:max-w-screen-xl lg:max-w-screen-lg bg-white rounded-3xl flex flex-1 mx-auto">
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div
            className="w-[80%] max-w-md aspect-[4/3] bg-center bg-no-repeat rounded-lg border-4"
            style={{
              backgroundImage: `url(${future})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className="flex flex-col flex-1 rounded-3xl lg:mx-10 lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center mb-5">
            <h1 className="text-2xl xl:text-4xl font-extrabold text-n-14">
              Crie sua conta
            </h1>
            <p className="text-[12px] text-gray-500">
              Inscreva-se para o Future Day 2025
            </p>
          </div>

          {/* Mensagens de erro ou sucesso */}
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-center mb-4">
              {successMessage}
            </div>
          )}

          <form className="w-full flex-1 mt-8" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div className="flex gap-4">
                <inputField
                  placeholder="Digite seu nome"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <inputField
                  placeholder="Digite seu telefone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <inputField
                placeholder="Digite seu email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="flex gap-4">
                <inputField
                  placeholder="Digite sua empresa"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <inputField
                  placeholder="Digite seu cargo"
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4">
                <inputField
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <inputField
                  placeholder="Confirme sua senha"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
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
              <p className="mt-6 text-xs text-gray-600 text-center">
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
