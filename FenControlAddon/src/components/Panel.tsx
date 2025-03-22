import React, { memo } from "react";
import { AddonPanel } from "storybook/internal/components";

interface PanelProps {
  active: boolean;
}

export const Panel: React.FC<PanelProps> = memo(function MyPanel(props) {
  return <AddonPanel {...props}>My panel</AddonPanel>;
});
