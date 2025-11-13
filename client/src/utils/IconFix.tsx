// src/utils/IconFix.tsx
import React from "react";

export function IconFix(
  Icon: React.ComponentType<any>,
  props?: React.ComponentProps<any>
) {
  return <Icon {...props} /> as React.ReactElement;
}
