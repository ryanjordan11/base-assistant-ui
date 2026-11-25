"use client";

import { BaseConfigProvider } from "@/lib/base/config-provider";
import { DemoRuntimeProvider } from "@/components/runtime/demo-runtime-provider";
import { defaultBaseConfig } from "@/lib/base/defaults";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseConfigProvider value={defaultBaseConfig}>
      <DemoRuntimeProvider>{children}</DemoRuntimeProvider>
    </BaseConfigProvider>
  );
}
