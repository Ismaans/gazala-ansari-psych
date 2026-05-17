# Dr. Gazala A. Ansari, PhD — Practice Website

Static marketing site for the clinical psychology practice of Dr. Gazala A. Ansari, PhD,
serving Alexandria, VA and the greater DMV area.

## Pages

- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `fees.html` — Fees & Practical Info
- `faq.html` — Frequently Asked Questions
- `contact.html` — Contact (form + map)
- `privacy.html` — Privacy Policy

## Stack

Plain HTML, CSS, and a small `main.js` for the mobile menu, services dropdown, and
animated FAQ accordion. Fonts: Lora (headings) and DM Sans (body) via Google Fonts.

## Local preview

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>.

## Deployment

This is a static site — it can be hosted on any static host:

- **GitHub Pages** — push to `main` and enable Pages in the repo settings
- **Netlify** — drag-and-drop the folder or connect the repo
- **Vercel** — `vercel deploy`

## To-do

- Wire the contact form to a backend (Formspree, Netlify Forms, etc.)
- Configure a custom domain
- Add favicon and Open Graph image
