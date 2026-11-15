(function(){
var NS='http://www.w3.org/2000/svg';
var tray=document.getElementById('tray');
var layer=document.getElementById('layer');
var mood=document.getElementById('mood');
var W=400,FLOOR=118,KEY='pepper-seed-heaps';
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var seeds=[];            // {el,kind,hx,hy,mx,my}
var cols={sun:{},mil:{}};
var centre={sun:100,mil:300};
var cap={sun:90,mil:420};
var mixed=false;

function rnd(a,b){return a+Math.random()*(b-a)}
function gauss(){return (Math.random()+Math.random()+Math.random()-1.5)/1.5}
function put(s,x,y){s.el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)'}

function settle(kind){
  var w=kind==='sun'?10:3.4, h=kind==='sun'?5.6:3.4;
  var spread=kind==='sun'?30:34;
  var x=centre[kind]+gauss()*spread;
  var c=cols[kind], lo=Math.floor((x-w/2)/2), hi=Math.floor((x+w/2)/2), top=FLOOR,i;
  for(i=lo;i<=hi;i++){var v=c[i]===undefined?FLOOR:c[i]; if(v<top)top=v}
  // slump: slide toward the lower neighbour if the spot is steep
  for(var k=0;k<6;k++){
    var l=c[lo-2]===undefined?FLOOR:c[lo-2], r=c[hi+2]===undefined?FLOOR:c[hi+2];
    if(l-top>h*1.6 && x>centre[kind]-60){x-=2;lo--;hi--}
    else if(r-top>h*1.6 && x<centre[kind]+60){x+=2;lo++;hi++}
    else break;
    top=FLOOR;for(i=lo;i<=hi;i++){var v2=c[i]===undefined?FLOOR:c[i]; if(v2<top)top=v2}
  }
  var y=top-h*.55;
  for(i=lo;i<=hi;i++)c[i]=top-h*.8;
  return {x:x,y:y};
}

function make(kind,pos){
  var g=document.createElementNS(NS,'g');g.setAttribute('class','seed');
  if(kind==='sun'){
    var rot=rnd(-35,35)+(Math.random()<.4?rnd(-40,40):0);
    var e=document.createElementNS(NS,'ellipse');
    e.setAttribute('rx',4.8);e.setAttribute('ry',2.6);e.setAttribute('class','sun');
    e.setAttribute('transform','rotate('+rot.toFixed(0)+')');
    var l=document.createElementNS(NS,'line');
    l.setAttribute('x1',-3);l.setAttribute('x2',3);l.setAttribute('y1',0);l.setAttribute('y2',0);
    l.setAttribute('class','sunline');l.setAttribute('transform','rotate('+rot.toFixed(0)+')');
    g.appendChild(e);g.appendChild(l);
  }else{
    var c=document.createElementNS(NS,'circle');
    c.setAttribute('r',1.7);c.setAttribute('class','mil');g.appendChild(c);
  }
  var s={el:g,kind:kind,hx:pos.x,hy:pos.y,mx:rnd(8,W-8),my:rnd(FLOOR-14,FLOOR-2)};
  layer.appendChild(g);
  seeds.push(s);
  return s;
}

function add(kind,n,drop){
  for(var i=0;i<n;i++){
    var count=seeds.filter(function(s){return s.kind===kind}).length;
    if(count>=cap[kind])break;
    var s=make(kind,settle(kind));
    if(mixed){put(s,s.mx,s.my)}
    else if(drop&&!reduce){
      s.el.style.setProperty('--t','0s');
      put(s,s.hx,-10);
      (function(s){requestAnimationFrame(function(){requestAnimationFrame(function(){
        s.el.style.setProperty('--t',(.5+Math.random()*.4)+'s');put(s,s.hx,s.hy)})})})(s);
    }else put(s,s.hx,s.hy);
  }
  update();save();
}

function word(n,big){
  var a=big?[0,12,40,70]:[0,60,180,320];
  if(n===0)return 'nothing yet';
  if(n<a[1])return 'a tiny few';
  if(n<a[2])return 'a nice little mound';
  if(n<a[3])return 'a proper heap';
  return 'a mountain';
}
function update(){
  var ns=seeds.filter(function(s){return s.kind==='sun'}).length;
  var nm=seeds.length-ns;
  document.getElementById('sunword').textContent=word(ns,true);
  document.getElementById('milword').textContent=word(nm,false);
  if(mixed)mood.textContent='Oh no. Everything is jumbled. My paws are itching.';
  else if(seeds.length>0)mood.textContent='Sunflower on the left, millet on the right. Tidy. Perfect.';
  else mood.textContent='Tap the shelf, or press a button, to pour some seeds.';
}
function save(){
  try{localStorage.setItem(KEY,JSON.stringify({
    s:seeds.filter(function(s){return s.kind==='sun'}).length,
    m:seeds.filter(function(s){return s.kind==='mil'}).length}))}catch(e){}
}

function toss(){
  mixed=true;
  seeds.forEach(function(s,i){
    s.mx=rnd(8,W-8);s.my=rnd(FLOOR-16,FLOOR-2);
    s.el.style.setProperty('--t',(.5+Math.random()*.5)+'s');
    put(s,s.mx,s.my-rnd(0,30));
    (function(s){setTimeout(function(){put(s,s.mx,s.my)},reduce?0:420)})(s);
  });
  pressed(false);update();
}
function sortThem(){
  mixed=false;
  // sunflowers first, then millet, a little staggered so it feels like carrying
  seeds.forEach(function(s,i){
    var delay=reduce?0:Math.min(i*6,1400);
    setTimeout(function(){
      s.el.style.setProperty('--t',(.8+Math.random()*.5)+'s');
      put(s,s.hx,s.hy);
    },delay);
  });
  pressed(true);update();
}
function pressed(v){document.getElementById('sortbtn').setAttribute('aria-pressed',v?'true':'false')}
function clearAll(){
  seeds.forEach(function(s){s.el.remove()});seeds=[];cols={sun:{},mil:{}};mixed=false;pressed(false);update();save();
}

// tap the left or right half of the tray to pour that seed
tray.addEventListener('click',function(e){
  var r=tray.getBoundingClientRect();
  var x=(e.clientX-r.left)/r.width;
  add(x<.5?'sun':'mil',x<.5?4:14,true);
});
document.getElementById('addsun').onclick=function(){add('sun',6,true)};
document.getElementById('addmil').onclick=function(){add('mil',25,true)};
document.getElementById('mixbtn').onclick=toss;
document.getElementById('sortbtn').onclick=sortThem;
document.getElementById('clearbtn').onclick=clearAll;

var start={s:14,m:60};
try{var v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&v.s+v.m>0)start=v}catch(e){}
add('sun',start.s,false);add('mil',start.m,false);
})();
