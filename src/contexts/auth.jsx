import { AuthContext } from "./authContext";
import React ,{ useState, useEffect } from "react";
import { api } from "../services/server";

const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(); //armazenar informações do usuario autenticado
    const [ error, setError ] = useState(''); //armazenar mensagens de erro de autenticação
    const [ auth, setAuth ] = useState(false);//booleano que indica se o usuário esta autenticado ou nao

    useEffect(() => {//ao carregar a aplicação irá verificar o token e user
        const verificaData = async() => {
            const userToken = localStorage.getItem("user_token");//acessa o armazenamento local do navegador e recupera o item com a chave user_token armazenando o valor desse item que é o token do usário
            console.log(userToken)

            // localStorage.setItem("user_token", JSON.stringify(userToken))
            // setUser(JSON.parse(userToken));

            // if(userToken) { //userToken é o token / userStorage é o nosso usuário. entao verifica se tem o token e usuario
            //     setUser(JSON.parse(userToken));//converte a string JSON armazenada de volta para objeto JS
            //     setAuth(true);//atualiza o estado auth para true, indicando que o usuário esta autenticado
            //     api.defaults.headers.common['authorization'] = `${userToken}`;
            // } 
        }
        verificaData();
    }, []);

    async function signIn(email, senha){
        try {
            const response = await api.post("/user/login", {email, senha})
            //token e dados do usuário serao extraidos da resposta do servidor 
            const tokenResponse = response.data.token;
            console.log(response)

            setAuth(true);

            //dados de usuario sendo armazenados em localStorage
            localStorage.setItem("user_token", tokenResponse);

            // console.log('Token armazenado:', localStorage.getItem('user_token'));
            return true
        } catch (e) {
            setAuth(false);
            if (e.response) {
                setError(e.response.data.message);
            } else if (e.code === 'ERR_NETWORK') {
                setError('Não foi possível conectar ao servidor.');
            } else {
                setError('Ocorreu um erro ao tentar fazer login.');
            }
        }
    }

    function signOut() {
        setUser(null)
        setAuth(false)
        localStorage.removeItem("user_token")
        delete api.defaults.headers.common['Authorization'];
    }

    return(
        <AuthContext.Provider value={{ user, auth, error, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;