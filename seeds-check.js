(function(){
// The settle check readout. It reads each column's height from the diagram itself,
// so it always agrees with what the diagram shows.
var heaps=[
  {id:'sun',limit:2,name:'Sunflower'},
  {id:'mil',limit:1,name:'Millet'}
];
function heights(svg){
  var out=[];
  var hits=svg.querySelectorAll('[data-i]');
  for(var i=0;i<hits.length;i++){
    var m=/,\s*(\d+) seeds? high/.exec(hits[i].getAttribute('aria-label')||'');
    out[+hits[i].getAttribute('data-i')]=m?+m[1]:0;
  }
  return out;
}
function wobbly(h,limit){
  var w=[];
  for(var i=0;i<h.length;i++){
    var l=i>0?h[i-1]:h[i], r=i<h.length-1?h[i+1]:h[i];
    if(h[i]-l>limit||h[i]-r>limit)w.push(i);
  }
  return w;
}
function show(p){
  var svg=document.getElementById('cols-'+p.id);
  var dots=document.getElementById('dots-'+p.id);
  var say=document.getElementById('say-'+p.id);
  if(!svg||!dots||!say)return;
  var h=heights(svg);
  if(!h.length)return;
  var w=wobbly(h,p.limit),set={};
  w.forEach(function(i){set[i]=1});
  var html='';
  for(var i=0;i<h.length;i++)html+='<i'+(set[i]?' class="w"':'')+'></i>';
  if(dots.getAttribute('data-sig')!==html){dots.innerHTML=html;dots.setAttribute('data-sig',html)}
  var txt,cls;
  if(!w.length){txt='settled, no rings';cls='ok'}
  else if(w.length===1){txt='one wobbly column (number '+(w[0]+1)+')';cls='bad'}
  else{txt=w.length+' wobbly columns';cls='bad'}
  if(say.textContent!==txt){say.textContent=txt;say.className='chk-say '+cls}
}
function all(){heaps.forEach(show)}
heaps.forEach(function(p){
  var svg=document.getElementById('cols-'+p.id);
  if(!svg)return;
  var pending=false;
  new MutationObserver(function(){
    if(pending)return;pending=true;
    requestAnimationFrame(function(){pending=false;all()});
  }).observe(svg,{childList:true});
});
all();
})();
