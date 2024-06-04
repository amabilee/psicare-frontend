import React from "react";
import logo from "../../assets/logo.svg"
import "./style.css"

export default function Login() {

    return(
        <div className="body">
            <div className="box">
                <div className="form">
                    <img src={logo} alt="psicare" />
                    <input type="email" id="email" className="email" placeholder="Seu email"/>
                    <input type="password" id="senha" className="senha" placeholder="Sua senha"/>
                    <button type="submit" id="button-login" className="button-login">Entrar</button>
                </div>
            </div>
        </div>
    )
}