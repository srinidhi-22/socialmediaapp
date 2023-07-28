import React, { useContext, useState } from "react";
import Storycard from "../storycard/Storycard";
import { Users } from "../../data";
import "./stories.scss";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import StoryModal from "./StoryModal";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStorySubmit = async (storyText, selectedFile) => {
    try {
      console.log(storyText);
      handleModalClose();
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className="stories">
      <div className="storyCard">
        <div className="overlay"></div>
        <img src={currentUser.photoURL} alt="" className="storyProfile" />
        <img src={currentUser.photoURL} alt="" className="storybackground" />
        <img
          src="/assets/person/upload.png"
          alt=""
          className="storyadd"
          onClick={handleModalOpen}
        />
        <span className="text">{currentUser.displayName}</span>
      </div>

      {Users.map((u) => (
        <Storycard key={u.id} user={u} />
      ))}

      {isModalOpen && (
        <StoryModal onClose={handleModalClose} onSubmit={handleStorySubmit} />
      )}
    </div>
  );
};

export default Stories;
