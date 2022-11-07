import React from "react";
import { Navigate } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie'

const ProtectedRoute = ({
}) => {

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-user']);


    if (cookies.Token && cookies.UserId) {
        return cookies.Token && cookies.UserId ? <Navigate to={ '/user' } replace /> : <Navigate to={ '/' } replace /> }
};

export default ProtectedRoute;
