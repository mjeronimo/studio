// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import {
  ITheme,
  ThemeGenerator,
  createTheme,
  getColorFromString,
  themeRulesStandardCreator,
} from "@fluentui/react";
import { Theme as MuiTheme } from "@material-ui/core";

import components from "@foxglove/studio-base/theme/components";
import { fonts } from "@foxglove/studio-base/util/sharedStyleConstants";

export function createFluentThemeFromMuiTheme(theme: MuiTheme): ITheme {
  const themeRules = themeRulesStandardCreator();
  const colorPalette = {
    primaryColor: getColorFromString(theme.palette.primary.main)!,
    foregroundColor: getColorFromString(theme.palette.text.primary)!,
    backgroundColor: getColorFromString(theme.palette.background.paper)!,
  };

  ThemeGenerator.insureSlots(themeRules, theme.palette.type === "dark");
  ThemeGenerator.setSlot(themeRules.primaryColor!, colorPalette.primaryColor);
  ThemeGenerator.setSlot(themeRules.foregroundColor!, colorPalette.foregroundColor);
  ThemeGenerator.setSlot(themeRules.backgroundColor!, colorPalette.backgroundColor);

  const palette: {
    [key: string]: string;
  } = ThemeGenerator.getThemeAsJson(themeRules);

  return createTheme({
    defaultFontStyle: {
      fontFamily: fonts.SANS_SERIF,
    },
    semanticColors: {
      menuBackground: theme.palette.background.paper,
      menuItemBackgroundHovered: theme.palette.action.hover,
      errorBackground: theme.palette.error.main,
      warningBackground: theme.palette.warning.main,
    },
    components,
    palette,
    isInverted: theme.palette.type === "dark",
  });
}
