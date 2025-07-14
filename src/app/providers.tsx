"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import config from "@/rainbowKitConfig";
import { WagmiProvider } from "wagmi";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}
