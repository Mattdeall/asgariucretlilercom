import vinextHandler from "vinext/server/fetch-handler";

export * from "vinext/server/fetch-handler";

type CronEnv = { PUBLISH_CRON_SECRET?: string };

// Cloudflare Cron Trigger: publishes due scheduled articles by calling the
// protected /api/cron/publish route on this same Worker.
async function runPublishCron(env: CronEnv, ctx: unknown, handler: { fetch: (...a: any[]) => Promise<Response> }) {
  const secret = env.PUBLISH_CRON_SECRET;
  if (!secret) throw new Error("PUBLISH_CRON_SECRET is not set");
  const res = await handler.fetch(
    new Request("https://internal.invalid/api/cron/publish", {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
    }),
    env,
    ctx,
  );
  if (!res.ok) throw new Error(`Scheduled publish failed with status ${res.status}`);
  console.log("Scheduled publish ok", await res.text());
}

const handler = vinextHandler as unknown as { fetch: (...a: any[]) => Promise<Response> };

export default {
  ...handler,
  fetch: (...args: any[]) => handler.fetch(...args),
  async scheduled(_controller: unknown, env: CronEnv, ctx: unknown) {
    await runPublishCron(env, ctx, handler);
  },
};
