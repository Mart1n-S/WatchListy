declare module "next-pwa" {
    import { NextConfig } from "next";

    export interface CacheExpiration {
        maxEntries?: number;
        maxAgeSeconds?: number;
    }

    export interface RuntimeCachingOptions {
        cacheName?: string;
        expiration?: CacheExpiration;
        cacheableResponse?: {
            statuses?: number[];
            headers?: Record<string, string>;
        };
    }

    export interface RuntimeCachingRule {
        urlPattern: RegExp | string;
        handler: "CacheFirst" | "NetworkFirst" | "NetworkOnly" | "StaleWhileRevalidate";
        options?: RuntimeCachingOptions;
    }

    export interface NextPWAConfig {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        skipWaiting?: boolean;
        runtimeCaching?: RuntimeCachingRule[];
    }

    export default function withPWA(
        config?: NextPWAConfig
    ): (nextConfig: NextConfig) => NextConfig;
}
