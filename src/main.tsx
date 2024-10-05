import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Barebones from "./client/barebones";

createRoot(document.getElementById("root")!).render(<Barebones />);
