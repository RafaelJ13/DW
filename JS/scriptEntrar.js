// Configuração do IndexedDB
const dbName = "EssentiaDB";
const storeName = "users";
const sessionStoreName = "session";
let db;

// Inicializa IndexedDB
const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath: "email" });
  }
  if (!db.objectStoreNames.contains(sessionStoreName)) {
    db.createObjectStore(sessionStoreName, { keyPath: "id" });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  atualizarMenu(); // Atualiza o menu com base no estado de login
};

request.onerror = function () {
  console.error("Erro ao abrir o banco de dados.");
};

// Função para adicionar usuário
function addUser(user) {
  const transaction = db.transaction([storeName], "readwrite");
  const store = transaction.objectStore(storeName);
  const request = store.add(user);

  request.onsuccess = function () {
    alert("Usuário cadastrado com sucesso!");
    salvarSessao(user.email); // Salva a sessão do usuário recém-cadastrado
    atualizarMenu(); // Atualiza o menu para refletir o estado de login
  };

  request.onerror = function () {
    alert("Erro ao cadastrar usuário. O email já está em uso.");
  };
}

// Função para autenticar usuário
function authenticateUser(email, password) {
  const transaction = db.transaction([storeName], "readonly");
  const store = transaction.objectStore(storeName);
  const request = store.get(email);

  request.onsuccess = function () {
    const user = request.result;
    if (user && user.password === password) {
      // Salva sessão
      const txSession = db.transaction(["session"], "readwrite");
      const sessionStore = txSession.objectStore("session");
      sessionStore.put({ id: "currentSession", email: user.email });
      window.location.href = "index.html";
      salvarSessao(user.email); // Salva a sessão do usuário autenticado
      atualizarMenu(); // Atualiza o menu para refletir o estado de login
      console.log("Usuário autenticado com sucesso.");
    } else {
      alert("Email ou senha incorretos.");
    }
  };

  request.onerror = function () {
    alert("Erro ao autenticar usuário.");
  };
}

// Função para salvar sessão
function salvarSessao(email) {
  const transaction = db.transaction([sessionStoreName], "readwrite");
  const store = transaction.objectStore(sessionStoreName);
  const request = store.put({ id: "currentSession", email });

  request.onsuccess = function () {
    console.log("Sessão salva com sucesso.");
  };

  request.onerror = function () {
    console.error("Erro ao salvar sessão.");
  };
}

// Função para verificar sessão
function verificarSessao(callback) {
  const transaction = db.transaction([sessionStoreName], "readonly");
  const store = transaction.objectStore(sessionStoreName);
  const request = store.get("currentSession");

  request.onsuccess = function () {
    callback(request.result ? request.result.email : null);
  };

  request.onerror = function () {
    callback(null);
  };
}

// Função para encerrar sessão
function encerrarSessao() {
  const transaction = db.transaction([sessionStoreName], "readwrite");
  const store = transaction.objectStore(sessionStoreName);
  const request = store.delete("currentSession");

  request.onsuccess = function () {
    alert("Sessão encerrada.");
    atualizarMenu();
  };

  request.onerror = function () {
    console.error("Erro ao encerrar sessão.");
  };
}

// Atualiza o menu com base no estado de login
function atualizarMenu() {
  verificarSessao(function (email) {
    const navProfile = document.querySelector(".nav-profile");
    if (email) {
      navProfile.textContent = "Perfil";
      navProfile.onclick = encerrarSessao; // Clique em "Perfil" encerra a sessão
    } else {
      navProfile.textContent = "Entrar";
      navProfile.onclick = function () {
        window.location.href = "Entrar.html";
      };
    }
  });
}

// Manipulador de envio do formulário de cadastro
document.getElementById("signup-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email-cadastro").value;
  const senha = document.getElementById("senha-cadastro").value;
  // Novos campos
  const morada = ""; // Não definido por padrão
  const telefone = ""; // Não definido por padrão

  if (nome && email && senha) {
    addUser({ nome, email, password: senha, morada, telefone });
    event.target.reset();
  } else {
    alert("Por favor, preencha todos os campos.");
  }
});

// Manipulador de envio do formulário de login
document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email-login").value;
  const senha = document.getElementById("password-login").value;

  if (email && senha) {
    authenticateUser(email, senha);
  } else {
    alert("Por favor, preencha todos os campos.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const request = indexedDB.open("EssentiaDB", 1);
  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("users")) {
      db.createObjectStore("users", { keyPath: "email" });
    }
    if (!db.objectStoreNames.contains("session")) {
      db.createObjectStore("session", { keyPath: "id" });
    }
  };
  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(["users"], "readwrite");
    const store = tx.objectStore("users");
    // Cria admin apenas se não existir
    const getAdmin = store.get("admin@admin.com");
    getAdmin.onsuccess = function () {
      if (!getAdmin.result) {
        store.put({
          email: "admin@admin.com",
          password: "admin",
          nome: "Administrador",
          tipo: "admin",
        });
      }
    };
  };
});