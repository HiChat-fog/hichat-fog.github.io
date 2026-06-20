/**
 * main.rs — Typewriter Animation & Panel Toggle
 *
 * Key behaviors:
 *   1. The typewriter first types "ENGINEER" (the static role).
 *   2. Then it cycles through rotating prefixes: "COMPILER", "EXPLOIT", "SOFTWARE".
 *   3. Each cycle: type prefix char-by-char → pause → delete prefix char-by-char → long pause.
 *   4. Wider words that overflow the viewport are filtered out.
 *   5. Cursor stays at the end of the text, colored with the accent (#f27745).
 *   6. ABOUT / CONTACT buttons toggle panels; clicking the same button again closes it.
 */

(function () {
  "use strict";

  /* ---- DOM references ---- */
  const STATIC_ROLE = "DEVELOPER";
  const PREFIX_WORDS = ["OS_KERNEL", "CYBER_SEC", "LLM_ARCH", "FULLSTACK", "RUSTACEAN"];

  const rollEl = document.getElementById("roll");
  const roleTextEl = document.getElementById("role-text");
  const cursorEl = document.getElementById("cursor");

  /* ---- Helper: async delay ---- */
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ===================================================
     WIDTH FITTING — filter prefixes that overflow
     =================================================== */

  function prefixFitsViewport(prefix) {
    if (!rollEl || !cursorEl) return true;

    // Create a hidden measuring element that mirrors .role layout
    const measure = document.createElement("div");
    measure.className = "role";
    measure.style.position = "absolute";
    measure.style.visibility = "hidden";
    measure.style.whiteSpace = "nowrap";
    measure.style.maxWidth = "none";
    measure.style.overflow = "visible";

    const prefixClone = document.createElement("span");
    prefixClone.className = "prefix show";
    prefixClone.textContent = prefix + " ";
    prefixClone.style.maxWidth = "none";
    prefixClone.style.overflow = "visible";
    prefixClone.style.width = `${(prefix.length + 1) * 1.05}ch`;

    const spacerClone = document.createElement("span");
    spacerClone.className = "spacer";
    spacerClone.innerHTML = "&nbsp;";

    const roleClone = document.createElement("span");
    roleClone.textContent = STATIC_ROLE;

    measure.appendChild(prefixClone);
    measure.appendChild(spacerClone);
    measure.appendChild(roleClone);
    document.body.appendChild(measure);

    const measuredWidth = measure.offsetWidth;
    document.body.removeChild(measure);

    // On narrow screens use a smaller fraction of viewport width
    let fraction;
    if (window.innerWidth <= 480) {
      fraction = 0.6;
    } else if (window.innerWidth <= 768) {
      fraction = 0.68;
    } else {
      fraction = 0.8;
    }

    return measuredWidth <= window.innerWidth * fraction;
  }

  function getFittingPrefixes() {
    const fitting = PREFIX_WORDS.filter(prefixFitsViewport);
    if (fitting.length === 0) {
      // Fall back to the shortest word
      return [PREFIX_WORDS.reduce((a, b) =>
        a.length < b.length ? a : b
      )];
    }
    return fitting;
  }

  /* ===================================================
     CURSOR POSITIONING
     =================================================== */

  function positionCursorAtEnd() {
    if (!cursorEl || !roleTextEl) return;
    // Move cursor just past the role text
    const textWidth = roleTextEl.offsetWidth + 4;
    cursorEl.style.transform = `translateX(-${textWidth + 12}px)`;
    cursorEl.style.color = "#f27745";
  }

  function positionCursorDuringTyping() {
    if (!cursorEl || !roleTextEl || !rollEl) return;
    const roleEl = document.querySelector(".role");
    const rollWidth = rollEl.offsetWidth;
    const roleTextWidth = roleTextEl.offsetWidth * 0.1;
    const isMobile = window.innerWidth <= 768;
    const factor = isMobile ? 0.3 : 1;
    const offset = roleTextWidth * factor;
    const landing = rollWidth - offset;
    const roleTotalWidth = roleEl ? roleEl.offsetWidth : 0;
    const distance = roleTotalWidth - landing;
    cursorEl.style.transform = `translateX(-${distance}px)`;
    cursorEl.style.color = "#f27745";
  }

  function hideCursor() {
    if (!cursorEl || !roleTextEl) return;
    const textWidth = roleTextEl.offsetWidth;
    const limit = window.innerWidth * 0.35;
    const target = Math.min(textWidth + 24, limit);
    cursorEl.style.transform = `translateX(-${target}px)`;
    cursorEl.style.animation = "none";
    cursorEl.style.opacity = "0";
  }

  function showCursorAtStart() {
    if (!cursorEl) return;
    const textWidth = roleTextEl.offsetWidth + 4;
    cursorEl.style.transform = `translateX(-${textWidth + 12}px)`;
    cursorEl.style.color = "#f27745";
  }

  /* ===================================================
     TYPEWRITER: Type "ENGINEER" on load
     =================================================== */

  async function typeStaticRole() {
    if (!roleTextEl || !cursorEl) return;

    cursorEl.style.opacity = "1";
    cursorEl.style.color = "#fff";
    cursorEl.style.transform = "translateX(0)";
    roleTextEl.textContent = "";

    for (let i = 0; i < STATIC_ROLE.length; i++) {
      roleTextEl.textContent += STATIC_ROLE[i];
      await wait(80);
    }
  }

  /* ===================================================
     TYPEWRITER: Type a prefix word
     =================================================== */

  async function typePrefix(word) {
    if (!rollEl) return;
    rollEl.classList.add("show");
    rollEl.textContent = "";
    rollEl.style.width = "0ch";

    for (let i = 0; i < word.length; i++) {
      rollEl.textContent = word.slice(0, i + 1);
      rollEl.style.width = `${(rollEl.textContent.length + 1) * 1.05}ch`;
      await wait(50);
      positionCursorDuringTyping();
    }
    positionCursorDuringTyping();
  }

  /* ===================================================
     TYPEWRITER: Delete the prefix
     =================================================== */

  async function deletePrefix() {
    if (!rollEl || !cursorEl) return;

    cursorEl.style.animation = "blink 1s steps(2, start) infinite";
    cursorEl.style.opacity = "1";
    rollEl.classList.add("show");
    cursorEl.style.color = "#f27745";

    // Read the actual current text from the DOM
    let current = rollEl.textContent ?? "";
    while (current.length > 0) {
      current = current.slice(0, -1);
      rollEl.textContent = current;
      rollEl.style.width = `${(current.length + 1) * 1.05}ch`;
      await wait(30);
      positionCursorDuringTyping();
    }
  }

  /* ===================================================
     MAIN LOOP — cycle through prefixes
     =================================================== */

  async function startCycle() {
    if (!rollEl) return;

    // Infinite cycle
    for (;;) {
      const fittingWords = getFittingPrefixes();

      for (const word of fittingWords) {
        // Re-check that this word still fits (viewport may have resized)
        if (!getFittingPrefixes().includes(word)) continue;

        // 1. Type the prefix
        await typePrefix(word + " ");
        rollEl.classList.add("show");

        // 2. Pause with full text visible
        await wait(1800);

        // 3. Delete the prefix
        await deletePrefix();

        // 4. Hide prefix and show cursor off-screen
        rollEl.classList.remove("show");
        rollEl.textContent = "";
        rollEl.style.width = "0ch";
        hideCursor();

        // 5. Brief pause before next word
        await wait(3000);
      }
    }
  }

  /* ===================================================
     PANEL TOGGLE
     =================================================== */

  function setupPanels() {
    const panels = {
      about: document.getElementById("panel-about"),
      contact: document.getElementById("panel-contact"),
    };

    let activePanel = null;

    document.querySelectorAll(".actions button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelKey = btn.dataset.panel;
        if (!panelKey) return;

        // If clicking the already-active button, close it
        if (activePanel === panelKey) {
          const panel = panels[panelKey];
          if (panel) panel.hidden = true;
          activePanel = null;
          return;
        }

        // Hide all panels
        Object.values(panels).forEach((p) => {
          if (p) p.hidden = true;
        });

        // Show the target panel
        const target = panels[panelKey];
        if (target) {
          target.hidden = false;
          activePanel = panelKey;
        }
      });
    });
  }

  /* ===================================================
     RESIZE HANDLER
     =================================================== */

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (rollEl && rollEl.classList.contains("show")) {
        positionCursorDuringTyping();
      } else {
        hideCursor();
      }
    }, 150);
  });

  /* ===================================================
     INIT
     =================================================== */

  async function init() {
    // Setup panel toggles immediately
    setupPanels();

    // Wait for DOM + fonts to be ready
    await new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve(), { once: true });
      }
    });

    // 1. Type "ENGINEER" for the first time
    await typeStaticRole();

    // 2. Position cursor at end with accent color
    showCursorAtStart();

    // 3. Brief pause
    await wait(200);

    // 4. Start the infinite prefix cycle
    startCycle();
  }

  init();
})();
