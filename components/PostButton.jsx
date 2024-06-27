import React from 'react'
import { FaRegSquarePlus } from "react-icons/fa6";

const PostButton = ({ setOpen }) => {
  return (
    <div className="post" onClick={() => setOpen(true)}>
          <FaRegSquarePlus size={20}></FaRegSquarePlus>
          <button className='post-btn'>POST</button>
    </div>
  )
}

export default PostButton