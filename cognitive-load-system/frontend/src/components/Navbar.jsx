import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
  }`;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setNavOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/60 backdrop-blur-2xl">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-5 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-wide text-slate-900 sm:text-2xl">
            CogniSense
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-xl text-slate-700 md:hidden"
          >
            {navOpen ? "×" : "☰"}
          </button>
        </div>

        <div className={`${navOpen ? "mt-4 flex" : "hidden"} flex-col gap-3 md:mt-0 md:flex md:flex-row md:items-center md:justify-between`}>
          <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
            <NavLink to="/" className={navLinkClass} onClick={closeMenus}>
              Home
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenus}>
                  Dashboard
                </NavLink>
                <NavLink to="/tests" className={navLinkClass} onClick={closeMenus}>
                  Tests
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink to="/admin" className={navLinkClass} onClick={closeMenus}>
                    Admin
                  </NavLink>
                )}
              </>
            )}
            {!isAuthenticated && (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={closeMenus}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClass} onClick={closeMenus}>
                  Signup
                </NavLink>
                <NavLink to="/admin/login" className={navLinkClass} onClick={closeMenus}>
                  Admin Access
                </NavLink>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="md:ml-auto">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="button-secondary min-w-[132px] justify-center"
                >
                  {user?.name || "Account"}
                </button>
                {menuOpen && (
                  <div className="mt-3 w-full rounded-[22px] border border-white/70 bg-white/95 p-2 shadow-2xl md:absolute md:right-0 md:w-48">
                    <NavLink
                      to="/history"
                      onClick={closeMenus}
                      className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      View history
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenus();
                        logout();
                      }}
                      className="mt-1 block w-full rounded-2xl px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
