import React, { useState } from "react";
import logo from "../../assets/logo.svg"
import { Link, useNavigate } from "react-router-dom";
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
import { UseAuth } from "../../hooks";
import "./style.css"


export default function Login() {
    const { signIn, error } = UseAuth();
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');
    // const [ message, setMessage ] = useState("");
    // const [ state, setState] = React.useState({
    //     open: false,
    //     vertical: 'top',
    //     horizontal: 'center',
    // });

    // const { vertical, horizontal, open } = state;

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

    // const handleMensagem = (newState) => {
    //     setState({ ...newState, open: true });
    //     setMessage("Não possui acesso? Entre em contato com o administrador do sistema.");
    // }

    // const handleClose = () => {
    //     setState({ ...state, open: false });
    // };
    
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
                    <div className="mensagem_alerta" >
                        <h3 
                        // onClick={handleMensagem({ vertical: 'bottom', horizontal: 'center' })}
                        >Não possui cadastro ?</h3>
                        {/* <Snackbar
                            ContentProps={{sx: {borderRadius: '8px'}}}
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            autoHideDuration={2000}
                            onClose={handleClose}
                            key={vertical + horizontal}
                        >
                            <Alert variant="filled"  severity="warning" onClose={handleClose} action="">
                            {typeof message === 'string' ? message : ''}    
                            </Alert> 
                        </Snackbar> */}
                    </div>
                    
                    {/* <Link to="/secretarios" className="link-button-login">Entrar</Link> */}
                </div>
                
            </div>
        </div>
    )
}