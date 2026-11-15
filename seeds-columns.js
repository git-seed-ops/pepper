(function(){
var NS='http://www.w3.org/2000/svg';
var N=15, CW=11, CH=6.4, ROWS=14, BASE=104, X0=2.5;
var KEY='pepper-seed-columns';
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var heaps={
  sun:{h:[],limit:2,cover:2,svg:document.getElementById('cols-sun'),v:document.getElementById('v-sun'),name:'Sunflower',wob:{},mov:{}},
  mil:{h:[],limit:1,cover:1,svg:document.getElementById('cols-mil'),v:document.getElementById('v-mil'),name:'Millet',wob:{},mov:{}}
};
var kinds=['sun','mil'];
var timer=null;
var focusAt=null; // {k,i}: keeps keyboard focus on a column when the diagram redraws
function rnd(a,b){return a+Math.random()*(b-a)}
function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)/1.5}
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}

// drop one seed: land on the highest column it covers, then nudge sideways while steep
function drop(p){
  var i=Math.max(0,Math.min(N-p.cover,Math.round((N-p.cover)/2+gauss()*3)));
  var best=i,j;
  for(j=i;j<i+p.cover;j++)if(p.h[j]>p.h[best])best=j;
  if(p.h[best]>=ROWS)return false;
  for(var k=0;k<N;k++){
    var here=p.h[best];
    var l=best>0?p.h[best-1]:here;
    var r=best<N-1?p.h[best+1]:here;
    var goL=best>0&&here-l>=p.limit, goR=best<N-1&&here-r>=p.limit;
    if(goL&&goR){if(Math.random()<.5)best--;else best++}
    else if(goL)best--;
    else if(goR)best++;
    else break;
  }
  p.h[best]++;
  return true;
}
// steepest breach between neighbours: move a grain from the taller to the lower
function steep(p){
  var worst=null,wd=p.limit;
  for(var i=0;i<N-1;i++){
    var d=p.h[i]-p.h[i+1],a=Math.abs(d);
    if(a>wd){wd=a;worst={from:d>0?i:i+1,to:d>0?i+1:i}}
  }
  return worst;
}
// a column is wobbly when it stands taller than a neighbour by more than the limit
function wobblies(p){
  var out={},c=0;
  for(var i=0;i<N;i++){
    var l=i>0?p.h[i-1]:p.h[i], r=i<N-1?p.h[i+1]:p.h[i];
    if(p.h[i]-l>p.limit||p.h[i]-r>p.limit)out[i]=1;
  }
  for(var k in out)c++;
  return {set:out,count:c};
}

function draw(p,kind){
  var s=p.svg;while(s.firstChild)s.removeChild(s.firstChild);
  s.appendChild(el('line',{'class':'ground',x1:1,x2:169,y1:BASE+1.5,y2:BASE+1.5}));
  for(var i=0;i<N;i++){
    var x=X0+i*CW, wob=p.wob[i], mv=p.mov[i];
    for(var r=0;r<p.h[i];r++){
      var top=r===p.h[i]-1;
      var cls='g-'+kind+(top&&mv?' moving':(top&&wob?' wob':''));
      var y=BASE-(r+1)*CH;
      if(kind==='sun')s.appendChild(el('rect',{'class':cls,x:x+.6,y:y+.5,width:CW-1.2,height:CH-1,rx:2.4}));
      else s.appendChild(el('circle',{'class':cls,cx:x+CW/2,cy:y+CH/2,r:2.5}));
    }
    if(wob&&p.h[i]>0){
      s.appendChild(el('rect',{'class':'halo',x:x+.2,y:BASE-p.h[i]*CH-.8,width:CW-.4,height:CH+.6,rx:3}));
    }
    var hit=el('rect',{x:x,y:BASE-ROWS*CH,width:CW,height:ROWS*CH+2,fill:'transparent','data-i':i,
      tabindex:0,role:'button',
      'aria-label':p.name+' column '+(i+1)+' of '+N+', '+p.h[i]+' seeds high. Press to poke a lump.'});
    s.appendChild(hit);
    if(focusAt&&focusAt.k===kind&&focusAt.i===i&&document.activeElement!==hit){
      try{hit.focus({preventScroll:true})}catch(e){}
    }
  }
}
function drawAll(){kinds.forEach(function(k){draw(heaps[k],k)})}
function save(){try{localStorage.setItem(KEY,JSON.stringify({sun:heaps.sun.h,mil:heaps.mil.h}))}catch(e){}}
function say(p,txt,cls){p.v.textContent=txt;p.v.className='verdict'+(cls?' '+cls:'')}
function few(n){return n===1?'one':n<=3?'a couple of':'a few'}
function clearMarks(){kinds.forEach(function(k){heaps[k].wob={};heaps[k].mov={}})}
function stop(){if(timer){clearInterval(timer);timer=null}}
function allSettled(){return kinds.every(function(k){return wobblies(heaps[k]).count===0})}

function reset(){
  kinds.forEach(function(k){var p=heaps[k];p.h=[];for(var i=0;i<N;i++)p.h.push(0);p.wob={};p.mov={}});
  for(var n=0;n<22;n++)drop(heaps.sun);
  for(var m=0;m<60;m++)drop(heaps.mil);
  drawAll();save();
  kinds.forEach(function(k){say(heaps[k],'Fresh and tidy. Ask me to check it.')});
}
function dropSome(){
  stop();
  for(var n=0;n<6;n++)drop(heaps.sun);
  for(var m=0;m<14;m++)drop(heaps.mil);
  clearMarks();drawAll();save();
  kinds.forEach(function(k){say(heaps[k],'Each seed landed on the tallest column it covered, then shuffled sideways if it was steep. Settled, I think.')});
}
function poke(kind,i){
  var p=heaps[kind];
  if(i===undefined)i=Math.floor(rnd(2,N-2));
  stop();
  for(var n=0;n<p.limit+2&&p.h[i]<ROWS;n++)p.h[i]++;
  clearMarks();drawAll();save();
  say(p,'Oof. A lump in one column. Does it look steep to you?');
}

function check(){
  stop();clearMarks();
  kinds.forEach(function(k){
    var p=heaps[k],w=wobblies(p);
    p.wob=w.set;
    if(w.count===0)say(p,p.name+': I walked along every column. Nothing stands too far above its neighbour. It has settled right.','ok');
    else say(p,p.name+': '+few(w.count)+' wobbly '+(w.count===1?'column':'columns')+', ringed in orange. '+(w.count===1?'It stands':'They stand')+' too far above a neighbour and will slump.','bad');
  });
  drawAll();
}

function step(){
  var moved=false;
  clearMarks();
  kinds.forEach(function(k){
    var p=heaps[k],s=steep(p);
    if(s){p.h[s.from]--;p.h[s.to]++;p.mov[s.to]=1;p.mov[s.from]=1;moved=true}
  });
  drawAll();
  return moved;
}
function finish(){
  clearMarks();drawAll();save();
  kinds.forEach(function(k){
    var p=heaps[k];
    if(wobblies(p).count===0)say(p,p.name+': slumped and shuffled, and now every column leans nicely on its neighbour. Settled. Pat pat.','ok');
    else say(p,p.name+': still a little wobbly.','bad');
  });
}
function settle(){
  stop();
  if(reduce){var guard=3000;while(guard-->0&&step()){}finish();return}
  timer=setInterval(function(){if(!step()){stop();finish()}},70);
}
// one grain at a time, for when I want to watch carefully
function nudge(){
  stop();
  if(step()){
    save();
    kinds.forEach(function(k){
      var p=heaps[k],n=wobblies(p).count;
      if(Object.keys(p.mov).length)say(p,p.name+': one grain slid sideways (green). '+(n?'Still '+few(n)+' wobbly.':'Nothing wobbly now.'),n?'bad':'ok');
      else say(p,p.name+': this heap is already settled, so I left it be.','ok');
    });
  }else{finish()}
}

document.getElementById('c-drop').onclick=dropSome;
document.getElementById('c-poke').onclick=function(){focusAt=null;poke('sun');poke('mil')};
document.getElementById('c-check').onclick=function(){focusAt=null;check()};
document.getElementById('c-settle').onclick=function(){focusAt=null;settle()};
var nb=document.getElementById('c-nudge');
if(nb)nb.onclick=function(){focusAt=null;nudge()};
document.getElementById('c-reset').onclick=function(){focusAt=null;stop();reset()};
kinds.forEach(function(k){
  var svg=heaps[k].svg;
  function idx(e){var a=e.target&&e.target.getAttribute&&e.target.getAttribute('data-i');return(a===null||a===undefined)?null:+a}
  svg.addEventListener('click',function(e){
    var i=idx(e);
    if(i!==null){focusAt=null;poke(k,i)}
  });
  svg.addEventListener('focusin',function(e){var i=idx(e);if(i!==null)focusAt={k:k,i:i}});
  svg.addEventListener('keydown',function(e){
    var i=idx(e);if(i===null)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();focusAt={k:k,i:i};poke(k,i)}
    else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
      e.preventDefault();
      var j=Math.max(0,Math.min(N-1,i+(e.key==='ArrowLeft'?-1:1)));
      var t=svg.querySelector('[data-i="'+j+'"]');if(t)t.focus();
    }
  });
});

var loaded=false;
try{
  var v=JSON.parse(localStorage.getItem(KEY)||'null');
  if(v&&v.sun&&v.mil&&v.sun.length===N&&v.mil.length===N){
    var clamp=function(n){return Math.max(0,Math.min(ROWS,n|0))};
    heaps.sun.h=v.sun.map(clamp);heaps.mil.h=v.mil.map(clamp);
    drawAll();loaded=true;
    kinds.forEach(function(k){say(heaps[k],'Remembered from last time. Ask me to check it.')});
  }
}catch(e){}
if(!loaded)reset();
})();
