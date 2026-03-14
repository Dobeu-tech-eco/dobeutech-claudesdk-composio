import "dotenv/config";
import { loadAnthropicKeyFromClaudeCode } from "./claude-code-auth.js";
import { Composio } from "@composio/core";

// Use ANTHROPIC_API_KEY from .env, or from Claude Code user settings (subscription / apiKeyHelper)
loadAnthropicKeyFromClaudeCode();
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";

const composio = new Composio({
  provider: new ClaudeAgentSDKProvider(),
});

async function main() {
  const session = await composio.create("user_123");
  const tools = await session.tools();
  const toolServer = createSdkMcpServer({
    name: "composio",
    version: "1.0.0",
    tools,
  });

  const prompt =
    "Send an email to john@example.com with the subject 'Hello' and body 'Hello from Composio!'";

  for await (const content of query({
    prompt,
    options: {
      mcpServers: { composio: toolServer },
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
    },
  })) {
    if (content.type === "assistant") {
      console.log("Claude:", content.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
