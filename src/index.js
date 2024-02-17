import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDfwpSsi-tqqYO-AZbLEL-_t-fiQpOZkLk",
    authDomain: "test-c1bf8.firebaseapp.com",
    projectId: "test-c1bf8",
    storageBucket: "test-c1bf8.appspot.com",
    messagingSenderId: "302921975848",
    appId: "1:302921975848:web:49a52b1f78ea608a5dcd1d"
  };

  initializeApp(firebaseConfig)

  // init services
  const db = getFirestore()
  const auth = getAuth()

  // collection ref
  const colRef = collection(db, 'books')

  // queries
  //const q = query(colRef, where("author", "==", "franz kafka"))

  // real time collection data
  onSnapshot(colRef, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  })

  // adding documents
  const addBookForm = document.querySelector('.add')
  addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
    })
    .then(() => {
        addBookForm.reset()
    })
  })

  // deleting documents
  const deleteBookForm = document.querySelector('.delete')
  deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
         })
  })

  // updating documents
  const updateForm = document.querySelector('.update')
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'new title'
    })
    .then(() => {
        updateForm.reset()
    })
  })

  // get a single document
  const docRef = doc(db, 'books', "Psh1hQjYsIn4mZWhsZ47")

  onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
  })

  // signing up
  const signupForm = document.querySelector('.signup')
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
       // console.log('user created', cred.user)
        signupForm.reset()
    })
    .catch((err) => {
        console.log(err.message)
    })
  })

  // logging in and out 
  const logoutButton = document.querySelector('.logout')
  logoutButton.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
       // console.log('user is logged out')
    })
    .catch((err) => {
        console.log(err.message)
    })
  })

  const loginForm = document.querySelector('.login')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
       // console.log('user is logged in:', cred.user)
    })
    .catch((err) => {
        console.log(err.message)
    })
  })

  // subscribing to auth changes
  onAuthStateChanged(auth, (user) => {
    console.log('user status changed', user)
  })