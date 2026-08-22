'use strict';

/**
 * Display mode switch.
 *
 * Dark (black + yellow) is the site default; light (white + blue) is applied
 * by setting data-theme="light" on <html>, which swaps the custom properties
 * defined in assets/css/style.css. The choice is remembered in localStorage.
 *
 * This file is loaded synchronously from <head> so the stored theme is applied
 * before the first paint; the toggle button itself is injected once the body
 * exists.
 */

(() => {

  const STORAGE_KEY = "theme";

  // Flip to true to fall back to the visitor's OS setting when they have not
  // picked a theme on this site yet.
  const FOLLOW_SYSTEM_PREFERENCE = false;

  const root = document.documentElement;

  // localStorage throws in some privacy modes, so every access is guarded.
  const readStored = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return null;
    }
  };

  const writeStored = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      /* preference just won't persist */
    }
  };

  const defaultTheme = () => {
    if (FOLLOW_SYSTEM_PREFERENCE &&
        window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  };

  const stored = readStored();
  let theme = stored === "light" || stored === "dark" ? stored : defaultTheme();

  let toggleBtn = null;

  const render = () => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }

    if (toggleBtn) {
      const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
      toggleBtn.setAttribute("aria-label", label);
      toggleBtn.setAttribute("title", label);
      toggleBtn.setAttribute("aria-pressed", String(theme === "light"));
    }
  };

  const setTheme = (next) => {
    theme = next;
    writeStored(next);
    render();
  };

  // Applied immediately, before the body renders, to avoid a flash of the
  // wrong theme.
  render();

  const buildToggle = () => {
    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "theme-toggle";
    toggleBtn.setAttribute("data-theme-toggle", "");
    toggleBtn.innerHTML =
      '<ion-icon name="sunny-outline" class="theme-toggle-icon theme-toggle-icon--to-light"></ion-icon>' +
      '<ion-icon name="moon-outline" class="theme-toggle-icon theme-toggle-icon--to-dark"></ion-icon>';

    toggleBtn.addEventListener("click", () => {
      setTheme(theme === "light" ? "dark" : "light");
    });

    document.body.appendChild(toggleBtn);
    render();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildToggle);
  } else {
    buildToggle();
  }

  // Keep other open tabs of the site in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue !== "light" && event.newValue !== "dark") return;
    theme = event.newValue;
    render();
  });

})();
