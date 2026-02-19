import type { ClaudeConversation } from "../lib/types";

/**
 * Synthetic sample conversations for users to test the tool
 * without uploading their real data. Covers a diverse range of
 * domains so the analysis produces interesting results.
 */
export const SAMPLE_CONVERSATIONS: ClaudeConversation[] = [
  {
    uuid: "sample-001",
    name: "Debug React useEffect infinite loop",
    created_at: "2025-11-15T10:30:00Z",
    updated_at: "2025-11-15T11:00:00Z",
    chat_messages: [
      { uuid: "m001", sender: "human", text: "I have a React component that keeps re-rendering infinitely. The useEffect has a dependency on an object that's created each render. How do I fix this bug?", created_at: "2025-11-15T10:30:00Z" },
      { uuid: "m002", sender: "assistant", text: "The issue is that objects are compared by reference in the dependency array. Each render creates a new object reference even if the contents are the same. You can fix this by memoizing with useMemo, or extracting the values as primitive dependencies.", created_at: "2025-11-15T10:31:00Z" },
      { uuid: "m003", sender: "human", text: "Can you review my code and show me exactly where to add useMemo?", created_at: "2025-11-15T10:32:00Z" },
      { uuid: "m004", sender: "assistant", text: "Here is the refactored component with useMemo wrapping the config object. I also added a lint rule suggestion to catch this pattern in the future.", created_at: "2025-11-15T10:33:00Z" },
    ],
  },
  {
    uuid: "sample-002",
    name: "Write blog post about AI in healthcare",
    created_at: "2025-11-18T14:00:00Z",
    updated_at: "2025-11-18T15:00:00Z",
    chat_messages: [
      { uuid: "m005", sender: "human", text: "Help me write a blog post about how AI is transforming healthcare diagnostics. I want to target a general audience, around 1200 words.", created_at: "2025-11-18T14:00:00Z" },
      { uuid: "m006", sender: "assistant", text: "Here is a draft outline with sections covering medical imaging, early detection, clinical decision support, and ethical considerations. Shall I expand each section?", created_at: "2025-11-18T14:02:00Z" },
      { uuid: "m007", sender: "human", text: "Yes, please write the full draft. Make the tone conversational but authoritative.", created_at: "2025-11-18T14:05:00Z" },
      { uuid: "m008", sender: "assistant", text: "Here is the full 1200-word blog post with an engaging hook, data-backed claims, and a forward-looking conclusion. I included citations for the key statistics.", created_at: "2025-11-18T14:10:00Z" },
      { uuid: "m009", sender: "human", text: "Can you edit the intro to be more compelling? Also add SEO keywords throughout.", created_at: "2025-11-18T14:15:00Z" },
      { uuid: "m010", sender: "assistant", text: "Revised intro with a patient story hook and woven in target keywords: AI diagnostics, machine learning healthcare, medical AI, early detection AI.", created_at: "2025-11-18T14:18:00Z" },
    ],
  },
  {
    uuid: "sample-003",
    name: "Build a REST API with Express and TypeScript",
    created_at: "2025-11-20T09:00:00Z",
    updated_at: "2025-11-20T11:00:00Z",
    chat_messages: [
      { uuid: "m011", sender: "human", text: "Help me set up an Express server with TypeScript. I need endpoints for CRUD operations on a users table with PostgreSQL.", created_at: "2025-11-20T09:00:00Z" },
      { uuid: "m012", sender: "assistant", text: "Here is the project structure with Express, TypeScript, and a PostgreSQL connection using pg. I included middleware for error handling and input validation.", created_at: "2025-11-20T09:05:00Z" },
      { uuid: "m013", sender: "human", text: "Can you add authentication with JWT tokens?", created_at: "2025-11-20T09:30:00Z" },
      { uuid: "m014", sender: "assistant", text: "Added JWT auth middleware, login and register endpoints, password hashing with bcrypt, and a protected route decorator.", created_at: "2025-11-20T09:35:00Z" },
      { uuid: "m015", sender: "human", text: "Now write tests for the auth endpoints using Jest.", created_at: "2025-11-20T10:00:00Z" },
      { uuid: "m016", sender: "assistant", text: "Here are the test files covering register, login, token validation, and protected route access. Using supertest for HTTP assertions.", created_at: "2025-11-20T10:10:00Z" },
    ],
  },
  {
    uuid: "sample-004",
    name: "Analyze Q3 sales data trends",
    created_at: "2025-12-01T08:00:00Z",
    updated_at: "2025-12-01T09:00:00Z",
    chat_messages: [
      { uuid: "m017", sender: "human", text: "I have a CSV with Q3 sales data. Can you help me analyze it? I need to find trends by region, identify top products, and create a summary for the leadership team.", created_at: "2025-12-01T08:00:00Z" },
      { uuid: "m018", sender: "assistant", text: "I can help with that analysis. Please share the data and I will calculate regional breakdowns, growth rates, and product performance metrics.", created_at: "2025-12-01T08:02:00Z" },
      { uuid: "m019", sender: "human", text: "Here is the data. Also generate some chart recommendations for the dashboard.", created_at: "2025-12-01T08:05:00Z" },
      { uuid: "m020", sender: "assistant", text: "Analysis complete. Key findings: West region up 23% YoY, Product A is your top performer. I recommend bar charts for regional comparison and line charts for monthly trends. Here is a formatted report.", created_at: "2025-12-01T08:15:00Z" },
    ],
  },
  {
    uuid: "sample-005",
    name: "Marketing strategy for SaaS launch",
    created_at: "2025-12-05T13:00:00Z",
    updated_at: "2025-12-05T14:30:00Z",
    chat_messages: [
      { uuid: "m021", sender: "human", text: "We are launching a new SaaS product next quarter. Help me build a go-to-market strategy. Our target is mid-market B2B companies.", created_at: "2025-12-05T13:00:00Z" },
      { uuid: "m022", sender: "assistant", text: "Here is a GTM framework covering positioning, pricing tiers, channel strategy, content marketing plan, and launch timeline. I focused on the mid-market segment.", created_at: "2025-12-05T13:10:00Z" },
      { uuid: "m023", sender: "human", text: "Can you draft the email marketing sequence for our launch campaign?", created_at: "2025-12-05T13:30:00Z" },
      { uuid: "m024", sender: "assistant", text: "Here is a 5-email nurture sequence: teaser, problem-aware, solution reveal, social proof, and limited-time offer. Each with subject lines, preview text, and conversion CTAs.", created_at: "2025-12-05T13:40:00Z" },
      { uuid: "m025", sender: "human", text: "Now help me plan the social media campaign on LinkedIn and Twitter.", created_at: "2025-12-05T14:00:00Z" },
      { uuid: "m026", sender: "assistant", text: "LinkedIn campaign plan with thought leadership posts, carousel graphics, and a paid ad strategy. Twitter plan with a launch thread, daily engagement posts, and influencer outreach list.", created_at: "2025-12-05T14:15:00Z" },
    ],
  },
  {
    uuid: "sample-006",
    name: "Design system for mobile app",
    created_at: "2025-12-08T10:00:00Z",
    updated_at: "2025-12-08T11:00:00Z",
    chat_messages: [
      { uuid: "m027", sender: "human", text: "Help me create a design system for a mobile app. I need a color palette, typography scale, spacing system, and component guidelines.", created_at: "2025-12-08T10:00:00Z" },
      { uuid: "m028", sender: "assistant", text: "Here is a comprehensive design system with a primary/secondary/neutral palette, type scale based on 4px grid, 8px spacing rhythm, and component specs for buttons, cards, inputs, and navigation.", created_at: "2025-12-08T10:15:00Z" },
      { uuid: "m029", sender: "human", text: "Can you generate the CSS custom properties and a Tailwind config for this system?", created_at: "2025-12-08T10:30:00Z" },
      { uuid: "m030", sender: "assistant", text: "Here is the tailwind.config.ts with your custom tokens and the equivalent CSS custom properties for use outside Tailwind.", created_at: "2025-12-08T10:35:00Z" },
    ],
  },
  {
    uuid: "sample-007",
    name: "Explain transformer architecture",
    created_at: "2025-12-10T16:00:00Z",
    updated_at: "2025-12-10T17:00:00Z",
    chat_messages: [
      { uuid: "m031", sender: "human", text: "Explain how the transformer architecture works. I understand basic neural networks but not attention mechanisms.", created_at: "2025-12-10T16:00:00Z" },
      { uuid: "m032", sender: "assistant", text: "The transformer uses self-attention to weigh the importance of different parts of the input when producing each part of the output. Let me break down the key components: multi-head attention, positional encoding, and feed-forward layers.", created_at: "2025-12-10T16:05:00Z" },
      { uuid: "m033", sender: "human", text: "What is the difference between self-attention and cross-attention?", created_at: "2025-12-10T16:15:00Z" },
      { uuid: "m034", sender: "assistant", text: "Self-attention computes relationships within the same sequence. Cross-attention computes relationships between two different sequences, like the encoder output and the decoder input in translation tasks.", created_at: "2025-12-10T16:18:00Z" },
      { uuid: "m035", sender: "human", text: "How does this compare to RNNs and LSTMs for sequence tasks?", created_at: "2025-12-10T16:25:00Z" },
      { uuid: "m036", sender: "assistant", text: "Transformers process entire sequences in parallel rather than step-by-step, which makes them faster to train and better at capturing long-range dependencies. RNNs struggle with vanishing gradients over long sequences, while transformers use positional encoding to maintain order information.", created_at: "2025-12-10T16:30:00Z" },
    ],
  },
  {
    uuid: "sample-008",
    name: "Refactor Python data pipeline",
    created_at: "2025-12-12T09:00:00Z",
    updated_at: "2025-12-12T10:30:00Z",
    chat_messages: [
      { uuid: "m037", sender: "human", text: "I have a Python script that processes CSV files. It is about 500 lines in a single function. Help me refactor it into clean, testable modules.", created_at: "2025-12-12T09:00:00Z" },
      { uuid: "m038", sender: "assistant", text: "I will break this into separate modules: data ingestion, transformation, validation, and output. Each module will have a clear interface and can be tested independently.", created_at: "2025-12-12T09:05:00Z" },
      { uuid: "m039", sender: "human", text: "Also add error handling and logging throughout.", created_at: "2025-12-12T09:30:00Z" },
      { uuid: "m040", sender: "assistant", text: "Added structured logging with the logging module, custom exception classes for each pipeline stage, and retry logic for the data ingestion step.", created_at: "2025-12-12T09:40:00Z" },
    ],
  },
  {
    uuid: "sample-009",
    name: "Write product requirements document",
    created_at: "2025-12-15T11:00:00Z",
    updated_at: "2025-12-15T12:30:00Z",
    chat_messages: [
      { uuid: "m041", sender: "human", text: "Help me write a PRD for a new feature: user notification preferences. Users should be able to configure email, push, and in-app notification settings per category.", created_at: "2025-12-15T11:00:00Z" },
      { uuid: "m042", sender: "assistant", text: "Here is a PRD with problem statement, user stories, acceptance criteria, technical requirements, wireframe descriptions, and a phased rollout plan.", created_at: "2025-12-15T11:15:00Z" },
      { uuid: "m043", sender: "human", text: "Add a section on success metrics and how we will measure adoption.", created_at: "2025-12-15T11:30:00Z" },
      { uuid: "m044", sender: "assistant", text: "Added KPIs: notification opt-in rate, email open rates by category, reduction in unsubscribe rate, and a 30/60/90 day measurement framework.", created_at: "2025-12-15T11:35:00Z" },
    ],
  },
  {
    uuid: "sample-010",
    name: "Automate deployment with GitHub Actions",
    created_at: "2025-12-18T14:00:00Z",
    updated_at: "2025-12-18T15:00:00Z",
    chat_messages: [
      { uuid: "m045", sender: "human", text: "Help me set up a CI/CD pipeline with GitHub Actions. I need it to run tests, build a Docker image, and deploy to AWS ECS on merge to main.", created_at: "2025-12-18T14:00:00Z" },
      { uuid: "m046", sender: "assistant", text: "Here is a GitHub Actions workflow with three jobs: test (runs pytest), build (creates Docker image and pushes to ECR), and deploy (updates ECS service). Includes caching and conditional deployment.", created_at: "2025-12-18T14:10:00Z" },
      { uuid: "m047", sender: "human", text: "Can you also add a staging environment that deploys on PRs?", created_at: "2025-12-18T14:30:00Z" },
      { uuid: "m048", sender: "assistant", text: "Added a preview environment workflow that deploys to a staging ECS cluster on PR open, and tears it down on PR close. Includes a comment bot that posts the staging URL.", created_at: "2025-12-18T14:40:00Z" },
    ],
  },
  {
    uuid: "sample-011",
    name: "Compare project management tools",
    created_at: "2025-12-20T09:00:00Z",
    updated_at: "2025-12-20T09:30:00Z",
    chat_messages: [
      { uuid: "m049", sender: "human", text: "Compare Linear, Jira, and Asana for a 20-person engineering team. We value speed, keyboard shortcuts, and GitHub integration.", created_at: "2025-12-20T09:00:00Z" },
      { uuid: "m050", sender: "assistant", text: "Detailed comparison across UX speed, keyboard navigation, GitHub integration depth, pricing, and team size fit. Linear wins on speed and developer experience, Jira on enterprise features, Asana on cross-functional visibility.", created_at: "2025-12-20T09:10:00Z" },
    ],
  },
  {
    uuid: "sample-012",
    name: "Create data visualization dashboard",
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-01-05T11:30:00Z",
    chat_messages: [
      { uuid: "m051", sender: "human", text: "Help me build a dashboard with D3.js that shows user engagement metrics: daily active users, session duration, and feature usage heatmap.", created_at: "2026-01-05T10:00:00Z" },
      { uuid: "m052", sender: "assistant", text: "Here is the D3 code for three chart components: a line chart for DAU trends, a bar chart for session durations, and a heatmap matrix for feature usage across user segments.", created_at: "2026-01-05T10:15:00Z" },
      { uuid: "m053", sender: "human", text: "Add interactivity: tooltips on hover, click to filter, and a date range picker.", created_at: "2026-01-05T10:45:00Z" },
      { uuid: "m054", sender: "assistant", text: "Added D3 tooltips with formatted data, cross-chart filtering on click events, and a brush-based date range selector that updates all three charts simultaneously.", created_at: "2026-01-05T11:00:00Z" },
    ],
  },
  {
    uuid: "sample-013",
    name: "Draft investor update email",
    created_at: "2026-01-08T15:00:00Z",
    updated_at: "2026-01-08T15:30:00Z",
    chat_messages: [
      { uuid: "m055", sender: "human", text: "Help me draft a monthly investor update. Key highlights: hit 10K users, closed Series A, hired VP Engineering. Challenges: churn rate higher than expected.", created_at: "2026-01-08T15:00:00Z" },
      { uuid: "m056", sender: "assistant", text: "Here is a concise investor update with highlights, key metrics, challenges and mitigations, and asks for the investor network. Professional tone with clear data points.", created_at: "2026-01-08T15:10:00Z" },
    ],
  },
  {
    uuid: "sample-014",
    name: "Fix CSS grid layout on mobile",
    created_at: "2026-01-10T11:00:00Z",
    updated_at: "2026-01-10T11:30:00Z",
    chat_messages: [
      { uuid: "m057", sender: "human", text: "My CSS grid layout breaks on mobile. The cards overflow horizontally instead of stacking. Here is my current CSS.", created_at: "2026-01-10T11:00:00Z" },
      { uuid: "m058", sender: "assistant", text: "The issue is that your grid-template-columns uses fixed widths. Switch to repeat(auto-fit, minmax(280px, 1fr)) and the cards will automatically stack on narrow screens. Also add overflow-x: hidden on the container.", created_at: "2026-01-10T11:05:00Z" },
      { uuid: "m059", sender: "human", text: "Now the spacing is off on tablet sizes. Can you review the responsive breakpoints?", created_at: "2026-01-10T11:15:00Z" },
      { uuid: "m060", sender: "assistant", text: "Added a media query at 768px to adjust gap and padding. Also added container queries so the card layout responds to its container width rather than just the viewport.", created_at: "2026-01-10T11:20:00Z" },
    ],
  },
  {
    uuid: "sample-015",
    name: "Research competitive landscape for fintech product",
    created_at: "2026-01-12T09:00:00Z",
    updated_at: "2026-01-12T10:00:00Z",
    chat_messages: [
      { uuid: "m061", sender: "human", text: "Help me research competitors in the expense management space. I need a comparison of Brex, Ramp, and Divvy focusing on features, pricing, and market positioning.", created_at: "2026-01-12T09:00:00Z" },
      { uuid: "m062", sender: "assistant", text: "Competitive analysis covering core features, pricing models, integration ecosystems, target segments, and differentiation strategies for each platform.", created_at: "2026-01-12T09:15:00Z" },
      { uuid: "m063", sender: "human", text: "Now help me identify gaps we could exploit with our product.", created_at: "2026-01-12T09:30:00Z" },
      { uuid: "m064", sender: "assistant", text: "Identified three underserved segments and four feature gaps in the current market. Recommended positioning and a feature priority matrix based on competitive whitespace.", created_at: "2026-01-12T09:45:00Z" },
    ],
  },
  {
    uuid: "sample-016",
    name: "Brainstorm names for new product",
    created_at: "2026-01-15T14:00:00Z",
    updated_at: "2026-01-15T14:30:00Z",
    chat_messages: [
      { uuid: "m065", sender: "human", text: "Brainstorm 20 name ideas for a developer productivity tool that focuses on automation and workflow optimization.", created_at: "2026-01-15T14:00:00Z" },
      { uuid: "m066", sender: "assistant", text: "Here are 20 name suggestions organized by theme: efficiency-focused, automation-themed, developer-culture, and abstract/brandable. Each includes a brief rationale and domain availability notes.", created_at: "2026-01-15T14:10:00Z" },
      { uuid: "m067", sender: "human", text: "I like the automation theme. Can you generate 10 more variations in that direction?", created_at: "2026-01-15T14:15:00Z" },
      { uuid: "m068", sender: "assistant", text: "10 more automation-themed names with compound words, portmanteaus, and abstract derivatives. Also checked that each is not already in use as a major product.", created_at: "2026-01-15T14:20:00Z" },
    ],
  },
];
