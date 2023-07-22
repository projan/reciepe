import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot, addDoc, deleteDoc, 
         query, where, orderBy , serverTimestamp , updateDoc   
         } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword , signOut , signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApPLk_krpihar8SHJaOx2wpd6xE8gPHS8",
    authDomain: "jsproject-8985a.firebaseapp.com",
    projectId: "jsproject-8985a",
    storageBucket: "jsproject-8985a.appspot.com",
    messagingSenderId: "845253114642",
    appId: "1:845253114642:web:f90a56c9b78cf9913491cb",
    measurementId: "G-Y7P02WCS82"
  };


const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Authorization initialization
const auth = getAuth();


//collection reference
const colRef = collection(db, 'recipes');

// queires 
const q = query(colRef,  orderBy ('created_at'));

//get collection data
/* getDocs(colRef)
.then((snapshot)=>{
    let receipes =[]
    snapshot.docs.forEach((doc)=>{
        receipes.push({...doc.data(),id : doc.id})
    })
    console.log(receipes);
})
.catch(err=>{
    console.log('error');
}) */

//get real collection data
const unsubCol = onSnapshot(q,(snapshot)=>{
    let receipes =[]
    snapshot.docs.forEach((doc)=>{
        receipes.push({...doc.data(),id : doc.id})
    })
    console.log(receipes);
})



//adding documents
const addReciepeForm = document.querySelector('.add')
addReciepeForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    addDoc(colRef, {
        title: addReciepeForm.title.value,
        author: addReciepeForm.author.value,
        created_at: serverTimestamp()
    })
    .then(()=>{
        addReciepeForm.reset();
    })
})

const deleteReciepeForm = document.querySelector('.delete')
deleteReciepeForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const docRef = doc(db, 'recipes', deleteReciepeForm.id.value)

    deleteDoc(docRef)
    .then(()=>{
        deleteReciepeForm.reset();
    })
})

//get a single document
const docRef = doc(db, 'recipes', 'TVmxNYaOdE5WvzF3gYhm')
const unsubDoc = onSnapshot(docRef, (doc) =>{
        console.log(doc.data(), doc.id)
    })

//updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    /* const docRef = doc(db, 'recipes', updateForm.id.value)
    updateDoc(docRef,{
        title: "BEST NEWARI'S FOOD"
    })
    .then(()=>{
        updateForm.reset();

    }) */
})

// Signing users up
const singupForm = document.querySelector('.signup')
singupForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const email = singupForm.email.value;
    const password = singupForm.password.value;

    createUserWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log('User created: ', cred.user)
        singupForm.reset();
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

// Log in and logout setup
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', ()=>{

    signOut(auth)
    .then(()=>{
        console.log('user signed out')
    })
    .catch((err)=>{
        console.log('user error')
    })


})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth,email,password)
    .then((cred)=>{
        console.log('user logged in :', cred.user)
    })
    .catch((err)=>{
        console.log(err.message)
    })


})

// subscribe to auth changes
const unsubAuth = onAuthStateChanged(auth, (user)=>{
    console.log('user status change:'+  user)
})

//unsubscibe from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', ()=>{
        console.log('unsubscribing')
        unsubCol()
        unsubDoc()
        unsubAuth()
})