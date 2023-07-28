import React, { useContext } from "react";
import "./menuLink.scss";
import { AuthContext } from "./../../context/AuthContext";
import { auth } from "../../firebase";
const MenuLink = ({ Icon, text }) => {
  const { currentUser } = useContext(AuthContext);
  // const currentUser = auth.currentUser;
  return (
    <div className="menuLink">
      {Icon}
      <span className="menuLinkText">{text}</span>
      <span className="menuLinkTextName">
        {text === "Logout" && `(${currentUser.displayName})`}
      </span>
    </div>
  );
};

export default MenuLink;
