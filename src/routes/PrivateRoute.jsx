import { Navigate } from "react-router-dom";
import { UseAuth } from "../hooks";
import { useEffect, useState } from "react";

import AgendaPage from "../pages/administrador/agenda";
import SecretariosPage from "../pages/administrador/secretario";
import ProfessoresPage from "../pages/administrador/professor";
import AlunosPage from "../pages/administrador/aluno";
import PacientesPage from "../pages/administrador/paciente";
import RelatoriosPage from "../pages/administrador/relatorio";
import GerenciaPage from "../pages/administrador/gerencia";

const accessControl = {
  "0": ["Agenda", "Secretarios", "Professores", "Alunos", "Pacientes", "Relatorios", "Gerencia"],
  "1": ["Agenda", "Pacientes", "Alunos"],
  "2": ["Pacientes", "Alunos", "Relatorios"],
  "3": ["Agenda", "Pacientes", "Relatorios"],
};

const hasAccess = (userLevel, componentName) => {
  return accessControl[userLevel]?.includes(componentName);
};

const PrivateRoute = ({ component: Component, componentName, ...rest }) => {
  const { signOut } = UseAuth();
  const userToken = localStorage.getItem("user_token");
  const userLevel = localStorage.getItem("user_level");
  const isAuthenticated = !!userToken;
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", checkWidth);
    checkWidth();

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!isDesktop) {
    signOut()
    return <Navigate to="/entrar" state={{ mensagem: "Esta versão do sistema foi projetada para uso em desktop. Para a melhor experiência, maximize a janela e evite redimensioná-la." }}/>;
  }

  if (!userLevel || !hasAccess(userLevel, componentName)) {
    signOut()
    return <Navigate to="/entrar" state={{ mensagem: "Acesso negado" }}/>;
  }

  if (!isAuthenticated) {
    signOut()
    return <Navigate to="/entrar" state={{ mensagem: "Acesso expirado" }}/>;
  }

  return <Component {...rest} />;
};

const Empty = (props) => <PrivateRoute component="empty" componentName="Login" {...props} />;
const Agenda = (props) => <PrivateRoute component={AgendaPage} componentName="Agenda" {...props} />;
const Secretarios = (props) => <PrivateRoute component={SecretariosPage} componentName="Secretarios" {...props} />;
const Professores = (props) => <PrivateRoute component={ProfessoresPage} componentName="Professores" {...props} />;
const Alunos = (props) => <PrivateRoute component={AlunosPage} componentName="Alunos" {...props} />;
const Pacientes = (props) => <PrivateRoute component={PacientesPage} componentName="Pacientes" {...props} />;
const Relatorios = (props) => <PrivateRoute component={RelatoriosPage} componentName="Relatorios" {...props} />;
const Gerencia = (props) => <PrivateRoute component={GerenciaPage} componentName="Gerencia" {...props} />;

export { Empty, Agenda, Secretarios, Professores, Alunos, Pacientes, Relatorios, Gerencia };
