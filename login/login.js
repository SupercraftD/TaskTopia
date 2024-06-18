import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

//initialize createNewAcc as false
let createNewAcc = false

//login function to will just set the accountType to the given type and show the inputs
window.login = function(type){
    window.accountType = type
    showInputs()
}

//signup function does same as login but sets createNewAcc to true
window.signup = function(type){
    window.accountType = type
    createNewAcc = true
    showInputs()
}

//showInputs makes the buttons invisible and the credentials show up
function showInputs(){
    document.getElementById("buttons").style.display = 'none';
    document.getElementById("credentials").style.display = 'grid';    
    if (createNewAcc){
        document.getElementById("name").style.display = "block";
        document.getElementById("nameInputLabel").innerHTML = window.accountType + "'s Name"
    }else{
        document.getElementById("name").style.display = "none";
    }
}

//submit function is called when user presses submit. Either logs in or signs up.
window.submit = function(){

    //gets the email and password values from the inputs
    let email = document.getElementById("emailInput").value
    let password = document.getElementById("passwordInput").value

    //if createNewAcc is true, create a new account. Otherwise login.
    if (createNewAcc){
        createUserWithEmailAndPassword(auth, email, password).then(async(userCredentials) =>{

            //signed up successfully, send user to main page
            const user = userCredentials.user

            let name = document.getElementById("nameInput").value

            console.log(user)
            console.log(userCredentials)

            await setDoc(doc(db, "Users", user.uid),{
                type:window.accountType,
                joined:serverTimestamp(),
                name:name
            })

            window.location = "../index.html"

        }).catch((error)=>{

            //some sort of error happened
            alert(error.message)

        })
    }else{
        signInWithEmailAndPassword(auth, email, password).then(async(userCredential) => {

            // Signed in successfully, send user to main page
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "Users", user.uid))

            if (userDoc.exists()){

                const data = userDoc.data()

                if (data.type != window.accountType){
                    alert("attempting to sign into the wrong account type!")
                    auth.signOut()
                }else{
                    window.location = "../index.html"
                }

            }else{
                alert("error fetching account data")
                auth.signOut()
            }
            

        }).catch((error) => {

            //some sort of error happened
            alert(error.message)

        });
    }
}