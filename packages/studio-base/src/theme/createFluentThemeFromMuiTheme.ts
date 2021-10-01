// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import {
  BaseSlots,
  ITheme,
  ThemeGenerator,
  createTheme,
  getColorFromString,
  isDark,
  themeRulesStandardCreator,
} from "@fluentui/react";
import { Theme as MuiTheme } from "@material-ui/core";

import components from "@foxglove/studio-base/theme/components";
import { colors, fonts } from "@foxglove/studio-base/util/sharedStyleConstants";

export function createFluentThemeFromMuiTheme(theme: MuiTheme): ITheme {
  const themeRules = themeRulesStandardCreator();
  const colorPalette = {
    primaryColor: getColorFromString(theme.palette.primary.main)!,
    textColor: getColorFromString(theme.palette.text.primary)!,
    backgroundColor: getColorFromString(theme.palette.background.default)!,
  };
  ThemeGenerator.insureSlots(
    themeRules,
    isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
  );
  ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.primaryColor]], colorPalette.primaryColor);
  ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.foregroundColor]], colorPalette.textColor);
  ThemeGenerator.setSlot(
    themeRules[BaseSlots[BaseSlots.backgroundColor]],
    colorPalette.backgroundColor,
  );
  const themeAsJson: {
    [key: string]: string;
  } = ThemeGenerator.getThemeAsJson(themeRules);

  return createTheme({
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
    palette: themeAsJson,
    isInverted: isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
  });
}
