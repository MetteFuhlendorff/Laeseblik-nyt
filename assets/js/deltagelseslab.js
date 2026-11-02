(() => {
  const quiz = document.querySelector('#lbx-dilemma');
  const feedback = document.querySelector('#lbx-feedback');
  const check = document.querySelector('#lbx-check');
  if (quiz && check && feedback) {
    check.addEventListener('click', () => {
      const chosen = quiz.querySelector('input[name="deltagelse-svar"]:checked');
      if (!chosen) { feedback.hidden = false; feedback.textContent = 'Vælg først det forslag, du vil undersøge.'; return; }
      const texts = {
        a: 'Det kan være fristende at tolke tilbagetrækning som manglende motivation, men det ved vi endnu ikke. Undersøg opgavens læsekrav og elevens egen oplevelse først.',
        b: 'Det er et stærkt undersøgelsesdesign: Du adskiller observation fra fortolkning, undersøger elevens perspektiv og ser på både afkodning og fællesskab. Aftal herefter én prøvehandling.',
        c: 'En lettere tekst kan fjerne en barriere, men kan også sænke de faglige forventninger og isolere eleven. Undersøg, om eleven kan deltage i samme faglige mål med en anden adgangsvej.'
      };
      feedback.textContent = texts[chosen.value]; feedback.hidden = false;
    });
  }
  const save = document.querySelector('#lbx-export');
  if (save) save.addEventListener('click', () => {
    const fields = [...document.querySelectorAll('[data-lbx-reflection]')];
    const output = ['Læseblik · Deltagelsesblikket','Studieark til refleksion. Ikke et diagnostisk værktøj.',''];
    for(const field of fields){
      output.push(field.dataset.lbxReflection + '\n' + (field.value.trim() || '[ikke udfyldt]') + '\n');
    }
    const blob = new Blob([output.join('\n')], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'laeseblik-deltagelsesblikket.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href),1000);
  });
  document.querySelector('#lbx-print')?.addEventListener('click', () => window.print());
})();
