// gen_home.mjs — builds the Keep Pivoting homepage (off-piste design system) from ../portfolio-list.md
// Run from keeppivoting-site/:  node gen_home.mjs   → writes index.html + sitemap.xml
// Re-run whenever the fleet grows; commit + push to deploy.
// Design DNA lifted from builds/31-off-piste (Moksh-approved reference): warm paper, Oswald/Inter,
// orange route metaphor, numbered eyebrows, first-input-gated reveals, right-gutter signal field.
import fs from 'node:fs';

const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = TODAY.slice(0, 4);
const BOOK = 'https://cal.com/keep-pivoting/30min';
const MAIL = 'moksh@temporaryperspective.com';

/* ---------- fleet from portfolio-list.md ---------- */
const md = fs.readFileSync('../portfolio-list.md', 'utf8');
const live = md.split('## LIVE (deployed)')[1].split(/^## (?!LIVE)/m)[0];
const sites = live.split(/^### /m).slice(1).map(b => {
  const h = b.split('\n')[0];
  const m = h.match(/^#(\d+) — ([^—]+?)(?: —|$)/);
  const u = b.match(/\*\*AFTER:\*\* (https?:\/\/\S+)/);
  if (!m || !u) return null;
  // public index shows clean names: drop trailing parentheticals ("(Category B — real person)", founder lists)
  const name = m[2].trim().replace(/\s*\([^)]*\)?\s*$/, '');
  return { n: +m[1], name, url: u[1].trim() };
}).filter(Boolean);
if (sites.length < 40) throw new Error(`parse suspiciously low: ${sites.length} sites`);
console.log(`${sites.length} live sites parsed`);

const FEATURED = [
  { img: 'off-piste-capital', name: 'Off Piste Capital', line: 'A topographic route off the groomed trail — the whole fund thesis drawn as a map.', url: 'https://off-piste-capital.keeppivoting.com/' },
  { img: '412-venture-fund', name: '412 Venture Fund', line: 'Molten gold on forged graphite — Pittsburgh steel, rebuilt as a website.', url: 'https://412-venture-fund.keeppivoting.com/' },
  { img: 'gutter-capital', name: 'Gutter Capital', line: 'Hand-drawn line art and editorial serif — restraint as a design position.', url: 'https://gutter-capital.keeppivoting.com/' },
  { img: 'qca-ventures', name: 'QCA Ventures', line: 'A deep-purple color field around one number: $128M in, $1B+ out.', url: 'https://qca-ventures.keeppivoting.com/' },
  { img: 'do-ventures', name: 'Do Ventures', line: 'A plant that grows as you scroll — luck is grown, not found.', url: 'https://do-ventures.keeppivoting.com/' },
];

const fonts = fs.readFileSync('fonts-inline.css', 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- structured data ---------- */
const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': 'https://keeppivoting.com/#org',
      name: 'Keep Pivoting', url: 'https://keeppivoting.com/',
      slogan: 'We build beautiful websites so that any company can be found on AI chatbots.',
      description: 'Keep Pivoting is an AI-search agency (AEO / GEO). We build beautiful websites so that any company can be found on AI chatbots — sites ChatGPT, Claude, Gemini and Perplexity can fetch, read, quote and rank.',
      email: MAIL,
      knowsAbout: ['Answer Engine Optimization', 'Generative Engine Optimization', 'AEO', 'GEO', 'AI search visibility', 'web design'],
      areaServed: 'Worldwide',
    },
    { '@type': 'WebSite', '@id': 'https://keeppivoting.com/#site', url: 'https://keeppivoting.com/', name: 'Keep Pivoting', publisher: { '@id': 'https://keeppivoting.com/#org' }, inLanguage: 'en' },
    {
      '@type': 'ItemList', '@id': 'https://keeppivoting.com/#work',
      name: 'Websites built by Keep Pivoting', numberOfItems: sites.length,
      itemListElement: sites.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: s.url })),
    },
    {
      '@type': 'OfferCatalog', name: 'Keep Pivoting services',
      itemListElement: [
        { '@type': 'Offer', name: 'The Answer Site', price: '2500', priceCurrency: 'USD', description: 'One-time build. A site AI can fetch, read, quote and rank: real static HTML, JSON-LD schema, llms.txt, answer-first copy.' },
        { '@type': 'Offer', name: 'The Authority Build', price: '5000', priceCurrency: 'USD', description: 'From $5,000 one-time. Built ground-up to make you the name AI recommends in your category.' },
        { '@type': 'Offer', name: 'Momentum retainer', price: '1000', priceCurrency: 'USD', description: '$1,000/month. Monthly AEO content, schema upkeep, AI-visibility scoreboard across ChatGPT, Claude, Gemini and Perplexity.' },
        { '@type': 'Offer', name: 'Dominance retainer', price: '2000', priceCurrency: 'USD', description: '$2,000/month. Everything in Momentum plus original research AI cites, digital PR and citation building, continuous CRO.' },
      ],
    },
  ],
};

/* ---------- fragments ---------- */
const featuredSlides = FEATURED.map((f, i) => `
  <div class="slide">
    <div class="slide-inner">
      <div class="slide-copy">
        <p class="eyebrow rv"><span class="idx">${String(i + 1).padStart(2, '0')}</span><span class="sl">/</span> ${esc(f.name)}</p>
        <h3 class="slide-h rv d1">${esc(f.line)}</h3>
        <a class="visit rv d2" href="${esc(f.url)}" target="_blank" rel="noopener">Visit the live site <span class="ar">↗</span></a>
      </div>
      <a class="slide-shot rv d1" href="${esc(f.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(f.name)}">
        <img src="assets/work/${f.img}.jpg" width="1400" height="900" loading="${i ? 'lazy' : 'eager'}" alt="${esc(f.name)} — website by Keep Pivoting">
      </a>
    </div>
  </div>`).join('\n');

const indexRows = sites.map((s, i) => `
    <a class="news-row" href="${esc(s.url)}" target="_blank" rel="noopener">
      <span class="dt">${String(i + 1).padStart(2, '0')}</span>
      <span class="ttl">${esc(s.name)}</span>
      <span class="ar">↗</span>
    </a>`).join('\n');

/* ---------- page ---------- */
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Keep Pivoting — we build beautiful websites so any company can be found on AI chatbots</title>
<meta name="description" content="We build beautiful websites so that any company can be found on AI chatbots. ${sites.length} live sites to prove it. Builds from $2,500. Book a call.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://keeppivoting.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Keep Pivoting">
<meta property="og:title" content="Keep Pivoting — be the answer AI gives.">
<meta property="og:description" content="We build beautiful websites so that any company can be found on AI chatbots. ${sites.length} live sites to prove it.">
<meta property="og:url" content="https://keeppivoting.com/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23141414'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23DA471B' stroke-width='6'/%3E%3Ccircle cx='50' cy='50' r='6' fill='%23DA471B'/%3E%3Cline x1='50' y1='14' x2='50' y2='26' stroke='%23DA471B' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 1)}
</script>
<style>
${fonts}

:root{
  --h1: clamp(2.4rem, 5vw, 4rem);
  --h2: clamp(1.8rem, 3.2vw, 2.6rem);
  --h3: clamp(1.35rem, 2.2vw, 1.7rem);
  --h4: 1.2rem;  --h5: 1.05rem;  --h6: 0.95rem;
  --p: 1.05rem;  --small: 0.85rem;  --eyebrow: 0.72rem;
  --display: clamp(3rem, 8.6vw, 7.6rem);
  --lh-tight: 1.12;  --lh-body: 1.6;
  --bg:#EFEBE1; --ink:#141414; --accent:#DA471B; --teal:#6AA4AF;
  --surface:#E2DFD4; --muted:#616161; --line:rgba(20,20,20,.16);
  --gutter: clamp(20px, 15vw, 200px);
  --sec-pad: clamp(90px, 11vw, 160px);
  --disp: 'Oswald', 'Arial Narrow', sans-serif;
  --body: 'Inter', -apple-system, 'Helvetica Neue', sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
html.no-motion{scroll-behavior:auto}
body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:var(--p);line-height:var(--lh-body);
  -webkit-font-smoothing:antialiased;overflow-x:clip}
::selection{background:var(--accent);color:var(--bg)}
img,svg{max-width:100%}
a{color:inherit;text-decoration:none}
h1,h2,h3{line-height:var(--lh-tight)}

.eyebrow{font-size:var(--eyebrow);letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.eyebrow .sl{color:var(--teal);margin:0 .35em;font-weight:700}
.eyebrow .idx{color:var(--ink)}

/* ===== NAV ===== */
nav{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;
  padding:22px var(--gutter);
  transition:background .5s ease,backdrop-filter .5s ease,-webkit-backdrop-filter .5s ease,box-shadow .5s ease,padding .55s cubic-bezier(.33,1,.68,1)}
nav.scrolled{background:rgba(239,235,225,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 1px 0 var(--line);padding-top:15px;padding-bottom:15px}
.brand{font-family:var(--disp);font-weight:600;font-size:1.06rem;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
.brand .sl{color:var(--accent);margin:0 .3em}
.navlinks{display:flex;gap:clamp(18px,3vw,44px);align-items:center}
.navlinks a{font-size:var(--eyebrow);letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--ink);
  padding:4px 0;position:relative}
.navlinks a::after{content:'';position:absolute;left:0;bottom:0;width:100%;height:1.5px;background:var(--accent);
  transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
.navlinks a:hover::after{transform:scaleX(1)}
.navtoggle{display:none;flex-direction:column;justify-content:center;gap:5px;width:32px;height:32px;background:none;border:0;cursor:pointer;padding:0;position:relative;z-index:2}
.navtoggle span{display:block;width:22px;height:2px;background:var(--ink);transition:transform .3s ease,opacity .3s ease}

/* ===== HERO — the pivot, drawn ===== */
.hero{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;overflow:hidden}
.hero .topo-stage{position:absolute;inset:0;pointer-events:none}
.hero .topo-stage svg{position:absolute;inset:-4%;width:108%;height:108%}
#topo path.ct{fill:none;stroke:var(--ink);stroke-width:1}
#topo path.ct.a{stroke-opacity:.075}
#topo path.ct.b{stroke-opacity:.13}
#route .piste{fill:none;stroke:#9C968A;stroke-width:1.6;stroke-dasharray:3 7;stroke-linecap:round}
#route .off{fill:none;stroke:var(--accent);stroke-width:2.4;stroke-linecap:round}
#route .fork{fill:var(--ink)}
#route .dest{fill:var(--accent)}
#route .ring{fill:none;stroke:var(--accent);stroke-width:1.4;opacity:.55}
#route text{font-family:var(--body);font-size:12.5px;font-weight:600;letter-spacing:.24em;fill:var(--muted)}
#route text.or{fill:var(--accent)}
html.anim #route .ring{animation:ringpulse 2.6s ease-out infinite}
@keyframes ringpulse{0%{transform:scale(.5);opacity:.7}70%{transform:scale(1.5);opacity:0}100%{transform:scale(1.5);opacity:0}}
#route .ring{transform-box:fill-box;transform-origin:center}
.hero-fade{position:absolute;inset:0;background:linear-gradient(90deg,var(--bg) 0%,rgba(239,235,225,.72) 34%,rgba(239,235,225,0) 62%);pointer-events:none}
.hero-inner{position:relative;z-index:2;width:100%;padding:120px var(--gutter) 90px}
.hero-inner .eyebrow{margin-bottom:26px;color:var(--ink)}
.hero-inner .eyebrow .yr{color:var(--muted)}
h1{font-family:var(--disp);font-weight:600;font-size:var(--display);text-transform:uppercase;letter-spacing:.012em;line-height:1.02}
h1 .row{display:block}
h1 .row em{font-style:normal;color:var(--accent)}
.hero-sub{max-width:34em;margin-top:30px;font-size:var(--h5);color:#3a3a3a;line-height:var(--lh-body)}
.hero-ctas{display:flex;gap:30px;align-items:center;margin-top:42px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:12px;background:var(--accent);color:#FCFAF4;font-size:var(--eyebrow);
  font-weight:700;letter-spacing:.2em;text-transform:uppercase;padding:17px 30px;transition:background .25s ease,transform .25s ease}
.btn:hover{background:#B93A14;transform:translateY(-2px)}
.btn .ar{transition:transform .25s ease}
.btn:hover .ar{transform:translateX(4px)}
.ghostlink{font-size:var(--eyebrow);font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);
  display:inline-flex;gap:10px;align-items:center;border-bottom:1.5px solid var(--ink);padding-bottom:5px;transition:color .25s,border-color .25s}
.ghostlink:hover{color:var(--accent);border-color:var(--accent)}
.hero-coords{position:absolute;right:var(--gutter);bottom:30px;z-index:2;display:flex;gap:14px;align-items:center;color:var(--muted);
  font-size:var(--eyebrow);letter-spacing:.22em;text-transform:uppercase;font-weight:600}
.hero-coords .tick{width:44px;height:1px;background:var(--muted);display:inline-block}

/* ===== manifesto sections ===== */
.fund{padding:var(--sec-pad) var(--gutter);border-top:1px solid var(--line)}
.fund .eyebrow{margin-bottom:34px}
.fund h2{font-family:var(--disp);font-weight:500;font-size:var(--h1);text-transform:uppercase;max-width:16em}
.fund h2 em{font-style:normal;color:var(--accent)}
.fund-cols{display:grid;grid-template-columns:1.28fr .72fr;gap:clamp(34px,5vw,84px);margin-top:40px;align-items:start}
.fund-lead{min-width:0}
.fund-copy{margin-top:clamp(26px,3vw,40px)}
.fund-cols p{color:#333;max-width:36em}
.fund-cols p + p{margin-top:1.1em}
.factlist{border-top:1px solid var(--ink);font-size:var(--small);margin-top:9px}
.factlist div{display:flex;justify-content:space-between;gap:20px;padding:13px 0;border-bottom:1px solid var(--line)}
.factlist dt{color:var(--muted);letter-spacing:.14em;text-transform:uppercase;font-size:var(--eyebrow);font-weight:600;padding-top:2px}
.factlist dd{font-family:var(--disp);font-weight:500;font-size:var(--h6);text-transform:uppercase;letter-spacing:.04em;text-align:right}
.factlist dd.or{color:var(--accent)}

/* ===== method stations ===== */
.stations{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(18px,3vw,44px);margin-top:56px}
.stations .st{border-top:2px solid var(--ink);padding-top:18px}
.stations .st.or{border-top-color:var(--accent)}
.stations h3{font-family:var(--disp);font-weight:500;font-size:var(--h4);letter-spacing:.06em;text-transform:uppercase}
.stations h3 .idx{color:var(--accent);margin-right:10px}
.stations p{font-size:var(--small);color:var(--muted);margin-top:10px;max-width:30em}
.method-note{margin-top:52px;font-size:var(--h5);color:#333;max-width:36em}
.method-note strong{color:var(--accent);font-weight:600}

/* ===== work — featured slides ===== */
.port-head{padding:var(--sec-pad) var(--gutter) 60px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap}
.port-head h2{font-family:var(--disp);font-weight:500;font-size:var(--h1);text-transform:uppercase}
.port-head h2 em{font-style:normal;color:var(--accent)}
.port-head .eyebrow{margin-bottom:14px}
.slide{position:relative;border-top:1px solid var(--line);transition:background .4s ease}
.slide:nth-child(even){background:var(--surface)}
.slide-inner{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,4vw,64px);align-items:center;
  padding:clamp(56px,7vw,96px) var(--gutter)}
.slide-copy{min-width:0}
.slide-h{font-family:var(--disp);font-weight:500;font-size:var(--h2);text-transform:uppercase;letter-spacing:.015em;
  max-width:14em;margin-top:24px;transition:color .3s ease}
.slide:hover .slide-h{color:var(--accent)}
.visit{display:inline-flex;align-items:center;gap:10px;margin-top:34px;font-size:var(--eyebrow);font-weight:700;
  letter-spacing:.22em;text-transform:uppercase;color:var(--ink)}
.visit .ar{transition:transform .3s ease;color:var(--accent)}
.slide:hover .visit .ar{transform:translate(4px,-4px)}
.visit:focus-visible{outline:2px solid var(--accent);outline-offset:6px}
.slide-shot{display:block;border:1px solid var(--line);background:var(--surface);
  box-shadow:0 18px 44px rgba(20,20,20,.10);overflow:hidden;transition:transform .45s cubic-bezier(.2,.6,.2,1),box-shadow .45s ease}
.slide-shot img{display:block;width:100%;height:auto}
.slide:hover .slide-shot{transform:translateY(-6px);box-shadow:0 26px 60px rgba(20,20,20,.16)}

/* ===== marquee belt ===== */
.more-strip{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:18px 0;background:var(--bg)}
.more-track{display:flex;gap:0;white-space:nowrap;width:max-content}
html.anim .more-track{animation:belt 36s linear infinite}
.more-strip:hover .more-track{animation-play-state:paused}
@keyframes belt{to{transform:translateX(-50%)}}
.more-track span{font-family:var(--disp);font-weight:500;font-size:var(--h5);letter-spacing:.26em;text-transform:uppercase;
  color:var(--muted);padding:0 34px}
.more-track span b{color:var(--accent);font-weight:500}

/* ===== full index rows ===== */
.news{padding:calc(var(--sec-pad) * .6) var(--gutter) var(--sec-pad)}
.news .eyebrow{margin-bottom:44px}
.news-row{display:grid;grid-template-columns:64px 1fr 30px;gap:clamp(14px,2.5vw,40px);align-items:baseline;
  padding:17px 0;border-top:1px solid var(--line);transition:padding-left .3s ease}
.news-row:last-of-type{border-bottom:1px solid var(--line)}
.news-row .dt{font-size:var(--eyebrow);letter-spacing:.16em;color:var(--muted);font-weight:600;text-transform:uppercase}
.news-row .ttl{font-family:var(--disp);font-weight:500;font-size:var(--h5);text-transform:uppercase;letter-spacing:.03em;line-height:1.3;transition:color .25s}
.news-row .ar{color:var(--accent);opacity:0;transition:opacity .25s,transform .25s;font-size:var(--h5)}
.news-row:hover{padding-left:10px}
.news-row:hover .ttl{color:var(--accent)}
.news-row:hover .ar{opacity:1;transform:translate(3px,-3px)}

/* ===== pricing ===== */
.pricing{padding:var(--sec-pad) var(--gutter);border-top:1px solid var(--line);background:var(--surface)}
.pricing .eyebrow{margin-bottom:34px}
.pricing h2{font-family:var(--disp);font-weight:500;font-size:var(--h1);text-transform:uppercase}
.tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(18px,2.5vw,36px);margin-top:56px}
.tier{border-top:2px solid var(--ink);padding-top:18px}
.tier.or{border-top-color:var(--accent)}
.tier .kind{font-size:var(--eyebrow);letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.tier h3{font-family:var(--disp);font-weight:500;font-size:var(--h4);letter-spacing:.05em;text-transform:uppercase;margin-top:8px}
.tier .price{font-family:var(--disp);font-weight:600;font-size:var(--h2);margin-top:14px;letter-spacing:.02em}
.tier .price .un{font-size:var(--small);font-family:var(--body);font-weight:500;color:var(--muted);letter-spacing:.08em}
.tier.or .price{color:var(--accent)}
.tier p{font-size:var(--small);color:var(--muted);margin-top:12px;line-height:1.55}
.pricing-note{margin-top:52px;font-size:var(--small);color:var(--muted);max-width:44em}
.pricing-note strong{color:var(--ink)}

/* ===== free report ===== */
.report{padding:var(--sec-pad) var(--gutter);border-top:1px solid var(--line)}
.report .eyebrow{margin-bottom:34px}
.report h2{font-family:var(--disp);font-weight:500;font-size:var(--h1);text-transform:uppercase;max-width:16em}
.report h2 em{font-style:normal;color:var(--accent)}
.report-cols{display:grid;grid-template-columns:1.28fr .72fr;gap:clamp(34px,5vw,84px);margin-top:40px;align-items:start}
.report-cols p{color:#333;max-width:36em}
.report-cols p + p{margin-top:1.1em}
.report-steps{border-top:1px solid var(--ink);font-size:var(--small)}
.report-steps div{display:flex;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
.report-steps .n{font-family:var(--disp);color:var(--accent);font-weight:600}
.report .hero-ctas{margin-top:48px}

/* ===== contact close ===== */
.contact{position:relative;padding:calc(var(--sec-pad) * 1.15) var(--gutter);border-top:1px solid var(--line);overflow:hidden;background:var(--surface)}
.contact .eyebrow{margin-bottom:30px}
.contact h2{font-family:var(--disp);font-weight:600;font-size:var(--display);text-transform:uppercase;line-height:1.02}
.contact h2 .thin{color:var(--muted);font-weight:300}
.contact h2 em{font-style:normal;color:var(--accent)}
.contact p{margin-top:28px;max-width:32em;color:#333}
.contact .hero-ctas{margin-top:44px}
.contact .mail{color:var(--muted);font-size:var(--small);letter-spacing:.05em}
.contact .mail a{border-bottom:1px solid var(--line)}
.contact .mail a:hover{color:var(--accent);border-color:var(--accent)}

/* ===== footer ===== */
footer{padding:56px var(--gutter);display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;border-top:1px solid var(--line)}
footer .fl{display:flex;gap:30px;flex-wrap:wrap}
footer .fl a{font-size:var(--eyebrow);letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--muted);transition:color .25s}
footer .fl a:hover{color:var(--accent)}
footer .legal{width:100%;margin-top:26px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  color:var(--muted);font-size:var(--eyebrow);letter-spacing:.16em;text-transform:uppercase;font-weight:500}

/* ===== reveals ===== */
html.anim .rv{opacity:0;transform:translateY(26px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.6,.2,1)}
html.anim .rv.in{opacity:1;transform:none}
html.anim .rv.d1{transition-delay:.08s} html.anim .rv.d2{transition-delay:.16s} html.anim .rv.d3{transition-delay:.24s}

/* ===== signal field — right-gutter signature ===== */
.signal-field{position:fixed;top:50%;right:max(calc((var(--gutter) - 132px)/2),8px);
  transform:translateY(-50%);width:min(132px,calc(var(--gutter) - 16px));z-index:3;pointer-events:none}
.signal-field svg{display:block;width:100%;height:auto;animation:sf-float 18s ease-in-out infinite alternate}
.signal-field .sf-piste{fill:none;stroke:var(--muted);stroke-opacity:.5;stroke-width:1.3;stroke-dasharray:3 7;stroke-linecap:round}
.signal-field .sf-fork{fill:var(--ink)}
.signal-field .sf-track{fill:none;stroke:var(--accent);stroke-opacity:.12;stroke-width:1.7;stroke-linecap:round}
.signal-field .sf-off{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:0}
.signal-field .sf-dot{fill:var(--accent);transform-box:fill-box;transform-origin:center;animation:sf-beat 6s ease-in-out infinite alternate}
.signal-field .sf-dot.sf-arrived{animation:sf-arrive .4s cubic-bezier(.22,1,.36,1)}
.signal-field .sf-ring{fill:none;stroke:var(--accent);stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:sf-ring 7s ease-out infinite}
.signal-field .sf-r1{opacity:.28}
.signal-field .sf-r2{opacity:.16;animation-delay:-2.3s}
.signal-field .sf-r3{opacity:.09;animation-delay:-4.6s}
.signal-field .sf-ct{fill:none;stroke:var(--ink);stroke-width:1}
.signal-field .sf-ct.sf-c1{stroke-opacity:.11}
.signal-field .sf-ct.sf-c2{stroke-opacity:.085}
.signal-field .sf-ct.sf-c3{stroke:var(--teal);stroke-opacity:.3}
.signal-field .sf-mark{fill:var(--ink);fill-opacity:.15}
.signal-field .sf-label{font-family:var(--body);font-size:8.5px;font-weight:600;letter-spacing:.28em;fill:var(--muted)}
@keyframes sf-ring{0%{transform:scale(.4);opacity:.3}70%{opacity:.04}100%{transform:scale(1.6);opacity:0}}
@keyframes sf-beat{from{opacity:1}to{opacity:.6}}
@keyframes sf-arrive{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes sf-float{from{transform:translateY(-5px)}to{transform:translateY(5px)}}
@media (max-width:719.98px){.signal-field{display:none}}
@media (max-height:600px){.signal-field{width:min(104px,calc(var(--gutter) - 16px))}}

/* ===== hero contour breathe ===== */
@keyframes op-topo-breathe{from{translate:0px 0px;scale:1}to{translate:-9px 6px;scale:1.014}}
#topo{animation:op-topo-breathe 30s ease-in-out infinite alternate}

/* ===== responsive ===== */
@media (max-width:1000px){
  .fund-cols,.report-cols{grid-template-columns:1fr}
  .stations{grid-template-columns:1fr;gap:26px}
  .tiers{grid-template-columns:repeat(2,1fr)}
  .slide-inner{grid-template-columns:1fr;gap:30px}
  .slide-shot{order:-1}
}
@media (max-width:720px){
  .brand{position:relative;z-index:2}
  .navtoggle{display:flex}
  .navlinks{position:fixed;top:0;left:0;right:0;z-index:1;flex-direction:column;align-items:stretch;gap:0;
    background:rgba(239,235,225,.98);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    padding:74px var(--gutter) 26px;box-shadow:0 16px 34px rgba(20,20,20,.10);
    transform:translateY(-102%);transition:transform .42s cubic-bezier(.2,.7,.2,1)}
  nav.open .navlinks{transform:translateY(0)}
  .navlinks a{font-size:1.05rem;letter-spacing:.14em;padding:17px 2px;border-bottom:1px solid var(--line)}
  .navlinks a:first-child{border-top:1px solid var(--line)}
  .navlinks a::after{display:none}
  nav.open .navtoggle span:nth-child(1){transform:translateY(3.5px) rotate(45deg)}
  nav.open .navtoggle span:nth-child(2){transform:translateY(-3.5px) rotate(-45deg)}
  .hero-fade{background:linear-gradient(180deg,rgba(239,235,225,.45),rgba(239,235,225,.45))}
  .hero .topo-stage svg{inset:-8%;width:116%;height:116%}
  #route text{display:none}
  .hero-coords{display:none}
  .tiers{grid-template-columns:1fr}
  .news-row .ar{display:none}
  .news-row{grid-template-columns:44px 1fr}
}
@media (prefers-reduced-motion:reduce){
  html.anim .rv{opacity:1;transform:none;transition:none}
  html.anim .more-track{animation:none}
  html.anim #route .ring{animation:none}
  #topo{animation:none !important}
  .signal-field svg,.signal-field svg *{animation:none !important}
}
html.no-motion .rv{opacity:1 !important;transform:none !important;transition:none !important}
html.no-motion .more-track,html.no-motion #route .ring{animation:none !important}
html.no-motion #topo{animation:none !important}
html.no-motion .signal-field svg,html.no-motion .signal-field svg *{animation:none !important}
</style>
</head>
<body>

<nav id="nav">
  <a class="brand" href="#top" aria-label="Keep Pivoting — home">Keep<span class="sl">/</span>Pivoting</a>
  <button class="navtoggle" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
  <div class="navlinks">
    <a href="#shift">The Shift</a>
    <a href="#method">Method</a>
    <a href="#work">Work</a>
    <a href="#pricing">Pricing</a>
    <a href="#report">Free Report</a>
    <a href="${BOOK}" target="_blank" rel="noopener">Book a Call</a>
  </div>
</nav>

<!-- recurring right-gutter signature: the pivot, tracked -->
<div class="signal-field" aria-hidden="true">
  <svg viewBox="0 0 124 340">
    <path class="sf-ct sf-c1" d="M6 40 C 30 24, 66 30, 92 16 M4 74 C 40 58, 74 66, 112 50 M10 108 C 44 96, 80 102, 118 88"/>
    <text class="sf-label" transform="rotate(90 114 24)" x="114" y="24">SIGNALS / KEEP PIVOTING</text>
    <path class="sf-ct sf-c2" d="M2 140 C 36 128, 70 136, 116 122 M8 174 C 42 162, 76 170, 120 156"/>
    <path class="sf-ct sf-c3" d="M4 208 C 38 196, 72 204, 118 190"/>
    <path class="sf-piste" d="M96 8 L96 145 L96 300"/>
    <path class="sf-track" d="M96 145 C 84 190, 58 208, 46 238"/>
    <path class="sf-off" pathLength="100" d="M96 145 C 84 190, 58 208, 46 238"/>
    <circle class="sf-fork" cx="96" cy="145" r="3"/>
    <circle class="sf-ring sf-r3" cx="46" cy="238" r="25"/>
    <circle class="sf-ring sf-r2" cx="46" cy="238" r="17"/>
    <circle class="sf-ring sf-r1" cx="46" cy="238" r="9"/>
    <circle class="sf-dot" cx="46" cy="238" r="4"/>
    <circle class="sf-mark" cx="104" cy="96" r="1.8"/>
    <circle class="sf-mark" cx="12" cy="322" r="1.8"/>
  </svg>
</div>

<!-- ===== HERO ===== -->
<header class="hero" id="top">
  <div class="topo-stage">
    <svg id="topo" viewBox="0 0 1760 1120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>
    <svg id="route" viewBox="0 0 1760 1120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="piste" d="M1020 -20 C 1060 240, 1120 420, 1150 620 C 1172 770, 1180 940, 1178 1140"/>
      <path class="off" id="offpath" d="M1108 380 C 1030 480, 940 560, 900 680 C 868 776, 866 830, 878 894"/>
      <circle class="fork" cx="1108" cy="380" r="5"/>
      <circle class="ring" cx="878" cy="894" r="16"/>
      <circle class="dest" cx="878" cy="894" r="6.5"/>
      <text x="1180" y="240">THE OLD ROADMAP</text>
      <text class="or" x="912" y="902">WHERE BUYERS ASK NOW</text>
    </svg>
  </div>
  <div class="hero-fade"></div>

  <div class="hero-inner">
    <p class="eyebrow">Keep Pivoting <span class="sl">/</span> AEO · GEO <span class="sl">/</span> <span class="yr">AI-Search Agency</span></p>
    <h1>
      <span class="row">Be the</span>
      <span class="row">Answer</span>
      <span class="row"><em>AI</em> gives</span>
    </h1>
    <p class="hero-sub">We build beautiful websites so that any company can be found on AI chatbots. When your buyers ask ChatGPT, Claude, Gemini or Perplexity for what you do — we make sure the answer is you.</p>
    <div class="hero-ctas">
      <a class="btn" href="${BOOK}" target="_blank" rel="noopener">Book a call <span class="ar">→</span></a>
      <a class="ghostlink" href="#work">${sites.length} live sites — see the work <span style="color:var(--accent)">↓</span></a>
    </div>
  </div>
  <div class="hero-coords"><span class="tick"></span> Serving worldwide · What doesn't compound, decays</div>
</header>

<main>
<!-- ===== 01 THE SHIFT ===== -->
<section class="fund" id="shift">
  <p class="eyebrow rv">The Shift <span class="sl">/</span> 01</p>
  <div class="fund-cols">
    <div class="fund-lead">
      <h2 class="rv d1">Your buyers stopped googling. They ask <em>AI</em> now.</h2>
      <div class="fund-copy rv d2">
        <p>When someone asks an AI assistant for the best firms in your space, it doesn't guess — it reads. It names the companies whose sites it can fetch, quote and trust. If the model can't cleanly read you, you don't exist to it, no matter how the site looks to a human.</p>
        <p>Anyone can build a website in an afternoon now — you can, your competitor can, a model can do it while you sleep. Being the one AI actually recommends is the hard part. That's the whole job, and it's what we charge for.</p>
      </div>
    </div>
    <dl class="factlist rv d3">
      <div><dt>Websites built</dt><dd>110+</dd></div>
      <div><dt>Live right now</dt><dd class="or">${sites.length} sites</dd></div>
      <div><dt>Builds from</dt><dd>$2,500</dd></div>
      <div><dt>Retainers from</dt><dd>$1,000/mo</dd></div>
      <div><dt>Typical build</dt><dd>~2 weeks</dd></div>
      <div><dt>Serving</dt><dd>Worldwide</dd></div>
    </dl>
  </div>
</section>

<!-- ===== 02 METHOD ===== -->
<section class="fund" id="method">
  <p class="eyebrow rv">Method <span class="sl">/</span> 02</p>
  <h2 class="rv d1">Three things decide if AI names you.</h2>
  <div class="stations">
    <div class="st or rv d1">
      <h3><span class="idx">01</span>Machine-legible structure</h3>
      <p>Real static HTML, JSON-LD schema, an llms.txt, robots that say yes. If an AI fetch returns an empty shell, you're invisible — however good the design.</p>
    </div>
    <div class="st rv d2">
      <h3><span class="idx">02</span>Answer-first content</h3>
      <p>Written the way a model pulls answers: extractable, quotable, shaped around the exact questions your buyers ask their AI.</p>
    </div>
    <div class="st rv d3">
      <h3><span class="idx">03</span>Off-site authority</h3>
      <p>The citations, directories and mentions AI already trusts. Most of what gets a company named happens off its own site — we work both.</p>
    </div>
  </div>
  <p class="method-note rv">Beautiful to humans on the surface, machine-legible underneath. <strong>This very page is built that way</strong> — view the source.</p>
</section>

<!-- ===== 03 WORK ===== -->
<section id="work">
  <div class="port-head">
    <div>
      <p class="eyebrow rv">The Work <span class="sl">/</span> 03</p>
      <h2 class="rv d1"><em>${sites.length}</em> sites live. Open any of them.</h2>
    </div>
    <div class="rv d2" style="text-align:right">
      <p class="eyebrow" style="color:var(--accent);margin-bottom:14px">More every week <span class="sl">/</span>${YEAR.slice(2)}</p>
      <a class="ghostlink" href="#index">Full index <span style="color:var(--accent)">↓</span></a>
    </div>
  </div>
${featuredSlides}
  <div class="more-strip" aria-hidden="true"><div class="more-track" id="belt"></div></div>
  <div class="news" id="index">
    <p class="eyebrow rv">The full index <span class="sl">/</span> every live build</p>
${indexRows}
  </div>
</section>

<!-- ===== 04 PRICING ===== -->
<section class="pricing" id="pricing">
  <p class="eyebrow rv">Pricing <span class="sl">/</span> 04</p>
  <h2 class="rv d1">Public. Like everything else we do.</h2>
  <div class="tiers">
    <div class="tier rv d1">
      <p class="kind">One-time build</p>
      <h3>The Answer Site</h3>
      <p class="price">$2,500</p>
      <p>A site AI can fetch, read, quote and rank: real static HTML, JSON-LD schema, llms.txt, answer-first copy. Live in about two weeks.</p>
    </div>
    <div class="tier rv d2">
      <p class="kind">One-time build</p>
      <h3>The Authority Build</h3>
      <p class="price">$5,000<span class="un">+</span></p>
      <p>Built ground-up to make you the name AI recommends in your category — deeper entity and schema work, plus the launch pages AI cites.</p>
    </div>
    <div class="tier or rv d2">
      <p class="kind">Monthly retainer</p>
      <h3>Momentum</h3>
      <p class="price">$1,000<span class="un">/mo</span></p>
      <p>Monthly AEO content, LinkedIn + X in your voice, schema upkeep, and an AI-visibility scoreboard across ChatGPT, Claude, Gemini and Perplexity.</p>
    </div>
    <div class="tier rv d3">
      <p class="kind">Monthly retainer</p>
      <h3>Dominance</h3>
      <p class="price">$2,000<span class="un">/mo</span></p>
      <p>Everything in Momentum plus original research AI cites, digital PR and citation building, competitor tracking, and continuous CRO.</p>
    </div>
  </div>
  <p class="pricing-note rv"><strong>Founding offer:</strong> lifetime rate-lock on your plan. Annual prepay gets two months free. Custom scope is quoted on a call — <a class="ghostlink" style="text-transform:none;letter-spacing:.02em" href="${BOOK}" target="_blank" rel="noopener">book one</a>.</p>
</section>

<!-- ===== 05 FREE REPORT ===== -->
<section class="report" id="report">
  <p class="eyebrow rv">The Free Report <span class="sl">/</span> 05</p>
  <h2 class="rv d1">Proof first. <em>Then</em> an invoice.</h2>
  <div class="report-cols">
    <div class="rv d2">
      <p>We'll ask ChatGPT, Claude, Gemini and Perplexity about your market — then send you exactly where you show up, where you don't, and what it would take to be the answer. We spend real API tokens generating it. No charge, no obligation.</p>
      <p>And when we say don't trust us — we mean it. Ask your own AI which site wins you business. That's the test we build for.</p>
    </div>
    <div class="report-steps rv d3">
      <div><span class="n">01</span><span>Email us your website — ten seconds of your time.</span></div>
      <div><span class="n">02</span><span>We interrogate all four major AI assistants about your space.</span></div>
      <div><span class="n">03</span><span>You get the report back, usually the same day.</span></div>
    </div>
  </div>
  <div class="hero-ctas rv">
    <a class="btn" href="mailto:${MAIL}?subject=Free%20AI-visibility%20report&body=My%20website%3A%20">Get the free report <span class="ar">→</span></a>
    <a class="ghostlink" href="${BOOK}" target="_blank" rel="noopener">Or just book a call <span style="color:var(--accent)">→</span></a>
  </div>
</section>

<!-- ===== 06 CONTACT ===== -->
<section class="contact" id="contact">
  <p class="eyebrow rv">Contact <span class="sl">/</span> 06</p>
  <h2 class="rv d1">What doesn't<br><span class="thin">compound,</span> <em>decays.</em></h2>
  <p class="rv d2">Every great company has pivoted. You don't have to become someone else — you have to become what tomorrow demands. Thirty minutes, no deck, no pressure.</p>
  <div class="hero-ctas rv d3">
    <a class="btn" href="${BOOK}" target="_blank" rel="noopener">Book a call <span class="ar">→</span></a>
    <span class="mail"><a href="mailto:${MAIL}">${MAIL}</a></span>
  </div>
</section>
</main>

<footer>
  <a class="brand" href="#top">Keep<span class="sl">/</span>Pivoting</a>
  <div class="fl">
    <a href="#work">Work</a>
    <a href="#pricing">Pricing</a>
    <a href="#report">Free Report</a>
    <a href="${BOOK}" target="_blank" rel="noopener">Book a Call</a>
  </div>
  <div class="legal">
    <span>© ${YEAR} Keep Pivoting · Serving worldwide</span>
    <span>What doesn't compound, decays</span>
  </div>
</footer>

<script>
(function(){
'use strict';
var qs = new URLSearchParams(location.search);
var STATIC = qs.get('static') === '1';
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (STATIC) document.documentElement.classList.add('no-motion');

/* ---------- generative topographic field (deterministic, pre-paint) ---------- */
(function(){
  var svg = document.getElementById('topo'); if (!svg) return;
  var C = 20, GW = 88, GH = 56;
  var s = 20260727; // seed: the day the direction locked
  function rnd(){ s = Math.imul(s ^ (s >>> 15), s | 1); s ^= s + Math.imul(s ^ (s >>> 7), s | 61); return ((s ^ (s >>> 14)) >>> 0) / 4294967296; }
  var LX = 26, LY = 18, lat = [], y, x;
  for (y = 0; y <= LY; y++){ lat[y] = []; for (x = 0; x <= LX; x++) lat[y][x] = rnd(); }
  function sm(t){ return t * t * (3 - 2 * t); }
  function noise(nx, ny){
    nx = Math.max(0, Math.min(nx, LX - 0.001)); ny = Math.max(0, Math.min(ny, LY - 0.001));
    var xi = Math.floor(nx), yi = Math.floor(ny), xf = sm(nx - xi), yf = sm(ny - yi);
    var a = lat[yi][xi], b = lat[yi][xi+1], c = lat[yi+1][xi], d = lat[yi+1][xi+1];
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  }
  function fbm(u, v){ return 0.6*noise(u,v) + 0.28*noise(u*2.13+7.7, v*2.13+3.1) + 0.12*noise(u*4.31+13.2, v*4.31+9.6); }
  function bump(u, v, cx, cy, r){ var dx=(u-cx)/r, dy=(v-cy)/r; return Math.exp(-(dx*dx+dy*dy)); }
  var grid = [];
  for (y = 0; y <= GH; y++){ grid[y] = [];
    for (x = 0; x <= GW; x++){
      var u = x / GW, v = y / GH;
      grid[y][x] = 0.5*fbm(u*LX*0.52, v*LY*0.52) + 0.44*bump(u,v,0.70,0.36,0.23) + 0.34*bump(u,v,0.30,0.74,0.21);
    }
  }
  var levels = [], lv;
  for (lv = 0.34; lv <= 0.92; lv += 0.052) levels.push(lv);
  var dA = '', dB = '';
  levels.forEach(function(L, li){
    var d = '';
    for (var gy = 0; gy < GH; gy++) for (var gx = 0; gx < GW; gx++){
      var tl = grid[gy][gx], tr = grid[gy][gx+1], br = grid[gy+1][gx+1], bl = grid[gy+1][gx];
      var idx = (tl>L?8:0) | (tr>L?4:0) | (br>L?2:0) | (bl>L?1:0);
      if (idx === 0 || idx === 15) continue;
      var X = gx*C, Y = gy*C;
      function t(a,b){ return (L-a)/(b-a); }
      var top=[X+C*t(tl,tr),Y], right=[X+C,Y+C*t(tr,br)], bot=[X+C*t(bl,br),Y+C], left=[X,Y+C*t(tl,bl)];
      function seg(p,q){ d += 'M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+'L'+q[0].toFixed(1)+' '+q[1].toFixed(1); }
      switch(idx){
        case 1: case 14: seg(left,bot); break;
        case 2: case 13: seg(bot,right); break;
        case 3: case 12: seg(left,right); break;
        case 4: case 11: seg(top,right); break;
        case 6: case 9:  seg(top,bot); break;
        case 7: case 8:  seg(top,left); break;
        case 5:  seg(top,left); seg(bot,right); break;
        case 10: seg(top,right); seg(bot,left); break;
      }
    }
    if (li % 2) dA += d; else dB += d;
  });
  var NS = 'http://www.w3.org/2000/svg';
  function mk(d, cls){ var p = document.createElementNS(NS,'path'); p.setAttribute('d', d); p.setAttribute('class', cls); svg.appendChild(p); return p; }
  var pa = mk(dA, 'ct a'), pb = mk(dB, 'ct b');

  if (!STATIC && !reduced){
    var tx=0, ty=0, cx=0, cy=0, raf=null;
    function loop(){
      cx += (tx-cx)*0.06; cy += (ty-cy)*0.06;
      pa.setAttribute('transform','translate('+(cx*10)+','+(cy*8)+')');
      pb.setAttribute('transform','translate('+(cx*20)+','+(cy*15)+')');
      if (Math.abs(tx-cx)+Math.abs(ty-cy) > 0.001) raf = requestAnimationFrame(loop); else raf = null;
    }
    addEventListener('pointermove', function(e){
      if (!document.documentElement.classList.contains('anim')) return;
      tx = (e.clientX/innerWidth - .5); ty = (e.clientY/innerHeight - .5);
      if (!raf) raf = requestAnimationFrame(loop);
    }, {passive:true});
  }
})();

/* ---------- marquee belt ---------- */
(function(){
  var belt = document.getElementById('belt');
  if (belt){ var s2=''; for (var b=0;b<8;b++) s2+='<span>${sites.length} sites live <b>·</b> more every week <b>/</b></span>'; belt.innerHTML = s2+s2; }
})();

/* ---------- nav scroll state ---------- */
var nav = document.getElementById('nav');
function onScroll(){ nav.classList.toggle('scrolled', scrollY > 24); }
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* ---------- mobile menu ---------- */
var navToggle = document.querySelector('.navtoggle');
if (navToggle){
  navToggle.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.navlinks a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); });
  });
}

/* ---------- first-input gate: nothing is hidden until a real human interacts ---------- */
var armed = false;
function arm(){
  if (armed || STATIC) return; armed = true;
  document.documentElement.classList.add('anim');
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(function(n){
    var r = n.getBoundingClientRect();
    if (r.top < innerHeight * .9) { n.classList.add('in'); }
    io.observe(n);
  });
  if (!reduced){
    var off = document.getElementById('offpath');
    if (off){
      var len = off.getTotalLength();
      off.style.strokeDasharray = len;
      off.style.strokeDashoffset = len;
      off.getBoundingClientRect();
      off.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.5,0,.2,1) .1s';
      off.style.strokeDashoffset = '0';
    }
  }
}
['pointermove','pointerdown','wheel','touchstart','keydown','scroll'].forEach(function(ev){
  addEventListener(ev, arm, {passive:true, once:false});
});

/* ---------- signal field scroll-progress: the pivot line reaches the dot at page end ---------- */
(function(){
  if (STATIC || reduced) return;
  var offs = document.querySelectorAll('.signal-field .sf-off');
  if (!offs.length) return;
  var dots = document.querySelectorAll('.signal-field .sf-dot');
  var MIN = 6, fired = false, i;
  for (i = 0; i < dots.length; i++){
    dots[i].addEventListener('animationend', function(e){
      if (e.animationName === 'sf-arrive') this.classList.remove('sf-arrived');
    });
  }
  function apply(){
    var d = document.documentElement;
    var max = (d.scrollHeight || document.body.scrollHeight) - innerHeight;
    var y = window.pageYOffset || d.scrollTop || 0;
    var p = max > 0 ? y / max : 1;
    if (p < 0) p = 0; else if (p > 1) p = 1;
    var off = 100 - (MIN + (100 - MIN) * p);
    for (var k = 0; k < offs.length; k++) offs[k].style.strokeDashoffset = off;
    if (p >= 0.985 && !fired){ fired = true; for (var m = 0; m < dots.length; m++) dots[m].classList.add('sf-arrived'); }
    else if (p < 0.9 && fired){ fired = false; }
  }
  apply();
  addEventListener('scroll', apply, {passive:true});
  addEventListener('resize', apply, {passive:true});
})();
})();
</script>
</body>
</html>
`;

fs.writeFileSync('index.html', html);
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://keeppivoting.com/</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
`);
console.log('index.html + sitemap.xml written');
