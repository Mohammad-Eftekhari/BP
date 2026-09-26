const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function assertLocalDatabase(databaseUrl: string) {
  if (process.env.ALLOW_DESTRUCTIVE_DB === "true") {
    return;
  }

  let hostname = "";

  try {
    hostname = new URL(databaseUrl).hostname;
  } catch {
    throw new Error(
      "Refusing to run a destructive database command because DATABASE_URL is invalid.",
    );
  }

  if (!LOOPBACK_HOSTS.has(hostname)) {
    throw new Error(
      `Refusing to run a destructive database command against "${hostname}". Set ALLOW_DESTRUCTIVE_DB=true only when you intend to target that database.`,
    );
  }
}
