import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", link: "/" },
  { name: "DashBoard", link: "/dashboard" },
  {name:"CheckOut", link:"/cart"},
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };
  console.log(user);

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
      
          <div className="text-2xl font-bold text-blue-600">Sellbi</div>

   
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}

      
            {!user ? (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700"><Link to={user.Role=="seller"?"/seller" :"/profile"}className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">Hello, {user.name}</Link></span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

       
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

   
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="text-gray-700 hover:text-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-700"><Link to={user.Role=="seller"?"/seller" :"/profile"} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">Hello, {user.name}</Link></span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
