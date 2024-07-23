import { Link } from "react-router-dom";

const StyledButton = ({ to, children, onClick }) => (
  <button 
    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-rose-600 hover:bg-rose-100 hover:text-rose-900 focus:bg-rose-100 focus:text-rose-900 dark:text-rose-300 dark:hover:bg-rose-800 dark:hover:text-rose-50 dark:focus:bg-rose-800 dark:focus:text-rose-50"
    onClick={onClick}
  >
    <Link to={to} className="text-sm font-semibold leading-6 text-gray-900">{children}</Link>
  </button>
);

export default StyledButton;
