"use client";
import React, { useEffect, useState } from "react";
import "./styles/Post.css";
import { useSession,getSession } from "next-auth/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import Comments from "./Comments";

const Post = ({ post ,deletePost}) => {
  const { data: session } = useSession();
   console.log(session)
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isUpdating, setIsUpdating] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (session && post.likes.includes(session.user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [session, post.likes]);

  const updateLikes = async () => {
    if (!session || isUpdating) return; // Prevent multiple updates
    setIsUpdating(true); 

    try {
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);
      setLikesCount(newLikedStatus ? likesCount + 1 : likesCount - 1);

      const response = await axios.post("/api/updatelikes", {
        postId: post._id,
        userId: session.user.username,
      });

      if (!response.data.success) {
        setLiked(!newLikedStatus);
        setLikesCount(newLikedStatus ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    } finally {
      setIsUpdating(false); // Reset updating status
    }
  };

  const handleSubmit = async (postId) => {
    try {
      setIsDeleting(true);
      await axios.delete('/api/upload',{data:{
        id: post._id,
        public_id: post.public_id
      }
      });
      await axios
      deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="main-post">
      <div className="post-header">
        <div className="post-header-left">
          <img className="main-profile-img" src={post.profileImg} alt={post.profileId} />
          <h3 className="main-profile-name">{post.profileId}</h3>
        </div>
        {session && session.user.username === post.profileId ? (
        <button disabled={isDeleting} onClick={() => handleSubmit(post._id)} className="delete-btn">{isDeleting ? 'Deleting...' : 'Delete'}</button>) : null}
      </div>
      <div className="post-img-container">
        <img className="post-img" src={post.imageUrl} alt={post.caption} />
      </div>
      <div className="interaction">
        <div className="likes-container">
          {liked ? (
            <FaHeart className="heart red" size={32} onClick={updateLikes} />
          ) : (
            <FaRegHeart className="heart" size={32} onClick={updateLikes} />
          )}
          <p className="likes">{likesCount} likes</p>
        </div>
        <div className="caption-container">
          <h4>{post.profileId}: </h4>
          <p className="caption">{post.caption}</p>
        </div>
        {session ? <Comments postId={post._id}></Comments> : null}
         
      </div>
    </div>
  );
};

export default Post;
