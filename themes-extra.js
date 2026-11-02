Object.assign(TIDE_THEMES,{
 chill:{name:'Chill Guy',bg:'#18231e',panel:'#2a3b32',nav:'#23332b',field:'#2d4036',text:'#f3f0e4',muted:'#c1cabd',accent:'#a5ba9d',wallpaper:'wallpaper-chill.svg?v=0ede0b5efa',shade:.48,position:'80% center',motionLabel:'Move the clouds.'},
 nyan:{name:'Nyan Cat',bg:'#071c3d',panel:'#172e57',nav:'#10274d',field:'#1b345e',text:'#fff0fc',muted:'#c3cef1',accent:'#ed8bc6',wallpaper:'wallpaper-nyan.svg?v=c8fb67e625',shade:.24,position:'70% center',motionLabel:'Animate the stars.'},
 doge:{name:'Doge',bg:'#271f12',panel:'#40301d',nav:'#352816',field:'#483622',text:'#fff3d8',muted:'#e1cba3',accent:'#d9aa50',wallpaper:'wallpaper-doge.webp?v=2608377f3e',shade:.57,position:'60% 40%',motionLabel:'Animate the dust.'},
 xp:{name:'Windows XP',bg:'#071b36',panel:'#102f5a',nav:'#0e3772',field:'#163c66',text:'#f3f8ff',muted:'#b7d2ed',accent:'#79bc51',wallpaper:'wallpaper-xp.webp?v=831c041f78',shade:.47,position:'center center',motionLabel:'Move the clouds.'},
 dvd:{name:'DVD Screensaver',bg:'#020204',panel:'#18151f',nav:'#100e16',field:'#211c2c',text:'#f4efff',muted:'#c0b4d1',accent:'#c49bff',wallpaper:'wallpaper-dvd.svg?v=4c0f40c23c',shade:0,position:'center center',motionLabel:'Move the DVD logo.'},
 minecraft:{name:'Minecraft',bg:'#121b10',panel:'#273421',nav:'#1d2b19',field:'#2b3925',text:'#f0f6de',muted:'#bfcfae',accent:'#8bbb59',wallpaper:'wallpaper-minecraft.webp?v=3552efe3eb',shade:.52,position:'center center',motionLabel:'Animate the pixels.'},
 backrooms:{name:'Backrooms',bg:'#211e10',panel:'#38321c',nav:'#302b17',field:'#403922',text:'#fff6d9',muted:'#ddd0a9',accent:'#cbb777',wallpaper:'wallpaper-backrooms.webp?v=bb9cad67ab',shade:.51,position:'center center',motionLabel:'Animate the dust.'},
 ps2:{name:'PS2',bg:'#030714',panel:'#101d37',nav:'#0b142b',field:'#142643',text:'#eef5ff',muted:'#a7c5ec',accent:'#6baeff',wallpaper:'wallpaper-ps2.svg?v=97178ae945',shade:.12,position:'center bottom',motionLabel:'Animate the particles.'},
 spongebob:{name:'SpongeBob',bg:'#092b3b',panel:'#12485b',nav:'#0c394e',field:'#165469',text:'#fff7dc',muted:'#c6e7e7',accent:'#f1cd63',wallpaper:'wallpaper-spongebob.webp?v=5d0fe3d321',shade:.49,position:'60% center',motionLabel:'Animate the bubbles.'},
 badapple:{name:'Bad Apple!!',bg:'#050505',panel:'#202020',nav:'#141414',field:'#292929',text:'#f4f4f4',muted:'#c4c4c4',accent:'#b9b9b9',wallpaper:'wallpaper-badapple.webp?v=cfedbda642',shade:.65,position:'center center',motionLabel:'Animate the petals.'}
});

function backdropSpecks(time,color,count=25,kind='dust'){
 ctx.save();ctx.fillStyle=color;ctx.strokeStyle=color;
 for(let i=0;i<count;i++){
  const x=((i*283.93)%1000)/1000*flowWidth+Math.sin(time*.00012+i)*12;
  const distance=time*(.008+(i%5)*.002),start=((i*167.3)%1000)/1000*flowHeight;
  const y=kind==='bubbles'?(start-distance%(flowHeight+30)+flowHeight+30)%(flowHeight+30)-15:(start+distance)%(flowHeight+30)-15;
  ctx.globalAlpha=.14+(i%4)*.07;
  if(kind==='bubbles'){ctx.beginPath();ctx.arc(x,y,3+(i%5)*2,0,Math.PI*2);ctx.lineWidth=.8;ctx.stroke()}
  else if(kind==='stars'){const size=2+(i%3)*2;ctx.fillRect(x-size,y,2*size,2);ctx.fillRect(x,y-size,2,2*size)}
  else if(kind==='pixels'){ctx.fillRect(Math.round(x/4)*4,Math.round(y/4)*4,3+(i%3)*2,3+(i%3)*2)}
  else if(kind==='petals'){ctx.save();ctx.translate(x,y);ctx.rotate(time*.0001+i);ctx.beginPath();ctx.ellipse(0,0,3,7,.7,0,Math.PI*2);ctx.fill();ctx.restore()}
  else{ctx.beginPath();ctx.arc(x,y,1+(i%2)*.5,0,Math.PI*2);ctx.fill()}
 }
 ctx.restore();
}
function drawDVDBackdrop(time){
 const w=Math.min(220,flowWidth*.4),h=w*.65,spanX=Math.max(1,flowWidth-w-32),spanY=Math.max(1,flowHeight-h-40);
 const reflect=(value,span)=>Math.abs((value%(span*2))-span);
 const x=16+reflect(time*.045,spanX),y=20+reflect(time*.032+spanY*.35,spanY);
 const colors=['#be93ff','#64d9ef','#92e5ab','#f2ca70','#ee91b7'];
 ctx.save();ctx.translate(x,y);ctx.scale(w/220,w/220);ctx.globalAlpha=.9;ctx.fillStyle=colors[Math.floor(time/14000)%colors.length];
 ctx.font='italic 900 86px Arial, sans-serif';ctx.fillText('DVD',0,79);ctx.beginPath();ctx.ellipse(105,105,106,15,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#020204';ctx.beginPath();ctx.ellipse(105,105,31,4.5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=colors[Math.floor(time/14000)%colors.length];ctx.font='18px Arial, sans-serif';ctx.fillText('V I D E O',54,145);ctx.restore();
}
function drawBackdropClouds(time){ctx.save();ctx.fillStyle='#eff2df';ctx.globalAlpha=.055;for(let i=0;i<3;i++){const x=((i*.37*flowWidth+time*.006)%(flowWidth+280))-140,y=flowHeight*(.16+i*.14);ctx.beginPath();ctx.ellipse(x,y,95,18,0,0,Math.PI*2);ctx.ellipse(x+20,y-17,45,22,0,0,Math.PI*2);ctx.fill()}ctx.restore()}
function drawExtraTheme(time){
 if(!TIDE_THEMES[prefs.theme]?.wallpaper)return false;
 switch(prefs.theme){
  case'dvd':drawDVDBackdrop(time);break;
  case'chill':case'xp':drawBackdropClouds(time);break;
  case'nyan':backdropSpecks(time,'#d3e8ff',26,'stars');break;
  case'doge':case'backrooms':backdropSpecks(time,'#f0d69b',18);break;
  case'minecraft':backdropSpecks(time,'#d0e3a5',22,'pixels');break;
  case'ps2':backdropSpecks(time,'#82c6ff',30,'pixels');break;
  case'spongebob':backdropSpecks(time,'#c4f6ff',27,'bubbles');break;
  case'badapple':backdropSpecks(time,'#fff',18,'petals');break;
 }
 return true;
}
