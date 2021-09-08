// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { useAsync } from "react-use";

import OsContextSingleton from "@foxglove/studio-base/OsContextSingleton";
import { usePrompt } from "@foxglove/studio-base/hooks/usePrompt";
import { Player } from "@foxglove/studio-base/players/types";
import { parseInputUrl } from "@foxglove/studio-base/util/url";

type Options = {
  onPlayer: (player: Player) => void;
};

class Ros1Native {
  static id = "ros1-socket";
  static displayName = "ROS 1";
  static icon = "studio.ROS";

  static ui(options: Options): JSX.Element {
    const storageCacheKey = `studio.source.${Ros1Native.id}`;

    const prompt = usePrompt();
    const storage = useMemo(() => new Storage(), []);

    // fixme - read hostname option from app options?
    // I think the hostname option should be configured here when connecting
    const hostname: string | undefined = undefined;

    useAsync(async () => {
      const { default: Ros1Player } = await import("@foxglove/studio-base/players/Ros1Player");

      // undefined url indicates the user canceled the prompt
      let maybeUrl;
      const restore = options.restore;

      if (restore) {
        maybeUrl = storage.getItem<string>(storageCacheKey);
      } else {
        const value = storage.getItem<string>(storageCacheKey);

        const os = OsContextSingleton; // workaround for https://github.com/webpack/webpack/issues/12960
        maybeUrl = await prompt({
          title: "ROS 1 TCP connection",
          placeholder: "localhost:11311",
          initialValue: value ?? os?.getEnvVar("ROS_MASTER_URI") ?? "localhost:11311",
          transformer: (str) => {
            const result = parseInputUrl(str, "ros:", {
              "http:": { port: 80 },
              "https:": { port: 443 },
              "ros:": { protocol: "http:", port: 11311 },
            });
            if (result == undefined) {
              throw new Error(
                "Invalid ROS URL. See the ROS_MASTER_URI at http://wiki.ros.org/ROS/EnvironmentVariables for more info.",
              );
            }
            return result;
          },
        });
      }

      if (maybeUrl == undefined) {
        return undefined;
      }

      const url = maybeUrl;
      storage.setItem(storageCacheKey, url);

      const player = new Ros1Player({
        url,
        hostname,
        metricsCollector: options.playerOptions.metricsCollector,
      });

      options.onPlayer(player);
    }, []);

    return <></>;
  }
}

export default Ros1Native;
