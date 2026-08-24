# FADEHOUSE Barbershop — Web App Demo

A polished, clickable demo of a booking web app for a barbershop, built as a sales tool to show prospective small-business clients what's possible. Styled after a modern mobile-app aesthetic: deep indigo/violet palette, rounded cards, pill buttons, gold ratings.

**No build step, no dependencies.** It's plain HTML/CSS/JS so it runs anywhere instantly — handy for showing a client on the spot from any laptop.

## Run it locally

From this folder, start any static file server. With Python (already on most Macs):

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

Or, since there's no build step, you can also just double-click `index.html` to open it directly in a browser.

## What's included

- **Home** (`index.html`) — hero, stats, popular services, featured barbers, testimonials, promo banner
- **Services** (`services.html`) — full price list with category filters and an FAQ section
- **Barbers** (`barbers.html`) — team profiles with ratings and specialties
- **Gallery** (`gallery.html`) — filterable photo gallery of the shop and work
- **Book** (`book.html`) — a full 4-step booking flow: choose service(s) → choose barber → choose date/time → enter details → confirmation screen, with a live running total

Everything is wired together — clicking "Book with [barber]" or a service's `+` button jumps straight into the booking flow with that selection pre-filled.

## Structure

```
index.html        Home page
services.html      Services & pricing
barbers.html        Barber profiles
gallery.html        Photo gallery
book.html            Booking flow
assets/css/style.css  Design system (colors, typography, components)
assets/js/app.js       Shared interactivity + booking wizard logic
assets/img/              Photos
```

## Customizing for a real client

This is seeded with placeholder content for a fictional shop ("FADEHOUSE", SoHo NYC). To adapt it for a real client:

1. Swap the brand name/logo in the header (search `FADEHOUSE` across the HTML files).
2. Replace `assets/img/*` with the client's real photos.
3. Update `SERVICES` and `BARBERS` in `assets/js/app.js` with real services, prices and staff.
4. Update the address, phone, email and hours in each page's footer.
5. Point the booking form at a real backend (e.g. Calendly, Square Appointments, or a custom API) — right now submissions are simulated client-side for demo purposes only, nothing is actually booked or stored.
