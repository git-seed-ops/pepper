(function(){
var svg=document.getElementById('nudge-svg');
if(!svg)return;
var NS='http://www.w3.org/2000/svg';
var N=9, CW=12, CH=5.6, BASE=60, X0=6;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var say=document.getElementById('nudge-say');
var bNudge=document.getElementById('n-nudge'),bAuto=document.getElementById('n-auto'),bNew=document.getElementById('n-new');
var radios=document.querySelectorAll('input[name="n-kind"]');
var h=[],limit=2,busy=false,running=false,timer=null,moved=0,mark=null,epoch=0;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1))}

// wobbly: taller than a neighbour by more than the limit. Edges only have one neighbour.
function wobblyList(){
  var w=[];
  for(var i=0;i<N;i++){
    var l=i>0?h[i-1]:h[i], r=i<N-1?h[i+1]:h[i];
    if(h[i]-l>limit||h[i]-r>limit)w.push(i);
  }
  return w;
}
// the tallest of the wobbly ones, and the lower neighbour that receives its top seed
function pick(){
  var w=wobblyList();
  if(!w.length)return null;
  var best=w[0];
  w.forEach(function(i){if(h[i]>h[best])best=i});
  var to;
  if(best===0)to=1;
  else if(best===N-1)to=N-2;
  else to=h[best-1]<=h[best+1]?best-1:best+1;
  return {from:best,to:to};
}
function setSay(t,c){say.textContent=t;say.className='nudge-say'+(c?' '+c:'')}
function stopAuto(){
  running=false;
  if(timer){clearTimeout(timer);timer=null}
  bAuto.textContent='Nudge until settled';
  bAuto.setAttribute('aria-pressed','false');
}
function fresh(){
  stopAuto();epoch++;
  limit=document.querySelector('input[name="n-kind"]:checked').value==='mil'?1:2;
  h=[];var v=rnd(2,3);
  for(var i=0;i<N;i++){v=Math.max(1,Math.min(4,v+rnd(-1,1)));h.push(v)}
  var s=rnd(2,N-3);
  h[s]=Math.max.apply(null,h)+limit+rnd(1,2);
  moved=0;mark=null;busy=false;
  draw();
  setSay('A fresh heap. One column is standing up too tall. Press the nudge and watch it give a seed to its lower neighbour.','');
}
function draw(){
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  svg.appendChild(el('line',{'class':'ground',x1:2,x2:118,y1:BASE+1.2,y2:BASE+1.2}));
  var tallest=mark?mark.from:-1;
  for(var i=0;i<N;i++){
    var x=X0+i*CW;
    for(var r=0;r<h[i];r++){
      var top=r===h[i]-1;
      var cls='seed';
      if(mark&&top&&i===mark.from)cls+=' fly';
      else if(i===tallest)cls+=' tall';
      var rect=el('rect',{'class':cls,x:x+.7,y:BASE-(r+1)*CH+.4,width:CW-1.4,height:CH-.8,rx:2.2});
      if(mark&&top&&i===mark.from)rect.setAttribute('id','n-fly');
      svg.appendChild(rect);
    }
    if(i===tallest&&h[i]>0){
      svg.appendChild(el('rect',{'class':'halo',x:x+.1,y:BASE-h[i]*CH-.8,width:CW-.2,height:h[i]*CH+1.2,rx:3}));
      var t=el('text',{'class':'labt',x:x+CW/2,y:BASE-h[i]*CH-3});
      t.textContent='tallest';svg.appendChild(t);
    }
    var lab=el('text',{'class':'lab',x:x+CW/2,y:BASE+6.5});
    lab.textContent=String(i+1);svg.appendChild(lab);
  }
  if(mark){
    var a=X0+mark.from*CW+CW/2,b=X0+mark.to*CW+CW/2;
    var y=BASE-Math.max(h[mark.from],h[mark.to])*CH-9;
    var s=a<b?-1:1;
    svg.appendChild(el('path',{'class':'arrow',d:'M'+a+' '+(y+1)+' Q'+((a+b)/2)+' '+(y-6)+' '+b+' '+(y+1)+' M'+(b+s*2.4)+' '+(y-1.2)+' L'+b+' '+(y+1)+' L'+(b+s*-.2)+' '+(y+3.6)}));
  }
}
function words(i){return 'column '+(i+1)}

// one nudge: ring the tallest wobbly column, then slide its top seed to the lower neighbour
function nudge(done){
  if(busy)return;
  var p=pick();
  if(!p){
    mark=null;draw();
    setSay(moved?'Settled. No rings left, and not one seed skittered off the edge. Pat pat.':'This heap is already settled, so I left it be.','ok');
    if(done)done(false);
    return;
  }
  busy=true;
  var my=epoch;
  mark={from:p.from,to:p.to};
  draw();
  var side=p.to<p.from?'left':'right';
  setSay('The tallest wobbly one is '+words(p.from)+'. Its lower neighbour is on the '+side+' ('+words(p.to)+'). The top seed slides that way.','bad');
  function land(){
    if(my!==epoch)return;
    h[p.from]--;h[p.to]++;moved++;
    mark=null;busy=false;draw();
    var left=wobblyList().length;
    setSay('One seed moved from '+words(p.from)+' to '+words(p.to)+'. '+(left?'Still a ring or two. Look again, then nudge again.':'No rings left. It has settled, and the seed stayed on the shelf.'),left?'bad':'ok');
    if(done)done(!!left);
  }
  if(reduce){land();return}
  var fly=document.getElementById('n-fly');
  setTimeout(function(){
    if(my!==epoch)return;
    if(fly){
      var dx=(p.to-p.from)*CW, dy=(h[p.from]-h[p.to]-1)*CH;
      fly.style.transform='translate('+dx+'px,'+dy+'px)';
    }
    setTimeout(land,500);
  },420);
}
function auto(){
  if(running){stopAuto();return}
  running=true;
  bAuto.textContent='Stop nudging';
  bAuto.setAttribute('aria-pressed','true');
  function go(){
    if(!running)return;
    nudge(function(more){
      if(!running)return;
      if(!more){stopAuto();return}
      timer=setTimeout(go,reduce?60:150);
    });
  }
  go();
}
bNudge.onclick=function(){stopAuto();nudge()};
bAuto.onclick=auto;
bNew.onclick=fresh;
for(var i=0;i<radios.length;i++)radios[i].onchange=fresh;
fresh();
})();
