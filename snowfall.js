(function(){
var sky=document.getElementById('sfSky');
var layersEl=document.getElementById('sfLayers');
var counts={lazy:36,queenly:80,blizzard:170};
var mode='queenly';
var depths=[
  {name:'far',  size:[2,4],  dur:[22,30], swd:[5,8],  amp:[4,10],  o:[.35,.5], blur:'1px',push:[.4,.7], stars:0},
  {name:'mid',  size:[4,7],  dur:[14,20], swd:[3,6],  amp:[10,22], o:[.6,.8],  blur:'.4px',push:[.8,1.2],stars:.05},
  {name:'near', size:[9,18], dur:[8,12],  swd:[2,4],  amp:[18,40], o:[.8,.95], blur:'0px', push:[1.5,2.3],stars:.4}
];
function r(a){return a[0]+Math.random()*(a[1]-a[0]);}
function build(){
  layersEl.innerHTML='';
  var total=counts[mode];
  var share=[.5,.35,.15];
  depths.forEach(function(d,i){
    var layer=document.createElement('div');
    layer.className='layer layer-'+d.name;
    var n=Math.round(total*share[i]);
    for(var k=0;k<n;k++){
      var outer=document.createElement('span');
      outer.className='fall';
      var inner=document.createElement('span');
      var star=Math.random()<d.stars;
      inner.className='sway'+(star?' star':'');
      if(star)inner.textContent='\u2745';
      var s=Math.round(r(d.size));
      var st=outer.style;
      st.setProperty('--x',(Math.random()*104-2).toFixed(1)+'%');
      st.setProperty('--y',(Math.random()*90).toFixed(0));
      st.setProperty('--s',s+'px');
      st.setProperty('--dur',r(d.dur).toFixed(1)+'s');
      st.setProperty('--delay','-'+(Math.random()*d.dur[1]).toFixed(1)+'s');
      st.setProperty('--o',r(d.o).toFixed(2));
      st.setProperty('--push',r(d.push).toFixed(2));
      var is=inner.style;
      is.setProperty('--amp',r(d.amp).toFixed(1));
      is.setProperty('--tilt',r([8,40]).toFixed(0));
      is.setProperty('--swd',r(d.swd).toFixed(1)+'s');
      is.setProperty('--sdelay','-'+(Math.random()*d.swd[1]).toFixed(1)+'s');
      is.setProperty('--blur',d.blur);
      is.setProperty('--spin',r([10,24]).toFixed(0)+'s');
      outer.appendChild(inner);
      layer.appendChild(outer);
    }
    layersEl.appendChild(layer);
  });
}
function setNow(){
  var m={lazy:'Lazy snow. Plenty of time to think about seeds.',queenly:'Queenly snow. Three depths, all swaying at their own pace.',blizzard:'A blizzard! My whiskers are very busy.'};
  document.getElementById('sfNow').textContent=m[mode];
}
['lazy','queenly','blizzard'].forEach(function(k){
  document.getElementById('b-'+k).addEventListener('click',function(){mode=k;build();setNow();});
});
var wind=document.getElementById('wind');
wind.addEventListener('input',function(){sky.style.setProperty('--wind',wind.value);});
var hush=document.getElementById('hushBtn');
hush.addEventListener('click',function(){
  var h=sky.classList.toggle('hush');
  hush.textContent=h?'Let it fall again':'Hush the snow';
  hush.setAttribute('aria-pressed',h);
});
build();setNow();

/* ---- the finished shortcut ---- */
var svgNS='http://www.w3.org/2000/svg';
var tun=document.getElementById('tun');
var path=document.getElementById('tpath');
var ham=document.getElementById('tham');
var digBtn=document.getElementById('digBtn');
var walkBtn=document.getElementById('walkBtn');
var tnote=document.getElementById('tnote');
var len=path.getTotalLength();
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var done=false,busy=false;
try{done=localStorage.getItem('pepperShortcut')==='1';}catch(e){}
function place(t){var p=path.getPointAtLength(len*t);ham.setAttribute('cx',p.x);ham.setAttribute('cy',p.y);}
function show(f){path.style.strokeDasharray=len;path.style.strokeDashoffset=len*(1-f);}
function anim(ms,fn,end){
  if(reduce){fn(1);end&&end();return;}
  var t0=null;
  function step(ts){
    if(t0===null)t0=ts;
    var f=Math.min(1,(ts-t0)/ms);
    var e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
    fn(e);
    if(f<1)requestAnimationFrame(step);else end&&end();
  }
  requestAnimationFrame(step);
}
function finished(){
  done=true;digBtn.textContent='The shortcut is done';digBtn.disabled=true;walkBtn.disabled=false;
  tnote.textContent='Done! The Back Corner Hollow now runs all the way to the den under the Ramp Shadow Dip. A tiny queen does not take the long way round.';
}
if(done){show(1);place(0);finished();}else{show(0);place(0);walkBtn.disabled=true;}
digBtn.addEventListener('click',function(){
  if(busy||done)return;busy=true;
  tnote.textContent='Scratch, scratch, kick the sand backwards...';
  anim(4200,function(e){show(e);place(e);},function(){
    busy=false;finished();
    try{localStorage.setItem('pepperShortcut','1');}catch(e){}
  });
});
walkBtn.addEventListener('click',function(){
  if(busy||!done)return;busy=true;
  tnote.textContent='Trot trot trot. It smells of warm dust, then cool shade.';
  anim(3200,function(e){place(e);},function(){
    busy=false;
    tnote.textContent='In the den under the Ramp Shadow Dip. Quiet. Dim. Perfect for a nap. (Tap again to go back.)';
    var rev=document.createElement('i');
    // flip direction for next walk
    path.dataset.rev=path.dataset.rev==='1'?'0':'1';
  });
});
/* second walk goes the other way */
walkBtn.addEventListener('click',function(){});
(function(){
  var orig=place;
  place=function(t){orig(path.dataset.rev==='1'?1-t:t);};
})();
})();
