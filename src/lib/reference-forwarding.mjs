// Compatibility bridge for the former public origin. Keep until retirement gates pass.
const referenceOrigin = 'https://migrated-from-lovable-0aa80275.base44.app';
const referencePage = /^\/(?:|about|calculator|compare|drugs(?:\/[a-z0-9-]+)?|infusions|ios-privacy|monitoring|offline|premedication|references|review-status|search|sources|support|topics(?:\/[a-z0-9-]+)?)\/?$/;

export function forwardHostedReference(request) {
  const url = new URL(request.url);
  if (!['GET','HEAD'].includes(request.method) || url.protocol !== 'https:' ||
      url.hostname !== 'med-whisper-guide.lovable.app' ||
      !referencePage.test(url.pathname) || url.pathname.startsWith('//')) return;
  const destination = new URL(referenceOrigin);
  destination.pathname = url.pathname;
  const allowed = url.pathname.replace(/\/$/,'') === '/compare' ? ['a','b'] :
    url.pathname.replace(/\/$/,'') === '/search' ? ['q','class','tdm','infusion'] : [];
  for(const key of allowed) {
    const value=url.searchParams.get(key);
    if(value !== null && value.length<=200) destination.searchParams.set(key,value);
  }
  const literal=JSON.stringify(destination.href).replace(/</g,'\\u003c');
  const link=destination.href.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const html='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Anaesthesia Drug Guide has moved</title><script>'+
    'const target=new URL('+literal+');try {let saved=0;for(let i=0;i<localStorage.length;i++){if(localStorage.key(i)?.startsWith("drugref:v9:drug:"))saved++;}if(saved>=210)target.hash="restore-offline-reference";}catch{}location.replace(target.href);'+
    '</script><main><h1>Anaesthesia Drug Guide has moved</h1><p><a href="'+link+'">Open the reference on Base44</a></p></main></html>';
  return new Response(request.method === 'HEAD' ? null : html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
}

