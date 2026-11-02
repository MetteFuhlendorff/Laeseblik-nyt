(() => {
  const feedback={
    choice:{right:'Det er en iagttagelse, som kan undersøges videre. Den fortæller ikke i sig selv, hvorfor Emil handler sådan.',wrong1:'Det er en fortolkning. Vi ved endnu ikke, om det er motivationen, der er problemet. Begynd med det, der er observeret.',wrong2:'Det er en vurdering af Emil, ikke en præcis observation. Spørg, hvad der faktisk sker i timerne.'},
    question:{right:'Det spørgsmål åbner for variationer i Emils oplevelse. I kan sammen få øje på situationer, der allerede fungerer, og barrierer, der kan ændres.',wrong1:'Spørgsmålet lægger op til, at Emil forsvarer sig. Prøv et nysgerrigt spørgsmål om, hvornår han oplever hjælpemidlet som brugbart.',wrong2:'Spørgsmålet gør hjælpen til et krav. Her er det vigtigere først at forstå, hvad der opleves svært i klassen.'}
  };
  function setChoice(kind,btn){
    document.querySelectorAll(`[data-sc-${kind}]`).forEach(b=>b.setAttribute('aria-pressed',b===btn?'true':'false'));
    const box=document.querySelector(`#sc-${kind}-feedback`);
    if(box){box.hidden=false;box.textContent=feedback[kind][btn.dataset['sc'+kind.charAt(0).toUpperCase()+kind.slice(1)]]||'';}
  }
  document.querySelectorAll('[data-sc-choice]').forEach(b=>b.addEventListener('click',()=>setChoice('choice',b)));
  document.querySelectorAll('[data-sc-question]').forEach(b=>b.addEventListener('click',()=>setChoice('question',b)));
  const fields=[['Observation og manglende viden','sc-observation'],['Elevens perspektiv','sc-perspective'],['Prøvehandling','sc-action'],['Elevens medvirken','sc-student'],['Tegn på deltagelse','sc-signs'],['Opfølgning og forbehold','sc-follow']];
  function notes(){return 'NÅR LÆSEKURSET ER SLUT\nStudieopgave fra Læseblik\n\n'+fields.map(([t,id])=>t+'\n'+(document.getElementById(id)?.value?.trim()||'(Ikke udfyldt)')).join('\n\n')+'\n\nRefleksion: Hvad ved vi, hvad antager vi, og hvad må vi undersøge videre?\n\nOpgaven bygger på en fiktiv case. Brug ikke personhenførbare elevoplysninger.';}
  const output=document.getElementById('sc-notes-result');const target=document.getElementById('sc-notes-text');
  document.getElementById('sc-make-notes')?.addEventListener('click',()=>{target.textContent=notes();output.hidden=false;output.scrollIntoView({behavior:'smooth',block:'nearest'});});
  document.getElementById('sc-print')?.addEventListener('click',()=>{target.textContent=notes();output.hidden=false;window.print();});
  document.getElementById('sc-save')?.addEventListener('click',()=>{const blob=new Blob([notes()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='laeseblik-arbejdsnotat.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);const status=document.getElementById('sc-save-status');if(status)status.textContent='Notatet er klar til at gemme.';});
})();
