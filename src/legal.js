// Entry for the static legal pages (Impressum, Datenschutz).
// Deliberately minimal: no field/panel/scroll JS — just shared styles, fonts,
// and the year stamp. NOTE: legal pages must NOT use [data-reveal] (its CSS
// hides content until scroll.js adds .is-in, and scroll.js isn't loaded here).
import './styles/legal.css';

// self-hosted variable fonts (same as the home page)
import '@fontsource-variable/roboto-flex/wdth.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
