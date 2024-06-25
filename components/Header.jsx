"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import "./styles/Header.css"
import { FaRegSquarePlus } from "react-icons/fa6";
import { useState } from 'react'
import UploadModal from './UploadModal'
import { signIn ,useSession} from 'next-auth/react'
import axios from 'axios'

const Header = () => {
    const {data:session} = useSession()
    const [open, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    }
  return (
    <div className='Header'>
        <div className="left">
            <Link href="/">
                <Image
                src="/instagram-logo-illustration.svg"
                alt="Instagram logo"
                width={200}
                height={100}
                />
            </Link>   
        </div>
        <div className="right">
            <div className="post" onClick={() => setOpen(true)}>
                <FaRegSquarePlus size={20}></FaRegSquarePlus>
                <button className='post-btn'>POST</button>
            </div>
            {session ? <>
            <Link href="/profile"><img className='header-profile-img' src={session.user.image} alt={session.user.name} /></Link>
            </> :
            <button className='login-btn' onClick={() => signIn()} >Log In</button>}
        </div>

        <UploadModal isOpen={open} onClose={onClose}/>

    </div>
  )
}

export default Header