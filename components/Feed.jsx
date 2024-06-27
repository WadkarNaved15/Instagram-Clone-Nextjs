"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideProfile from './SideProfile';
import FeedPosts from './FeedPosts';
import UploadModal from './UploadModal';
import "./styles/Feed.css";

const Feed = () => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const onClose = () => {
    setOpen(false);
  };

  const getPosts = async () => {
    try {
      const response = await axios.get('/api/allposts');
      const data = await response.data;
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const refreshPosts = async () => {
    await getPosts();
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <main className='feed'>
      <section className='feed-section'>
        <FeedPosts posts={posts} deletePost={deletePost}></FeedPosts>
      </section>
      <section className='side-profile-section'>
        <SideProfile refreshPosts={refreshPosts} setOpen={setOpen} ></SideProfile>
        <UploadModal isOpen={open} onClose={onClose} onUploadSuccess={refreshPosts} />
      </section>
    </main>
  );
}

export default Feed;
