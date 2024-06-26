"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import axios from 'axios'
import "./styles/SideProfile.css"

const SideProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        const data = await response.data;
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div className='side-profile-page'>
      <div className="side-profile">
        <div>
          <Link href="/profile">
            <img className="profile-img" src={session.user.image} alt={session.user.name} />
          </Link>
        </div>
        
        <div className="profile-name">
            <Link href="/profile">
                <h3 className="username">{session.user.name}</h3>
            </Link>
        </div>
        <div className="sign-out">
          <button className="sign-out-btn" onClick={() => {
            signOut();
          }}>Sign Out</button>
        </div>
      </div>
      <div className="personal-posts">
        <div className="posts">
          {posts.map((post) => (
            <div key={post._id} className='side-post'>
              <img className="image" src={post.imageUrl} alt={post.caption} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideProfile;
