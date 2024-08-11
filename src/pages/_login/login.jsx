import React, { useState } from "react";
import logo from "../../assets/logo.svg"
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../../hooks";
import "./style.css"


export default function Login() {
    const { signIn, error } = UseAuth();
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log("email:", email);
        console.log("Senha:", senha)  

        try{
           const sucesso = await signIn(email, senha)
            if (sucesso){
                navigate("/secretarios")
                return
            } else {
                console.log("Erro de autenticação:", error);
            } 
        } catch(e) {
            console.log("Erro ao fazer login", e)
        }
        
    }
    
    return(
        <div className="body">
            <div className="box">
                <div className="form">
                    <img src={logo} alt="psicare" />
                    <input type="email" id="email" className="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input type="password" id="senha" className="senha" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required/>

                    <button type="submit" id="button-login" className="button-login" onClick={handleSubmit}>
                        Entrar
                    </button>
                    {/* <Link to="/secretarios" className="link-button-login">Entrar</Link> */}
                </div>
            </div>
        </div>
    )
}