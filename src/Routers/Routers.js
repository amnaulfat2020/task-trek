import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from '../pages/registrationPage/Registration';
import ChangePassword from '../pages/changespassword/ChangePassword';
import Login from '../pages/login/Login';
import UserProfile from '../pages/userprofile';
import TaskPage from '../pages/taskpage/TaskPage';
import ForgetPassword from '../pages/forgetPassword/ForgetPassword';
import NotFound from '../components/NotFound';
import Dashboard from '../pages/dashboard';
import Project from '../pages/project/Project';
import LayoutSideBar from '../layout/LayoutSideBar';
import TermAndCondition from '../pages/TermsAndConditons';
import Member from '../pages/member/Member';
import Error from '../components/Error';
const Routers = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/dashboard/project/:userId/:projectId/tasks" element={<LayoutSideBar currentPage="Tasks"><TaskPage /></LayoutSideBar>} />
          <Route path="/members/:userId" element={<LayoutSideBar currentPage="Member" ><Member /></LayoutSideBar>} />
          <Route path="/dashboard/:userId" element={<LayoutSideBar currentPage="Dashboard"><Dashboard /></LayoutSideBar>} />
          <Route path="/dashboard/project/:userId" element={<LayoutSideBar currentPage="Projects"><Project /></LayoutSideBar>} />
          <Route path="/project/user-profile" element={<UserProfile />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/term-condition" element={<TermAndCondition />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<Error />} />

        </Routes>
      </Router>
    </div>
  );
};

export default Routers;



