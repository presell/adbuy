


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
