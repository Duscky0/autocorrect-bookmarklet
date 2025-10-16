javascript:(async function(){
  const sel=window.getSelection().toString();
  const target=document.activeElement;
  const text=sel||target?.value;
  if(!text){alert("Selecione um texto ou clique dentro de um campo de texto.");return;}
  try{
    const res=await fetch("https://api.languagetool.org/v2/check",{
      method:"POST",
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:"language=pt-BR&text="+encodeURIComponent(text)
    });
    const data=await res.json();
    if(!data.matches.length){alert("Nenhum erro encontrado.");return;}
    let corrected=text;
    for(const m of data.matches.reverse()){
      const r=m.replacements?.[0]?.value;
      if(r) corrected=corrected.slice(0,m.offset)+r+corrected.slice(m.offset+m.length);
    }
    if(sel){
      prompt("Texto corrigido:",corrected);
    }else if(target && target.value){
      target.value=corrected;
      alert("Texto corrigido automaticamente.");
    }
  }catch(e){
    alert("Erro ao conectar ao corretor.");
  }
})();
