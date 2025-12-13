import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Signup from "./Signup";
import { Dashboard } from "./Dashboard";
import SendMoney from "./SendMoney";

import Signin from "./Signin";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send" element={<SendMoney />} />
    </Routes>
  </BrowserRouter>
);
