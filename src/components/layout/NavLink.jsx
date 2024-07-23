import { Link } from "react-router-dom";

const NavLink = ({ to, children, onClick }) => (
  <Link 
    to={to} 
    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50" 
    onClick={onClick}
  >
    {children}
  </Link>
);

export default NavLink;
