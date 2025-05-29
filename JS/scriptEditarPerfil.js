document.getElementById("editar-perfil-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const password = document.getElementById("password").value;
  const morada = document.getElementById("morada").value;
  const telefone = document.getElementById("telefone").value;

  if (nome && password) {
    alert("Alterações salvas com sucesso!");
    // Aqui você pode salvar os dados no IndexedDB ou enviar para um servidor
  } else {
    alert("Por favor, preencha os campos obrigatórios.");
  }
});

document.getElementById("mudar-foto").addEventListener("click", function () {
  alert("Funcionalidade de mudar foto ainda não implementada.");
});