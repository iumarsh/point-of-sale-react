import React, { useContext } from 'react'
import Dashboard from '.';
import AuthContext from '../../utility/AuthContext';
import UserDashboard from './UserDashboard';

const MainDashboard = () => {

    const { user, loading, logout } = useContext(AuthContext);
  return (
    user?.role == "Regular" ? <UserDashboard/> : <Dashboard/>
  )
}

export default MainDashboard