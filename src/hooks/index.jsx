import { AuthContext } from "../contexts/authContext";
import { useContext } from "react";

//essa pasta de hooks tem a finalidade de fornecer uma maneira fácil de acessar o contexto de autenticação
export function UseAuth() {
    const context = useContext(AuthContext); //useContext é chamada como parâmetro para AuthContext, para pegar o valor atual do contexto de autenticação

    return context
}