"use client"
import React, { useState, useEffect } from 'react'
import { useSession} from 'next-auth/react'
import Link from 'next/link'
import PostButton from './PostButton';
import axios from 'axios'

import "./styles/SideProfile.css"

const SideProfile = ({refreshPosts,setOpen}) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);


  const fetchPosts = async () => {
    try {
      const response = await axios.post('/api/posts',{
        publicId: session?.user.email.split('@')[0]
      });
      const data = await response.data;
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if(refreshPosts) {
      fetchPosts();
    }
  }, [refreshPosts]);
  

  if (!session) {
    return null;
  }

  return (
    <div className='side-profile-page'>
      <div className="side-profile">
        <div>
          <Link href="/profile">
            <img className='side-profile-img' src={session?.user.image} alt={session?.user.name} />
          </Link>
        </div>
        
        <div className="profile-name">
            <Link href="/profile">
                <h4 className="username">{session.user.name}</h4>
            </Link>
        </div>
        <PostButton setOpen={setOpen}></PostButton>
      </div>
      <div className="personal-posts">
        <div className="posts">
          {posts.map((post) => (
            <div key={post._id} className='side-post'>
              {post.fileType.startsWith("image/") ?  (
                  <img className="image" src={post.imageUrl} alt={post.caption} />
                ): (
                  <video className="image" controls>
                    <source src={post.imageUrl} type="video/mp4" />
                    <source src={post.imageUrl} type="video/webm" />
                    <source src={post.imageUrl} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
        )
      }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideProfile;
