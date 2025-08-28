
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useEffect, useState } from "react";

const DashboardPage = () => {
    const { user, logout } = useAuthStore();


    const handleLogout = () => {
        logout();
    };

    return (
        <>
          
           
        </>
    );
};

export default DashboardPage;