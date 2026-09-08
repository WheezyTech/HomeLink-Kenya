import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();


export function AuthProvider({children}) {

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);


    useEffect(()=>{

        const token = localStorage.getItem("access");
        const storedUser = localStorage.getItem("user");

        if(token){

            try{
                const decoded = jwtDecode(token);

                if(storedUser){
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(decoded);
                }

            }catch(error){
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");

            }

        }

        setLoading(false);

    },[]);



    const logout = ()=>{

        localStorage.clear();

        setUser(null);

    };



    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}



export function useAuth(){

    return useContext(AuthContext);

}