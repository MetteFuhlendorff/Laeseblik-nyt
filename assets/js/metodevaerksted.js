"use strict";
(()=>{
 const check=document.querySelector('#check-statements');
 if(!check)return;
 const correct={stmt1:'obs',stmt2:'tolk',stmt3:'hand'};
 const explain={stmt1:'En afgrænset iagttagelse. Du kan undersøge den nærmere, men ikke udlede årsagen alene.',stmt2:'En mulig fortolkning af adfærd og motivation, ikke noget der er direkte observeret.',stmt3:'Det er et forslag til en handling med opfølgning, ikke et resultat.'};
 check.addEventListener('click',()=>{
  let score=0;
  Object.keys(correct).forEach(name=>{
    const selected=document.querySelector('input[name="'+name+'"]:checked');
    const dest=document.querySelector('[data-feedback="'+name+'"]');
    if(!selected){dest.textContent='Vælg en kategori for at få feedback.';return;}
    const ok=selected.value===correct[name];if(ok)score++;
    dest.textContent=(ok?'Præcist. ':'Overvej igen. ')+explain[name];
    dest.classList.toggle('is-correct',ok);
  });
  document.querySelector('#statement-result').textContent=score+' af 3 kategorier valgt korrekt. Læs begrundelserne under hvert udsagn.';
 });
 document.querySelector('#check-decision').addEventListener('click',()=>{
   const selected=document.querySelector('input[name="decision"]:checked');
   const dest=document.querySelector('#decision-feedback');
   if(!selected){dest.textContent='Vælg først et svar.';return;}
   const messages={a:'Målrettet undervisning i ordafkodning kan være et relevant valg. Her bygger indsatsen dog på en enkelt kort situation, og der mangler elevens perspektiv samt oplysninger om læsning og deltagelse i den øvrige undervisning.',b:'Denne plan giver det mest dækkende udgangspunkt: Den undersøger afkodning i flere situationer, inddrager elevens oplevelse og følger både læseudvikling og aktiv deltagelse. Hvilken del ville du prioritere først, og hvorfor?',c:'Oplæsningsstøtte kan give adgang til fagets indhold og styrke deltagelsen. En samlet plan skal også undersøge elevens ordafkodning, så valget af læseundervisning bliver fagligt begrundet.'};
   dest.textContent=messages[selected.value];
 });
 const form=document.querySelector('#analysis-builder');
 const fields=[['question','Spørgsmål'],['evidence','Empiri / observation'],['concept','Teori og faglige begreber'],['interpretation','Foreløbig analyse'],['alternative','Mulige forklaringer og begrænsninger'],['action','Forslag til didaktisk afprøvning og opfølgning']];
 form.addEventListener('submit',e=>{
   e.preventDefault();
   const vals=fields.map(([id,label])=>({label,value:document.querySelector('#field-'+id).value.trim()}));
   const wrap=document.querySelector('#analysis-output-wrap');
   if(!vals.some(x=>x.value)){wrap.hidden=false;document.querySelector('#analysis-output').textContent='Skriv i mindst ét felt for at samle dine noter.';return;}
   document.querySelector('#analysis-output').textContent='LÆSEBLIK · ANALYSEUDKAST\n\n'+vals.map(x=>x.label+'\n'+(x.value||'[Mangler at blive udfyldt]')).join('\n\n')+'\n\nFagligt efterblik: Hvilke sætninger kræver mere belæg? Hvilke spørgsmål står endnu åbne?';
   wrap.hidden=false;wrap.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
 form.addEventListener('reset',()=>{document.querySelector('#analysis-output-wrap').hidden=true;document.querySelector('#analysis-message').textContent='';});
 document.querySelector('#copy-analysis').addEventListener('click',async()=>{
   const output=document.querySelector('#analysis-output').textContent;
   const dest=document.querySelector('#analysis-message');
   try{await navigator.clipboard.writeText(output);dest.textContent='Udkastet er kopieret.'}catch(e){dest.textContent='Markér teksten i feltet og kopiér den manuelt. Du kan også printe.';document.querySelector('#analysis-output').focus()}
 });
 document.querySelector('#print-analysis').addEventListener('click',()=>{window.print()});
})();
