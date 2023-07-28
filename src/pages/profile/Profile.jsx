import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./profile.scss";
import ProfileRightbar from "../../components/profileRightBar/ProfileRightBar";
import UsersPost from "../../components/usersPost/UsersPost";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
  fieldValue,
} from "firebase/firestore";
import { db } from "../../firebase";
import TimeAgo from "react-timeago";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const { username } = useParams();
  const [userProfileData, setUserProfileData] = useState(null);
  const [areFriends, setAreFriends] = useState(false);

  // ... (rest of the code remains the same)

  const checkIfFriends = async () => {
    try {
      if (currentUser && userProfileData) {
        const currentUserUID = currentUser.uid;

        // Get the current user's friends list
        const friendsList = await getFriendsList();

        // Check if the current user's ID exists in the friends list
        const isFriend = friendsList.includes(userProfileData.uid);
        setAreFriends(isFriend);
      }
    } catch (error) {
      console.error("Error checking if friends:", error);
    }
  };

  const getFriendsList = async () => {
    try {
      if (currentUser) {
        const userFriendsDoc = await getDoc(
          doc(db, "userFriends", currentUser.uid)
        );
        return userFriendsDoc.exists()
          ? userFriendsDoc.data().friends || []
          : [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching friends list:", error);
      return [];
    }
  };

  // ... (rest of the code remains the same)

  useEffect(() => {
    checkIfFriends();
  }, [currentUser, userProfileData]);

  const handleAddFriend = async () => {
    try {
      if (currentUser && userProfileData) {
        const currentUserUID = currentUser.uid;
        const userProfileUID = userProfileData.uid;

        console.log(areFriends);

        // Check if they are already friends
        if (areFriends) {
          console.log("Already friends!");
          return;
        }

        // Check if "userFriends" collection exists for the current user
        const currentUserFriendsRef = doc(db, "userFriends", currentUserUID);
        const currentUserFriendsDoc = await getDoc(currentUserFriendsRef);

        if (!currentUserFriendsDoc.exists()) {
          // Create "userFriends" collection and add the friend's UID
          await setDoc(currentUserFriendsRef, {
            friends: [userProfileUID], // Use arrayUnion to add the friend's UID to the array
          });
        } else {
          // Update the current user's friends array in the "userFriends" collection
          await updateDoc(currentUserFriendsRef, {
            friends: [...currentUserFriendsDoc.data().friends, userProfileUID], // Use arrayUnion to add the friend's UID to the array
          });
        }

        // Update the areFriends state to true after adding the friend
        setAreFriends(true);

        console.log("Friend added successfully!");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  console.log(username);

  const getUserProfileData = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("displayName", "==", username)
      );
      const userSnapshot = await getDocs(usersQuery);

      console.log("User Snapshot:", userSnapshot);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userUid = userDoc.id;
        setUserProfileData(userDoc.data());
        console.log("User UID:", userUid);
      } else {
        setUserProfileData(null);
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (username) {
      getUserProfileData();
    }
  }, [username]);

  console.log("testing users profile", userProfileData?.uid);

  return (
    <div className="profile">
      <Navbar />
      <div className="profileWrapper">
        <Sidebar />
        <div className="profileRight">
          <div className="profileCover">
            <img
              src="/assets/profileCover/profilecover.jpg"
              alt=""
              className="profileCoverImg"
            />
            {userProfileData && (
              <img
                src={userProfileData.photoURL}
                alt=""
                className="profileUserImg"
              />
            )}
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">
              {userProfileData ? userProfileData.displayName : username}
            </h4>
            {userProfileData && (
              <span className="profileInfoDesc">
                {userProfileData.bio ? userProfileData.bio : "hii friends"}
              </span>
            )}
            {userProfileData &&
              currentUser &&
              currentUser.uid !== userProfileData.uid && (
                <>
                  {areFriends ? (
                    <span>Friends</span>
                  ) : (
                    <button onClick={handleAddFriend}>Add Friend</button>
                  )}
                </>
              )}
          </div>
          <div className="profileRightBottom">
            {userProfileData?.uid && <UsersPost userId={userProfileData.uid} />}
            {userProfileData?.uid && (
              <ProfileRightbar userId={userProfileData.uid} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
