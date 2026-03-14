import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-12">{children}</main>
  </div>
);

export default Layout;
