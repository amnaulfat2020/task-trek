
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from '../pages/registrationPage/Registration';
import SuccessEmail from '../pages/successEmail/SuccessEmail';
import SuccessRegister from '../pages/successRegister/SuccessRegister';
import ChangePassword from '../pages/changespassword/ChangePassword';
import Login from '../pages/login/Login';
import UserProfile from '../pages/userprofile';
import TaskPage from '../pages/taskpage/TaskPage';
import ForgetPassword from '../pages/forgetPassword/ForgetPassword';
import NotFound from '../components/NotFound';
import Sidebar from '../pages/sidebar/Sidebar';

const Routers = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard/:userId" element={<Sidebar />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/success-email" element={<SuccessEmail />} />
          <Route path="/success-register" element={<SuccessRegister />} />
          <Route path="/dashboard/user-profile" element={<UserProfile />} />
          <Route exact path="/:projectId/tasks" element={<TaskPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Routers;
