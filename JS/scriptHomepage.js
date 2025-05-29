// script.js

function scrollToProdutos() {
    const produtos = document.getElementById("produtos");
    if (produtos) {
      produtos.scrollIntoView({ behavior: "smooth" });
    }
  }
  
  window.addEventListener("scroll", function () {
    const header = document.getElementById("main-header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  