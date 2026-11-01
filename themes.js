const TIDE_THEMES={
 tide:{name:'Tide',bg:'#06162f',panel:'#102c52',nav:'#0b2449',field:'#0d2b52',text:'#edf4ff',muted:'#92afd2',accent:'#1566e8'},
 midnight:{name:'Midnight',bg:'#08090e',panel:'#191c28',nav:'#12141e',field:'#191c28',text:'#efeff7',muted:'#9b9db3',accent:'#9b9fc2'},
 seafoam:{name:'Seafoam',bg:'#071f21',panel:'#123b3d',nav:'#0c3033',field:'#123b3d',text:'#e5faf6',muted:'#8dbcb9',accent:'#35b9ad'},
 plum:{name:'Plum',bg:'#1b1029',panel:'#352046',nav:'#291837',field:'#352046',text:'#f2eafa',muted:'#b6a0cb',accent:'#ac7bde'},
 rose:{name:'Rose',bg:'#2b1421',panel:'#4c2839',nav:'#3c1d2e',field:'#4c2839',text:'#ffedf3',muted:'#c7a0b1',accent:'#e68eaf'},
 sand:{name:'Sand',bg:'#2b2015',panel:'#493722',nav:'#3a2b1b',field:'#493722',text:'#f8efdf',muted:'#bca78c',accent:'#d7ad70'},
 forest:{name:'Forest',bg:'#111f17',panel:'#263b2a',nav:'#1a2d20',field:'#263b2a',text:'#eaf2e7',muted:'#a1b59e',accent:'#8fba7d'},
 slate:{name:'Slate',bg:'#19212c',panel:'#2c394b',nav:'#232e3d',field:'#2c394b',text:'#edf2fa',muted:'#a5b2c6',accent:'#85a8d2'}
};
function setTheme(key){const t=TIDE_THEMES[key]||TIDE_THEMES.tide;for(const [k,v] of Object.entries({bg:t.bg,panel:t.panel,nav:t.nav,field:t.field,ink:t.text,muted:t.muted,accent:t.accent}))document.documentElement.style.setProperty('--'+k,v);document.documentElement.dataset.theme=key;document.querySelector('meta[name="theme-color"]').content=t.bg}
function themePicker(){return '<div class="theme-grid">'+Object.entries(TIDE_THEMES).map(([key,t])=>'<button class="theme-option '+((prefs.theme||'tide')===key?'selected':'')+'" data-theme-choice="'+key+'" aria-pressed="'+((prefs.theme||'tide')===key)+'"><span class="theme-preview" style="background:'+t.bg+'"><i style="background:'+t.nav+'"></i><b style="background:'+t.accent+'"></b><em style="background:'+t.panel+'"></em></span><span>'+t.name+'</span></button>').join('')+'</div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-theme-choice]');if(!b)return;prefs.theme=b.dataset.themeChoice;applyPrefs();document.querySelectorAll('[data-theme-choice]').forEach(el=>{const selected=el.dataset.themeChoice===prefs.theme;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected))})});
