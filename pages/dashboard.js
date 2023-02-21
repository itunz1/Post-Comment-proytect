import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import Message from '../components/Message';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

export default function dashboard() {

    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    //see if user if logged
    const getData = () => {
        if (loading) {
            return;
        } if (!user) {
            return route.push('/auth/login');
        }
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        }));
        return unsubscribe;
    }

    //Delete post
    const deletePost = async (id) => {
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef);
    }

    //get user data
    useEffect(() => {
        getData();
    }, [user, loading]);


    return (
        <div>
            <h1>Your posts</h1>
            <div>
                {posts.map((post) => {
                    return (
                        <Message {...post} key={post.id}>
                            <div className='flex gap-4'>
                                <button onClick={() => deletePost(post.id)} className='flex items-center justify-center gap-2 py-2 text-pink-600'>
                                    <BsTrash2Fill className='text-2xl' />Delete
                                </button>
                                <Link href={{pathname: '/post', query: post}}>
                                <button className='flex items-center justify-center gap-2 py-2 text-teal-600'>
                                    <AiFillEdit className='text-2xl' /> Edit
                                </button>
                                </Link>
                            </div>
                        </Message>
                    );
                })}
            </div>
            <button className='px-4 py-2 my-6 font-medium text-white bg-gray-800' onClick={() => auth.signOut()}>Sign out</button>
        </div>
    )
}
