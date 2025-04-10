import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { fbg, futureGif } from "../../assets";
import FieldSignUp from "../../Components/design/FieldSignUp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importando o novo hook

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    confirmEmail: "",
    company: "",
    position: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth();

  // Opções para o campo de gênero
  const genderOptions = [
    { value: "", label: "Selecione seu gênero" },
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
  ];

  const passwordRequirements = [
    { test: (p) => p.length >= 8, text: "8+ caracteres" },
    { test: (p) => /\d/.test(p), text: "1 número" },
    { test: (p) => /[A-Z]/.test(p), text: "1 maiúscula" },
    { test: (p) => /[a-z]/.test(p), text: "1 minúscula" },
    { test: (p) => /[!@#$%^&*]/.test(p), text: "1 caractere especial" },
  ];

  const validatePassword = (password) => {
    return passwordRequirements.every((req) => req.test(password));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para formatar telefone com suporte para números internacionais
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    // Remove todos os caracteres não numéricos, exceto "+"
    const cleanPhone = value.replace(/[^\d+]/g, '');
    
    // Se já for um número internacional (começando com +), mantenha o formato
    if (cleanPhone.startsWith('+')) {
      return cleanPhone;
    }
    
    // Se o número for maior que 11 dígitos, converta para formato internacional
    if (cleanPhone.length > 11) {
      return `+${cleanPhone}`;
    }
    
    // Para números brasileiros (até 11 dígitos), aplique a formatação brasileira
    if (cleanPhone.length <= 2) {
      return `(${cleanPhone}`;
    }
    if (cleanPhone.length <= 7) {
      return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2)}`;
    }
    return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(
      2,
      7
    )}-${cleanPhone.substring(7, 11)}`;
  };

  // Função para validar telefone (brasileiro ou internacional)
  const validatePhoneNumber = (phone) => {
    if (!phone) return false;
    
    // Remove todos os caracteres não numéricos, exceto "+"
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Telefone internacional (deve começar com + e ter no mínimo 8 dígitos)
    if (cleanPhone.startsWith('+')) {
      return cleanPhone.length >= 9; // + e pelo menos 8 dígitos
    }
    
    // Telefone brasileiro (deve ter 10 ou 11 dígitos - com ou sem o 9)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  // Modifique o handleChange para incluir a formatação de telefone
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Aplica a formatação ao telefone
      setFormData({ ...formData, [name]: formatPhoneNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Limpar mensagens de erro ao digitar
    if (name === "email" || name === "confirmEmail") {
      setEmailError("");
    }
    if (name === "gender") {
      setGenderError("");
    }
    if (name === "phone") {
      setPhoneError("");
    }
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpar mensagens anteriores
    setErrorMessage("");
    setSuccessMessage("");
    setEmailError("");
    setGenderError("");
    setPhoneError("");
    
    // Verificar campos obrigatórios básicos
    const requiredFields = {
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      company: "Empresa",
      position: "Cargo",
      gender: "Gênero",
      password: "Senha",
      confirmPassword: "Confirmação de senha"
    };
    
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        setErrorMessage(`O campo ${label} é obrigatório.`);
        return;
      }
    }

    // Validar formato do email
    if (!validateEmail(formData.email)) {
      setEmailError("Formato de e-mail inválido.");
      return;
    }

    // Validar confirmação de email
    if (formData.email !== formData.confirmEmail) {
      setEmailError("Os emails não coincidem!");
      return;
    }

    // Validar telefone
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError("Formato de telefone inválido.");
      return;
    }

    // Validar senha
    if (!validatePassword(formData.password)) {
      setErrorMessage(
        "A senha deve conter pelo menos 8 caracteres, incluindo números, letras maiúsculas e minúsculas e caracteres especiais."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }

    try {
      // Remover campos não necessários para a API
      const { confirmEmail, confirmPassword, ...dataToSubmit } = formData;

      // Limpar formatação do telefone antes de enviar
      if (dataToSubmit.phone) {
        dataToSubmit.phone = dataToSubmit.phone.replace(/\D/g, "");
      }

      // Usar a função register do contexto
      const result = await register(dataToSubmit);
      
      if (result && result.success) {
        setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");
        
        // Limpar formulário
        setFormData({
          // Resetar campos
        });

        navigate("/events");
      } else {
        setErrorMessage(result?.error || "Erro ao criar sua conta. Tente novamente.");
      }
    } catch (error) {
      console.log("Erro ao realizar o cadastro:", error);
      setErrorMessage("Erro ao criar sua conta. Tente novamente.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-5 lg:px-0"
      style={{
        backgroundImage: `url(${fbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative shadow-custom 2xl:max-w-screen-xl lg:max-w-screen-lg max-h-[130vh] 2xl:max-h-[125vh] bg-white rounded-3xl flex flex-1 mx-auto">
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
        <div className=" rounded-3xl lg:mx-10 lg:w-1/2 xl:w-5/12 p-6 sm:p-11 xl:p-8 2xl:p-12">
          <div className="text-center">
            <h1 className="text-2xl  xl:text-4xl font-extrabold text-n-14">
              Crie sua conta
            </h1>
            <p className="text-[12px] text-gray-500">
              Inscreva-se para o Future Day 2025
            </p>
          </div>

          <form className="w-full flex-1 mt-8" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-xs flex flex-col gap-4">
              <div className="flex gap-4">
                <FieldSignUp
                  placeholder="Digite seu nome"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FieldSignUp
                  placeholder="Digite seu telefone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              {phoneError && (
                <div className="text-red-500 text-xs text-center">
                  {phoneError}
                </div>
              )}

              {/* Campo de email e confirmação de email */}
              <div className="space-y-4">
                <FieldSignUp
                  placeholder="Digite seu email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FieldSignUp
                  placeholder="Confirme seu email"
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  required
                />
                {emailError && (
                  <div className="text-red-500 text-xs text-center">
                    {emailError}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <FieldSignUp
                  placeholder="Nome da sua empresa"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
                <FieldSignUp
                  placeholder="Digite seu cargo"
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <FieldSignUp
                isSelect={true}
                options={genderOptions}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              />
              {genderError && (
                <div className="text-red-500 text-xs ml-1 -mt-2">
                  {genderError}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <FieldSignUp
                      placeholder="Senha"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsPasswordFocused(true)}
                      required
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
                  <div className="flex-1 relative">
                    <FieldSignUp
                      placeholder="Confirme a senha"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
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
                        {formData.password && req.test(formData.password)
                          ? "✓"
                          : "○"}
                      </span>
                      {req.text}
                      {index < passwordRequirements.length - 1 && (
                        <span className="ml-2">•</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-center text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 text-center text-sm">
                  {successMessage}
                </div>
              )}
              <button
                type="submit"
                className="mt-1 tracking-wide font-semibold bg-green-700 text-gray-100 w-full py-4 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
              <p className="text-xs text-gray-600 text-center">
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