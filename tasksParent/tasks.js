import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, arrayUnion, arrayRemove, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


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
        alert("Hello, "+data.name+"!")


        if (data.type == "parent"){
          
          let nameIn = document.getElementById("taskName")
          let timeIn = document.getElementById("taskTime")
          let submit = document.getElementById("addTask")

          submit.onclick = async function(){
            submit.style.display = 'none'

            let taskObj = {
              name:nameIn.value,
              time:timeIn.value,
              completed:false
            }

            if (taskObj.time != ''){
              await updateDoc(doc(db, "Users", uid), {
                tasks: arrayUnion(taskObj)
              })
  
            }else{
              alert("set a time!")
            }

            submit.style.display = 'block'

            window.location.href = window.location.href
          }
          data.tasks.sort((a,b)=>{
            const v = (x)=>{
              return parseInt(x.time.split(":")[0])*60 + parseInt(x.time.split(":")[1])
            }

            return v(a) - v(b)
          })

          for (let task of data.tasks){

            let taskElement = document.getElementById("taskTemplate").cloneNode(true)
            taskElement.id = task.name

            console.log(taskElement.childNodes)

            let [a,nameElement,b,timeElement,c,completedElement,d,removeButton] = taskElement.childNodes
            nameElement.innerHTML = task.name
            timeElement.innerHTML = task.time
            
            if (task.completed){
              completedElement.innerHTML = "Completed yet: Yes"
            }else{
              completedElement.innerHTML = "Completed yet: No"
            }

            taskElement.style.display = 'block'
            document.getElementById("list").appendChild(taskElement)

            removeButton.onclick = async function(){
              taskElement.style.display = 'none'

              await updateDoc(doc(db, "Users", uid), {
                tasks: arrayRemove(task)
              })
  
  
              taskElement.style.display = 'block'
  
              window.location.href = window.location.href

            }

          }

        }else{
          alert("parent only page")
          window.location.href = "../index.html"
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