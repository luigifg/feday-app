import React from "react";

const FieldSignUp = ({ placeholder, type, name, value, onChange, fullWidth = true, ...props}) => {
  return (
    <input
      className={`${
        fullWidth ? "w-full" : "w-1/2"
      } px-3 pr-8 py-3 rounded-lg font-small bg-gray-100 border border-gray-200 placeholder-gray-500 text-xxs sm:text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
      type={type}
      {...props}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};

export default FieldSignUp;