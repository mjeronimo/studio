// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { IPalette, hsl2rgb, getColorFromRGBA } from "@fluentui/react";
import { createTheme } from "@fluentui/theme";

import components from "@foxglove/studio-base/theme/components";
import { colors, fonts } from "@foxglove/studio-base/util/sharedStyleConstants";

const THEME_HUE = 247;

// https://aka.ms/themedesigner
export default createTheme({
  defaultFontStyle: {
    fontFamily: fonts.SANS_SERIF,
  },
  semanticColors: {
    menuBackground: "#242429",
    menuItemBackgroundHovered: "#2e2e39",
    errorBackground: colors.RED1,
    warningBackground: colors.YELLOW1,
  },
  components,
  isInverted: true,
  palette: {
    ...themeColors(),
    ...neutralColors(),
    black: "#fdfdfd",
    white: "#121217",
    blackTranslucent40: "#fdfdfd66",
    whiteTranslucent40: "#12121766",
  },
});

function themeColors(): Partial<IPalette> {
  const keys: (keyof IPalette)[] = [
    "themeDarker",
    "themeDark",
    "themeDarkAlt",
    "themePrimary",
    "themeSecondary",
    "themeTertiary",
    "themeLight",
    "themeLighter",
    "themeLighterAlt",
  ];
  keys.reverse(); // reverse because our theme is inverted

  const result: Partial<IPalette> = Object.fromEntries(
    keys.map((key, i) => {
      const ratio = i / (keys.length - 1);
      return [
        key,
        "#" +
          getColorFromRGBA(hsl2rgb(THEME_HUE, Math.min(20 + ratio * 75, 75), 40 + ratio * 57)).hex,
      ];
    }),
  );
  return result;
}

function neutralColors(): Partial<IPalette> {
  const keys: (keyof IPalette)[] = [
    "neutralDark",
    "neutralPrimary",
    "neutralPrimaryAlt",
    "neutralSecondary",
    "neutralSecondaryAlt",
    "neutralTertiary",
    "neutralTertiaryAlt",
    "neutralQuaternary",
    "neutralQuaternaryAlt",
    "neutralLight",
    "neutralLighter",
    "neutralLighterAlt",
  ];
  keys.reverse(); // reverse because our theme is inverted

  const result: Partial<IPalette> = Object.fromEntries(
    keys.map((key, i) => {
      const ratio = i / (keys.length - 1);
      return [key, "#" + getColorFromRGBA(hsl2rgb(THEME_HUE, 5, 16 + ratio * 80)).hex];
    }),
  );
  return result;
}
