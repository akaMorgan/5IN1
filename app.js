const state={current:0,unlocked:0,answers:[],timer:null};
const challenges=[
  {name:"GUESS",desc:"Visual Guessing",icon:"🧩"},
  {name:"SPEED",desc:"Timed Challenge",icon:"⚡"},
  {name:"MEMORY",desc:"Memory Challenge",icon:"◈"},
  {name:"LOGIC",desc:"Logic Puzzle",icon:"⌁"},
  {name:"FINAL",desc:"Final Mystery Challenge",icon:"✦"}
];
const games=[
  {type:"guess",question:"Can you guess what this is?",visual:"◉",options:["Camera","Headphones","Watch","Glasses"],correct:0},
  {type:"speed",question:"What is 15 × 4 ?",correctText:"60"},
  {type:"memory",question:"Look at the objects carefully. You have 3 seconds.",items:["★","♧","📷","🎧","🌱","☕"]},
  {type:"logic",question:"Solve the puzzle",sequence:"2  →  4  →  8  →  16  →  ?",correctText:"32"},
  {type:"final",question:"Decode the final piece using what you discovered.",items:["★","⚡","🎧","☕","🌱"],correctText:"15243"}
];

function showPage(id){
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
 document.getElementById(id).classList.remove("hidden");
 if(id==="challenges")renderMap();
 if(id==="leaderboard")renderLeaderboard();
 window.scrollTo({top:0,behavior:"smooth"});
}
function renderPieces(){
 const box=document.getElementById("miniPieces"); box.innerHTML="";
 for(let i=0;i<5;i++){const el=document.createElement("i");if(i<state.unlocked)el.innerHTML="✣",el.style.color="#ffc21a";box.appendChild(el)}
 document.getElementById("piecesCount").textContent=state.unlocked;
}
function renderMap(){
 const list=document.getElementById("challengeList"); list.innerHTML="";
 challenges.forEach((c,i)=>{
  const el=document.createElement("div");
  el.className="challenge-card "+(i===state.unlocked?"active":"");
  const locked=i>state.unlocked;
  el.innerHTML=`<div class="challenge-icon">${c.icon}</div><div><h3>${String(i+1).padStart(2,"0")} &nbsp; ${c.name}</h3><p>${c.desc}</p></div>${locked?'<span class="lock-small">🔒</span>':'<span class="challenge-num">›</span>'}`;
  if(!locked)el.onclick=()=>startGame(i);
  list.appendChild(el);
 });
}
function startGame(i){
 state.current=i;
 const g=games[i];
 document.getElementById("challengeTitle").textContent=`CHALLENGE ${String(i+1).padStart(2,"0")}`;
 document.getElementById("counter").textContent=`${i+1} / 5`;
 document.getElementById("progressBar").style.width=`${(i+1)*20}%`;
 const root=document.getElementById("gameContent");
 let content=`<div class="game-card"><div class="question">${g.question}</div>`;
 if(g.type==="guess"){
  content+=`<div class="visual">${g.visual}</div><div class="options">${g.options.map((x,n)=>`<button class="option" onclick="selectOption(this,${n},${g.correct})">${x}</button>`).join("")}</div>`;
 }else if(g.type==="speed"){
  content+=`<div class="timer" id="timer">07</div><div class="input-row"><input id="answer" class="answer-input" placeholder="Enter your answer" inputmode="numeric"><button class="primary" onclick="submitText()">SUBMIT</button></div>`;
 }else if(g.type==="memory"){
  content+=`<div class="memory-grid">${g.items.map(x=>`<div class="memory-card">${x}</div>`).join("")}</div><div class="options"><button class="option" onclick="memoryAnswer()">I'M READY</button></div>`;
 }else if(g.type==="logic"){
  content+=`<div class="visual" style="font-size:25px;letter-spacing:2px">${g.sequence}</div><div class="input-row"><input id="answer" class="answer-input" placeholder="Enter your answer" inputmode="numeric"><button class="primary" onclick="submitText()">SUBMIT</button></div>`;
 }else{
  content+=`<div class="memory-grid">${g.items.map(x=>`<div class="memory-card">${x}</div>`).join("")}</div><div class="input-row"><input id="answer" class="answer-input" placeholder="Enter the code"><button class="primary" onclick="submitText()">DECODE</button></div>`;
 }
 content+=`<div class="game-actions"><button class="secondary" onclick="showPage('challenges')">BACK TO MAP</button></div></div>`;
 root.innerHTML=content; showPage("game");
 if(g.type==="speed")startTimer(7);
 if(g.type==="memory")setTimeout(()=>document.querySelectorAll(".memory-card").forEach(x=>x.style.filter="blur(8px)"),3000);
}
function selectOption(btn,n,correct){
 document.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");
 setTimeout(()=>n===correct?success():failure(),350);
}
function submitText(){
 const val=(document.getElementById("answer")?.value||"").trim().toLowerCase();
 const g=games[state.current];
 if(val===String(g.correctText).toLowerCase())success();else failure();
}
function memoryAnswer(){success()}
function success(){
 clearInterval(state.timer);state.unlocked=Math.max(state.unlocked,state.current+1);renderPieces();
 if(state.current===4){showPage("complete")}else{startGame(state.current+1)}
}
function failure(){const el=document.getElementById("gameContent");el.animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],180)}
function startTimer(sec){
 let t=sec;const el=document.getElementById("timer");
 state.timer=setInterval(()=>{t--;if(el)el.textContent=String(t).padStart(2,"0");if(t<=0){clearInterval(state.timer);failure()}},1000);
}
function renderLeaderboard(){}
renderPieces();
