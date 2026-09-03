import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import StockHistory from "./pages/StockHistory";
import NotFound from "./pages/NotFound";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/stock-history" element={<StockHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;