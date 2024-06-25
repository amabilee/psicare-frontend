import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/_login/login";
import Agenda from "../pages/administrador/agenda"
import Secretarios from "../pages/administrador/secretario";
import Professores from "../pages/administrador/professor";
import Alunos from "../pages/administrador/aluno";
import Pacientes from "../pages/administrador/paciente";
import Relatorios from "../pages/administrador/relatorio";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/secretarios" element={<Secretarios />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
