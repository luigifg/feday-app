import React from "react";

const FieldSignUp = ({ placeholder, type, name, value, onChange, fullWidth = true, isSelect = false, options = [], ...props}) => {
  const baseClassName = `${
    fullWidth ? "w-full" : "w-1/2"
  } px-3 py-2 rounded-lg font-small bg-gray-100 border border-gray-200 text-xxxs sm:text-xxs focus:outline-none focus:border-gray-400 focus:bg-white`;
  
  if (isSelect) {
    return (
      <div className="relative">
        <select
          className={`${baseClassName} appearance-none pr-8`}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Seta customizada com distância adequada da borda */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <input
      className={`${baseClassName} ${placeholder ? "placeholder-gray-500" : ""}`}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default FieldSignUp;