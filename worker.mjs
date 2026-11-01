const ALLOWED_ORIGINS=new Set(['https://tides.pages.dev','https://nerdcrab.github.io','https://edustudy.surge.sh','https://tideseducation.surge.sh','https://oceanstudies.surge.sh','https://tidesedu.edgeone.dev']);
const buckets=new Map();
function json(body,status=200,origin=''){const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};if(origin&&ALLOWED_ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;return new Response(JSON.stringify(body),{status,headers})}
async function boundedJSON(request,maxBytes=2500000){const length=Number(request.headers.get('content-length')||0);if(length>maxBytes)throw Error('size');const reader=request.body?.getReader();if(!reader)throw Error('json');let size=0,chunks=[];try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw Error('size')}chunks.push(value)}}finally{reader.releaseLock()}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}return JSON.parse(new TextDecoder().decode(bytes))}
function validImage(data){if(typeof data!=='string'||data.length>1200000)return false;const m=data.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);if(!m||m[2].length%4)return false;try{const s=atob(m[2].slice(0,32));return m[1]==='jpeg'?s.startsWith('\xff\xd8\xff'):m[1]==='png'?s.startsWith('\x89PNG\r\n\x1a\n'):s.startsWith('RIFF')&&s.slice(8,12)==='WEBP'}catch{return false}}
function limited(ip){const now=Date.now();for(const [key,b]of buckets)if(now-b.start>60000)buckets.delete(key);if(buckets.size>4000)return true;let b=buckets.get(ip);if(!b){b={start:now,count:0};buckets.set(ip,b)}b.count++;return b.count>6}
async function presence(request,env){
 const origin=request.headers.get('Origin')||'';
 if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:'Not allowed.'},403);
 if(request.method==='OPTIONS')return ALLOWED_ORIGINS.has(origin)?new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}}):json({error:'Not allowed.'},403);
 if(!['GET','POST'].includes(request.method))return json({error:'Use GET or POST.'},405,origin);
 if(!env.PRESENCE_DB)return json({error:'Online count unavailable.'},503,origin);
 const now=Date.now(),cutoff=now-120000;
 try{
  let row;
  if(request.method==='POST'){
   if(!ALLOWED_ORIGINS.has(origin))return json({error:'Not allowed.'},403);
   if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Use JSON.'},415,origin);
   let data;try{data=await boundedJSON(request,256)}catch{return json({error:'Invalid visitor.'},400,origin)}
   if(typeof data.id!=='string'||!/^\w{8}-\w{4}-4\w{3}-[89ab]\w{3}-\w{12}$/i.test(data.id)||!/^[0-9a-f-]+$/i.test(data.id))return json({error:'Invalid visitor.'},400,origin);
   const results=await env.PRESENCE_DB.batch([
    env.PRESENCE_DB.prepare('DELETE FROM online_visitors WHERE last_seen < ?').bind(cutoff),
    env.PRESENCE_DB.prepare('INSERT INTO online_visitors(id,last_seen) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen WHERE online_visitors.last_seen < ?').bind(data.id,now,now-30000),
    env.PRESENCE_DB.prepare('SELECT COUNT(*) AS online FROM online_visitors WHERE last_seen >= ?').bind(cutoff)
   ]);row=results[2].results[0];
  }else row=await env.PRESENCE_DB.prepare('SELECT COUNT(*) AS online FROM online_visitors WHERE last_seen >= ?').bind(cutoff).first();
  return json({online:Number(row.online),windowSeconds:120},200,origin);
 }catch{return json({error:'Online count unavailable.'},503,origin)}
}

export default{async fetch(request,env){
 const url=new URL(request.url);if(url.pathname==='/api/presence')return presence(request,env);if(url.pathname!=='/api/chat')return env.ASSETS.fetch(request);
 const origin=request.headers.get('Origin')||'';
 if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:'This site is not allowed to use chat.'},403);
 if(request.method==='OPTIONS'){if(!ALLOWED_ORIGINS.has(origin))return json({error:'Not allowed.'},403);return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}})}
 if(request.method==='GET')return json({configured:!!env.OPENROUTER_API_KEY,model:'openrouter/free'},200,origin);
 if(request.method!=='POST')return json({error:'Use POST.'},405,origin);
 if(!ALLOWED_ORIGINS.has(origin))return json({error:'Open chat from Tide.'},403,origin);
 if(!env.OPENROUTER_API_KEY)return json({error:'Chat is not connected yet.'},503,origin);
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'Use a JSON request.'},415,origin);
 let data;try{data=await boundedJSON(request)}catch(e){return json({error:e.message==='size'?'Message is too long.':'Invalid chat request.'},e.message==='size'?413:400,origin)}
 if(!Array.isArray(data.messages)||!data.messages.length||data.messages.length>16)return json({error:'Start a new chat and try again.'},400,origin);
 let total=0,imageCount=0;const messages=[];for(const m of data.messages){if(!m||!['user','assistant'].includes(m.role))return json({error:'Invalid message role.'},400,origin);if(typeof m.content==='string'){if(!m.content.trim()||m.content.length>4000)return json({error:'Messages must contain 1–4,000 characters.'},400,origin);total+=m.content.length;messages.push({role:m.role,content:m.content});continue}if(m.role!=='user'||!Array.isArray(m.content)||m.content.length!==2)return json({error:'Invalid image message.'},400,origin);const [text,image]=m.content;if(text?.type!=='text'||typeof text.text!=='string'||!text.text.trim()||text.text.length>4000||image?.type!=='image_url'||!validImage(image.image_url?.url))return json({error:'Use a JPG, PNG, or WebP image and a short message.'},400,origin);if(++imageCount>2)return json({error:'Send no more than two images in a request.'},400,origin);total+=text.text.length;messages.push({role:'user',content:[{type:'text',text:text.text},{type:'image_url',image_url:{url:image.image_url.url}}]})}
 if(total>14000)return json({error:'This chat is full. Start a new chat to continue.'},400,origin);
 if(data.messages.at(-1).role!=='user')return json({error:'The last message must be from you.'},400,origin);
 if(limited(request.headers.get('CF-Connecting-IP')||'unknown'))return json({error:'Too many messages. Wait a minute and try again.'},429,origin);
 try{
  const upstream=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+env.OPENROUTER_API_KEY,'Content-Type':'application/json','HTTP-Referer':'https://tides.pages.dev','X-OpenRouter-Title':'Tide'},body:JSON.stringify({model:'openrouter/free',messages:[{role:'system',content:'You are Tide, a general-purpose chat assistant. Give clear, useful answers in plain language. You can inspect images attached to this chat, but cannot see the user’s live screen, browse the web, or control their device. Do not pretend to have done so.'},...messages],max_tokens:1000,stream:false}),signal:AbortSignal.timeout(45000)});
  if(!upstream.ok){const text=upstream.status===429?'The free models are busy or the daily limit has been reached. Try again later.':upstream.status===401||upstream.status===403?'Chat needs its server connection checked.':'The model is unavailable. Try again later.';return json({error:text},upstream.status===429?429:502,origin)}
  const result=await upstream.json();const reply=result.choices?.[0]?.message?.content;
  if(typeof reply!=='string'||!reply.trim())return json({error:'The model returned an empty reply. Try again.'},502,origin);
  return json({reply},200,origin);
 }catch{return json({error:'The reply timed out or the provider could not be reached. Try again.'},502,origin)}
}};
