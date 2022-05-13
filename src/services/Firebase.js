import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
  apiKey: "AIzaSyD8_4JYec_QackOJXPWvQ7gHEbfYFgDOJM",
  authDomain: "psi-tarefas-f819d.firebaseapp.com",
  databaseURL: "https://psi-tarefas-f819d-default-rtdb.firebaseio.com",
  projectId: "psi-tarefas-f819d",
  storageBucket: "psi-tarefas-f819d.appspot.com",
  messagingSenderId: "100222859927",
  appId: "1:100222859927:web:5ad6d3a8e6cc515391c7d2",
  measurementId: "G-F1TDGDS0RX"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
