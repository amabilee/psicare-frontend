import React from "react";
import logo from "../../assets/logo.svg"
import "./style.css"

export default function Login() {

    return(
        <div className="body">
            <div className="box">
                <div className="form">
                    <img src={logo} alt="psicare" />
                    <input type="email" name="email" id="email" placeholder="Seu email"/>
                    <input type="password" name="senha" id="senha" placeholder="Sua senha"/>
                    <button type="submit" id="button-login">Entrar</button>
                </div>
            </div>
        </div>
    )
}