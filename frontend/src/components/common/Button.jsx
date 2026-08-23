function Button({
    children,
    type = "button",
    onClick,
    variant = "primary",
    className = "",
    disabled = false
}){
    const baseStyles = 
    "px-4 py-2 rounded-lg font-medium transition duration-200 focus:outline-none";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover: bg-gray-300",
        success: "bg-green-600 text-white hover: bg-green-700",
        danger: "bg-red-600 text-white hover: bg-red-700"
    };

    return (
        <button 
          type = {type}
          onClick = {onClick}
          disabled = {disabled}
          className = {`${baseStyles} ${variants[variant]} ${className}`}
          >
            {children}
          </button>
    );
}

export default Button;