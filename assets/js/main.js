(() => {
 if(location.protocol==='file:'){document.querySelectorAll('a[href]').forEach(el=>{const h=el.getAttribute('href');if(h&&!h.startsWith('#')&&!h.startsWith('http')&&!h.startsWith('mailto:')&&!h.startsWith('tel:')){const parts=h.split('#');if(parts[0].endsWith('/'))el.setAttribute('href',parts[0]+'index.html'+(parts[1]?'#'+parts[1]:''))}})}
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const on=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',on?'true':'false')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}))}
 document.querySelectorAll('[data-filter-group]').forEach(group=>{const container=document.querySelector(group.dataset.filterGroup);if(!container)return;const buttons=group.querySelectorAll('button');const search=document.querySelector('[data-resource-search]');const apply=()=>{const selected=group.querySelector('button.selected')?.dataset.filter||'Alle';const q=(search?.value||'').trim().toLocaleLowerCase('da');container.querySelectorAll('[data-category]').forEach(el=>{const match=(selected==='Alle'||el.dataset.category===selected)&&(!q||el.textContent.toLocaleLowerCase('da').includes(q));el.classList.toggle('hidden',!match)})};buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('selected'));b.classList.add('selected');apply()}));search?.addEventListener('input',apply)});
 document.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>{const parent=b.closest('.audio-box');const text=parent?.querySelector('[data-script]')?.textContent||'';const status=parent?.querySelector('.status');if(!('speechSynthesis'in window)){if(status)status.textContent='Oplæsning understøttes ikke i denne browser.';return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.trim());u.lang='da-DK';u.rate=.92;u.onstart=()=>{if(status)status.textContent='Computeroplæsning spiller …'};u.onend=()=>{if(status)status.textContent='Oplæsningen er færdig.'};u.onerror=()=>{if(status)status.textContent='Kunne ikke afspille. Prøv en anden browser.'};speechSynthesis.speak(u)}));
 document.querySelectorAll('[data-stop-speak]').forEach(b=>b.addEventListener('click',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();const st=b.closest('.audio-box')?.querySelector('.status');if(st)st.textContent='Stoppet.'}));
 document.querySelectorAll('[data-copy-notes]').forEach(b=>b.addEventListener('click',async()=>{const block=b.closest('.exercise');const answer=block?.querySelector('textarea')?.value||'';const title=block?.querySelector('h3')?.textContent||'Refleksion';if(!answer.trim()){alert('Skriv først din refleksion.');return}try{await navigator.clipboard.writeText(`${title}\n\n${answer}`);b.textContent='Kopieret ✓'}catch(e){const t=block.querySelector('textarea');t.focus();t.select();b.textContent='Markér og kopiér teksten'}}));
 document.querySelectorAll('[data-save-notes]').forEach(b=>b.addEventListener('click',()=>{const block=b.closest('.exercise');const answer=block?.querySelector('textarea')?.value||'';if(!answer.trim()){alert('Skriv først din refleksion.');return;}const title=block?.querySelector('h3')?.textContent||'Refleksion';const blob=new Blob([`${title}\n\n${answer}\n`],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='laeseblik-refleksion.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);b.textContent='Gemt som tekst ✓'}));
 document.querySelectorAll('[data-case-choice]').forEach(b=>b.addEventListener('click',()=>{const group=b.closest('[data-case]');const feedback=group.querySelector('[data-case-feedback]');const good=b.dataset.caseChoice==='observe';feedback.hidden=false;feedback.textContent=good?'Godt udgangspunkt. Beskriv det observerbare og undersøg mulige forklaringer før du vælger støtte.':'Overvej også, hvilke konkrete observationer der mangler, før du kan afgøre, hvilken indsats der passer.';group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'))}));
 document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
 document.querySelectorAll('[data-copy-link]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);b.textContent='Link kopieret ✓'}catch(e){b.textContent='Kopiér adressen fra browseren'}}));
})();


/* Læseblik: søgning i siteindhold samt aktive indholdslinks. */
(()=>{
  const pageRoot=new URL('../../',new URL(document.currentScript?.src||document.querySelector('script[src*="main.js"]')?.src||location.href));
  document.querySelectorAll('.lb-search-link').forEach(a=>{a.href=new URL('soeg/',pageRoot).href});
  const input=document.querySelector('#lb-site-query');
  const output=document.querySelector('#lb-search-results');
  if(input&&output){
    const entries=window.LAESEBLIK_SEARCH_INDEX||[];
    const count=document.querySelector('#lb-search-count');
    const buttons=[...document.querySelectorAll('[data-search-category]')];
    const normalize=s=>(s||'').toLocaleLowerCase('da').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let current='alle';
    let lastQ='';
    const getScore=(obj,words)=>{
      const title=normalize(obj.title),desc=normalize(obj.description),all=normalize(obj.keywords);
      if(!words.every(w=>title.includes(w)||desc.includes(w)||all.includes(w)||normalize(obj.section).includes(w)))return -1;
      return words.reduce((n,w)=>n+(title.includes(w)?12:0)+(desc.includes(w)?5:0)+(all.includes(w)?1:0),0);
    };
    const render=()=>{
      const q=input.value.trim();lastQ=q;
      const words=normalize(q).split(/\s+/).filter(Boolean);
      const found=entries.filter(x=>current==='alle'||x.category===current)
        .map(x=>({item:x,score:getScore(x,words)})).filter(x=>x.score>=0)
        .sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title,'da'));
      output.replaceChildren();
      if(count)count.textContent=found.length+' '+(found.length===1?'resultat':'resultater')+(q?' for "'+q+'"':'');
      if(!found.length){const p=document.createElement('p');p.className='lb-search-empty';p.textContent='Ingen resultater. Prøv fx "tekst", "LST", "ordblindhed" eller "opgaveskrivning".';output.append(p);return;}
      found.forEach(({item})=>{
        const a=document.createElement('a');a.className='lb-result-card';a.href=new URL(item.url,pageRoot).href;
        const cat=document.createElement('span');cat.className='lb-result-category';cat.textContent=item.section;
        const h=document.createElement('strong');h.textContent=item.title;
        const p=document.createElement('span');p.className='lb-result-description';p.textContent=item.description||item.keywords.slice(0,180);
        a.append(cat,h,p);output.append(a);
      });
    };
    const initial=new URLSearchParams(location.search).get('q');if(initial)input.value=initial;
    input.addEventListener('input',render);
    document.querySelector('#lb-search-form')?.addEventListener('submit',e=>{e.preventDefault();const u=new URL(location.href);u.searchParams.set('q',input.value.trim());history.replaceState({},'',u);render()});
    buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(t=>{t.classList.toggle('selected',t===b);t.setAttribute('aria-pressed',t===b?'true':'false')});current=b.dataset.searchCategory;render()}));
    render();
  }
  const sidebar=document.querySelector('.sidebar');
  if(sidebar&&'IntersectionObserver' in window){
    const anchors=[...sidebar.querySelectorAll('a[data-toc-link]')];
    const ids=anchors.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const ob=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){anchors.forEach(a=>a.classList.toggle('lb-toc-active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-18% 0px -68% 0px',threshold:0});ids.forEach(s=>ob.observe(s));
  }
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)&&!document.activeElement?.isContentEditable){e.preventDefault();location.href=new URL('soeg/',pageRoot).href;}
  });
})();
