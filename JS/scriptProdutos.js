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