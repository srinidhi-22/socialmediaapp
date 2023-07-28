import React, { useEffect, useState } from "react";
import "./usersPost.scss";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import TimeAgo from "react-timeago";
import Post from "../post/Post"; // Import the Post component
import Share from "../share/Share";

const UsersPost = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      // Fetch the user's posts using the userID prop
      const postsQuery = query(
        collection(db, "posts"),
        where("uid", "==", userId)
      );
      const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
        const userPostsData = [];
        snapshot.forEach((doc) => {
          userPostsData.push({ id: doc.id, data: doc.data() });
        });
        setUserPosts(userPostsData);
      });

      return () => {
        unsubscribePosts();
      };
    }
  }, [userId]);

  return (
    <div className="feedUsersPost">
      <div className="feedUsersPostWrapper">
        {userId ? (
          <div className="usersPost">
            <Share />
            {userPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPost;
