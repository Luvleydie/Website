import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import LoginPage from "./Components/LoginPage";
import SignUpPage from "./Components/SignUpPage";
import PaymentPage from "./Components/PaymentPage";
import Almacen from "./Components/Almacen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route path="/payment" element={<PaymentPage />} /> 
        <Route path="/Almacen" element={<Almacen />} />
      </Routes>
    </Router>
  );
}

export default App;

