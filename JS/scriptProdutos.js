function filtrarProdutos() {
    const termo = document.getElementById('pesquisa-input').value.trim().toLowerCase();
    const fragrancia = document.querySelector('#fragrancia-options .selected').dataset.value;
    const temp = document.querySelector('#temp-options .selected').dataset.value;

    document.querySelectorAll('.produto-card').forEach(card => {
      const titulo = card.querySelector('.produto-titulo').textContent.toLowerCase();
      const fragranciaProduto = card.getAttribute('data-fragrancia') || '';
      const tempProduto = card.getAttribute('data-temp') || '';

      const matchTexto = termo === '' || titulo.includes(termo);
      const matchFragrancia = !fragrancia || fragranciaProduto === fragrancia;
      const matchTemp = !temp || tempProduto === temp;

      if (matchTexto && matchFragrancia && matchTemp) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Depois de filtrar, verifique se há produtos visíveis
    const produtosVisiveis = document.querySelectorAll('.produto-card:not([style*="display: none"])');
    const nenhumProdutoMsg = document.getElementById('nenhum-produto');
    if (nenhumProdutoMsg) {
      if (produtosVisiveis.length === 0) {
        nenhumProdutoMsg.style.display = 'block';
      } else {
        nenhumProdutoMsg.style.display = 'none';
      }
    }
  }

  const fragranciaSelect = document.getElementById('fragrancia-select');
  const fragranciaTrigger = document.getElementById('fragrancia-trigger');
  const fragranciaOptions = document.getElementById('fragrancia-options').children;

  fragranciaSelect.addEventListener('click', function(e) {
    this.classList.toggle('open');
  });
  Array.from(fragranciaOptions).forEach(option => {
    option.addEventListener('click', function(e) {
      Array.from(fragranciaOptions).forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      fragranciaTrigger.textContent = this.textContent;
      fragranciaSelect.classList.remove('open');
    });
  });

  const tempSelect = document.getElementById('temp-select');
  const tempTrigger = document.getElementById('temp-trigger');
  const tempOptions = document.getElementById('temp-options').children;

  tempSelect.addEventListener('click', function(e) {
    this.classList.toggle('open');
  });
  Array.from(tempOptions).forEach(option => {
    option.addEventListener('click', function(e) {
      Array.from(tempOptions).forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      tempTrigger.textContent = this.textContent;
      tempSelect.classList.remove('open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!fragranciaSelect.contains(e.target)) fragranciaSelect.classList.remove('open');
    if (!tempSelect.contains(e.target)) tempSelect.classList.remove('open');
  });

  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (btn && nav) {
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
          navAuthArea.innerHTML = `
            <div class="nav-profile dropdown">
              <button class="profile-btn">Perfil</button>
              <div class="dropdown-content">
                <a href="EditarPerfil.html">Editar Perfil</a>
                <a href="VerPerfil.html">Ver Perfil</a>
                <a href="Favoritos.html">Favoritos</a>
                <a href="#" id="logout-link">Sair</a>
              </div>
            </div>
          `;
          const navProfile = navAuthArea.querySelector('.nav-profile');
          const profileBtn = navAuthArea.querySelector('.profile-btn');
          profileBtn.addEventListener('click', function (e) {
            e.preventDefault();
            navProfile.classList.toggle('open');
          });
          document.addEventListener('click', function (e) {
            if (!navProfile.contains(e.target)) navProfile.classList.remove('open');
          });
          navProfile.querySelector('.dropdown-content').addEventListener('click', function (e) {
            e.stopPropagation();
          });
          navAuthArea.querySelector('#logout-link').addEventListener('click', function (e) {
            e.preventDefault();
            const req = indexedDB.open("EssentiaDB", 1);
            req.onsuccess = function (event) {
              const db = event.target.result;
              const tx = db.transaction(["session"], "readwrite");
              const store = tx.objectStore("session");
              store.delete("currentSession");
              tx.oncomplete = function () {
                window.location.href = "Entrar.html";
              };
            };
          });
        } else {
          navAuthArea.innerHTML = `<a href="Entrar.html" class="profile-btn" style="background:#F4741F;color:#fff;border-radius:8px;padding:8px 18px;font-weight:600;text-decoration:none;">Entrar</a>`;
        }
      };
    };

    document.querySelectorAll('.logout-link, #logout-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const req = indexedDB.open("EssentiaDB", 1);
        req.onsuccess = function (event) {
          const db = event.target.result;
          const tx = db.transaction(["session"], "readwrite");
          const store = tx.objectStore("session");
          store.delete("currentSession");
          tx.oncomplete = function () {
            window.location.href = "Entrar.html";
          };
        };
      });
    });
  });