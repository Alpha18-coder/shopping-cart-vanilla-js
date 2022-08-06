import { shopItemsData } from './Data.js';

const catalog = document.querySelector('.product-catalog');
const cartAmount = document.querySelector('.cart-amount');

/* VARIABLES */

//stores items in the basket
let basket = JSON.parse(localStorage.getItem("data") || "[]");


function addProduct() {
    const productList = document.createElement('ul');
    productList.classList.add('product-list');


    productList.innerHTML = shopItemsData.map((item) => {

         let { id, name, price, desc, img } = item;
        let searchBasket = basket.find((x) => x.id === item.id) || [];
        
        return `
        <li class='item' id="product-id-${id}">
            <img width='219' src=${img} alt=${name} />
            <div class='details'>
                <h3>${name}</h3>
                <p>${desc}</p>
                <div class='price-quantity'>
                    <h2>$${price}</h2> 
                    <div class='buttons'>
                        <i onclick="decrement(${id})" class='bi bi-dash-lg'></i>
                        <span id=${id} class='quantity'>${searchBasket.itemCount === undefined ? 0 : searchBasket.itemCount}</span>
                        <i onclick="increment(${id})" class='bi bi-plus-lg'></i>
                    </div>
                </div>
            </div>
        </li>
    `}).join('');


    catalog.appendChild(productList);
}

addProduct();



let decrement = (selectedElement) => {
  let search = basket.find((x) => x.id === selectedElement.id);

  //checking if the object already exists
  if (search === undefined) alert("There isn't any product to delete!");
  else if (search.itemCount === 0) return; //avoids negative numbers
  else search.itemCount -= 1; //it does exist but it's a lot of products

  update(selectedElement.id);
  basket = basket.filter((x) => x.itemCount !== 0);
  localStorage.setItem("data", JSON.stringify(basket));
}

let increment = (selectedElement) => {
    let currentItem = basket.find(item => item.id === selectedElement.id);

    if(currentItem === undefined) {
        basket.push({
            id: selectedElement.id,
            itemCount: 1
        })
    } else {
        currentItem.itemCount += 1;
    }

    update(selectedElement.id);
    localStorage.setItem("data", JSON.stringify(basket));
}

let update = (id) => {
    let search = basket.find((item) => item.id === id);
    document.getElementById(id).innerText = search.itemCount;
    updateCart();
}

let updateCart = () => {
    let cartCount = basket.map((item) => item.itemCount).reduce((x,y) => x+y,0);
    cartAmount.innerHTML = cartCount;
}

updateCart();

window.decrement = decrement;
window.increment = increment;

