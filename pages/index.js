import Head from 'next/head';
import { Inter } from '@next/font/google';
import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import Message from '../components/Message.js'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  //Create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  const getPost = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPost();
  }, [])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='my-12 text-lg font-medium'>
        <h2>See what other people are saying</h2>
        {allPosts.map((post) => (
          <Message key={post.id} {...post} >
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button className='px-4 py-2 my-6 font-medium text-white bg-gray-800 rounded-md hover:bg-gray-400'>
                {post.comments?.length > 0 ? post.comments?.length : 0} Comments
                </button>
            </Link>
          </Message>
        ))}
      </div>
    </>
  )
}
