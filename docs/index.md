---
title: CivicFix Docs
---

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    background: linear-gradient(135deg, #0ea5e9 0%, #7c3aed 50%, #f97316 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    animation: floatBg 12s ease-in-out infinite;
  }

  @keyframes floatBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .hero h1 { font-size: 2.25rem; margin: 0 0 0.5rem; letter-spacing: -0.5px; }
  .hero p { margin: 0 0 1.4rem; opacity: 0.95 }

  .btn-row { display:flex; gap:12px; flex-wrap:wrap; justify-content:center }
  .btn {
    display:inline-block; padding:10px 16px; border-radius:8px; font-weight:600; color:#0f172a;
    background: white; text-decoration:none; box-shadow: 0 6px 18px rgba(2,6,23,0.12);
    transform: translateY(0); transition: transform .18s ease, box-shadow .18s ease;
  }
  .btn:hover { transform: translateY(-6px); box-shadow: 0 18px 30px rgba(2,6,23,0.18); }

  .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-top:1.6rem }
  .card { background: #fff; color:#0f172a; padding:14px; border-radius:10px; box-shadow:0 6px 18px rgba(2,6,23,0.06) }

  .pulse { display:inline-block; width:10px; height:10px; border-radius:999px; background:#10B981; margin-right:8px; vertical-align:middle; animation:pulse 1.6s infinite }
  @keyframes pulse { 0%{ transform:scale(1); opacity:1 } 50%{ transform:scale(1.5); opacity:.6 } 100%{ transform:scale(1); opacity:1 } }

  pre { background:#0f172a; color:#e6eef8; padding:12px; border-radius:8px; overflow:auto }

  .toc a { text-decoration:none; color:#0369a1 }

  /* small responsive tweaks */
  @media (max-width:640px){ .hero h1{font-size:1.6rem} }
</style>

<div class="hero">
  <h1>CivicFix — Docs & Technical Reference</h1>
  <p>Interactive documentation hub for the CivicFix AI civic-issue reporting project.</p>

  <div class="btn-row">
    <a class="btn" href="TECH_SPEC.md">View Technical Specification</a>
    <a class="btn" href="TECHNICAL_PLAN.md">Open Technical Plan</a>
    <a class="btn" href="https://github.com/Diwakartalwar/CivicFix-AI-Public-Issue-Reporting-System-Powered-by-IBM-Bob-">Repository Root</a>
  </div>

  <div style="margin-top:1.2rem; opacity:.95">Quick links • Animated hero • Mobile friendly</div>
</div>

## What's here

Below are quick entry points into the repo documentation and design artifacts.

<div class="features">
  <div class="card"><span class="pulse"></span>Tech spec and architecture overview</div>
  <div class="card"><span class="pulse" style="background:#f59e0b"></span>Implementation plan & timelines</div>
  <div class="card"><span class="pulse" style="background:#7c3aed"></span>API reference and prompts</div>
  <div class="card"><span class="pulse" style="background:#3b82f6"></span>Deployment & CI suggestions</div>
</div>

## Table of Contents

- [Technical Specification](TECH_SPEC.md)
- [Technical Plan](TECHNICAL_PLAN.md)
- [Deployment Guide](deployment.md)
 - [BOB Build Story](BOB_BUILD_STORY.md)
 - [Setup Guide](SETUP_GUIDE.md)

## Quick API snippets

Example classify endpoint:

```http
POST /api/classify
Content-Type: application/json

{
  "issueDescription": "Garbage piling up near the park",
  "location": "Central Park, Ward 12"
}
```

## Styling & Animation notes

- The hero uses a CSS animated gradient and subtle motion on buttons.
- Small `pulse` indicators show live/active states.
- This file is pure Markdown + inline CSS for GitHub Pages in the `docs/` folder.

---

If you want a richer docs site (search, versioning, mkdocs theme, or a GIF header), tell me which style and I'll scaffold it (MkDocs or GitHub Pages build).
