/* Tiny client-side blog engine. No build step: it reads posts/*.md straight from your repo. */
const BLOG = (() => {
  // Leave repo blank to auto-detect on github.io. If you use a custom domain, set it: "Gautam-Kumaran/your-repo-name"
  const CONFIG = { repo: "Gautam-Kumaran/Personal-Website", dir: "posts" };
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const FILE = /^(\d{4})-(\d{2})-(\d{2})-?(.*)\.md$/i;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function repo() {
    if (CONFIG.repo) return CONFIG.repo;
    const host = location.hostname, first = location.pathname.split("/")[1];
    if (host.endsWith(".github.io")) {
      const owner = host.split(".")[0];
      return owner + "/" + (first && !first.includes(".") ? first : owner + ".github.io");
    }
    throw new Error("Set CONFIG.repo in assets/blog.js");
  }

  async function listFiles() {
    try { const c = sessionStorage.getItem("blog-files"); if (c) return JSON.parse(c); } catch {}
    const r = await fetch(`https://api.github.com/repos/${repo()}/contents/${CONFIG.dir}`);
    if (!r.ok) throw new Error("Could not list posts (" + r.status + ")");
    const names = (await r.json())
      .filter(f => f.type === "file" && FILE.test(f.name) && !f.name.startsWith("_"))
      .map(f => f.name).sort().reverse();                       // newest first
    try { sessionStorage.setItem("blog-files", JSON.stringify(names)); } catch {}
    return names;
  }

  const slugOf = name => name.replace(/\.md$/i, "");
  function dateOf(name) { const m = name.match(FILE); return `${+m[3]} ${MONTHS[+m[2]-1]} ${m[1]}`; }
  function titleFromName(name) {
    const t = (name.match(FILE)[4] || "").replace(/[-_]+/g, " ").trim();
    return t ? t[0].toUpperCase() + t.slice(1) : dateOf(name);
  }

  async function fetchRaw(name) {
    const r = await fetch(`${CONFIG.dir}/${encodeURIComponent(name)}`);
    if (!r.ok) throw new Error("Post not found");
    return r.text();
  }

  // Splits optional front matter, finds title/summary/tags, estimates reading time.
  function parse(raw, name) {
    const meta = {};
    const fm = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    if (fm) {
      fm[1].split(/\r?\n/).forEach(l => { const i = l.indexOf(":"); if (i > 0) meta[l.slice(0,i).trim().toLowerCase()] = l.slice(i+1).trim().replace(/^["']|["']$/g, ""); });
      raw = raw.slice(fm[0].length);
    }
    let body = raw.trim(), title = meta.title;
    if (!title) {
      const h = body.match(/^#\s+(.+?)\s*(\r?\n|$)/);
      if (h) { title = h[1]; body = body.slice(h[0].length).trim(); } else title = titleFromName(name);
    }
    let summary = meta.summary;
    if (!summary) {
      const para = body.split(/\n\s*\n/).find(p => p.trim() && !/^(#|```|\||[-*>]|!\[|\$\$)/.test(p.trim())) || "";
      summary = para.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`$]/g, "").replace(/\s+/g, " ").trim();
      if (summary.length > 170) summary = summary.slice(0, 170).replace(/\s+\S*$/, "") + "…";
    }
    const tags = (meta.tags || "").replace(/^\[|\]$/g, "").split(",").map(t => t.trim()).filter(Boolean);
    return { name, slug: slugOf(name), title, summary, tags, body, draft: /^true$/i.test(meta.draft || ""),
             date: dateOf(name), reading: Math.max(1, Math.round((body.match(/\w+/g) || []).length / 200)) };
  }

  // marked would mangle LaTeX, so hide math from it and put it back for KaTeX.
  const MATH = /(```[\s\S]*?```|`[^`\n]+`)|(\$\$[\s\S]+?\$\$)|((?<![\\$\w])\$(?!\s)[^$\n]+?(?<!\s)\$(?![\w$]))/g;
  function toHtml(md) {
    const stash = [];
    const text = md.replace(MATH, (m, code) => code ? m : "@@MATH" + (stash.push(m) - 1) + "@@");
    let html = marked.parse(text, { gfm: true });
    html = html.replace(/@@MATH(\d+)@@/g, (_, i) => esc(stash[+i]).replace(/&quot;/g, '"'));
    return html.replace(/(<img[^>]*\ssrc=")(?!https?:|\/|data:)([^"]+)/g, `$1${CONFIG.dir}/$2`);
  }

  async function load(names) {            // fetch + parse several posts, skipping failures and drafts
    const out = await Promise.all(names.map(n => fetchRaw(n).then(r => parse(r, n)).catch(() => null)));
    return out.filter(p => p && !p.draft);
  }

  const card = p => `
    <a href="post.html?p=${encodeURIComponent(p.slug)}" class="glass-panel rounded-xl p-stack-lg block group hover:border-primary/40 transition-all duration-300">
      <p class="font-label-mono text-[11px] text-primary uppercase tracking-[0.15em] mb-2">${p.date} &middot; ${p.reading} min</p>
      <h2 class="font-headline-md text-headline-md text-text-primary group-hover:text-primary transition-colors mb-2">${esc(p.title)}</h2>
      <p class="font-body-sm text-on-surface-variant line-clamp-3">${esc(p.summary)}</p>
      ${p.tags.length ? `<div class="flex flex-wrap gap-2 mt-4">${p.tags.map(t => `<span class="px-2 py-1 border border-outline-variant rounded font-label-mono text-[10px] text-on-surface-variant">${esc(t)}</span>`).join("")}</div>` : ""}
    </a>`;

  return { esc, listFiles, fetchRaw, parse, toHtml, load, card, titleFromName, dateOf, slugOf };
})();
