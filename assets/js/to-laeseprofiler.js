"use strict";
(()=>{
const g=id=>document.getElementById(id);
const fb={freja:{
a:'Du undersøger et mønster, der kan belyse fonologisk omkodning og stavning. Det er relevant, men elevens deltagelse og forståelse må også undersøges.',
b:'Du sammenligner forståelse ved forskellige læsevilkår. Sørg for sammenligneligt indhold. Der mangler fortsat direkte oplysninger om ordafkodningen.',
c:'Du får viden om de konkrete deltagelsesbetingelser. Det siger endnu ikke sikkert noget om ordlæsningspræcisionen.'},ali:{
a:'Det kan belyse sprogforståelse og ordforråd, også uden krav om selvstændig afkodning. Supplér med konkrete tekstforståelsesopgaver.',
b:'Du får viden om ordlæsningspræcision og hastighed. Overvej også, hvorfor Ali har vanskeligt ved begreber efter oplæsning.',
c:'Du ser på brugen af fagbegreber i en naturlig undervisningssituation. Det kan ikke alene afgøre, om der er bredere sproglige vanskeligheder.'}};
g('adv-respond').addEventListener('click',()=>{
let a=document.querySelector('input[name="freja"]:checked'),b=document.querySelector('input[name="ali"]:checked'),note=g('adv-reason').value.trim(),el=g('adv-response');el.hidden=false;
if(!a||!b){el.textContent='Vælg én undersøgelse for hver elev.';return;}
if(note.length<45){el.textContent='Skriv først din faglige begrundelse med mindst 45 tegn. Hvad kan undersøgelsen vise, og hvad står åbent?';return;}
el.replaceChildren();for(const [person,body] of [['Freja',fb.freja[a.value]],['Ali',fb.ali[b.value]]]){const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=person+': ';p.append(strong,document.createTextNode(body));el.append(p);}
const p=document.createElement('p');p.textContent='Sammenhold nu valgene og beskriv din næste observation. Fagligt holdbare prioriteringer kræver både belæg og blik for begrænsninger.';el.append(p);
});
const fields=[['adv-observation','Observationer'],['adv-hypothesis','Forklaringer og teori'],['adv-activity','Undervisning og deltagelse'],['adv-followup','Opfølgning']];
g('adv-generate').addEventListener('click',()=>{g('adv-note').textContent='LÆSEBLIK | TO LÆSEPROFILER\nFiktiv studiecase\n\n'+fields.map(([id,title])=>title+'\n'+(g(id).value.trim()||'[Udfyldes]')).join('\n\n');g('adv-output').hidden=false;});
g('adv-reset').addEventListener('click',()=>{for(const [id] of fields)g(id).value='';g('adv-reason').value='';document.querySelectorAll('.adv-choices input').forEach(x=>x.checked=false);g('adv-output').hidden=true;g('adv-response').hidden=true;});
g('adv-save').addEventListener('click',()=>{const blob=new Blob([g('adv-note').textContent],{type:'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='Laeseblik-laeseprofiler-noter.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
g('adv-print').addEventListener('click',()=>window.print());
})();