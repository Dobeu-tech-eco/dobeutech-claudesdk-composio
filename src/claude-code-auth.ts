import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";

const CLAUDE_USER_DIR =
  process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude");
const SETTINGS_FILE = join(CLAUDE_USER_DIR, "settings.json");

interface ClaudeCodeSettings {
  apiKeyHelper?: string;
  env?: Record<string, string>;
}

/**
 * Load ANTHROPIC_API_KEY from the same sources Claude Code uses when already
 * "logged in" or configured: user settings (~/.claude/settings.json) via
 * apiKeyHelper or env.ANTHROPIC_API_KEY. Does nothing if process.env already
 * has ANTHROPIC_API_KEY (e.g. from .env).
 */
export function loadAnthropicKeyFromClaudeCode(): void {
  if (process.env.ANTHROPIC_API_KEY?.trim()) {
    return;
  }

  if (!existsSync(SETTINGS_FILE)) {
    return;
  }

  let settings: ClaudeCodeSettings;
  try {
    const raw = readFileSync(SETTINGS_FILE, "utf-8");
    settings = JSON.parse(raw) as ClaudeCodeSettings;
  } catch {
    return;
  }

  if (settings.env?.ANTHROPIC_API_KEY?.trim()) {
    process.env.ANTHROPIC_API_KEY = settings.env.ANTHROPIC_API_KEY.trim();
    return;
  }

  if (settings.apiKeyHelper?.trim()) {
    try {
      const cmd = settings.apiKeyHelper.trim();
      const shell = platform() === "win32" ? "cmd.exe" : "/bin/sh";
      const out = execSync(cmd, { encoding: "utf-8", shell });
      const key = out.split("\n")[0]?.trim();
      if (key) {
        process.env.ANTHROPIC_API_KEY = key;
      }
    } catch {
      // apiKeyHelper failed; leave ANTHROPIC_API_KEY unset
    }
  }
}
