import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/_login/login";

import {
  Empty, Agenda, Secretarios, Professores, Alunos, Pacientes, Relatorios, Gerencia
} from './PrivateRoute.jsx'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Empty />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/secretarios" element={<Secretarios />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/gerencia" element={<Gerencia />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;