import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 md:px-6 md:py-10">{children}</main>
  </div>
);

export default Layout;
