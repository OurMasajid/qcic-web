/* =========================================================
   QCIC Masjid — home page interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    var closeMenu = function () {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    /* clicking a link, or the empty overlay background itself, closes the menu */
    navLinks.addEventListener("click", function (e) {
      if (e.target === navLinks || e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Prayer time: highlight the next prayer ---- */
  var prayers = [
    { key: "fajr",    label: "Fajr",    mins: 5 * 60 + 45 },
    { key: "dhuhr",   label: "Dhuhr",   mins: 13 * 60 + 50 },
    { key: "asr",     label: "Asr",     mins: 18 * 60 + 30 },
    { key: "maghrib", label: "Maghrib", mins: 20 * 60 + 35 },
    { key: "isha",    label: "Isha",    mins: 21 * 60 + 45 }
  ];
  var now = new Date();
  var cur = now.getHours() * 60 + now.getMinutes();
  var next = prayers.find(function (p) { return p.mins > cur; }) || prayers[0];

  document.querySelectorAll("[data-prayer]").forEach(function (el) {
    el.classList.toggle("is-next", el.getAttribute("data-prayer") === next.key);
  });
  var nameEl = document.querySelector("[data-next-name]");
  var timeEl = document.querySelector("[data-next-time]");
  if (nameEl && timeEl) {
    var h = Math.floor(next.mins / 60), m = next.mins % 60;
    var ampm = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 || 12;
    nameEl.textContent = next.label;
    timeEl.textContent = h12 + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
  }

  /* ---- Forms that hand off to the visitor's email client ---- */
  document.querySelectorAll(".site-form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-mailto");
      var prefix = form.getAttribute("data-subject-prefix") || "Website Message";
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var subject = form.querySelector('[name="subject"]');
      var message = form.querySelector('[name="message"]');
      var subjectText = prefix + (subject && subject.value ? ": " + subject.value : "");
      var bodyLines = [];
      if (name) bodyLines.push("Name: " + name.value);
      if (email) bodyLines.push("Email: " + email.value);
      bodyLines.push("");
      if (message) bodyLines.push(message.value);
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subjectText) + "&body=" + encodeURIComponent(bodyLines.join("\n"));
    });
  });

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Community snapshots lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var snapStrip = document.getElementById("snapStrip");
  if (lightbox && lightboxImg && snapStrip) {
    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
    };
    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightboxImg.src = "";
    };
    snapStrip.addEventListener("click", function (e) {
      var card = e.target.closest(".snap-card");
      if (!card) return;
      var img = card.querySelector("img");
      if (img) openLightbox(img.src, img.alt);
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
