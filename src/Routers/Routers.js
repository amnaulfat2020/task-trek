import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from '../pages/project/Project';
import Registration from '../pages/registrationPage/Registration';
import SuccessEmail from '../pages/successEmail/SuccessEmail';
import SuccessRegister from '../pages/successRegister/SuccessRegister';
import ChangePassword from '../pages/ChangePassword'
import Login from '../pages/login/Login';
import UserProfile from '../pages/userprofile';
import TaskPage from '../pages/TaskPage';
import ForgetPassword from '../pages/forgetPassword/ForgetPassword';


const Routers = () => {
    return (
        <div>
            <Router>
                <Routes>


                    <Route exact path="/dashboard" element={<Project />} /> 
                    <Route exact path="/forget-password" element={<ForgetPassword />} /> 
                    <Route exact path="/change-password" element={<ChangePassword />} />
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/register" element={<Registration />} />
                    <Route exact path="/dashboard" element={<Project />} />
                    <Route exact path="/change-password" element={<ChangePassword />} />
                    <Route exact path="/success-email" element={<SuccessEmail />} />
                    <Route exact path="/success-register" element={<SuccessRegister />} />
                    <Route exact path="/dashboard/user-profile" element={<UserProfile />} />
                    <Route exact path="/tasks/" element={<TaskPage />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Routers