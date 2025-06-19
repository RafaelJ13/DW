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
  
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  btn.onclick = function() {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  };
  // Fecha menu ao clicar em link
  document.querySelectorAll('#mobileNav a').forEach(link => {
    link.onclick = () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
    };
  });
  // Fecha menu ao clicar no X
const closeBtn = document.querySelector('.close-mobile-nav');
if (closeBtn) {
  closeBtn.onclick = () => {
    btn.classList.remove('open');
    nav.classList.remove('open');
  };
}

