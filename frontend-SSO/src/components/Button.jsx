const variants = {
  primary: 'bg-primary text-white hover:bg-blue-700',
  secondary: 'bg-secondary text-white hover:bg-gray-700',
  danger: 'bg-danger text-white hover:bg-red-600',
}

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
