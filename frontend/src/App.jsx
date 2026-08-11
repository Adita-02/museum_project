import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { useEffect } from "react";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ArtifactDetails from "./pages/ArtifactDetails";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Asia from './pages/Asia';
import Africa from './pages/Africa';
import Europe from './pages/Europe';
import Americas from './pages/Americas';
import MemoryGame from "./components/MemoryGame"; // <-- notun import

import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminPanel from './admin/AdminPanel';
import AdminCivilizations from './admin/AdminCivilizations';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminSettings from './admin/AdminSettings';
import AdminReviews from './admin/Reviews';
import AdminSuggestions from './admin/Suggestions';
import ArtifactList from './admin/ArtifactList';
import AddArtifact from './admin/AddArtifact';
import EditArtifact from './admin/EditArtifact';
import Exhibitions from "./pages/Exhibitions";
import AdminModeration from './admin/AdminModeration';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gallery", element: <Home /> },
      { path: "/civs", element: <Home /> },
      { path: "/timeline", element: <Home /> },
      { path: "/team", element: <Home /> },
      
      { path: "/exhibitions", element: <Exhibitions /> },
      
      { path: "/africa", element: <Africa /> },
      { path: "/asia", element: <Asia /> },
      { path: "/europe", element: <Europe /> },
      { path: "/americas", element: <Americas /> },

      { path: "/games", element: <MemoryGame /> }, // <-- notun route

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ArtifactDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success/:id", element: <OrderSuccess /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "content", element: <AdminPanel /> },
      { path: "artifacts", element: <ArtifactList /> },
      { path: "artifacts/add", element: <AddArtifact /> },
      { path: "artifacts/edit/:id", element: <EditArtifact /> },
      { path: "civilizations", element: <AdminCivilizations /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "reviews", element: <AdminReviews /> },
      { path: "suggestions", element: <AdminSuggestions /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "moderation", element: <AdminModeration /> },
    ],
  },
], {
  basename: "/museum_project/",
});

export default function App() {
  // Custom cursor setup
  useEffect(() => {
    if (!document.getElementById("cursor")) {
      const cursor = document.createElement("div");
      cursor.id = "cursor";
      document.body.appendChild(cursor);
    }
    if (!document.getElementById("cursor-ring")) {
      const ring = document.createElement("div");
      ring.id = "cursor-ring";
      document.body.appendChild(ring);
    }
    const onMouseMove = (e) => {
      const cursor = document.getElementById("cursor");
      const ring = document.getElementById("cursor-ring");
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
      if (ring) {
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return <RouterProvider router={router} />;
}