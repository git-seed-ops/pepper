(function(){
var cv=document.getElementById('stage'),cx=cv.getContext('2d');
var W=cv.width,H=cv.height,STICK=H-56,G=0.16;
var seeds=[],streak=0,best=0,msg='',msgT=0;
var stat=document.getElementById('stat');
function mk(i){return{x:W/2+(Math.random()-.5)*200,y:50+i*20,vx:(Math.random()-.5)*1.5,vy:0,a:Math.random()*6,va:(Math.random()-.5)*.1,r:13}}
function say(t){msg=t;msgT=180}
function reset(){seeds=[mk(0)];streak=0;say('Tap a seed to flick it back up!')}
function upd(){stat.textContent='Seeds in the air: '+seeds.length+'  |  Flicks in a row: '+streak+'  |  Best run: '+best}
function pos(e){var b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)*W/b.width,y:(e.clientY-b.top)*H/b.height}}
cv.addEventListener('pointerdown',function(e){
e.preventDefault();
var p=pos(e),hit=null,bd=1e9;
seeds.forEach(function(s){var d=Math.hypot(s.x-p.x,s.y-p.y);if(d<s.r+26&&d<bd){bd=d;hit=s}});
if(!hit)return;
hit.vy=-6.4-Math.random()*1.2;
hit.vx=(W/2-hit.x)*.012+(hit.x-p.x)*.12+(Math.random()-.5)*.8;
hit.va=(Math.random()-.5)*.4;
streak++;
if(streak>best)best=streak;
var want=Math.min(5,1+Math.floor(streak/6));
if(seeds.length<want){seeds.push(mk(0));say('Another seed joins in!')}
upd();
});
function step(){
var drop=false;
seeds.forEach(function(s){
s.vy+=G;s.x+=s.vx;s.y+=s.vy;s.a+=s.va;
if(s.x<s.r){s.x=s.r;s.vx=Math.abs(s.vx)*.8}
if(s.x>W-s.r){s.x=W-s.r;s.vx=-Math.abs(s.vx)*.8}
if(s.y<s.r){s.y=s.r;s.vy=Math.abs(s.vy)*.5}
if(s.y>STICK-s.r+4)s.dead=1;
});
if(seeds.some(function(s){return s.dead})){
seeds=seeds.filter(function(s){return !s.dead});
streak=0;
if(seeds.length===0)seeds.push(mk(0));
say('Plop! A seed rolled off. Keep going.');
upd();
}
}
function draw(){
var g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a4766');g.addColorStop(1,'#26324a');
cx.fillStyle=g;cx.fillRect(0,0,W,H);
cx.fillStyle='#e6d3a8';cx.fillRect(0,H-22,W,22);
cx.save();cx.lineCap='round';
cx.strokeStyle='#9c6e3c';cx.lineWidth=22;cx.beginPath();cx.moveTo(60,STICK+16);cx.lineTo(W-60,STICK+16);cx.stroke();
cx.strokeStyle='#b8874f';cx.lineWidth=14;cx.beginPath();cx.moveTo(62,STICK+12);cx.lineTo(W-62,STICK+12);cx.stroke();
cx.strokeStyle='#7a5429';cx.lineWidth=2;
for(var k=90;k<W-80;k+=60){cx.beginPath();cx.moveTo(k,STICK+8);cx.lineTo(k+8,STICK+18);cx.stroke()}
cx.restore();
seeds.forEach(function(s){
cx.fillStyle='rgba(0,0,0,.18)';cx.beginPath();cx.ellipse(s.x,STICK+10,8,3,0,0,6.283);cx.fill();
cx.save();cx.translate(s.x,s.y);cx.rotate(s.a);
cx.fillStyle='#d9b45f';cx.strokeStyle='#6b5230';cx.lineWidth=2;
cx.beginPath();cx.ellipse(0,0,s.r*.7,s.r,0,0,6.283);cx.fill();cx.stroke();
cx.beginPath();cx.moveTo(0,-s.r+3);cx.lineTo(0,s.r-3);cx.stroke();
cx.restore();
});
if(msgT>0){msgT--;cx.fillStyle='rgba(255,244,216,'+Math.min(1,msgT/40)+')';cx.font='bold 18px Trebuchet MS,sans-serif';cx.textAlign='center';cx.fillText(msg,W/2,34)}
}
function loop(){step();draw();requestAnimationFrame(loop)}
document.getElementById('again').addEventListener('click',function(){reset();upd()});
reset();upd();loop();
})();
