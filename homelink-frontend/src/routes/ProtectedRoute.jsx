import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({ children, roles = [] }) {


    const {
        user,
        loading
    } = useAuth();

    const normalizedRole = user?.role?.toUpperCase();



    if(loading){

        return <h2>Loading...</h2>;

    }



    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (roles.length > 0) {
        const allowedRoles = roles.map((role) => role.toUpperCase());

        if (!allowedRoles.includes(normalizedRole)) {
            return <Navigate to="/dashboard" replace />;
        }
    }


    return children;


}


export default ProtectedRoute;