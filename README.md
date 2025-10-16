# Autocorrect Bookmarklet

Corrige automaticamente erros de ortografia e gramática em textos escritos ou selecionados, usando o serviço gratuito **LanguageTool**.

## ✍️ Como funciona
Este bookmarklet identifica o texto selecionado ou o conteúdo do campo ativo (input/textarea) e envia para a API pública do LanguageTool.  
O resultado corrigido é aplicado automaticamente ou mostrado para cópia rápida.

## 💡 Uso
1. Copie o código abaixo.  
2. Crie um novo favorito no navegador.  
3. No campo de **URL**, cole o código.  
4. Em qualquer página:
   - Selecione um texto **ou** clique dentro de um campo de texto.  
   - Clique no bookmarklet para corrigir automaticamente.  

## 🧩 Código
```js
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
