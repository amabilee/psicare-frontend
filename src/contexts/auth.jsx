    import { AuthContext } from "./authContext";
    import React ,{ useState, useEffect } from "react";
    import { api } from "../services/server";

    const AuthProvider = ({ children }) => {
        const [ user, setUser ] = useState(); //armazenar informações do usuario autenticado
        const [ error, setError ] = useState(''); //armazenar mensagens de erro de autenticação
        const [ auth, setAuth ] = useState(false);//booleano que indica se o usuário esta autenticado ou nao

        useEffect(() => {//ao carregar a aplicação irá verificar o token e user
            const varificaData = async() => {
                const userToken = localStorage.getItem("user_token");//acessa o armazenamento local do navegador e recupera o item com a chave user_token armazenando o valor desse item que é o token do usário
                console.log(userToken)
                const userStorage = localStorage.getItem("user");//recupera os dados do usuário

                if(userToken && userStorage) { //userToken é o token / userStorage é o nosso usuário. entao verifica se tem o token e usuario
                    setUser(JSON.parse(userStorage));//converte a string JSON armazenada de volta para objeto JS
                    setAuth(true);//atualiza o estado auth para true, indicando que o usuário esta autenticado
                    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
                } 
            }
            varificaData();
        }, []);

        async function signIn(cpf, senha){
            try {
                const response = await api.post("/user/login", {cpf, senha})
                //token e dados do usuário serao extraidos da resposta do servidor 
                const tokenResponse = response.data.token;
                const userResponse = response.data.entity;

                setUser(userResponse);
                setAuth(true);

                //dados de usuario sendo armazenados em localStorage
                localStorage.setItem('user_token', tokenResponse);
                localStorage.setItem('user', JSON.stringify(userResponse));

                api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse}`;

                console.log('Token armazenado:', localStorage.getItem('user_token'));
                console.log('Dados do usuário armazenados:', localStorage.getItem('user'));


                // console.log(response.data)
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
            localStorage.removeItem("user")
            delete api.defaults.headers.common['Authorization'];
        }

        return(
            <AuthContext.Provider value={{ user, auth, error, signIn, signOut }}>
                {children}
            </AuthContext.Provider>
        )
    }

    export default AuthProvider;