import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import  Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return{
    top: '${top}%',
    left: '${left}%',
    transform: 'translte(-${top}%, -${left}%)',
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxshadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has looged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform ome cleanup actions
      unsubscribe();
    }

  }, [user, username]);

  // UseEffect -> Runs a piece of code based on a specific condition

  useEffect(() => {
    //this is where the code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time a new post is added, this code fires
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id, 
      post: doc.data()
    })));
    })
  }, []); //condition

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => {alert(error.message)})

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault(); //it prevent the browser from redirecting the page to another page

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={() => setOpen(false) }
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
            <img
             className="app__headerImage"
             src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
             alt=""
            />
            </center>

            <Input 
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign up</Button>
          
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false) }
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
            <img
             className="app__headerImage"
             src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
             alt=""
            />
            </center>
            <Input 
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          
          </form>
        </div>
      </Modal>


      <div className="app__header">
        <img
        className="app__headerImage"
        src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />

      {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
      ): (
        <div className="app__loginContianer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}  
      
      </div>

      <div className="app_post">
        <div>
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }</div>
      </div>
      
      {user?.displayName ? (  //? - optionals react similar to try catch..
        <ImageUpload username={user.displayName} />
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}


      {/* <Post username="sweetysutar" caption="Learning React js with CP" imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--54ca_F2q--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/1wwdyw5de8avrdkgtz5n.png" />
      <Post username="coder" caption="A guide for begginers" imageUrl="https://www.freecodecamp.org/news/content/images/2020/08/How-To-Learn-To-Code.png" /> */}


    </div>
    
  );
}

export default App;
