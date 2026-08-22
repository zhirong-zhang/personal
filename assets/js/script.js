'use strict';

// Element toggle function
const elementToggleFunc = (elem) => elem.classList.toggle("active");

// Sidebar toggle
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));

// Custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", () => elementToggleFunc(select));

// Filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = (selectedValue) => {
  filterItems.forEach((item) => {
    if (selectedValue === "all" || selectedValue === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// Add event to all select items
selectItems.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
});

// Add event to all filter buttons for large screen
let lastClickedBtn = filterBtn[0];

filterBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

// Contact form validation
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

// Page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const portfolioButton = document.querySelector("[data-portfolio-btn]");

/**
 * The open tab is remembered for the lifetime of the browser tab, so the
 * "Back to Portfolio" link on a project page returns to whichever tab the
 * visitor actually came from. Project pages are linked from both About
 * (Highlight Projects) and Portfolio, so a fixed destination would be wrong
 * for one of them.
 */
const ACTIVE_PAGE_KEY = "activePage";

// Which page a navbar button opens. The attribute is what the inline <head>
// script keys its stylesheet off, so both must read it the same way; the label
// is only a fallback if the attribute is ever missing.
const linkTarget = (link) =>
  link.dataset.navTarget || link.textContent.trim().toLowerCase();

// sessionStorage throws in some privacy modes. Failing just means the visitor
// lands on About, which is the markup default.
const rememberPage = (pageName) => {
  try {
    sessionStorage.setItem(ACTIVE_PAGE_KEY, pageName);
  } catch (err) {
    /* choice won't persist */
  }
};

// Swaps the visible article without touching scroll position.
const showPage = (pageName) => {
  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  navigationLinks.forEach((link) => {
    link.classList.toggle("active", linkTarget(link) === pageName);
  });
};

/**
 * The inline script in <head> pre-selects the remembered tab with a temporary
 * stylesheet so the correct article is painted first. It stays in place while
 * the restored tab is on screen (it also suppresses the fade, which would
 * otherwise replay and flicker), and is dropped the moment the visitor
 * navigates for themselves.
 */
const clearRestoreStyle = () => {
  const style = document.getElementById("page-restore");
  if (style) style.remove();
};

const activatePage = (pageName, scrollTarget = null) => {
  clearRestoreStyle();
  showPage(pageName);
  rememberPage(pageName);

  if (scrollTarget) {
    const target = document.querySelector(scrollTarget);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

navigationLinks.forEach((navLink) => {
  navLink.addEventListener("click", function () {
    const pageName = linkTarget(this);
    activatePage(pageName);
  });
});

if (portfolioButton) {
  portfolioButton.addEventListener("click", () => {
    activatePage("portfolio", "#portfolio-section");
  });
}

// Restore the remembered tab on load, before the visitor sees anything.
(() => {
  let remembered = null;

  try {
    remembered = sessionStorage.getItem(ACTIVE_PAGE_KEY);
  } catch (err) {
    return;
  }

  if (!remembered) return;

  // Only restore a page that exists AND has a nav link, so a stale value can
  // never strand the visitor on an article they cannot navigate away from.
  const exists = [...pages].some((page) => page.dataset.page === remembered);
  const reachable = [...navigationLinks].some(
    (link) => linkTarget(link) === remembered
  );

  if (exists && reachable) showPage(remembered);
})();
