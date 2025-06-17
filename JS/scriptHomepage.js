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

document.addEventListener("DOMContentLoaded", function () {
  const navAuthArea = document.getElementById('nav-auth-area');
  const request = indexedDB.open("EssentiaDB", 1);
  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(["session"], "readonly");
    const store = tx.objectStore("session");
    const getSession = store.get("currentSession");
    getSession.onsuccess = function () {
      const session = getSession.result;
      if (session && session.email) {
        // Mostra dropdown (sem JS extra)
        navAuthArea.innerHTML = `
          <div class="nav-profile dropdown">
            <button class="profile-btn">Perfil</button>
            <div class="dropdown-content">
              <a href="EditarPerfil.html">Editar Perfil</a>
              <a href="VerPerfil.html">Ver Perfil</a>
              <a href="Favoritos.html">Favoritos</a>
              <a href="#" class="logout-link">Sair</a>
            </div>
          </div>
        `;
      } else {
        // Mostra só o botão Entrar
        navAuthArea.innerHTML = `<a href="Entrar.html" class="profile-btn">Entrar</a>`;
      }
    };
  };
});
