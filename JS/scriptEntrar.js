    // Configuração do IndexedDB
    const dbName = "EssentiaDB";
    const storeName = "users";
    let db;

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "email" });
      }
    };

    request.onsuccess = function (event) {
      db = event.target.result;
    };

    request.onerror = function () {
      console.error("Erro ao abrir o banco de dados.");
    };

    // Função para adicionar usuário
    function addUser(user) {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      store.add(user);

      transaction.oncomplete = function () {
        alert("Usuário cadastrado com sucesso!");
      };

      transaction.onerror = function () {
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
          alert("Login realizado com sucesso!");
        } else {
          alert("Email ou senha incorretos.");
        }
      };

      request.onerror = function () {
        alert("Erro ao autenticar usuário.");
      };
    }

    // Manipulador de envio do formulário de cadastro
    document.getElementById("signup-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email-cadastro").value;
      const senha = document.getElementById("senha-cadastro").value;

      if (nome && email && senha) {
        addUser({ nome, email, password: senha });
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