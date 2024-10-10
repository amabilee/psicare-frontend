import React from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../hooks';

import AgendaPage from "../pages/administrador/agenda";
import SecretariosPage from "../pages/administrador/secretario";
import ProfessoresPage from "../pages/administrador/professor";
import AlunosPage from "../pages/administrador/aluno";
import PacientesPage from "../pages/administrador/paciente";
import RelatoriosPage from "../pages/administrador/relatorio";

const hasAccess = (userLevel, componentName) => {
    const accessControl = {
        '0': ['Agenda', 'Secretarios', 'Professores', 'Alunos', 'Pacientes', 'Relatorios'],
        '1': ['Agenda', 'Pacientes'],
        '2': ['Pacientes', 'Alunos', 'Relatorios'],
        '3': ['Agenda', 'Pacientes', 'Relatorios'],
    };

    return accessControl[userLevel]?.includes(componentName);
};

const PrivateRoute = ({ component: Component, componentName, ...rest }) => {
    const { signOut } = UseAuth();
    const userToken = localStorage.getItem("user_token");
    const userLevel = localStorage.getItem("user_level");
    const isAuthenticated = !!userToken;

    if (isAuthenticated) {
        if (userLevel && hasAccess(userLevel, componentName)) {
            return <Component {...rest} />;
        } else {
            signOut();
            return <Navigate to="/entrar" />;
        }
    } else {
        signOut();
        return <Navigate to="/entrar" />;
    }
};

const Agenda = (props) => <PrivateRoute component={AgendaPage} componentName="Agenda" {...props} />;
const Secretarios = (props) => <PrivateRoute component={SecretariosPage} componentName="Secretarios" {...props} />;
const Professores = (props) => <PrivateRoute component={ProfessoresPage} componentName="Professores" {...props} />;
const Alunos = (props) => <PrivateRoute component={AlunosPage} componentName="Alunos" {...props} />;
const Pacientes = (props) => <PrivateRoute component={PacientesPage} componentName="Pacientes" {...props} />;
const Relatorios = (props) => <PrivateRoute component={RelatoriosPage} componentName="Relatorios" {...props} />;

export {
    Agenda, Secretarios, Professores, Alunos, Pacientes, Relatorios
};