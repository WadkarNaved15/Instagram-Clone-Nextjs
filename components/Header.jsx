"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import "./styles/Header.css"
import { signIn ,useSession, signOut} from 'next-auth/react'
import { FaRegSquarePlus } from "react-icons/fa6";

const Header = () => {
    const {data:session} = useSession()
   
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
            
            {session ? <>
            <div className="sign-out">
                <button className="sign-out-btn" onClick={() => {
                    signOut();
                }}>Sign Out</button>
            </div>
            <Link href={`/profile/${session.user.username}`}><img className='header-profile-img' src={session.user.image} alt={session.user.name} /></Link>
            </> :
            <button className='login-btn' onClick={() => signIn()} >Log In</button>}
        </div>

        

    </div>
  )
}

export default Header