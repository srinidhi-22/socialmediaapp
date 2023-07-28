import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import "./register.scss";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";

const Register = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (isRegistered) {
      navigate("/", { replace: true }); // Navigate to the home page after successful registration
    }
  }, [isRegistered]);
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(false);
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    // Check if the username is already taken
    const displayNameSnapshot = await getDocs(
      query(collection(db, "users"), where("displayName", "==", displayName))
    );

    if (!displayNameSnapshot.empty) {
      alert("Username is already taken. Please choose another one.");
      return; // Do not proceed with registration
    }

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload profile picture (if user provided one)
      let downloadURL = null;
      if (img) {
        const imgRef = ref(storage, `usersImages/${res.user.uid}.jpg`);
        await uploadBytes(imgRef, img);
        downloadURL = await getDownloadURL(imgRef);
      } else {
        // Use the default image if user didn't provide one
        downloadURL =
          "https://firebasestorage.googleapis.com/v0/b/socialapp-dc9c8.appspot.com/o/usersImages%2FDefaultProfile.jpg?alt=media&token=f153588a-9353-427c-bf7c-2a500cc50fbd";
      }

      // Update profile and create user on firestore
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });
      await setDoc(doc(db, "userFriends", res.user.uid), {
        friends: [],
      });

      console.log("Registration successful");
      setIsRegistered(true); 
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">WE Soc</h3>
          <span className="registerDesc">
            Connect with the world around you.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <div className="top">
              <img
                src={
                  img
                    ? URL.createObjectURL(img)
                    : "/assets/profileCover/DefaultProfile.jpg"
                }
                alt=""
                className="profileImg"
              />
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    style={{ display: "none" }}
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleRegister} className="bottomBox">
                <input
                  type="text"
                  placeholder="Name"
                  id="displayName"
                  className="registerInput"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="registerInput"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  className="registerInput"
                  minLength={6}
                  required
                />
                {/* <input
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  className="registerInput"
                  required
                /> */}
                <button type="submit" className="registerButton">
                  Sign Up
                </button>
                <Link to="/login">
                  <button className="loginRegisterButton">
                    Log into Account
                  </button>
                </Link>
                {error && <span>Something went wrong</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
