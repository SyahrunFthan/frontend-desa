import { Loading } from "../components";
import { FooterMainComponent, NavbarMainComponent } from "../components/layout";
import { useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return <Loading setIsLoading={setIsLoading} />;
  return (
    <div
      className="min-h-screen bg-white flex flex-col overflow-x-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <NavbarMainComponent
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="flex-1 mt-10">{children}</main>

      <FooterMainComponent />
    </div>
  );
};

export default AppLayout;
