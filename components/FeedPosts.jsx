"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import Post from './Post'
import axios from 'axios'
import "./styles/FeedPosts.css"



const FeedPosts = ({posts,deletePost}) => {
    if(!posts) {
        return (
            <div>
                <h4>No Posts</h4>
            </div>
        )
    }

  return (
    <div className='feed-posts'>
        {posts.map((post) => (
            <Post key={post._id} post={post} deletePost={deletePost} />
        ))}
    </div>
  )
}

export default FeedPosts