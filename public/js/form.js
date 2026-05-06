function togglePCD(){
  const p = document.getElementById("pcd").value;
  document.getElementById("pcdBox").style.display = (p === "Sim") ? "block" : "none";
}

const form = document.getElementById("formulario");

form.addEventListener("submit", async function(e){

  e.preventDefault();

  const msg = document.getElementById("msg");

  const dados = {
    nome: nome.value,
    email: email.value,
    genero: genero.value,
    raca: raca.value,
    pcd: pcd.value,
    pcd_desc: pcd_desc.value,
    regiao: regiao.value,
    bairro: bairro.value,
    atividade: atividade.value,
    origem: origem.value
  };

  try {
    const res = await fetch('https://brotai-site.onrender.com/inscrever', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(dados)
    });

    if(res.ok){

      msg.innerText = "Inscrição enviada com sucesso!";
      limparFormulario();

      setTimeout(() => {
        form.reset();
      }, 100);

    } else {
      const erro = await res.text();
      msg.innerText = erro;
    }

  } catch {
    msg.innerText = "Erro de conexão";
  }

});

function limparFormulario(){

  form.reset();

  bairro.innerHTML = '<option value="">Selecione a região primeiro</option>';
  atividade.innerHTML = '<option value="">Selecione</option>';

  document.getElementById("pcdBox").style.display = "none";

}