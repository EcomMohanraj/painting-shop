// Generates ADMIN_PASSWORD_HASH for .env.local.
//
//   npm run admin:hash
//
// The password is typed at a hidden prompt, so it never appears on screen
// or in your shell history.

import { createInterface } from "node:readline";
import { hashPassword } from "../src/lib/password";

const MIN_LENGTH = 10;

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let currentQuestion = "";
// Print only the prompt text, never the typed characters.
(rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s: string) => {
  if (s.includes(currentQuestion)) process.stdout.write(currentQuestion);
};

// Queue incoming lines so none are lost if input arrives before we ask (e.g. piped).
const lines: string[] = [];
let waiting: ((line: string) => void) | null = null;
rl.on("line", (line) => {
  if (waiting) {
    const resolve = waiting;
    waiting = null;
    resolve(line);
  } else lines.push(line);
});
rl.on("close", () => {
  if (waiting) {
    console.error("\nNo input received.");
    process.exit(1);
  }
});

function askHidden(question: string): Promise<string> {
  currentQuestion = question;
  process.stdout.write(question);
  return new Promise((resolve) => {
    const done = (line: string) => {
      process.stdout.write("\n");
      resolve(line);
    };
    const queued = lines.shift();
    if (queued !== undefined) done(queued);
    else waiting = done;
  });
}

async function main() {
  const password = await askHidden("New admin password: ");
  if (password.length < MIN_LENGTH) {
    console.error(`Password must be at least ${MIN_LENGTH} characters.`);
    process.exit(1);
  }
  const confirm = await askHidden("Confirm password: ");
  if (password !== confirm) {
    console.error("Passwords don't match.");
    process.exit(1);
  }
  console.log("\nAdd this line to .env.local (replacing any existing ADMIN_PASSWORD_HASH):\n");
  console.log(`ADMIN_PASSWORD_HASH=${hashPassword(password)}\n`);
}

main().finally(() => rl.close());
