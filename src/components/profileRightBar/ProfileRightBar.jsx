import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import "./profileRightBar.scss";

const ProfileRightBar = ({ userId }) => {
  const [getUserInfo, setGetUserInfo] = useState({});
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const getInfo = () => {
      const unSub = onSnapshot(doc(db, "users", userId), (doc) => {
        setGetUserInfo(doc.data());
      });
      return () => {
        unSub();
      };
    };
    userId && getInfo();
  }, [userId]);

  console.log(getUserInfo);

  return (
    <div className="profileRightBar">
      <div className="profileRightBarHeading">
        <span className="profileRightBarTitle"> User Information</span>
        {/* Edit Profile Link */}
        {currentUser.uid === userId && (
          <Link
            to={`/profile/${currentUser.displayName}/edit`}
            style={{ textDecoration: "none" }}
          >
            <span className="editButton">Edit Profile</span>
          </Link>
        )}
      </div>

      <div className="profileRightBarInfo">
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Email: </span>
          <span className="profileRightBarInfoValue">
            {getUserInfo.email ? getUserInfo.email : currentUser.email}
          </span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Phone Number: </span>
          <span className="profileRightBarInfoValue">{getUserInfo.phone}</span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Age: </span>
          <span className="profileRightBarInfoValue">{getUserInfo.age}</span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Country: </span>
          <span className="profileRightBarInfoValue">
            {getUserInfo.country}
          </span>
        </div>
        <div className="profileRightBarInfoItem">
          <span className="profileRightBarInfoKey">Bio: </span>
          <span className="profileRightBarInfoValue">{getUserInfo.bio}</span>
        </div>
      </div>

      <h4 className="profileRightBarTitle">Close Friends</h4>
      {/* Close Friends List */}
      <div className="profileRightBarFollowings">
        {/* Add Close Friends */}
        {/* Replace the hard-coded list with your data or fetch it from Firestore */}
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend1.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Janet</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend2.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Isabella</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend3.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Beverly</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend4.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Glenna</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend5.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Alexis</span>
        </div>
        <div className="profileRightBarFollowing">
          <img
            src="/assets/person/friend6.jpg"
            alt=""
            className="profileRightBarFollowingImg"
          />
          <span className="profileRightBarFollowingName">Kate</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileRightBar;
