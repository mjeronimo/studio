// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useMessagePipeline } from "@foxglove-studio/app/components/MessagePipeline";

type Props = {
  topic: string;
  datatype: string;
  name: string;
};

// Registers a publisher with the player and returns a publish() function to publish data.
export default function usePublisher({ topic, datatype, name }: Props): (msg: unknown) => void {
  const [id] = useState(() => uuidv4());
  const publish = useMessagePipeline((context) => context.publish);
  const setPublishers = useMessagePipeline((context) => context.setPublishers);
  useEffect(() => {
    setPublishers(id, [{ topic, datatype, advertiser: { type: "panel", name } }]);
    return () => setPublishers(id, []);
  }, [id, topic, datatype, name, setPublishers]);

  return useCallback(
    (msg: unknown) => {
      publish({ topic, msg });
    },
    [publish, topic],
  );
}