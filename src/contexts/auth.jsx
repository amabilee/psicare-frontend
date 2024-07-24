    import { AuthContext } from "./authContext";
    import React ,{ useState, useEffect } from "react";
    import { api } from "../services/server";

    const AuthProvider = ({ children }) => {
        const [ user, setUser ] = useState(); //armazenar informações do usuario autenticado
        const [ error, setError ] = useState(''); //armazenar mensagens de erro de autenticação
        const [ auth, setAuth ] = useState(false);//booleano que indica se o usuário esta autenticado ou nao
        const [ loading, setLoading ] = useState(false);//booleano que indica se a operaçõa de autenticação está em andamento

        useEffect(() => {
            const varificaData = async() => {
            const userToken = localStorage.getItem("user_token");
                const userStorage = localStorage.getItem("user");

                if(userToken && userStorage) { //userToken é o token / userStorage é o nosso usuário. entao verifica se tem o token e usuario
                    setUser(JSON.parse(userStorage));
                    setAuth(true);
                } 
            }
            varificaData();
        }, []);

        async function signIn(email, senha){
            setLoading(true)
            try {
                const response = await api.post("/login", {email, senha})
                const tokenResponse = response.data.token;
                const userResponse = response.data;

                setUser(userResponse);
                setAuth(true);
                localStorage.setItem('user', JSON.stringify(userResponse));
                localStorage.setItem('user_token', tokenResponse);

                setTimeout(() => {
                    setLoading(false);
                }, 1000);

                // console.log(response.data)
                return true
            } catch (e) {
                setAuth(false);
                setLoading(false);
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
            setUser({})
            setAuth(false)
            localStorage.removeItem("user")
            localStorage.removeItem("user_token")
        }

        return(
            <AuthContext.Provider value={{ user, auth, error, loading, signIn, signOut }}>
                {children}
            </AuthContext.Provider>
        )
    }

    export default AuthProvider;