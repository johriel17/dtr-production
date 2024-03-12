import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('')
  const location = useLocation()
  const {logout} = useLogout()
  const {user} = useAuthContext()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(()=>{

    setActiveLink(location.pathname)
  },[location.pathname])

  const handleLogout = () => {

      logout()

  }

  return (
    <header>
      <nav className="bg-amber-100 border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">DTR</span>
          </Link>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
          <div className={`w-full md:block md:w-auto ${isMenuOpen ? '' : 'hidden'}`} id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-300 rounded-lg bg-amber-100 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-amber-100">
              <li>
                <Link to="/" onClick={()=>setIsMenuOpen(false)} className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-amber-700 ${activeLink === '/' && 'underline'}`}>Home</Link>
              </li>
              <li>
                <Link to="/dtrs" onClick={()=>setIsMenuOpen(false)} className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-amber-700 ${activeLink.startsWith('/dtrs') && 'underline'}`}>Daily Time Records</Link>
              </li>
              <li>
                <Link to="/employees" onClick={()=>setIsMenuOpen(false)} className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-amber-700 ${activeLink.startsWith('/employees') && 'underline'}`}>Employees</Link>
              </li>
              <li>
                <Link to="/departments" onClick={()=>setIsMenuOpen(false)} className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-amber-700 ${activeLink.startsWith('/departments') && 'underline'}`}>Departments</Link>
              </li>
              <li>
                <Link to="/users" onClick={()=>setIsMenuOpen(false)} className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-amber-700 ${activeLink.startsWith('/users') && 'underline'}`}>Users</Link>
              </li>
              {/* <li>
                <Link to="#" onClick={()=>setIsMenuOpen(false)} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline md:p-0 underline-offset-8 decoration-double decoration-sky-600">Contact</Link>
              </li> */}
              <li>
                {/* <span>{user.email}</span> */}
                <button className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:underline underline-offset-8 decoration-double decoration-sky-600 md:p-0" onClick={handleLogout}>Log out</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
