// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { init as initSentry } from "@sentry/browser";
import ReactDOM from "react-dom";

import { I64Array } from "@foxglove/int64array";
import Logger from "@foxglove/log";

import VersionBanner from "./VersionBanner";

const log = Logger.getLogger(__filename);
log.debug("initializing");

// FIXME auto polyfill?
window.BigInt64Array = I64Array as unknown as typeof BigInt64Array;
window.BigUint64Array = I64Array as unknown as typeof BigUint64Array;
ArrayBuffer.isView = (function (originalIsView) {
  return function (obj: unknown): obj is ArrayBufferView {
    return originalIsView(obj) || obj instanceof I64Array;
  };
})(ArrayBuffer.isView.bind(ArrayBuffer));

DataView.prototype.getBigInt64 = function (
  byteOffset: number,
  littleEndian: boolean = false,
): bigint {
  //FIXME
  return this.getBigUint64(byteOffset, littleEndian);
};
DataView.prototype.getBigUint64 = function (
  byteOffset: number,
  littleEndian: boolean = false,
): bigint {
  const lo = this.getInt32(byteOffset, littleEndian);
  const hi = this.getInt32(byteOffset + Uint32Array.BYTES_PER_ELEMENT, littleEndian);
  return (BigInt(littleEndian ? hi : lo) << 32n) | BigInt(littleEndian ? lo : hi);
};
DataView.prototype.setBigInt64 = function (
  byteOffset: number,
  value: bigint,
  littleEndian: boolean = false,
): void {
  //FIXME
  this.setBigUint64(byteOffset, value, littleEndian);
};
DataView.prototype.setBigUint64 = function (
  byteOffset: number,
  value: bigint,
  littleEndian: boolean = false,
): void {
  const hi = Number((value >> 32n) & 0xffffffffn);
  const lo = Number(value & 0xffffffffn);
  this.setInt32(byteOffset, littleEndian ? lo : hi, littleEndian);
  this.setInt32(byteOffset, littleEndian ? hi : lo, littleEndian);
};

if (typeof process.env.SENTRY_DSN === "string") {
  log.info("initializing Sentry");
  initSentry({
    dsn: process.env.SENTRY_DSN,
    autoSessionTracking: true,
    // Remove the default breadbrumbs integration - it does not accurately track breadcrumbs and
    // creates more noise than benefit.
    integrations: (integrations) => {
      return integrations.filter((integration) => {
        return integration.name !== "Breadcrumbs";
      });
    },
    maxBreadcrumbs: 10,
  });
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("missing #root element");
}

async function main() {
  const searchParams = new URLSearchParams(window.location.search);
  const demoMode = searchParams.get("demo") != undefined;
  if (demoMode) {
    // Remove ?demo from the page URL so reloading the page doesn't save a new copy of the demo layout.
    searchParams.delete("demo");
    history.replaceState(undefined, "", `${window.location.pathname}?${searchParams.toString()}`);
  }
  const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)\./);
  const chromeVersion = chromeMatch ? parseInt(chromeMatch[1] ?? "", 10) : 0;
  const isChrome = chromeVersion !== 0;

  const canRenderApp = typeof BigInt64Array === "function" && typeof BigUint64Array === "function";
  const banner = (
    <VersionBanner
      isChrome={isChrome}
      currentVersion={chromeVersion}
      isDismissable={canRenderApp}
    />
  );
  const renderCallback = () => {
    // Integration tests look for this console log to indicate the app has rendered once
    log.debug("App rendered");
  };

  if (!canRenderApp) {
    ReactDOM.render(banner, rootEl, renderCallback);
    return;
  }

  const { installDevtoolsFormatters, overwriteFetch, waitForFonts } = await import(
    "@foxglove/studio-base"
  );
  installDevtoolsFormatters();
  overwriteFetch();
  // consider moving waitForFonts into App to display an app loading screen
  await waitForFonts();

  const { Root } = await import("./Root");
  ReactDOM.render(
    <>
      {banner}
      <Root loadWelcomeLayout={demoMode} />
    </>,
    rootEl,
    renderCallback,
  );
}

void main();
