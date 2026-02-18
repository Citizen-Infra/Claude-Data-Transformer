# claude.pdt — Personal Data Transformer (Skills Discovery)

Upload your Claude conversation history and get personalized Skill recommendations based on how you actually use AI.

Claude.pdt analyzes your exported conversations entirely in your browser — your data never touches our servers — and matches your usage patterns against a community-curated Skills Commons to surface the tools that fit how you already think.

## How it works

1. **Connect** — Bring your own Anthropic API key. We use Claude Haiku for cost-efficient analysis ($0.05–$0.30 typical).
2. **Upload** — Drop in your `conversations.json` from Claude's Settings → Privacy → Export Data.
3. **Discover** — The app samples your conversations, builds a usage profile (domains, work patterns, skill gaps), and ranks Skills by relevance to your actual workflow.

## What you get

- **Usage signature** — A breakdown of how you use AI: research, writing, code, strategy, with percentages and pattern tags.
- **Skill recommendations** — Ranked and explained. Not generic — tuned to your conversation history.
- **Install guidance** — Instructions for Claude.ai and Claude Code.

## Privacy architecture

- No server, no database, no account. Everything runs client-side.
- Your API key is held in browser memory only. Close the tab and it's gone.
- Conversation data goes directly from your browser to Anthropic's API. We are never in the data path.

## Skills Commons

The catalog currently includes official Anthropic skills (docx, xlsx, pptx, pdf, frontend-design) and curated community skills. The long-term vision is an open, community-governed Skills Commons where anyone can contribute — upload your SKILL.md and AI generates the catalog metadata automatically.

## Relationship to chatgpt.pdt

Sibling product. Same design system, same privacy model, same Citizen Infrastructure ethos. chatgpt.pdt transforms ChatGPT history into MCP files and networking cards. claude.pdt transforms Claude history into skill recommendations and usage signatures.

---

Built by [Citizen Infrastructure](https://github.com/HoustonBloom). Your data, always.
