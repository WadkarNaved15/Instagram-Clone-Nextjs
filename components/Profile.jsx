"use client";
import React, { useState, useEffect } from 'react';
import { useSession , signOut} from 'next-auth/react';
import axios from 'axios';
import Post from '@/components/Post';
import "./styles/Profile.css";

const Profile = ({profileId}) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!session) return;

   
    const fetchPosts = async () => {
      try {
        const response = await axios.post('/api/posts',{
          profileId: profileId || session.user.username
        });
        const data = response.data;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [session]);

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };


  if (!session) {
    return null;
  }
  return (
    <>{posts.length === 0 ? <>
    <div className="profile-page">
      <div className="profile">
        <img className="profile-img" src={session.user.image} alt={session.user.username} />
        <h3>{session.user.name}</h3>
        <p className="profile-username">{`username : ${session.user.username}`}</p>
        <button className="logout-btn" onClick={() => signOut()}>Logout</button>
      </div>
    </div>
      </> :
    <div className="profile-page">
      <div className="profile">
        <img className="profile-img" src={posts[0].profileImg} alt={posts[0].profileId} />
        <h3>{posts[0].username}</h3>
        <p className="profile-username">{`username : ${posts[0].profileId}`}</p>
        {session.user.username === posts[0].profileId && <button className="logout-btn" onClick={() => signOut()}>Logout</button>}
      </div>
      <div className="profile-posts">
        {posts.map((post) => (
          <Post key={post._id} post={post} deletePost={deletePost}/>
        ))}
      </div>
    </div>}
    </>
  );
};

export default Profile;
