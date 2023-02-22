import React from 'react'
import Link from 'next/link';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Nav() {

    const [user, loading] = useAuthState(auth);

    return (
        <nav className='flex items-center justify-between py-10 mb-4'>
            <Link href='/'>
                <button className='p-4 text-lg font-medium border-4 rounded-full'>Master Minds</button>
            </Link>
            <ul className='flex items-center gap-10'>
                {!user && (
                <Link href={"/auth/login"} className='px-4 py-2 ml-8 text-sm font-medium text-white rounded-lg bg-cyan-500'>Join Now</Link>
                )}
                {user && (
                    <div className='flex items-center gap-6'>
                        <Link href='/post'>
                        <button className='px-4 py-2 font-medium text-white bg-cyan-500 hover:bg-cyan-700 rounded-mg textx-sm'>Post</button>
                        </Link>
                        <Link href='/dashboard'>
                            <img className='w-12 rounded-full cursor-pointer' src={user.photoURL} alt='User image'/>
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    )
}
