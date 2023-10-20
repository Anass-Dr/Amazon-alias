"use strict";

// Global Variables :
const searchInput = document.getElementById("search");
const cartSide = document.querySelector(".cart_sidebar");
const cartProduct = document.querySelectorAll(".cart_product");
let cartEventTarget;

// #- Move to products pages
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") window.location.href = "./products.html";
});

// #- Show / hide the Cart sidebar :
const sideControl = () => {
  cartSide.classList.toggle("hidden");
  document.body.classList.toggle("overflow_hidden");
};

// #- Change Product Quantity :
const quantityIncrement = (e) => {
  const quantitySpan = e.target.nextElementSibling;
  quantitySpan.textContent > 1
    ? quantitySpan.textContent--
    : (quantitySpan.textContent = 1);
};

const quantityDecrement = (e) => {
  const quantitySpan = e.target.previousElementSibling;
  quantitySpan.textContent < 10
    ? +quantitySpan.textContent++
    : (quantitySpan.textContent = 10);
};

// #- Remove Product :
cartProduct.forEach((product) =>
  product.addEventListener("click", (e) => {
    if (e.target.parentElement.classList.contains("cart_product_delete")) {
      cartEventTarget = e.currentTarget;
      e.currentTarget.classList.add("remove");
      const removeProduct = () => cartEventTarget.remove();
      setTimeout(removeProduct, 500);
    }
  })
);
