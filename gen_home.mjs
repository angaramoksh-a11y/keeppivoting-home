// gen_home.mjs — builds the minimal Keep Pivoting homepage from ../portfolio-list.md
// Run from keeppivoting-site/:  node gen_home.mjs   → writes index.html + sitemap.xml
// Re-run whenever the fleet grows; commit + push to deploy.
import fs from 'node:fs';

const TODAY = new Date().toISOString().slice(0, 10);
const md = fs.readFileSync('../portfolio-list.md', 'utf8');
const live = md.split('## LIVE (deployed)')[1].split(/^## (?!LIVE)/m)[0];
const sites = live.split(/^### /m).slice(1).map(b => {
  const h = b.split('\n')[0];
  const m = h.match(/^#(\d+) — ([^—]+?)(?: —|$)/);
  const u = b.match(/\*\*AFTER:\*\* (https?:\/\/\S+)/);
  return m && u ? { n: +m[1], name: m[2].trim(), url: u[1].trim() } : null;
}).filter(Boolean);

if (sites.length < 40) throw new Error(`parse suspiciously low: ${sites.length} sites`);
console.log(`${sites.length} live sites parsed`);

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const itemList = {
  '@type': 'ItemList',
  '@id': 'https://keeppivoting.com/#work',
  name: 'Websites built by Keep Pivoting',
  numberOfItems: sites.length,
  itemListElement: sites.map((s, i) => ({
    '@type': 'ListItem', position: i + 1, name: s.name, url: s.url,
  })),
};

const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://keeppivoting.com/#org',
      name: 'Keep Pivoting',
      url: 'https://keeppivoting.com/',
      description: 'Keep Pivoting builds beautiful websites so that any company can be found on AI chatbots like ChatGPT, Claude, Gemini and Perplexity (AEO / GEO).',
      slogan: 'We build beautiful websites so that any company can be found on AI chatbots.',
      email: 'moksh@temporaryperspective.com',
      knowsAbout: ['Answer Engine Optimization', 'Generative Engine Optimization', 'AEO', 'GEO', 'AI search visibility', 'web design'],
      areaServed: 'Worldwide',
    },
    { '@type': 'WebSite', '@id': 'https://keeppivoting.com/#site', url: 'https://keeppivoting.com/', name: 'Keep Pivoting', publisher: { '@id': 'https://keeppivoting.com/#org' }, inLanguage: 'en' },
    itemList,
  ],
};

const links = sites.map(s =>
  `      <li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`
).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keep Pivoting — websites any company can be found with on AI chatbots</title>
<meta name="description" content="We build beautiful websites so that any company can be found on AI chatbots. ${sites.length} live sites below — open any of them. Book a call.">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://keeppivoting.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Keep Pivoting">
<meta property="og:title" content="Keep Pivoting">
<meta property="og:description" content="We build beautiful websites so that any company can be found on AI chatbots.">
<meta property="og:url" content="https://keeppivoting.com/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230B0B0C'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23F0A83C' stroke-width='6'/%3E%3Ccircle cx='50' cy='50' r='6' fill='%23F0A83C'/%3E%3Cline x1='50' y1='14' x2='50' y2='26' stroke='%23F0A83C' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 1)}
</script>
<style>
  @font-face{font-family:'Space Grotesk';src:url('fonts/SpaceGrotesk-var.woff2') format('woff2');font-weight:300 700;font-display:swap;}
  :root{--ink:#0B0B0C;--paper:#FFFFFF;--muted:#66666B;--line:#E4E4E7;}
  *{box-sizing:border-box;margin:0;}
  body{background:var(--paper);color:var(--ink);font-family:'Space Grotesk',system-ui,sans-serif;font-size:17px;line-height:1.6;}
  .wrap{max-width:640px;margin:0 auto;padding:12vh 24px 96px;}
  h1{font-size:clamp(28px,6vw,40px);font-weight:700;letter-spacing:-0.02em;line-height:1.1;}
  .tag{margin-top:24px;font-size:clamp(19px,3.2vw,23px);font-weight:400;max-width:34ch;}
  .contact{margin-top:40px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;}
  .btn{display:inline-block;background:var(--ink);color:var(--paper);text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:500;}
  .btn:hover{opacity:.85;}
  .mail{color:var(--ink);text-decoration:underline;text-underline-offset:3px;}
  .work{margin-top:96px;}
  .work h2{font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);}
  .work ol{list-style:none;padding:0;margin-top:20px;counter-reset:site;}
  .work li{counter-increment:site;border-top:1px solid var(--line);}
  .work li:last-child{border-bottom:1px solid var(--line);}
  .work a{display:flex;gap:16px;align-items:baseline;padding:13px 4px;color:var(--ink);text-decoration:none;}
  .work a::before{content:counter(site,decimal-leading-zero);font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;}
  .work a:hover{background:#FAFAFA;text-decoration:underline;text-underline-offset:3px;}
  footer{margin-top:96px;color:var(--muted);font-size:14px;}
</style>
</head>
<body>
<main class="wrap">
  <h1>Keep&nbsp;Pivoting</h1>
  <p class="tag">We build beautiful websites so that any company can be found on AI chatbots.</p>
  <div class="contact">
    <a class="btn" href="https://cal.com/keep-pivoting/30min">Book a call</a>
    <a class="mail" href="mailto:moksh@temporaryperspective.com">moksh@temporaryperspective.com</a>
  </div>
  <section class="work" id="work">
    <h2>${sites.length} websites we&rsquo;ve built — open any of them</h2>
    <ol>
${links}
    </ol>
  </section>
  <footer>
    <p>What doesn&rsquo;t compound, decays. &copy; ${TODAY.slice(0, 4)} Keep Pivoting</p>
  </footer>
</main>
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
