import React, { useContext } from "react";
import { Link } from "react-router-dom";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import VideocamIcon from "@mui/icons-material/Videocam";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventIcon from "@mui/icons-material/Event";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import "./sidebar.scss";
import MenuLink from "../menuLink/MenuLink";
import Friends from "../friends/Friends";
import { Users } from "../../data";
import { DarkModeContext } from "./../../context/darkModeContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <MenuLink Icon={<RssFeedIcon />} text="Feed" />
        </Link>
        <MenuLink Icon={<ChatIcon />} text="Chats" />
        <MenuLink Icon={<VideocamIcon />} text="Videos" />
        <MenuLink Icon={<GroupsIcon />} text="Friends" />
        <MenuLink Icon={<BookmarkIcon />} text="Saved" />
        <MenuLink Icon={<ShoppingCartIcon />} text="Shopping" />
        {/* <MenuLink Icon={<EventIcon />} text="Events" /> */}
        <span onClick={() => dispatch({ type: "TOGGLE" })}>
          <MenuLink Icon={<Brightness4Icon />} text="Theme" />
        </span>
        <span onClick={() => signOut(auth)}>
          <MenuLink Icon={<ExitToAppOutlinedIcon />} text="Logout" />
        </span>

        {/* <button className="sidebarButton">Show More</button> */}
        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <Friends key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;