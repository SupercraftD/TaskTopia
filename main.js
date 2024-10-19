import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


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

onAuthStateChanged(auth, async(user) => {
    if (user) {

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user

      const uid = user.uid;
      
      const userDoc = await getDoc(doc(db, "Users", uid))

      if (userDoc.exists()){

        const data = userDoc.data()

        document.getElementById("logout").onclick = async function(){
          await auth.signOut()
          window.location.href = window.location.href
        }

        if (data.type == "parent"){
          document.getElementById("parent").style.display = 'grid'
          document.getElementById("buttons").style.display = 'none'
          document.getElementById("parentIdCode").innerHTML = data.parentId
          document.getElementById("list").onclick = function(){
            window.location.href = "tasksParent/tasks.html"
          }
        }

        document.getElementById("quiz").onclick = function(){
          window.location.href = "quizbowl/QuizBowl.html"
        }
        document.getElementById("tasks").onclick = function(){
          window.location.href = "tasks/tasks.html"
        }
        document.getElementById("settings").onclick = function(){
          window.location.href = "settings/settings.html"
        }
        document.getElementById("shop").onclick = function(){
          window.location.href = "Shop/shop.html"
        }
        document.getElementById("connect").onclick = function(){
          window.location.href = "Connect/connect.html"
        }
        document.getElementById("avatar").onclick = function(){
          window.location.href = "Avatar/avatar.html"
        }


      }else{
        alert('where doc??')
      }


    } else {

      // User is signed out
      // send to login page

      window.location.href = "login/login.html"
    }
});
