import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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
    document.getElementById("credentials").style.display = 'block';    
}

//submit function is called when user presses submit. Either logs in or signs up.
window.submit = function(){

    //gets the email and password values from the inputs
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    //if createNewAcc is true, create a new account. Otherwise login.
    if (createNewAcc){
        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) =>{

            //signed up successfully, send user to main page
            const user = userCredentials.user
            window.location = "../index.html"

        }).catch((error)=>{

            //some sort of error happened
            alert(error.message)

        })
    }else{
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

            // Signed in successfully, send user to main page
            const user = userCredential.user;
            window.location = "../index.html"
            

        }).catch((error) => {

            //some sort of error happened
            alert(error.message)

        });
    }
}