var coins=50;

window.onload = function(){
  document.getElementById("value").innerHTML=coins;
}

function buy(id, price){
  if (price>coins){
    alert("You don't have enough coins!\n" + "You need " + (price-coins) + " more coins!");
  } else {
    if (confirm("Are you sure you want to buy " + id + " for " + price + " coins?\nYou will have " + (coins-price) + " coins left.")){
      coins-=price;
      document.getElementById("value").innerHTML=coins;
      alert("item successfully bought")
    }
  }
}
