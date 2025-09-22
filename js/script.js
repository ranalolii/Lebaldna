(function(){
  const sectors = {
    shelter: {name:'Shelter', desc:'Support housing, repairs, and safe spaces.'},
    health: {name:'Health', desc:'Medical outreach, health awareness and clinics.'},
    microfinance: {name:'Microfinance', desc:'Train and support small income-generating projects.'},
    charity: {name:'Charity', desc:'Donation drives, distributions and campaigns.'},
    cbl: {name:'CBL (Community-Based Learning)', desc:'Community-facing projects (work with children, elderly, schools).' },
    junior: {name:'Junior Program', desc:'Beginner/student volunteers and children-focused activities.'},
    research: {name:'Research', desc:'Surveys, data analysis, reporting and recommendations.'}
  };

  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resultEl = document.getElementById('result');
  const explainEl = document.getElementById('explain');
  const breakdownEl = document.getElementById('breakdown');
  const hintEl = document.getElementById('hint');

  function readAnswers() {
    const form = document.getElementById('quiz');
    const answers = [];
    for (let i=1;i<=5;i++){
      const q = form['q'+i];
      if (!q) return null;
      const val = Array.from(q).find(r=>r.checked)?.value || null;
      answers.push(val);
    }
    return answers;
  }

  function calculate() {
    const answers = readAnswers();
    if (!answers || answers.includes(null)) {
      hintEl.textContent = 'Please answer all 5 questions';
      return;
    }
    hintEl.textContent = 'Results ready';
    // score
    const scores = {};
    Object.keys(sectors).forEach(k=>scores[k]=0);
    answers.forEach(a=>{ if(a && a in scores) scores[a] += 1; });

    // find best score(s)
    const entries = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
    const topScore = entries[0][1];
    const top = entries.filter(e=>e[1]===topScore).map(e=>e[0]);

    // show result
    resultEl.classList.remove('hidden');
    explainEl.classList.remove('hidden');
    breakdownEl.classList.remove('hidden');

    if (topScore === 0) {
      resultEl.textContent = 'No match — try again';
      explainEl.textContent = '';
      breakdownEl.innerHTML = '';
      return;
    }

    // show primary result (if tie, show top two)
    if (top.length === 1) {
      const s = top[0];
      resultEl.textContent = `Best fit: ${sectors[s].name}`;
      explainEl.textContent = sectors[s].desc;
    } else {
      // tie: show top two names
      resultEl.textContent = `Top fits: ${top.map(k=>sectors[k].name).join(' & ')}`;
      explainEl.textContent = 'You match multiple sectors well — see breakdown below.';
    }

    // breakdown
    breakdownEl.innerHTML = '';
    entries.forEach(([k,v])=>{
      const el = document.createElement('div');
      el.className = 'sector-pill';
      el.innerHTML = `<div><strong>${sectors[k].name}</strong><div class="small">${sectors[k].desc}</div></div><div class="small">${v} pts</div>`;
      breakdownEl.appendChild(el);
    });
  }

  submitBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', ()=>{
    document.getElementById('quiz').reset();
    resultEl.classList.add('hidden'); explainEl.classList.add('hidden'); breakdownEl.classList.add('hidden');
    hintEl.textContent = 'Answer all 5 questions';
  });
})();