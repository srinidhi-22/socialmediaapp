import React from "react";

const StoryModal = ({ onClose, onSubmit }) => {
  const [storyText, setStoryText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleTextChange = (e) => {
    setStoryText(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    onSubmit(storyText, selectedFile);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <textarea
          value={storyText}
          onChange={handleTextChange}
          placeholder="Write your story..."
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default StoryModal;
