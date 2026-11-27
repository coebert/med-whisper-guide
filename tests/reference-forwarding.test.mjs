import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { forwardHostedReference } from '../src/lib/reference-forwarding.mjs';
const old = 'https://med-whisper-guide.lovable.app';
const canonical = 'https://migrated-from-lovable-0aa80275.base44.app';
async function handoff(path, keys = []) {
  const response = forwardHostedReference(new Request(old + path));
  const html = await response.text();
  let actual;
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {
    URL, localStorage: {length:keys.length,key:i=>keys[i]},
    location:{replace:value=>{actual=value;}}
  });
  return {response,actual,html};
}
test('preserves monograph and topic paths', async () => {
  for (const path of ['/drugs/propofol','/drugs/noradrenaline/','/topics/sedation-anaesthesia'])
    assert.equal((await handoff(path)).actual,canonical+path);
});
test('preserves supported comparison and search filters, drops arbitrary parameters', async () => {
  assert.equal((await handoff('/compare?a=fentanyl&b=remifentanil&redirect=https://example.com')).actual,canonical+'/compare?a=fentanyl&b=remifentanil');
  assert.equal((await handoff('/search?q=propofol&class=agent&tdm=true&infusion=true&token=secret')).actual,canonical+'/search?q=propofol&class=agent&tdm=true&infusion=true');
});
test('passes only an offline restore marker, never cached clinical contents', async () => {
  const keys=Array.from({length:210},(_,i)=>'drugref:v9:drug:'+i);
  assert.equal((await handoff('/drugs/propofol',keys)).actual,canonical+'/drugs/propofol#restore-offline-reference');
  assert.equal((await handoff('/drugs/propofol',keys.slice(1))).actual,canonical+'/drugs/propofol');
});
test('limits bridge to exact public legacy hostname and read methods', () => {
  for (const origin of ['https://other.lovable.app','https://id-preview--med-whisper-guide.lovable.app',canonical,'http://med-whisper-guide.lovable.app','https://localhost'])
    assert.equal(forwardHostedReference(new Request(origin+'/drugs/propofol')),undefined);
  for(const method of ['POST','PUT','DELETE']) assert.equal(forwardHostedReference(new Request(old+'/drugs/propofol',{method})),undefined);
  for(const path of ['/api/drugs','//example.com','/unknown']) assert.equal(forwardHostedReference(new Request(old+path)),undefined);
});
test('HEAD has no body and handoff remains uncached with no referrer',async()=>{
  const r=forwardHostedReference(new Request(old+'/drugs/propofol',{method:'HEAD'}));
  assert.equal(await r.text(),''); assert.equal(r.headers.get('cache-control'),'no-store');
  assert.equal(r.headers.get('referrer-policy'),'no-referrer');
});
test('escapes hostile query text and rejects overlong values',async()=>{
  const r=await handoff('/search?q='+encodeURIComponent('</script><script>alert(1)</script>'));
  assert.equal(new URL(r.actual).searchParams.get('q'),'</script><script>alert(1)</script>');
  assert.equal((r.html.match(/<script>/g)||[]).length,1);
  assert.equal((await handoff('/search?q='+'x'.repeat(201))).actual,canonical+'/search');
});
