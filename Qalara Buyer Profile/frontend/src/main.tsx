import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { BuyerListPage } from "./pages/BuyerListPage";
import { NewBuyerPage } from "./pages/NewBuyerPage";
import { ReviewBuyerPage } from "./pages/ReviewBuyerPage";
import { BuyerDetailPage } from "./pages/BuyerDetailPage";
import { EditBuyerPage } from "./pages/EditBuyerPage";
import { supabase } from "./lib/supabase";

async function requireSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return data.session;
}

function AuthBoundary({ children }: { children: React.ReactNode }) {
  return children;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <AuthBoundary><AppShell /></AuthBoundary>,
    loader: requireSession,
    errorElement: <Navigate to="/login" replace />,
    children: [
      { index: true, element: <Navigate to="/buyers" replace /> },
      { path: "buyers", element: <BuyerListPage /> },
      { path: "buyers/new", element: <NewBuyerPage /> },
      { path: "buyers/new/review", element: <ReviewBuyerPage /> },
      { path: "buyers/:id", element: <BuyerDetailPage /> },
      { path: "buyers/:id/edit", element: <EditBuyerPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
