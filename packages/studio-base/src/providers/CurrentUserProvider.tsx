// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { PropsWithChildren, useEffect } from "react";
import { useAsync, useLocalStorage } from "react-use";

import Logger from "@foxglove/log";
import { useConsoleApi } from "@foxglove/studio-base/context/ConsoleApiContext";
import CurrentUserContext from "@foxglove/studio-base/context/CurrentUserContext";
import { isNonEmptyOrUndefined } from "@foxglove/studio-base/util/emptyOrUndefined";

const log = Logger.getLogger(__filename);

/** MeProvider attempts to load the current user's profile if there is an authenticated session */
export default function MeProvider(props: PropsWithChildren<unknown>): JSX.Element {
  const api = useConsoleApi();
  const [bearerToken] = useLocalStorage<string>("fox.bearer-token");

  const {
    loading,
    value: me,
    error,
  } = useAsync(async () => {
    if (!isNonEmptyOrUndefined(bearerToken)) {
      return Promise.resolve(undefined);
    }
    api.setAuthHeader(`Bearer ${bearerToken}`);
    return api.me();
  }, [api, bearerToken]);

  useEffect(() => {
    log.error(error);
  }, [error]);

  if (loading) {
    return <></>;
  }

  return <CurrentUserContext.Provider value={me}>{props.children}</CurrentUserContext.Provider>;
}