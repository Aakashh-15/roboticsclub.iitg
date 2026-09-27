/* Line icons used across the site (stroke = currentColor). */
window.ICONS = (() => {
  const w = (d) =>
    `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  return {
    rover: w(`<rect x="10" y="16" width="26" height="10" rx="3"/><path d="M16 16v-5h9l3 5"/><circle cx="12" cy="34" r="4"/><circle cx="24" cy="34" r="4"/><circle cx="36" cy="34" r="4"/><path d="M12 30l4-4M36 30l-4-4M24 30v-4"/><path d="M36 16l6-6M42 10v4"/>`),
    arm: w(`<path d="M8 42h20"/><rect x="13" y="36" width="10" height="6" rx="1"/><circle cx="18" cy="30" r="3"/><path d="M18 27l6-12"/><circle cx="25" cy="13" r="3"/><path d="M28 13h10"/><path d="M38 9v8M38 9l4 2M38 17l4-2"/>`),
    drone: w(`<rect x="19" y="20" width="10" height="8" rx="2"/><path d="M19 22l-8-6M29 22l8-6M19 26l-8 6M29 26l8 6"/><ellipse cx="10" cy="15" rx="6" ry="1.8"/><ellipse cx="38" cy="15" rx="6" ry="1.8"/><ellipse cx="10" cy="33" rx="6" ry="1.8"/><ellipse cx="38" cy="33" rx="6" ry="1.8"/>`),
    dog: w(`<rect x="12" y="16" width="22" height="9" rx="3"/><path d="M34 18h5l3 4-3 2h-5"/><path d="M15 25l-3 7 3 6M20 25l2 7-2 6M28 25l-2 7 2 6M32 25l3 7-3 6"/>`),
    swarm: w(`<circle cx="12" cy="14" r="5"/><circle cx="36" cy="14" r="5"/><circle cx="24" cy="34" r="5"/><path d="M17 14h14M15 18l6 12M33 18l-6 12" stroke-dasharray="2 3"/>`),
    mouse: w(`<path d="M8 8h14v10h10v-10h8v32h-10v-12h-12v12h-10z"/><circle cx="27" cy="34" r="2.5"/>`),
    gear: w(`<circle cx="24" cy="24" r="6"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/><circle cx="24" cy="24" r="13"/>`),
    bulb: w(`<path d="M18 32c0-4-6-7-6-14a12 12 0 0 1 24 0c0 7-6 10-6 14z"/><path d="M19 37h10M21 42h6"/>`),
    trophy: w(`<path d="M15 8h18v10a9 9 0 0 1-18 0z"/><path d="M15 12H8c0 6 3 9 7 9M33 12h7c0 6-3 9-7 9M24 27v7M17 41h14M19 34h10v7H19z"/>`),
    bot: w(`<rect x="10" y="16" width="28" height="20" rx="6"/><circle cx="19" cy="26" r="2.5"/><circle cx="29" cy="26" r="2.5"/><path d="M24 16v-6M21 10h6M6 24v6M42 24v6M19 32h10"/>`),
    chip: w(`<rect x="14" y="14" width="20" height="20" rx="2"/><rect x="20" y="20" width="8" height="8"/><path d="M19 8v6M24 8v6M29 8v6M19 34v6M24 34v6M29 34v6M8 19h6M8 24h6M8 29h6M34 19h6M34 24h6M34 29h6"/>`),
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  };
})();
