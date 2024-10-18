import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, serverTimestamp, getDocs, query, collection, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


const firebaseConfig = {
    apiKey: "AIzaSyBMufNB0c0NTiV1WlIPXi8JS1l_MOVbQGg",
    authDomain: "tasktopia-fc42d.firebaseapp.com",
    projectId: "tasktopia-fc42d",
    storageBucket: "tasktopia-fc42d.appspot.com",
    messagingSenderId: "303297114372",
    appId: "1:303297114372:web:f5a9544e201e1c6dcda051",
    measurementId: "G-9SLQ2G0GEL"
};


let input
let btn

let uid
let userDoc

//initialize the firebase app and authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

async function submit(){

  //  btn.style.display = 'none'

    let id = input.value

    const q = query(collection(db, "Users"), where("type","==","parent"))
    const qS = await getDocs(q)

    let found = false

    for (let d of qS.docs){

        const data = d.data()
        console.log(data)

        if (data.parentId == id){

            await updateDoc(doc(db, "Users", uid), {
                parent: id
            })
            found = true

        }

    }

    if (!found){
        alert("no parent id found!")
    }else{
        alert("successfully connected!")
    }

   // btn.style.display = 'grid'

}



onAuthStateChanged(auth, async(user) => {
    if (user) {

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user

        uid = user.uid;
      
        userDoc = await getDoc(doc(db, "Users", uid))

      if (userDoc.exists()){

        const data = userDoc.data()

        input = document.getElementById("in")
        btn = document.getElementById("submit")

        btn.onclick = submit
    
      }else{
        alert('where doc??')
      }
    } else {

      // User is signed out
      // send to login page

      window.location.href = "../login/login.html"
    }
});