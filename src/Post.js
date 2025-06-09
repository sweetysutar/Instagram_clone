import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

import { db, serverTimestamp } from "./firebase";

function Post({ user, postId, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!postId) return;

    // Firestore collection reference: posts/{postId}/comments
    const commentsRef = collection(db, "posts", postId, "comments");

    // Query to order comments by timestamp
    const q = query(commentsRef, orderBy("timestamp", "desc"));

    // Realtime listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => doc.data()));
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [postId]);

  const postComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    const commentsRef = collection(db, "posts", postId, "comments");

    await addDoc(commentsRef, {
      username: user.displayName,
      text: comment,
      timestamp: serverTimestamp(),
    });

    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="post" />

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox" onSubmit={postComment}>
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button disabled={!comment} className="post__button" type="submit">
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
