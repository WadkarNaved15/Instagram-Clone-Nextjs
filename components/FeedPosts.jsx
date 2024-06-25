"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'
import "./styles/FeedPosts.css"



const FeedPosts = () => {
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await axios.get('/api/allposts');
                const data = await response.data;
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
         getPosts();

    }, []);
  return (
    <div className='feed-posts'>
        {posts.map((post) => (
            <Post key={post._id} post={post} />
        ))}
    </div>
  )
}

export default FeedPosts