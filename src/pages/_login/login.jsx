import React from "react";
import logo from "../../assets/logo.svg"
import { Link } from "react-router-dom";
import "./style.css"

export default function Login() {

    return(
        <div className="body">
            <div className="box">
                <div className="form">
                    <img src={logo} alt="psicare" />
                    <input type="email" id="email" className="email" placeholder="Email"/>
                    <input type="password" id="senha" className="senha" placeholder="Senha"/>
                    {/* <button type="submit" id="button-login" className="button-login">Entrar</button> */}
                    <Link to="/secretarios" className="link-button-login">Entrar</Link>
                </div>
            </div>
        </div>
    )
}