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
        
        refresh()

      }else{
        alert('where doc??')
      }


    } else {

      // User is signed out
      // send to login page

      window.location.href = "../login/login.html"
    }
});


//updates the coin count and the shop catalog. Should be called every time the page state is updated
async function refresh(){
  canBuy = true
  document.getElementById("coinCount").innerHTML=data.coins;

  let shop = document.getElementById("shop")

  while (shop.children.length > 0){
    shop.removeChild(shop.children[0])
  }

  let itemCatalog = await getDoc(doc(db,"Shop","catalog"))

  if (itemCatalog.exists()){

    const itemData = itemCatalog.data()

    let sortedKeys = Object.keys(itemData)
    sortedKeys.sort((a,b)=>{
      return itemData[a].cost - itemData[b].cost
    })

    for (let itemName of sortedKeys){

      if (data.ownedItems.includes(itemName)){
        continue
      }

      let item = itemData[itemName]

      let itemElement = document.getElementById("itemTemplate").cloneNode(true)
      itemElement.id = itemName
      itemElement.style.display = "block"

      let name = itemElement.children[0]
      let img = itemElement.children[2]
      let price = itemElement.children[4]
      let buy = itemElement.children[6]
      img.src = "/"+item.image
      name.innerHTML = "Name: " + itemName
      price.innerHTML = "Price: " + item.cost.toString()
      buy.onclick = function(){
        if (canBuy){
          canBuy = false
          purchase(itemName, item.cost)
        }
      }

      if (item.cost > data.coins){
        itemElement.style.backgroundColor = 'red'
      }

      document.getElementById('shop').appendChild(itemElement)
    }

  }else{
    alert("could not fetch items")
  }

}

async function purchase(id, price){
  
  if (price>data.coins){
    alert("You don't have enough coins!\n" + "You need " + (price-data.coins) + " more coins!");
  } else {
    if (confirm("Are you sure you want to buy " + id + " for " + price + " coins?\nYou will have " + (data.coins-price) + " coins left.")){
      data.coins-=price;
      data.ownedItems.push(id)
      await updateDoc(doc(db, "Users", uid), data)
      alert("item successfully bought")
    }
  }
  
  refresh()
}
