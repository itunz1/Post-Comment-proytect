import React, { useEffect, useState } from 'react';
import Message from '../components/Message';
import { useRouter } from 'next/router';
import { auth, db } from '../utils/firebase';
import { toast } from 'react-toastify';
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';

export default function Details() {

    const route = useRouter();
    const routeData = route.query
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    //Submit a message
    const submitMessage = async () => {
        //check if user is logged
        if(!auth.currentUser){
            return route.push('/auth/login')
        }
        if(!message){
            toast.error('Dont leave an empty message 😅', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            return;
        };
        const docRef = doc(db, 'posts', routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now(),
            })
        });
        setMessage("");
    };

    //Get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            setAllMessages(snapshot.data().comments)
        });
        return unsubscribe;
    };

    useEffect(() => {
        if(!route.isReady) return;
        getComments();
    }, [route.isReady])

  return (
    <div>
        <Message {...routeData}></Message>
        <div className='my-4'>
            <div className='flex '>
                <input 
                onChange={(e) => setMessage(e.target.value)} 
                type='text' value={message} 
                placeholder="Send message 😀"
                className='w-full p-2 text-sm text-white bg-gray-800'
                />
                <button onClick={submitMessage} type='submit' className='px-4 py-2 text-sm text-white bg-cyan-500'>Submit</button>
            </div>
            <div className='py-6'>
                <h2 className='font-bold'>Comments</h2>
                {allMessages?.map(message => (
                    <div className='p-4 my-4 bg-white border-2' key={message.time}>
                        <div className='flex items-center gap-2 mb-4'>
                            <img className='w-10 rounded-full' src={message.avatar}/>
                            <h2>{message.userName}</h2>
                        </div>
                        <h2>{message.message}</h2>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
