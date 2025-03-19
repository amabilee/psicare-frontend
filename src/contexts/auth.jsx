import { AuthContext } from "./authContext";
import { useState, useEffect } from "react";
import { api } from "../services/server";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [error, setError] = useState('');
    const [auth, setAuth] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const verificaData = async () => {
            const userToken = localStorage.getItem("user_token");
            if (userToken) {
                if (typeof userToken == 'string'){
                    setUser(userToken);
                } else {
                    setUser(JSON.parse(userToken));
                }
                setAuth(true);
                api.defaults.headers.common['authorization'] = `${userToken}`;
            }

        }
        verificaData();
    }, []);

    async function signIn(email, senha) {
        if (String(email.length) != 0 && String(senha.length) != 0) {
            try {
                const response = await api.post("/user/login", { email, senha })
                const tokenResponse = response.data;
                setAuth(true);
                response.data.id && setUserId(response.data.id)
                localStorage.setItem("user_token", tokenResponse.token);
                localStorage.setItem("user_level", tokenResponse.userLevelAccess)                
                return response
            } catch (e) {
                setAuth(false);
                if (e.response && e.response.data) {
                    setError(e.response.data);
                } else if (e.code === 'ERR_NETWORK') {
                    setError('Não foi possível conectar ao servidor.');
                } else if (e.code === "ERR_BAD_REQUEST") {
                    setError('Credenciais inválidas');
                } else {
                    setError('Ocorreu um erro ao tentar fazer login.');
                }
            }
        } else {
            setError('Insira as suas credenciais.');
        }
    }

    function signOut() {
        setUser(null)
        setAuth(false)
        setError('')
        localStorage.removeItem("user_token")
        localStorage.removeItem("user_level")
    }

    return (
        <AuthContext.Provider value={{ user, auth, error, signIn, signOut, userId }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;