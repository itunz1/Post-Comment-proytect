import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';


export default function post() {

    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const updateData = route.query;

    //Form state
    const [post, setPost] = useState({
        description: "",
    });

    //Submit post
    const submitPost = async (e) => {
        e.preventDefault();

        //Run checks for description
        if(!post.description){
            toast.error('Description Field Empty 😅', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }
        if(!post.description.length > 300){
            toast.error('Description too long 😅', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        }

        //make a new post
        const collectionRef = collection(db, 'posts');
        await addDoc(collectionRef, {
            ...post,
            timestamp: serverTimestamp(),
            user: user.uid,
            avatar: user.photoURL,
            username: user.displayName,
        });
        setPost({description: ""});
        return route.push('/');
    };

    return (
        <div className='max-w-md p-12 mx-auto my-20 rounded-lg shadow-lg'>
            <form onSubmit={submitPost}>
                <h1 className='text-2xl font-bold'>Create a new post</h1>
                <div className='py-2 '>
                    <h3 className='py-2 text-lg font-medium'>Description</h3>
                    <textarea
                        value={post.description}
                        onChange={(e) => setPost({ ...post, description: e.target.value })} className='w-full h-48 p-2 text-sm text-white bg-gray-800 rounded-lg'></textarea>
                    <p className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ""}`}>{post.description.length}/300</p>
                </div>
                <button
                    type='submit'
                    className='w-full p-2 my-2 text-sm font-medium text-white rounded-lg bg-cyan-600'>Submit</button>
            </form>
        </div>
    )
}
