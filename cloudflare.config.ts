import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "asgariucretlilercom",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-10",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      VINEXT_KV_CACHE: bindings.kv({ id: "0751d847a653477e896abbf54ba1bf29" }),
    },
  }),
});
