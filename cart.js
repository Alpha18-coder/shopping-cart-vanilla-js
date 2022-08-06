import { shopItemsData } from './Data.js';

const cartAmount = document.getElementById('cartAmount');
const shoppingCart = document.getElementById('shoppingCart');

let basket = JSON.parse(localStorage.getItem("data") || [])

let calculation = () => {
    cartAmount.innerHTML = basket.map((x) => x.itemCount).reduce((x,y) => x+y,0);
}

calculation();


// User Interface

let generateCartItems = () => {
    return (shoppingCart.innerHTML = basket.map((item) => {
        let {itemCount, id} = item;
        let search = shopItemsData.find((item) => item.id === id) || [];

        return`
        <div class="cart-item" id="cart-item-${id}">
            <div class="img-container">
                <img src=${search.img} alt=${search.name} />
            </div>
            <div class="item-info">
                <div class="flex space-btw">
                    <div class="flex">
                        <h4>${search.name}</h4>
                        <span class="cart-price">$ ${search.price}</span>
                    </div>
                        <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                </div>
                <div class='buttons'>
                    <i onclick="decrement(${id})" class='bi bi-dash-lg'></i>
                    <span id=${id} class='quantity'>${itemCount}</span>
                    <i onclick="increment(${id})" class='bi bi-plus-lg'></i>
                </div>
                <h2>$ ${itemCount*search.price}</h2>
            </div>
        </div>
        `
    }))
}


let totalAmount = () => {

    if(basket.length !== 0) {
        let amount = basket.map((x) => {
            let {itemCount, id} = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            return itemCount * search.price;
        }).reduce((x,y) => x+y, 0);

        shoppingCart.innerHTML=`
        <h1>total bill: $ ${amount}</h1>
            <div class="cart-buttons">
                <button class="btn btn-checkout">checkout</button>
                <button class="btn btn-clear" onclick="clearCart()">clear cart</button>
            </div>
            
            <div>
            ${generateCartItems()}
        </div>
        `
    } else {
        shoppingCart.innerHTML = `
        <div class="cart-empty">
            <h1>cart is empty</h1>
            <a href="index.html">back to home</button>
        </div>
        `
    }
}

totalAmount();

//Logic

let saveChanges = () => {
    updateCart();
    totalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
}

let removeItem = (selectedElement) => {
    basket = basket.filter((x) => x.id !== selectedElement.id);
    saveChanges();
}

let clearCart = () => {
    basket = [];
    saveChanges();
}


let decrement = (selectedElement) => {
  let search = basket.find((x) => x.id === selectedElement.id);

  if (search.itemCount === 0) return; //avoids negative numbers
  else search.itemCount -= 1; //it does exist but it's a lot of products

  update(selectedElement.id);
  basket = basket.filter((x) => x.itemCount !== 0); //first remove
  totalAmount(); //then re-render the basket
  localStorage.setItem("data", JSON.stringify(basket));
}


let increment = (selectedElement) => {
    let search = basket.find(item => item.id === selectedElement.id);
    search.itemCount += 1;
    update(selectedElement.id);
    localStorage.setItem("data", JSON.stringify(basket));
}

let update = (id) => {
    let search = basket.find((item) => item.id === id);
    document.getElementById(id).innerText = search.itemCount;
    updateCart();
    totalAmount();
}

let updateCart = () => {
    let cartCount = basket.map((item) => item.itemCount).reduce((x,y) => x+y,0);
    cartAmount.innerHTML = cartCount;
}

updateCart();

window.decrement = decrement;
window.increment = increment;
window.removeItem = removeItem;
window.clearCart = clearCart;
