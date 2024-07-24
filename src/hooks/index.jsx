import { AuthContext } from "../contexts/authContext";
import { useContext } from "react";

export function UseAuth() {
    return useContext(AuthContext); //useContext é chamada como parâmetro para AuthContext, para pegar o valor atual do contexto de autenticação
}