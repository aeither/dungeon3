import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import "./styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MintPage from "./MintPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "mint",
    element: <MintPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ContextProvider>
      {/* <App /> */}
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
