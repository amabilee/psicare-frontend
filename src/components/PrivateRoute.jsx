import React from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../hooks';

import AgendaPage from "../pages/administrador/agenda"
import SecretariosPage from "../pages/administrador/secretario";
import ProfessoresPage from "../pages/administrador/professor";
import AlunosPage from "../pages/administrador/aluno";
import PacientesPage from "../pages/administrador/paciente";
import RelatoriosPage from "../pages/administrador/relatorio";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { signOut } = UseAuth();
    const userToken = localStorage.getItem("user_token");
    const isAuthenticated = userToken ? true : false

    if (isAuthenticated) {
        return <Component {...rest} />
    } else {
        signOut()
        return <Navigate to="/entrar" />
    }
};

const Agenda = (props) => <PrivateRoute component={AgendaPage} {...props} />;
const Secretarios = (props) => <PrivateRoute component={SecretariosPage} {...props} />;
const Professores = (props) => <PrivateRoute component={ProfessoresPage} {...props} />;
const Alunos = (props) => <PrivateRoute component={AlunosPage} {...props} />;
const Pacientes = (props) => <PrivateRoute component={PacientesPage} {...props} />;
const Relatorios = (props) => <PrivateRoute component={RelatoriosPage} {...props} />;

export {
    Agenda, Secretarios, Professores, Alunos, Pacientes, Relatorios
}
