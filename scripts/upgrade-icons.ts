// Why this file exists:
// `bun run <script>` doesn't load .env into package.json scripts, so writing
// `--key=$PIXELARTICONS_LICENSE_KEY` there expands to an empty string.
// Bun *does* load .env when it runs a file directly, so we read the key here
// and pass it to the pixelarticons CLI ourselves.

const key = process.env.PIXELARTICONS_LICENSE_KEY;

// Fail early with a clear message instead of the CLI's generic usage error
if (!key) {
  console.error(
    "PIXELARTICONS_LICENSE_KEY is missing. Add it to .env (see .env.example).",
  );
  process.exit(1);
}

// Run the CLI as if we'd typed it, sharing this terminal's input/output
const result = Bun.spawnSync(
  ["bunx", "pixelarticons", "upgrade", `--key=${key}`],
  {
    stdio: ["inherit", "inherit", "inherit"],
  },
);

// Pass the CLI's exit code through so `bun run` reports success/failure correctly
process.exit(result.exitCode);
