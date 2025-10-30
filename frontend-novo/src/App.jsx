import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AreaLogada from "./pages/AreaLogada";
import Perfil from "./pages/Perfil";
import ListaPerfis from "./pages/ListaPerfis";
import CadastroMesa from "./pages/CadastroMesa";
import ReservaMesa from "./pages/ReservaMesa";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Login />} />
        <Route path="/area-logada" element={<AreaLogada />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfis" element={<ListaPerfis />} />
        <Route path="/cadastro-mesas" element={<CadastroMesa />} />
        <Route path="/reserva-mesas" element={<ReservaMesa />} />
      </Routes>
    </Router>
  );
}

export default App;