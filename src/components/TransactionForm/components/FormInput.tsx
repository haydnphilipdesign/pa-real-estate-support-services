export const FormInput = ({ value, onChange, className, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    placeholder={placeholder}
  />
); 