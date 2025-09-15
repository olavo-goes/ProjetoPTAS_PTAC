import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AreaLogada from "./pages/AreaLogada";


function App () {
  return(
    <Router>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/area-logada" element={<AreaLogada />} />
      </Routes>
    </Router>
  );
}

export default App;