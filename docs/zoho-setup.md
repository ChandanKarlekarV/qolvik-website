# Zoho setup for qolvik.com

Three things to switch on (Zoho Mail, Web3Forms, Zoho Bookings), about 30 minutes in total. After each step, either paste the value into `scripts/config.js` yourself or send it to Claude — none of these values are secret.

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

## Step 2 — Website enquiries by email (Web3Forms)

Every message from the contact form is emailed to you. No server, no password.

1. Go to **web3forms.com** → *Create your Access Key*.
2. Enter the inbox that should receive enquiries (hello@qolvik.com once Step 1 works, or your Gmail for now) → *Create Access Key*.
3. Open that inbox and find the email from Web3Forms (check Spam). It contains the **Access Key**, like `a1b2c3d4-…`.
4. Paste it into `scripts/config.js` → `FORM.web3formsKey: "a1b2c3d4-…"` (or send it to Claude).
   - This key is **meant to be public**: it can only send mail *to you*, never to anyone else.
5. Rebuild (`node build.js`), deploy, then send a test message from the live site.
6. Optional: log in at **app.web3forms.com** with the same email to see every submission, change the receiving email, or add *Allowed domains → qolvik.com* (paid plan) so the key only works from your site.

Free plan: 250 messages a month. Emails come from `notify@web3forms.com` — mark the first one *Not spam*, and use **Reply** to answer the visitor directly.

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
