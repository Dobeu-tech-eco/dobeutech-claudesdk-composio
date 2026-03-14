# dobeutech-claudesdk-composio

Dobeutech Composio.dev Claude SDK based project. Integrates [Composio](https://composio.dev/) tools with the [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk) using the official session-based pattern and `ClaudeAgentSDKProvider`.

## Install

```bash
npm install
```

## Configure API keys

Copy the example env file and set your keys:

```bash
cp .env.example .env
```

Edit `.env` and set:

- **COMPOSIO_API_KEY** — from [Composio Settings](https://platform.composio.dev/?next_page=/settings)
- **ANTHROPIC_API_KEY** — optional if you use Claude Code’s config: from [Anthropic API keys](https://console.anthropic.com/settings/keys), or leave unset to use the same source as your already-logged-in Claude Code (user settings in `~/.claude/settings.json`: `apiKeyHelper` or `env.ANTHROPIC_API_KEY`)

## Run

```bash
npm start
```

This runs the agent with the default prompt (e.g. send an email via Composio). The app uses `composio.create(user_id)`, `session.tools()`, and `createSdkMcpServer` as per the [Composio Claude Agent SDK provider docs](https://docs.composio.dev/docs/providers/claude-agent-sdk).

## Scripts

- `npm start` — run the agent (`tsx src/index.ts`)
- `npm run typecheck` — run TypeScript type check
