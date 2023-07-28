import React, { useContext, useEffect, useState } from "react";
import "./post.scss";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  ThumbUp,
  ThumbUpAltOutlined,
  ShareOutlined,
  Delete,
} from "@mui/icons-material";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [deleteOptionVisible, setDeleteOptionVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isCurrentUserPost = post.data.uid === currentUser.uid;

  // // Function to fetch and display the current user's messages
  // const displayCurrentUserMessages = async () => {
  //   try {
  //     // Get a reference to the current user's document in the 'usersPosts' collection
  //     const userPostsRef = doc(db, "usersPosts", currentUser.uid);

  //     // Fetch the user's posts document
  //     const userPostsSnapshot = await getDoc(userPostsRef);

  //     if (userPostsSnapshot.exists()) {
  //       // Get the data of the user's posts document
  //       const userPostsData = userPostsSnapshot.data();

  //       if (
  //         userPostsData &&
  //         userPostsData.messages &&
  //         Array.isArray(userPostsData.messages)
  //       ) {
  //         const messages = userPostsData.messages;

  //         // Log all the messages of the current user
  //         console.log("Current User's Messages:", messages);
  //       } else {
  //         console.log("User has no messages.");
  //       }
  //     } else {
  //       console.log("User's posts document does not exist.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user's messages:", error);
  //   }
  // };

  // // Call the function to display the current user's messages
  // useEffect(() => {
  //   displayCurrentUserMessages();
  // }, [currentUser.uid]);

  // console.log(post.id);

  const deleteCollection = async (db, collectionPath) => {
    const querySnapshot = await getDocs(collection(db, collectionPath));

    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, collectionPath, docSnapshot.id));
    });
  };

  const handleMoreVertClick = (event) => {
    setDeleteOptionVisible(true);
  };

  const handleDeleteOptionClose = () => {
    setDeleteOptionVisible(false);
  };

  const handleDeleteOptionClick = async () => {
    // Ask for confirmation before deleting the post
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      try {
        // Delete the "likes" subcollection
        await deleteCollection(db, `posts/${post.id}/likes`);

        // Delete the "comments" subcollection
        await deleteCollection(db, `posts/${post.id}/comments`);

        // Delete the post document from the "posts" collection
        await deleteDoc(doc(db, "posts", post.id));

        // Close the delete option menu
        handleDeleteOptionClose();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser.uid]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "comments"),
      (snapshot) => {
        setComments(
          snapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            data: snapshot.data(),
          }))
        );
      }
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  const handleComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", post.id, "comments"), {
      comment: input,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setCommentBoxVisible(false);
    setInput("");
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Delete the comment document from the "comments" subcollection
      await deleteDoc(doc(db, "posts", post.id, "comments", commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", post.id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "posts", post.id, "likes", currentUser.uid), {
        userId: currentUser.uid,
      });
    }
  };

  // State to store the author's display name and photoURL
  const [authorData, setAuthorData] = useState({
    displayName: "",
    photoURL: "",
  });

  // Fetch the author's display name and photoURL based on the UID in post data
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const userRef = doc(db, "users", post.data.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setAuthorData(userData); // Store both displayName and photoURL in state
        }
      } catch (error) {
        console.error("Error fetching author's data:", error);
      }
    };

    fetchAuthorData();
  }, [post.data.uid]);

  // console.log(comments);
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              to={`/profile/${authorData.displayName
                .replace(/\s+/g, "")
                .toLowerCase()}`}
            >
              <img
                src={authorData.photoURL}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">
              @{post.data.displayName.replace(/\s+/g, "").toLowerCase()}
            </span>
            <span className="postDate">
              <TimeAgo date={new Date(post.data?.timestamp?.toDate())} />
            </span>
          </div>
          <div className="postTopRight">
            {isCurrentUserPost && (
              <div className="postTopRight">
                <IconButton
                  onClick={handleMenuOpen}
                  aria-controls="post-menu"
                  aria-haspopup="true"
                >
                  <MoreVert className="postVertButton" />
                </IconButton>
                <Menu
                  id="post-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleDeleteOptionClick}>Delete</MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.data.input}</span>
          <img src={post.data.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite className="bottomLeftIcon" style={{ color: "red" }} />
            <ThumbUp
              onClick={(e) => {
                likePost();
              }}
              className="bottomLeftIcon"
              style={{ color: "#011631" }}
            />
            {likes.length > 0 && (
              <span className="postLikeCounter">{likes.length}</span>
            )}
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setCommentOpen(!commentOpen)}
            >
              {comments.length} · comments · share
            </span>
          </div>
        </div>

        <hr className="footerHr" />
        <div className="postBottomFooter">
          <div
            className="postBottomFooterItem"
            onClick={(e) => {
              likePost();
            }}
          >
            {liked ? (
              <ThumbUp style={{ color: "#011631" }} className="footerIcon" />
            ) : (
              <ThumbUpAltOutlined className="footerIcon" />
            )}
            <span className="footerText">Like</span>
          </div>
          <div
            className="postBottomFooterItem"
            onClick={() => setCommentBoxVisible(!commentBoxVisible)}
          >
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText">Share</span>
          </div>
        </div>
      </div>
      {commentBoxVisible && (
        <form onSubmit={handleComment} className="commentBox">
          <textarea
            type="text"
            placeholder="Write a comment ..."
            className="commentInput"
            rows={1}
            style={{ resize: "none" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input} className="commentPost">
            Comment
          </button>
        </form>
      )}

      {commentOpen > 0 && (
        <div className="comment">
          {comments
            .sort((a, b) => b.data.timestamp - a.data.timestamp)
            .map((c) => (
              <div key={c.id}>
                <div className="commentWrapper">
                  <img
                    className="commentProfileImg"
                    src={c.data.photoURL}
                    alt=""
                  />
                  <div className="commentInfo">
                    <span className="commentUsername">
                      @{c.data.displayName.replace(/\s+/g, "").toLowerCase()}
                    </span>
                    <p className="commentText">{c.data.comment}</p>
                    {c.data.uid === currentUser.uid && (
                      <IconButton
                        className="commentDeleteButton"
                        onClick={() => handleDeleteComment(c.id)}
                        aria-label="delete"
                        // style={{ color: "red" }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Post;
