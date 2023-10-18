
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./userprofile.css";
import { storage } from "../../utils/constants/Firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { useUserContext } from "../../contexts/SearchContext";
import MenuBar from "../../layout/MenuBar";


const { Title, Text } = Typography;

const UserProfile = (props) => {
  const imageListRef = ref(storage, "images/");
  const [isOpen, setIsOpen] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  // const { userData } = props; // Access user data passed as a prop

  const { userData ,updateUser } = useUserContext();

  // const { userData } = useUserContext();


  console.log("userdata: ", updateUser);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  

  useEffect(() => {
    // Check if userData exists and has an email or unique identifier
    if (userData && userData.email) {
      const userIdentifier = userData.email; // Use the email as the identifier
  
      listAll(imageListRef)
        .then((res) => {
          // Filter the images that belong to the user based on the identifier
          const userImages = res.items.filter((item) =>
            item.name.includes(userIdentifier)
          );
  
          // Fetch the download URLs for the user's images
          return Promise.all(userImages.map(getDownloadURL));
        })
        .then((urls) => {
          setImageList(urls);
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }
  }, [imageListRef, userData]);
  

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageList((prev) => [...prev, url]);
          alert("Image uploaded");
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Image upload failed");
      });
  };

  return (
    <>
      <MenuBar />
      <section>
        <div className="user-data">
          <Title className="hero-title typography">
            {userData ? userData.title : props.title}

          </Title>
          {imageList.length > 0 ? (
            <div className="img-container">
              {imageList.map((url, index) => (
                <img
                  key={index}
                  className="img"
                  onClick={openModal}
                  src={url}
                  alt={`Image ${index}`}
                />
              ))}
              {isOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span onClick={closeModal} className="close-button">
                      &times;
                    </span>
                    <input
                      type="file"
                      className="file-container"
                      onChange={(e) => {
                        setImageUpload(e.target.files[0]);
                      }}
                    />
                    <Button onClick={uploadImage}>Upload</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="img-container">
              <img
                className="img"
                src={props.defaultImage}
                alt={props.img}
                onClick={openModal}
              />
              {isOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span onClick={closeModal} className="close-button">
                      &times;
                    </span>
                    <input
                      type="file"
                      className="file-container"
                      onChange={(e) => {
                        setImageUpload(e.target.files[0]);
                      }}
                    />
                    <Button onClick={uploadImage}>Upload</Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <Title className="hero-name typography">
            {userData ? userData.email : props.email}
            {/* {userData && userData.email} */}
          </Title>
          <div className="hero-status">
            <div className="status-tasks typograhy">
              <Text className="user-status">{props.tasks}</Text>
              <Text className="status-name">Tasks</Text>
            </div>
            <div className="status-tasks rect typograhy">
              <Text className="user-status">{props.team}</Text>
              <Text className="status-name">Team</Text>
            </div>
            <div className="status-tasks rect typograhy">
              <Text className="user-status">{props.completedTasks}</Text>
              <Text className="status-name">Completed Tasks</Text>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

UserProfile.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  tasks: PropTypes.number,
  team: PropTypes.number,
  completedTasks: PropTypes.number,
  defaultImage: PropTypes.string,
  img: PropTypes.string,
  userData: PropTypes.shape({
    title: PropTypes.string,
    name: PropTypes.string,
  }),
};

UserProfile.defaultProps = {
  title: "Profile",
  img: "image",
  name: "Khusan Akhmedov",
  tasks: 21,
  team: 238,
  completedTasks: 101,
  defaultImage:
    "https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png",
};

export default UserProfile;



