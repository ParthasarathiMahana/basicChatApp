import './App.css';
// for using firebase 
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// for communicating with firebase and authentication
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { useState } from 'react';

// for identification of our project
firebase.initializeApp({
  apiKey: "AIzaSyA0kY7zOrqRJuscco5t-2jVjqxcIPhMJ5o",
  authDomain: "chatapp-51cb1.firebaseapp.com",
  projectId: "chatapp-51cb1",
  storageBucket: "chatapp-51cb1.appspot.com",
  messagingSenderId: "862187183339",
  appId: "1:862187183339:web:c693aea36dfd6e177272ae"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  // checking if user is logged in
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {/* if logged in show chat section otherwise show signin page */}
      {user ? <ChatSection/>:<SigninPage/>}
    </div>
  );
}

// signin page component
function SigninPage(){

  const signInWithGoogleAc= ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogleAc}>Signin with Your Google Account</button>
  )
}

// signout btn
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign out</button>
  )
}

// chat section
function ChatSection(){

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const handleSend = async(e)=>{
    e.preventDefault();

    const{uid} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })

    setFormValue('');
  }

  return(
    <>
      <div>
        {messages && messages.map(msg=><Chatmessage key={msg.id} message={msg}/>)}
      </div>

      <form onSubmit={handleSend}>
        <input value={formValue} onChange={(e)=>{setFormValue(e.target.value)}}/>
        <button type='submit'>send</button>
      </form>

      <div><SignOut/></div>
    </>
  )
}

function Chatmessage(props){
  const {text, uid} = props.message;

  const messageClass = uid == auth.currentUser.uid?'sent':'received'

  return (
    <div className={`message ${messageClass}`}>
      <p>{uid}: {text}</p>
    </div>
  )
}

export default App;
