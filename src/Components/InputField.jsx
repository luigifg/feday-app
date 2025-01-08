import React from "react";

const InputField = ({ placeholder, type, name, value, onChange, fullWidth = true }) => {
  return (
    <input
      className={`${
        fullWidth ? "w-full" : "w-1/2"
      } px-3 py-3 rounded-lg font-small bg-gray-100 border border-gray-200 placeholder-gray-500 text-xxs sm:text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
      type={type}
      placeholder={placeholder}
      name={name} // Adiciona o nome para poder identificar o campo
      value={value} // Adiciona o valor para controlar o estado
      onChange={onChange} // Adiciona a função onChange para atualizar o estado
    />
  );
};

export default InputField;
