import React from "react";
import { Modal } from "antd";
import "./userprofile.css";
import { useParams } from "react-router-dom";
const UserProfilePopup = ({ userData, onClose }) => {
  return (
    <Modal title="User Profile" open={true} onCancel={onClose} footer={[]}>
      <div className="p-box">
        <h1 className="p-title typo">Name:</h1>{" "}
        <p className="typo cap"> {userData.firstName}</p>
      </div>
      <div className="p-box">
        <h1 className="p-title typo">Email:</h1>{" "}
        <p className="typo">{userData.email}</p>
      </div>
    </Modal>
  );
};

export default UserProfilePopup;
