// tilt container functions
(function () {
  const UA = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(UA) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(UA);
  const isMobile = isIOS || isAndroid || matchMedia("(pointer:coarse)").matches;

  const getVH = () =>
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  /* ----------------------------
     ✅ Marquee Initialization
     (Still active — harmless)
  -----------------------------*/
  function initMarquees() {
    document.querySelectorAll(".scroll-tilt").forEach((el) => {
      if (el.__tiltMarqueeInit) return;
      el.__tiltMarqueeInit = true;

      const track = document.createElement("div");
      track.className = "scroll-tilt-track";

      const kids = Array.from(el.children);
      kids.forEach((n) => track.appendChild(n));
      kids.forEach((n) => track.appendChild(n.cloneNode(true)));
      el.appendChild(track);

      const compute = () => {
        const dist = track.scrollWidth / 2;
        const speed =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--tilt-marquee-speed"
            )
          ) || 60;
        const dur = Math.max(2, dist / speed);
        track.style.setProperty("--marquee-dist", dist + "px");
        track.style.setProperty("--marquee-dur", dur + "s");
      };

      if (track.querySelector("img")) {
        requestAnimationFrame(() => compute());
        window.addEventListener("load", compute, { once: true });
      } else {
        requestAnimationFrame(() => compute());
      }

      el.addEventListener(
        "mouseenter",
        () => (track.style.animationPlayState = "paused")
      );
      el.addEventListener(
        "mouseleave",
        () => (track.style.animationPlayState = "running")
      );
    });
  }

  /* ----------------------------
     ❌ Tilt Initialization Disabled
     (Full function commented out for debugging)
  -----------------------------*/

  /*
  function initTilt() {
    const pairs = Array.from(document.querySelectorAll(".tilt-wrap"))
      .map((wrap) => ({ wrap, card: wrap.querySelector(".card-3d") }))
      .filter((p) => p.card);
    if (!pairs.length) return;

    const rootCS = getComputedStyle(document.documentElement);
    const FROM_TILT = parseFloat(rootCS.getPropertyValue("--fromTilt")) || 22;
    const FROM_Y = parseFloat(rootCS.getPropertyValue("--fromY")) || 68;
    const FROM_SCALE =
      parseFloat(rootCS.getPropertyValue("--fromScale")) || 0.965;

    const inViewPad = 160;

    const progressFromRect = (rect) => {
      const vh = getVH();
      const start = vh;
      const end = -rect.height;
      return Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    };

    const updateCard = (card, wrapRect) => {
      const p = progressFromRect(wrapRect);
      const tilt = (1 - p) * FROM_TILT - p * 1;
      const y = (1 - p) * FROM_Y;
      const s = FROM_SCALE + (1 - FROM_SCALE) * p;
      const op = 0.78 + (1 - 0.78) * p;
      card.style.transform = `translateY(${y}px) rotateX(${tilt}deg) scale(${s}) translateZ(0)`;
      card.style.opacity = op;
    };

    pairs.forEach(({ wrap, card }) => {
      const hasMarquee = !!card.querySelector(".scroll-tilt");
      const useCSSTimeline = !isMobile && !hasMarquee;

      if (useCSSTimeline) {
        card.classList.add("use-css-timeline");

        let lastTop = null,
          usingFallback = false;
        const tick = () => {
          if (usingFallback) return;
          const r = wrap.getBoundingClientRect();
          if (lastTop === null) lastTop = r.top;
          const moved = Math.abs(r.top - lastTop) > 0.25;
          lastTop = r.top;
          if (!moved) {
            usingFallback = true;
            card.classList.remove("use-css-timeline");
            startJS();
          } else {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      } else {
        startJS();
      }

      function startJS() {
        card.style.animation = "none";
        let active = false;

        const drive = () => {
          if (!active) return;
          updateCard(card, wrap.getBoundingClientRect());
          requestAnimationFrame(drive);
        };

        const onScrollLike = () => {
          const vh = getVH();
          const r = wrap.getBoundingClientRect();
          const near = r.top < vh + inViewPad && r.bottom > -inViewPad;
          if (near && !active) {
            active = true;
            requestAnimationFrame(drive);
          } else if (!near && active) {
            active = false;
          }
        };

        window.addEventListener("scroll", onScrollLike, { passive: true });
        window.addEventListener("resize", onScrollLike, { passive: true });
        window.addEventListener("orientationchange", onScrollLike, {
          passive: true,
        });
        if (window.visualViewport) {
          visualViewport.addEventListener("resize", onScrollLike, {
            passive: true,
          });
          visualViewport.addEventListener("scroll", onScrollLike, {
            passive: true,
          });
        }

        onScrollLike();
      }
    });
  }
  */

  /* ----------------------------
     🚀 Start — only marquee active
  -----------------------------*/
  function start() {
    initMarquees();
    // setTimeout(initTilt, 300); // ❌ Disabled tilt initialization
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();



window.reinitializeHomepageScripts = function () {
  /* ---------- Keyword Highlighting ---------- */
  const phrases = [
    "Done-For-You",
    "Push of a Button",
    "High-Volume",
    "Zero-Setup",
    "Flat Fees",
    "$249",
    "Actually Work",
    "Rubber Bumpers",
    "Never Felt",
    "Work Our Butts Off",
    "Brandless Campaigns",
    "Post-Opt-In",
    "Without Lifting a Finger",
    "Asked Questions",
    "Select Industries",
  ];

  function highlightKeywords() {
    const elements = document.querySelectorAll(".H1");
    if (elements.length === 0) return false;

    elements.forEach((el) => {
      let html = el.innerHTML;
      phrases.forEach((phrase) => {
        const escaped = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(escaped, "gi");
        html = html.replace(
          regex,
          (m) => `<span class="highlight-gradient">${m}</span>`
        );
      });
      el.innerHTML = html;
    });

    console.log(`[Highlight] ✅ Applied to ${elements.length} elements.`);
    return true;
  }

  // Run after DOM load and recheck until Plasmic finishes rendering
  const start = performance.now();
  const poll = setInterval(() => {
    if (highlightKeywords()) {
      clearInterval(poll);
    } else if (performance.now() - start > 5000) {
      // stop after 5s max
      clearInterval(poll);
      console.warn("[Highlight] ⏱ Timeout — no .H1 elements found");
    }
  }, 10);
};
