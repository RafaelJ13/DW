let fotoBase64 = ""; // Variável global para guardar a imagem

window.onload = function () {
  const request = indexedDB.open("EssentiaDB", 1);
  request.onsuccess = function (event) {
    const db = event.target.result;
    // Busca sessão atual
    const txSession = db.transaction(["session"], "readonly");
    const sessionStore = txSession.objectStore("session");
    const sessionReq = sessionStore.get("currentSession");
    sessionReq.onsuccess = function () {
      const session = sessionReq.result;
      if (session && session.email) {
        // Busca dados do usuário
        const txUser = db.transaction(["users"], "readonly");
        const userStore = txUser.objectStore("users");
        const userReq = userStore.get(session.email);
        userReq.onsuccess = function () {
          const user = userReq.result;
          if (user) {
            document.getElementById("email").value = user.email || "";
            document.getElementById("nome").value = user.nome || "";
            document.getElementById("password").value = user.password || "";
            document.getElementById("morada").value = user.morada || "";
            if (document.getElementById("telefone")) {
              document.getElementById("telefone").value = user.telefone || "";
            }
            // Carrega foto se existir
            if (user.fotoPerfil) {
              document.getElementById("foto-perfil").src = user.fotoPerfil;
              fotoBase64 = user.fotoPerfil;
            } else {
              document.getElementById("foto-perfil").src = "img/default-profile.jpg";
              fotoBase64 = "";
            }
          }
        };
      }
    };
  };
};

// Preview e conversão para base64 ao selecionar imagem
document.getElementById("input-foto").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      fotoBase64 = e.target.result;
      document.getElementById("foto-perfil").src = fotoBase64;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("editar-perfil-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const password = document.getElementById("password").value;
  const morada = document.getElementById("morada").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;

  if (nome && password) {
    // Salva no IndexedDB
    const request = indexedDB.open("EssentiaDB", 1);
    request.onsuccess = function (event) {
      const db = event.target.result;
      const tx = db.transaction(["users"], "readwrite");
      const store = tx.objectStore("users");
      // Salva a foto em base64, se não houver, salva vazio
      store.put({ nome, email, password, morada, telefone, fotoPerfil: fotoBase64 });
      tx.oncomplete = function () {
        alert("Alterações salvas com sucesso!");
        window.location.href = "VerPerfil.html"; // Redireciona para o perfil após salvar
      };
    };
  } else {
    alert("Por favor, preencha os campos obrigatórios.");
  }
});

document.getElementById("mudar-foto").addEventListener("click", function () {
  alert("Funcionalidade de mudar foto ainda não implementada.");
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-link");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // Remove sessão do IndexedDB
      const req = indexedDB.open("EssentiaDB", 3);
      req.onsuccess = function (event) {
        const db = event.target.result;
        if (db.objectStoreNames.contains("session")) {
          const tx = db.transaction(["session"], "readwrite");
          const store = tx.objectStore("session");
          store.delete("currentSession");
          tx.oncomplete = function () {
            window.location.href = "Entrar.html"; // ou admin.html, conforme seu sistema
          };
        } else {
          window.location.href = "Entrar.html";
        }
      };
    });
  }
});