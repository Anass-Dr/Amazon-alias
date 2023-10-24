"use strict";

// Global Variables :
const searchInput = document.getElementById("search");
const cartSide = document.querySelector(".cart_sidebar");
const cartProduct = document.querySelectorAll(".cart_product");
const products = document.querySelectorAll(".product_card");
const cartItemsNumber = document.getElementById("cart_items_number");
const pageTotal = document.getElementById("page_total");

const cartProducts = JSON.parse(sessionStorage.getItem("cartProducts")) || [];
let cartEventTarget;

// #- Init Cart Sidebar :
loadProducts();

// #- Move to products pages
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") window.location.href = "./products.html";
});

// #- Search for products :
const getProductIndex = (number) =>
  cartProducts.findIndex((product) => product.number == number);

// #- Load Products :
function loadProducts() {
  const products = JSON.parse(sessionStorage.getItem("cartProducts"));
  cartItemsNumber.textContent = products?.length || "";
  products?.forEach((product) => createProduct(product));
  priceTotalCalc();
}

// #- Update Data :
function updateData(action, payload) {
  switch (action) {
    case "add":
      createProduct(payload.product);
      cartProducts.push(payload.product);
      break;
    case "delete":
      cartProducts.splice(getProductIndex(payload.number), 1);
      break;
    case "quantityInc":
      cartProducts[getProductIndex(payload.number)].quantity++;
      break;
    case "quantityDec":
      cartProducts[getProductIndex(payload.number)].quantity--;
  }
  sessionStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

// #- Create New Element in Cart Sidebar :
function createProduct(product) {
  document.querySelector(".cart_products").insertAdjacentHTML(
    "afterbegin",
    `
      <figure onclick={cartProductListener(event)} class="cart_product">
        <div class="cart_product_img" data-number="${product.number}"></div>
        <div class="cart_info">
          <h5>${product.title}</h5>
          <p>${product.price}</p>
          <div class="cart_product_action">
            <div class="quantity">
              <span data-action="minus">-</span>
              <span>${product.quantity}</span>
              <span data-action="plus">+</span>
            </div>
            <div class="cart_product_delete">
              <i class="fa-solid fa-trash"></i>
            </div>
          </div>
        </div>
      </figure>
  `
  );
}

// #- Add Product to Cart :
function addProduct(product) {
  const isExist = cartProducts.some(
    (item) =>
      item.number == product.querySelector(".product_card_img").dataset.number
  );
  if (isExist) return;

  const productObj = {
    number: +product.querySelector(".product_card_img").dataset.number,
    title: product.querySelector("h3").textContent.trim(),
    price: product.querySelector("h4 > span:first-child").textContent,
    quantity: 1,
  };
  cartItemsNumber.textContent++;
  updateData("add", { product: productObj });
  priceTotalCalc();
}

// #- Show / hide the Cart sidebar :
function sideControl() {
  cartSide.classList.toggle("hidden");
  document.body.classList.toggle("overflow_hidden");
  document.getElementById("dark_layer").classList.toggle("hidden");
}

// #- Change Product Quantity :
const quantityIncrement = (target, productObj) => {
  const quantitySpan = target.previousElementSibling;
  if (quantitySpan.textContent < 10) {
    quantitySpan.textContent++;
    updateData("quantityInc", {
      number: productObj.querySelector(".cart_product_img").dataset.number,
    });
  }
};

const quantityDecrement = (target, productObj) => {
  const quantitySpan = target.nextElementSibling;
  if (quantitySpan.textContent > 1) {
    quantitySpan.textContent--;
    updateData("quantityDec", {
      number: productObj.querySelector(".cart_product_img").dataset.number,
    });
  }
};

// #- Remove Product :
const rmProduct = (e) => {
  cartEventTarget = e.currentTarget;
  cartEventTarget.classList.add("remove");
  cartItemsNumber.textContent > 1
    ? cartItemsNumber.textContent--
    : (cartItemsNumber.textContent = "");
  updateData("delete", {
    number: cartEventTarget.querySelector(".cart_product_img").dataset.number,
  });
  setTimeout(() => cartEventTarget.remove(), 500);
  priceTotalCalc();
};

// #- Calcul Total Price :
function priceTotalCalc() {
  let total = 0;
  cartProducts?.forEach(
    (product) => (total += product.price.substring(1) * product.quantity)
  );
  document.querySelector(".total_price").textContent = "$" + total;
}

// Listening to Products :
products.forEach((product) => {
  product.addEventListener("click", (e) => {
    if (e.target.classList.contains("add_to_cart")) {
      addProduct(product);
      sideControl();
    }
  });
});

// Listening to Cart Products :
function cartProductListener(e) {
  if (e.target.parentElement.classList.contains("quantity")) {
    e.target.dataset.action == "plus"
      ? quantityIncrement(e.target, e.currentTarget)
      : quantityDecrement(e.target, e.currentTarget);
    priceTotalCalc();
  } else if (e.target.parentElement.classList.contains("cart_product_delete")) {
    rmProduct(e);
  }
}

function loadCart() {
  const container = document.querySelector("#cart_main .products");
  cartProducts.forEach((product) =>
    container.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="product_details">
      <label class="checkbox">
        <input type="checkbox" />
        <span class="checkmark"></span>
      </label>
      <div class="product_img" data-number="${product.number}"></div>
      <div class="product_info">
        <h3>${product.title}</h3>
        <p class="product_info-p">Selected Vue le 31</p>
        <span class="price">${product.price}</span>
        <span class="shipping">Shipping: $5</span>
      </div>
      <div class="likes">
        <div>
          <i class="fa-regular fa-heart"></i>
          <i class="fa-solid fa-trash"></i>
        </div>
        <div class="shipping_quantity">
          <span><b>-</b></span>
          <p>1</p>
          <span><b>+</b></span>
        </div>
      </div>
    </div>
  `
    )
  );
  pageTotal.textContent =
    "$" +
    cartProducts.reduce(
      (acc, curr) => acc + curr.quantity * curr.price.slice(1),
      0
    );
}
