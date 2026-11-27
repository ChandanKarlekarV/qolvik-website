# Zoho setup for qolvik.com

Three things to switch on in Zoho, about 45 minutes in total. After each step, either paste the value into `scripts/config.js` yourself or send it to Claude — none of these values are secret.

Use the **India** Zoho sites (`zoho.in`), so your data stays in Zoho's India data centre.

---

## Step 1 — Real email: hello@qolvik.com (Zoho Mail)

The website shows `hello@qolvik.com`. Until this inbox exists, mail sent to it is lost.

1. Go to **zoho.in/mail** → *Sign up* → choose a business email plan → enter the domain **qolvik.com**.
2. Zoho asks you to **verify the domain** with a TXT record:
   - Open **Cloudflare → qolvik.com → DNS → Records → Add record**.
   - Type `TXT`, Name `@`, Content: the `zoho-verification=…` value Zoho shows. Save, then click *Verify* in Zoho.
3. Create your user (for example `chandan@qolvik.com`), then add **hello@qolvik.com** as an *email alias* of that user (or as a group, if several people should get the mail).
4. Zoho then shows the **mail records**. Add each one in Cloudflare exactly as shown (copy the values from Zoho):
   - 3 × `MX` records (`mx.zoho.in`, `mx2.zoho.in`, `mx3.zoho.in` with priorities 10, 20, 50)
   - 1 × `TXT` SPF record (`v=spf1 include:zoho.in ~all`)
   - 1 × `TXT` DKIM record (Zoho: *Mail Admin → Domains → Email configuration → DKIM*)
5. Send a test email from your personal Gmail to hello@qolvik.com and check that it arrives.

> Cloudflare: MX and TXT records have no orange cloud — leave them as they are.

---

## Step 2 — Website enquiries go into Zoho CRM

Every message from the contact form becomes a **Lead** in Zoho CRM, and Zoho emails you about it.

1. Go to **crm.zoho.in** and sign in with the same Zoho account.
2. Open **Setup (gear icon) → Developer Hub (or Developer Space) → Webforms → Leads → Create Form**.
3. Add these fields to the form: **Last Name, Email, Phone, Company, Description, Lead Source**.
   - If *Lead Source* has no "Website" option: *Setup → Modules and Fields → Leads → Lead Source* → add **Website**.
4. Click **Next** and set:
   - Landing page URL: `https://qolvik.com/`
   - Assign owner: you
   - **Notify owner on new lead: ON**
   - Acknowledge the visitor: optional (Zoho sends them an email)
   - **CAPTCHA: OFF** — the website has its own spam protection, and Zoho's captcha would block it.
5. **Save** → choose **Embed options → Source code**.
6. In that code, find these two lines and copy only the `value` parts:
   ```
   name='xnQsjsdp' value='COPY-THIS'
   name='xmIwtLD'  value='COPY-THIS-TOO'
   ```
7. Paste them into `scripts/config.js` → `FORM.zoho.xnQsjsdp` and `FORM.zoho.xmIwtLD` (or send both to Claude).
8. After the next deploy, send a test message from the website and check **CRM → Leads**.

---

## Step 3 — "Book a demo" opens your calendar (Zoho Bookings)

1. Go to **bookings.zoho.in** → create a workspace called **Qolvik**.
2. Create a service: **ERP demo — 20 minutes**, online meeting (Zoho Meeting or Google Meet).
3. Set your available days and times, and a 15-minute gap between bookings.
4. **Publish** and copy the **booking page link**.
5. Paste it into `scripts/config.js` → `BOOKING_URL` (or send it to Claude). Every "Book a demo" button then opens it.

---

## Also worth doing (not Zoho)

| What | Why | Where |
|---|---|---|
| **Google Search Console** | Get qolvik.com into Google and submit the sitemap | search.google.com/search-console → *Domain* property → verify with a TXT record in Cloudflare → submit `https://qolvik.com/sitemap.xml` |
| **Google Business Profile** | Appear on Maps and "school ERP near me" in Bengaluru | business.google.com → add Qolvik with the Moodalapalya address. If it's a home address, choose *service-area business* and hide the street. |
| **Cloudflare Web Analytics** | See which pages bring enquiries (no cookies) | Cloudflare → Analytics & Logs → Web Analytics → add qolvik.com → copy the token into `ANALYTICS.cloudflareToken` |
| **PIN code** | Exact location for Google | `CONTACT.postalCode` in `scripts/config.js` |
| **GST and company number** | Trust footer for schools | When you have them, they go in the footer (ask Claude) |
