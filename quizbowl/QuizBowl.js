import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

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

let cUser

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let uName

onAuthStateChanged(auth, async(user) => {
    if (user) {

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user

      const uid = user.uid;
      cUser = user

      const userDoc = await getDoc(doc(db, "Users", uid))

      if (userDoc.exists()){

        const data = userDoc.data()
        uName = data.name


        document.getElementById("top").innerHTML="Joining/Creating lobby...."
    
        const lobbies = await getDoc(doc(db, "QuizBowl", "Lobbies"))
    
        if (lobbies.exists()){
    
            let lData = lobbies.data()
            
            let lobbyId = ""

            if (lData.openLobby){

                lobbyId = lData.openLobbyId
                let c = await getDoc(doc(db, "QuizBowl", lobbyId))
                
                if (c.exists()){
                    c=c.data()
                    c.players.push(user.uid)
                    c.playerAnswers[user.uid] = []
                    c.points[user.uid] = 0
                    c.playerNames[user.uid] = uName
                    
                    await setDoc(doc(db,"QuizBowl",lobbyId),c)
                }

            }else{
    
                //no open lobby - create one
    
                const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
                const questions = await response.json();
    
                if (questions.response_code != 0){
                    alert("error getting questions")
                    return
                }
                
                let currentLobby = {
                    players:[user.uid],
                    questions:questions.results,
                    host:cUser.uid,
                    id:makeid(20),
                    started:false,
                    currentQuestion:0,
                    timeUp:false,
                    playerAnswers:{},
                    points:{},
                    playerNames:{}
                }
                currentLobby.playerAnswers[cUser.uid] = []
                currentLobby.points[cUser.uid] = 0
                currentLobby.playerNames[cUser.uid] = uName
                lData.openLobby = true
                lData.openLobbyId = currentLobby.id
                
                lobbyId = currentLobby.id

                await setDoc(doc(db, "QuizBowl", currentLobby.id), currentLobby)
                await setDoc(doc(db, "QuizBowl", "Lobbies"), lData)
                
            }
            
            document.getElementById("top").innerHTML = "In Lobby!"
            document.getElementById("leave").style.display = "block"
            const unsub = onSnapshot(doc(db, "QuizBowl", lobbyId), lobbyUpdate)

        }

      }else{
        alert('where doc??')
      }


    } else {

      // User is signed out
      // send to login page

      window.location.href = "/login/login.html"
    }
});

let lobby
let timerId
let displayedQuestion = -1

async function lobbyUpdate(d){

    lobby = d.data()

    if (!lobby.started){
        document.getElementById("playerCount").innerHTML = lobby.players.length.toString()
        if (cUser.uid == lobby.host){
            if (lobby.players.length > 1){
                document.getElementById("enter").style.display = 'block'
            }else{
                document.getElementById("enter").style.display = 'none'
            }
        }
    }else{
        document.getElementById("lobby").style.display = 'none';

        if (!lobby.timeUp){
            
            if (lobby.currentQuestion >= lobby.questions.length){
                //round ends

                if (timerId){
                    clearTimeout(timerId)
                }

                let a = []
                for (let p in lobby.points) {
                    a.push([p,lobby.points[p]])
                }
                a.sort((a,b)=>{return b[1]-a[1]})

                document.getElementById("top").innerHTML = "Leaderboard:"

                for (let i=0; i<a.length; i++){
                    document.getElementById("winners").innerHTML += "<li>"+lobby.playerNames[a[i][0]]+"</li>"
                }

                return
            }
            let question = lobby.questions[lobby.currentQuestion]
            if (displayedQuestion != lobby.currentQuestion){
                

                document.getElementById("top").innerHTML = question.question

                displayedQuestion = lobby.currentQuestion

                let options = question.incorrect_answers
                if (options.length > 3){
                    options = options.slice(0,3)
                }
                options.push(question.correct_answer)
                shuffleArray(options)

                for (let i=0; i<options.length; i++){
                    let btn = document.getElementById("i" + (i+1).toString())
                    btn.style.display = 'block'
                    btn.innerHTML = options[i]
                    btn.onclick = async ()=>{

                        for (let j=1;j<=4;j++){
                            document.getElementById("i"+j.toString()).style.display = 'none'
                        }

                        let a = [btn.innerHTML, Date.now(),uName]

                        lobby.playerAnswers[cUser.uid] = a

                        await setDoc(doc(db, "QuizBowl", lobby.id),lobby)

                    }
                }


                if (cUser.uid == lobby.host){
                    if (timerId){
                        clearTimeout(timerId)
                    }
                    timerId = setTimeout(questionTimeUp, 5000)
                }
            }
            document.getElementById("game").style.display = 'grid';
        }else{

            //question time is up

            for (let j=1;j<=4;j++){
                document.getElementById("i"+j.toString()).style.display = 'none'
            }

            let q = lobby.questions[lobby.currentQuestion]

            let w = ""
            let wt = -1
            let wi = ""

            for (let i in lobby.playerAnswers){
                let a = lobby.playerAnswers[i]
                console.log(a,q)
                if (q.correct_answer == a[0]){

                    if (wt == -1 || a[1] < wt){
                        wt = a[1]
                        w = a[2]
                        wi = i
                    }

                }
            }

            if (wt == -1){
                document.getElementById("top").innerHTML = "No one got it right!"
            }else{
                document.getElementById("top").innerHTML = w + " won!"
            }

            if (cUser.uid == lobby.host){
                setTimeout(async()=>{
                    lobby.timeUp = false
                    lobby.currentQuestion++
                    if (wi!=''){
                        lobby.points[wi]++
                    }
                    await setDoc(doc(db, "QuizBowl",lobby.id),lobby)    
                },2000)
            }

        }
        
    }

}

async function questionTimeUp(){
    lobby.timeUp = true
    await setDoc(doc(db, "QuizBowl", lobby.id), lobby)
}

window.startGame = async function(){
    document.getElementById("lobby").style.display = 'none';

    lobby.started = true
    await updateDoc(doc(db,"QuizBowl","Lobbies"),{openLobby:false})
    await setDoc(doc(db, "QuizBowl", lobby.id), lobby)

}

window.leave = async function(){
    document.getElementById("leave").style.display = 'none'
    if (lobby){
        if (cUser.uid == lobby.host){
            if (lobby.players.length > 1){
                lobby.host = lobby.players[1]
                lobby.players.shift()
                await setDoc(doc(db,"QuizBowl",lobby.id),lobby)
            }else{
                await updateDoc(doc(db,"QuizBowl","Lobbies"),{openLobby:false})
            }
        }else{
            console.log(lobby.players,lobby.players.indexOf(cUser.uid))
            lobby.players.splice(lobby.players.indexOf(cUser.uid),1)
            await setDoc(doc(db,"QuizBowl",lobby.id),lobby)
        }
    }
    window.location.href = "../index.html"
}
