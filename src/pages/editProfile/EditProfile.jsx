import { DriveFolderUploadOutlined } from "@mui/icons-material";
import React from "react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuid } from "uuid";
import "./editProfile.scss";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    name: currentUser.displayName,
    email: currentUser.email,
    uid: currentUser.uid,
    photoURL: currentUser.photoURL,
    bio: currentUser.bio || "",
    phone: currentUser.phone || "",
    age: currentUser.age || "",
    country: currentUser.country || "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Update the profile information (name, bio, phone, age, country, etc.)
      const profileDataToUpdate =
      {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid,
        photoURL: currentUser.photoURL,
        bio: data.bio,
        phone: data.phone,
        age: data.age,
        country: data.country,
        createdAt: serverTimestamp(),
      };

      if (img) {
      const storageRef = ref(storage, "usersImages/" + uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update the profile picture with the new downloadURL
            await updateProfile(currentUser, { photoURL: downloadURL });

            // Add the photoURL to the profileDataToUpdate
            profileDataToUpdate.photoURL = downloadURL;

            // Update the profile document in the database with the updated data
            await setDoc(doc(db, "users", currentUser.uid), profileDataToUpdate);

            // Navigate to the profile page after the update is successful
            navigate(`/profile/${data.name}`);
          });
        }
      );
    } else {
      // If no image change, update the profile document with the updated data
      await setDoc(doc(db, "users", currentUser.uid), profileDataToUpdate);

      // Navigate to the profile page after the update is successful
      navigate(`/profile/${data.name}`);
    }
  } catch (error) {
    // Handle any errors that occurred during the update process
    setError("Failed to update profile. Please try again.");
  }
};

  const [profilePictureUrl, setProfilePictureUrl] = useState(
    currentUser.photoURL
  );

  useEffect(() => {
    // Whenever the profile picture changes, update the state to include a cache-busting query parameter
    setProfilePictureUrl(`${currentUser.photoURL}?${new Date().getTime()}`);
  }, [currentUser.photoURL]);

  return (
    <div className="editProfile">
      <Navbar />
      <div className="editProfileWrapper">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src="/assets/profileCover/profilecover.jpg"
                alt=""
                className="profileCoverImg"
              />
              <img
                src={profilePictureUrl}
                alt=""
                className="profileUserImg"
                key={profilePictureUrl} // Add this key attribute
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{currentUser.displayName}</h4>
              <span className="profileInfoDesc">
                {currentUser.bio ? currentUser.bio : "hii friends"}
              </span>
            </div>
          </div>
          <div className="editprofileRightBottom">
            <div className="top">
              <h1>Edit User Profile</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img
                  src={
                    img
                      ? URL.createObjectURL(img)
                      : "/assets/profileCover/DefaultProfile.jpg"
                  }
                  alt=""
                />
              </div>
              <div className="right">
                <form onSubmit={handleUpdate}>
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={(e) => setImg(e.target.files[0])}
                    />
                  </div>
                  <div className="formInput">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={data.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formInput">
                    <label>Bio</label>
                    <input
                      type="text"
                      name="bio"
                      value={data.bio}
                      placeholder="hii friends"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formInput">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+91 123 456 7890"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formInput">
                    <label>Age</label>
                    <input
                      type="text"
                      placeholder="Enter Your Age"
                      name="age"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formInput">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="United Kingdom"
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="updateButton">
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
