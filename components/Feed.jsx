import React from 'react'
import SideProfile from './SideProfile'
import FeedPosts from './FeedPosts'
import "./styles/Feed.css"

const Feed = () => {
  return (
      <main className='feed'>
        <section className='feed-section'>
          <FeedPosts></FeedPosts>
        </section >
        <section className='side-profile-section'>
          <SideProfile></SideProfile>
        </section>
      </main>
  )
}

export default Feed