import { Menu, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { menuMainItems } from "../../../constants/menu";
import { Link, useLocation } from "react-router-dom";
import { COLORS, ILLogoImage } from "../../../assets";
import { useEffect, useState } from "react";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarMainComponent = ({ isMenuOpen, setIsMenuOpen }: Props) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const transparent = isHome && isScrolled;

  const textColor = transparent ? "white" : COLORS.secondary;

  return (
    <nav
      className={`fixed top-0 w-full border-b z-50 py-2 transition-colors duration-300 ${
        transparent
          ? "bg-transparent border-transparent"
          : "bg-white backdrop-blur-sm border-gray-200"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={ILLogoImage} className="w-12 h-12" alt="" />
            <div>
              <h1 className="text-xl font-bold" style={{ color: textColor }}>
                Sikara Tobata
              </h1>
              <p
                className="text-sm"
                style={{ color: transparent ? "white" : COLORS.darkGray }}
              >
                Sistem Informasi Desa Sikara Tobata
              </p>
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {menuMainItems.map((item) =>
              item.items.map((i) => {
                const isActive =
                  i.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(i.path);

                return (
                  <Link
                    to={i.path}
                    key={i.key}
                    className={`capitalize font-medium transition-colors duration-200 ${
                      isActive ? "border-b-2 pb-1" : "hover:opacity-70"
                    }`}
                    style={{
                      color: isActive
                        ? COLORS.primary
                        : transparent
                        ? "white"
                        : COLORS.secondary,
                      borderColor: isActive ? COLORS.primary : "transparent",
                    }}
                  >
                    {i.label}
                  </Link>
                );
              })
            )}
          </div>

          {/* Toggle Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X
                className={`w-6 h-6 ${
                  transparent ? "text-white" : "text-black"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  transparent ? "text-white" : "text-black"
                }`}
              />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {menuMainItems.map((item) =>
                item.items.map((i) => {
                  const isActive =
                    i.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(i.path);

                  return (
                    <Link
                      to={i.path}
                      key={i.key}
                      className={`capitalize font-medium transition-colors duration-200 ${
                        isActive ? "pb-1" : "hover:opacity-70"
                      }`}
                      style={{
                        color: isActive
                          ? COLORS.primary
                          : transparent
                          ? "white"
                          : COLORS.secondary,
                        borderColor: isActive ? COLORS.primary : "transparent",
                      }}
                    >
                      {i.label}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarMainComponent;
