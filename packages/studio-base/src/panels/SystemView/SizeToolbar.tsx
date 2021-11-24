import React, { memo, useCallback, HTMLAttributes, FC, useEffect, useState } from 'react';
import cc from 'classcat';
import Button from "@foxglove/studio-base/components/Button";
import ReactFlow, { useStoreState, useStoreActions, useZoomPanHelper, FitViewParams } from 'react-flow-renderer';
import FoxgloveIcon from "@foxglove/studio-base/components/Icon";
import styles from "@foxglove/studio-base/panels/ThreeDimensionalViz/sharedStyles";

// MDI icons
import FitviewIcon from "./assets/icons/fitview.svg";
import MinusIcon from "@mdi/svg/svg/minus.svg";
import PlusIcon from "@mdi/svg/svg/plus.svg";
import LockIcon from "@mdi/svg/svg/lock-outline.svg";
import UnlockIcon from "@mdi/svg/svg/lock-open-variant-outline.svg";

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewParams?: FitViewParams;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

export interface ControlButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export const ControlButton: FC<ControlButtonProps> = ({ children, className, ...rest }) => (
  <button className={cc(['react-flow__controls-button', className])} {...rest}>
    {children}
  </button>
);

const Controls: FC<ControlProps> = ({
  style,
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  fitViewParams,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  className,
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const setInteractive = useStoreActions((actions) => actions.setInteractive);
  const { zoomIn, zoomOut, fitView } = useZoomPanHelper();

  const isInteractive = useStoreState((s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable);
  const mapClasses = cc(['react-flow__controls', className]);

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    fitView?.(fitViewParams);
    onFitView?.();
  }, [fitView, fitViewParams, onFitView]);

  const onInteractiveChangeHandler = useCallback(() => {
    setInteractive?.(!isInteractive);
    onInteractiveChange?.(!isInteractive);
  }, [isInteractive, setInteractive, onInteractiveChange]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={mapClasses} style={style}>
      <div className={styles.buttons}>
      {showZoom && (
        <>
        <Button className={styles.iconButton} tooltip="Zoom in graph" onClick={onZoomInHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <PlusIcon />
          </FoxgloveIcon>
        </Button>
        <Button className={styles.iconButton} tooltip="Zoom out graph" onClick={onZoomOutHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <MinusIcon />
          </FoxgloveIcon>
        </Button>
        </>
      )}
      {showFitView && (
        <Button className={styles.iconButton} tooltip="Fit graph to window" onClick={onFitViewHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            <FitviewIcon />
          </FoxgloveIcon>
        </Button>
      )}
      {showInteractive && (
        <Button className={styles.iconButton} tooltip="Lock/unlock the node positions" onClick={onInteractiveChangeHandler}>
          <FoxgloveIcon style={{ color: "white" }} size="small">
            {isInteractive ? <UnlockIcon /> : <LockIcon />}
          </FoxgloveIcon>
        </Button>
      )}
      </div>
      {children}
    </div>
  );
};

Controls.displayName = 'Controls';

export default memo(Controls);
