// Carrega dados do usuário logado
  function carregarPerfil() {
    const request = indexedDB.open("EssentiaDB", 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const txSession = db.transaction(["session"], "readonly");
      const sessionStore = txSession.objectStore("session");
      const sessionReq = sessionStore.get("currentSession");
      sessionReq.onsuccess = function () {
        const session = sessionReq.result;
        if (session && session.email) {
          const txUser = db.transaction(["users"], "readonly");
          const userStore = txUser.objectStore("users");
          const userReq = userStore.get(session.email);
          userReq.onsuccess = function () {
            const user = userReq.result;
            if (user) {
              document.getElementById("perfil-nome").textContent = user.nome || "";
              document.getElementById("perfil-email").textContent = user.email || "";
              document.getElementById("perfil-morada").textContent = user.morada || "Não definida";
              document.getElementById("perfil-telefone").textContent = user.telefone || "Não definido";
              // Mostra a foto de perfil
              const foto = user.fotoPerfil ? user.fotoPerfil : "img/default-profile.jpg";
              document.querySelector(".foto-preview img").src = foto;
            }
          };
        }
      };
    };
  }
  window.onload = carregarPerfil;

  document.addEventListener("DOMContentLoaded", function () {
    const navAuthArea = document.getElementById('nav-auth-area');
    const perfilBtn = document.getElementById('perfilDropdownBtn');
    if (perfilBtn && navAuthArea) {
      perfilBtn.addEventListener('click', function (e) {
        e.preventDefault();
        navAuthArea.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!navAuthArea.contains(e.target)) navAuthArea.classList.remove('open');
      });
      navAuthArea.querySelector('.logout-link').addEventListener('click', function (e) {
        e.preventDefault();
        // Coloque aqui seu código de logout
        alert("Logout!");
      });
    }
  });