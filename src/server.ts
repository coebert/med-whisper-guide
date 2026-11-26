import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const referenceOrigin = 'https://migrated-from-lovable-0aa80275.base44.app';
const referencePage = /^\/(?:|about|calculator|compare|drugs(?:\/[a-z0-9-]+)?|infusions|ios-privacy|monitoring|offline|premedication|references|review-status|search|sources|support|topics(?:\/[a-z0-9-]+)?)\/?$/;

function forwardHostedReference(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (!['GET','HEAD'].includes(request.method) || url.protocol !== 'https:' ||
      !url.hostname.endsWith('.lovable.app') || url.hostname.startsWith('id-preview--') ||
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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const forwarded = forwardHostedReference(request);
    if (forwarded) return forwarded;
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
