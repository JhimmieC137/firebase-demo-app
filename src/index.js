import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, getDocs,
    addDoc, deleteDoc, doc,
    onSnapshot,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore';
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
 } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVrQ30Px7AweykLP0-nAa-KFAmtVoDK8w",
    authDomain: "fireship-demo-project-5a6c7.firebaseapp.com",
    projectId: "fireship-demo-project-5a6c7",
    storageBucket: "fireship-demo-project-5a6c7.appspot.com",
    messagingSenderId: "715227958074",
    appId: "1:715227958074:web:6f127c070892d75854de03",
    measurementId: "G-EECZP9L78D"
  };

initializeApp(firebaseConfig)

// init service
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

// get realtime collection data
/*
getDocs(colRef)
 .then((snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })
    console.log(books)
})
 .catch(err => console.log(err.message))
*/
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })
    console.log(books)
})
 
// get a single document
const docRef = doc(db, 'books', 'sNMChI7lFV9X5l705unq')

// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    alert("Data sent")
    addBookForm.reset()
  })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

// update a document 
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
        .then(() => { 
        updateForm.reset()
    })
})


// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log( 'user created', cred.user)
        })
        .catch(err => console.log(err))
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {

    signOut(auth)
        .then(() => {
            console.log('user signed out')
        })
        .catch(err => alert('Something went wrong'))
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("user logged in successfully!", cred.user)
        })
        .catch(err => console.log(err))
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
})

// unsubscribe from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {

    console.log('unsubscribing...')
    unsubCol()
    unsubDoc()
    unsubAuth()
    console.log('unsubscribed')
})