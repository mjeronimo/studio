// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

// Keep in sync with fonts.module.scss
// We tried importing scss vars directly in JS, but style-loader doesn't support web workers

export const SANS_SERIF = [
  // Apple
  "-apple-system",
  "BlinkMacSystemFont",
  "ui-sans-serif",
  // Windows
  "Segoe UI",
  // Ubuntu
  "Ubuntu",
  // Chrome OS and Android
  "Roboto",
  // Fallback
  "sans-serif",
].join(",");

export const MONOSPACE = [
  // Apple
  "SF Mono",
  "ui-monospace",
  // Windows
  "Segoe UI Mono",
  //  Ubuntu
  "Ubuntu Mono",
  // Chrome OS + Android
  "Roboto Mono",
  // Styled fallbacks
  "Menlo",
  "Monaco",
  "Courier",
  // Fallback
  "monospace",
].join(",");
