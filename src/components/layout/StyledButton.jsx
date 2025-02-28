import { Link } from "react-router-dom";

const StyledButton = ({ to, children, onClick, className = "" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-semibold leading-6 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
  >
    {children}
  </Link>
);

export default StyledButton;
