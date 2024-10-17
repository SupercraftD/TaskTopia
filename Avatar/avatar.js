import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


const firebaseConfig = {
    apiKey: "AIzaSyBMufNB0c0NTiV1WlIPXi8JS1l_MOVbQGg",
    authDomain: "tasktopia-fc42d.firebaseapp.com",
    projectId: "tasktopia-fc42d",
    storageBucket: "tasktopia-fc42d.appspot.com",
    messagingSenderId: "303297114372",
    appId: "1:303297114372:web:f5a9544e201e1c6dcda051",
    measurementId: "G-9SLQ2G0GEL"
};


//initialize the firebase app and authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

let data
let uid

let canBuy = true

onAuthStateChanged(auth, async(user) => {
    if (user) {

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user

      uid = user.uid;
      
      const userDoc = await getDoc(doc(db, "Users", uid))

      if (userDoc.exists()){

        data = userDoc.data()
        alert("Hello, "+data.name+"!")
        
        const d=(x)=>{return document.getElementById(x)}

        for (let item of data.ownedItems){
          let btn = d("templateButton").cloneNode();
          btn.innerHTML = item
          btn.id = item+"btn"
          btn.onclick =function(){
            toggle(item);
          }

          d("bar").appendChild(btn)
          //btn.style.display = "block";

        }

      }else{
        alert('where doc??')
      }


    } else {

      // User is signed out
      // send to login page

      window.location.href = "../login/login.html"
    }
});

function toggle(item){
  const d=(x)=>{return document.getElementById(x)}
  let eyes = d("eyes")
  let hair = d("hair")
  let pants = d("pants")
  let shirt = d("shirt")

  let items = {
    "Eyes": eyes,
    "Hair": hair,
    "Pants": pants,
    "Shirt": shirt
  }

  let e = items[item]

  if (e.style.display == "none"){
    e.style.display = "block"
  }else{
    e.style.display = "none"
  }

}