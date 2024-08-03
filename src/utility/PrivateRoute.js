import React, { useContext } from "react";
import _ from "lodash"
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";




const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if(loading)
        return <div></div>
  return !_.isEmpty(user) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;