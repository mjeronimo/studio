// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Modal, Text, IModalProps, mergeStyleSets } from "@fluentui/react";

import { PlayerProblem } from "@foxglove/studio-base/players/types";
import mixins from "@foxglove/studio-base/styles/mixins.module.scss";

const styles = mergeStyleSets({
  modalBody: {
    padding: "28px",
    maxWidth: "600px",
    minWidth: "300px",
    maxHeight: "80vh",
    overflow: "auto",
  },
  tip: {
    paddingBottom: "8px",
  },
  error: {
    fontFamily: mixins.monospaceFont,
    whiteSpace: "normal",
  },
});

export default function PlayerProblemModal({
  problem,
  onRequestClose,
}: {
  problem: PlayerProblem;
  onRequestClose: IModalProps["onDismiss"];
}): JSX.Element {
  return (
    <Modal onDismiss={onRequestClose}>
      <Text>{problem.message}</Text>
      <hr />
      <div className={styles.modalBody}>
        {problem.tip != undefined && (
          <div className={styles.tip}>
            <span>{problem.tip}</span>
          </div>
        )}
        {problem.error?.stack != undefined && (
          <pre className={styles.error}>{problem.error.stack}</pre>
        )}
      </div>
    </Modal>
  );
}
