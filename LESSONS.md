# AI PM Technical Fluency - Session Plans

**Last updated:** February 4, 2026

See [MY_PRODUCT.md](MY_PRODUCT.md) for how concepts apply to your product.

---

## Teaching Philosophy

**For non-dev PMs who want to learn:**
1. **Start with WHY** — Explain the problem before the solution
2. **Visual first** — Diagrams, Console experiments, real examples
3. **Your product** — Every concept ties to YOUR product (see MY_PRODUCT.md)
4. **Console over code** — Use Anthropic Workbench whenever possible
5. **Simple Python only if needed** — 10 lines max, explain each line, YOU run it
6. **Check understanding** — Pause and confirm before moving on

---

## Current AI Landscape (as of Jan 2026)

### Latest Models
| Model | Released | Best For | Price (in/out per MTok) |
|-------|----------|----------|------------------------|
| **Claude Opus 4.5** | Nov 2025 | Most capable, widely used (recommended) | $5 / $25 |
| **Claude Sonnet 4.5** | Sep 2025 | Good balance of speed/cost | $3 / $15 |
| **Claude Haiku 4.5** | Oct 2025 | Speed, simple tasks, routing | $1 / $5 |

### Key New Features (2025-2026)
- **Extended Thinking** — Claude shows step-by-step reasoning before answering
- **1M token context** — Sonnet 4.5 supports 1 million tokens (beta)
- **Interleaved thinking + tools** — Claude can think between tool calls
- **MCP (Model Context Protocol)** — Standard for connecting AI to tools

---

## Phase 1: Foundations (Sessions 1-6)

### Session 1: LLM Architecture & API Fundamentals ✓
**Concept:** How LLMs work, tokens, parameters
**Exercises:**
- Temperature slider (0 vs 1)
- System prompts (surfer bro vs formal)
- Token counting
- Hallucination demo (no grounding vs grounded)
**Key Tradeoff:** Creativity vs consistency (temperature)

### Session 2: Prompt Engineering Patterns ✓
**Concept:** Few-shot, chain-of-thought, structured output
**Exercises:**
- Few-shot: show example headlines → get similar style
- Chain-of-thought: reason through audience/pain/benefit
- Structured output: get JSON { headline, subheadline, cta }
- Combine all three
**Key Tradeoff:** Quality vs cost (chain-of-thought uses more tokens)

### Session 3: Embeddings & Semantic Similarity ✓
**Concept:** Text → numbers, meaning positions, similarity
**Exercises:**
- TensorFlow Embedding Projector (king → queen visualization)
- Chat API vs Embedding API comparison
- Conceptual: how headline search would work
**Key Tradeoff:** Generate new vs find existing

### Session 4: Vector Databases Deep Dive ✓
**Concept:** Storing and searching embeddings at scale
**Before exercises, teach:**
- Record structure: id + values (embedding) + metadata
- Show example: `{ "id": "h1", "values": [0.9, 0.8, ...], "metadata": { "text": "Save 50%..." } }`
- Key insight: "The numbers are for searching, the metadata is what you get back"
- Similarity scores: "Cosine similarity ranges from 0 to 1. Higher = more similar."
**Exercises:**
- Explore Pinecone console (free tier)
- Create index, understand configuration
- Simple Python script to add/search data (explain each line, student runs it)
**Key Tradeoff:** Speed vs accuracy (approximate vs exact search)

### Session 5: Document Processing & Chunking
**Concept:** Breaking documents into pieces for embedding

**Start with WHY (no code):**
- Show a full landing page as a wall of text (500+ words)
- Ask: "Can you embed this whole thing?" → No, embedding models have limits (~8K tokens)
- Even if you could, searching a giant blob returns... the giant blob. Not helpful.
- So we need to break it into meaningful chunks

**Visual exercise (no code):**
- Take a real example from your product (or mock one up)
- Print it out / look at it together
- Ask: "Where would YOU cut this into pieces?"
- Natural breaks: headline, hero section, features list, testimonials, CTA
- Discuss: What makes a good chunk?

**Console experiment:**
- Paste a SMALL chunk (just headline + subheadline) → ask Claude: "What is this page about?"
- Paste a LARGE chunk (entire page) → ask same question
- Paste a MEDIUM chunk (one section) → ask same question
- Observe: Which answer is most useful? Why?

**The tradeoff visual:**
```
SMALL CHUNKS (50 words):
✓ Precise matches
✗ Loses context — "50% off" but off WHAT?

LARGE CHUNKS (500 words):
✓ Full context
✗ Matches too broadly — searching "discount" returns whole page

OVERLAP (chunks share 10-20%):
✓ Preserves context across cuts
✗ Stores more data, costs more
```

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- A marketer searches "testimonial about fast delivery"
- Which chunking strategy finds the right section?
- Discuss: For landing pages, what's the right chunk size?

**Key Tradeoff:** Chunk size — small = precise but no context, large = context but noisy

**Python (only if time, 10 lines max):**
- Simple script that splits text by paragraphs
- Student runs it themselves
- Show the output chunks

### Session 6: Building Your First RAG Pipeline
**Concept:** Retrieval Augmented Generation — the full loop

**Start with WHY:**
- You've learned: embeddings (Session 3), vector DB (Session 4), chunking (Session 5)
- Now we connect them: user asks question → find relevant chunks → Claude answers using those chunks
- This is how you stop hallucination — Claude only uses YOUR data

**Visual: The RAG Flow**
```
USER: "Show me landing pages about free trials"
         ↓
    [1. EMBED THE QUERY]
         ↓
    "free trials" → [0.2, 0.8, 0.1, ...]
         ↓
    [2. SEARCH VECTOR DB]
         ↓
    Find chunks with similar embeddings
         ↓
    [3. RETRIEVE TOP MATCHES]
         ↓
    "Start your free trial today..."
    "No credit card required..."
    "Try it free for 14 days..."
         ↓
    [4. INJECT INTO PROMPT]
         ↓
    "Using ONLY this context: {chunks}
     Answer the user's question: {query}"
         ↓
    [5. GENERATE RESPONSE]
         ↓
    Claude writes answer using only retrieved content
```

**Console experiment:**
- First: Ask Claude about your product (no context) → watch it hallucinate or say "I don't know"
- Then: Paste 3 real landing page chunks as context → ask same question → accurate answer
- This IS RAG, done manually

**Failure modes discussion:**
| Problem | What happens | Fix |
|---------|--------------|-----|
| Bad chunks | Retrieved content doesn't answer question | Better chunking strategy |
| Wrong matches | Semantic search returns irrelevant content | Better embeddings, metadata filters |
| Too few results | Not enough context for good answer | Increase top_k |
| Too many results | Claude gets confused by contradictions | Reranking (Session 10) |

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Walk through: "Generate a landing page for a summer sale"
- Where would RAG help? (Find similar past pages, retrieve brand guidelines, get approved CTAs)

**Key Tradeoff:** Retrieval quality vs generation quality — garbage in, garbage out

---

## Phase 2: Agentic AI (Sessions 7-13)

### Session 7: Function Calling & Tool Use
**Concept:** Claude can call functions — not just generate text

**Start with WHY:**
- So far Claude just writes text
- But what if you want Claude to: check inventory? send an email? look up a customer?
- You define TOOLS (functions), Claude decides when to use them

**Visual: How tools work**
```
YOU DEFINE:
  Tool: "check_inventory"
  Input: product_id
  Output: stock count

USER ASKS:
  "Is the blue widget in stock?"

CLAUDE THINKS:
  "I need to check inventory for blue widget"

CLAUDE CALLS:
  check_inventory(product_id="blue-widget")

SYSTEM RETURNS:
  { "stock": 42 }

CLAUDE RESPONDS:
  "Yes, we have 42 blue widgets in stock."
```

**Console experiment (Anthropic Workbench has tool use):**
- Define a simple tool (character counter, word counter)
- Ask Claude something that requires the tool
- Watch Claude decide to use it
- See the tool call in the response

**The autonomy question:**
- Should Claude ALWAYS use the tool? Or DECIDE when to use it?
- Demo both modes in Console

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Tool ideas: `get_brand_colors`, `check_compliance`, `fetch_template`, `get_approved_images`
- When should Claude auto-use vs ask permission?

**Key Tradeoff:** Autonomy vs control — let Claude decide vs force tool use

### Session 8: ReAct Agents & Extended Thinking
**Concept:** Agents that reason, act, observe, repeat — plus Claude's built-in thinking

**Start with WHY:**
- Simple tool use: one question → one tool → one answer
- But complex tasks need: think → try something → see result → think again → try something else
- This is the ReAct pattern (Reason + Act)

**Visual: ReAct Loop**
```
USER: "Find me a high-converting landing page template for SaaS"

THOUGHT: I should search for SaaS templates first
ACTION: search_templates(category="SaaS")
OBSERVATION: Found 12 templates

THOUGHT: Now I need to filter by conversion rate
ACTION: filter_by_performance(metric="conversion", min=0.05)
OBSERVATION: 3 templates have >5% conversion

THOUGHT: Let me get details on the top one
ACTION: get_template_details(id="saas-starter-pro")
OBSERVATION: {name, conversion_rate, sections, ...}

ANSWER: "I found 'SaaS Starter Pro' — it has 7.2% conversion rate and includes..."
```

**Extended Thinking (2026 feature):**
- Claude can now SHOW its thinking before answering
- You set a "thinking budget" (tokens for reasoning)
- More thinking = better answers, but costs more

**Console experiment:**
- Enable Extended Thinking in Workbench (if available)
- Ask a complex question
- See Claude's `<thinking>` block before the answer
- Compare: same question with/without extended thinking

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Agent that helps marketers: "Build me a landing page for our Q2 campaign"
- What tools would it need? What's the ReAct loop?

**Key Tradeoff:** Thoroughness vs cost/latency — more thinking = better but slower/pricier

### Session 9: Memory Systems for Stateful Agents
**Concept:** How agents remember things

**Start with WHY:**
- Chat conversations have memory within a session (Claude remembers what you said)
- But what about across sessions? What about user preferences?
- AI products need different types of memory

**Visual: Memory Types**
```
SHORT-TERM (conversation):
  "You mentioned you prefer blue earlier..."
  → Just keep chat history in context

LONG-TERM (user profile):
  "This user always uses formal tone"
  → Store in database, inject into system prompt

EPISODIC (past interactions):
  "Last month you created a landing page for Product X"
  → Store summaries, retrieve when relevant
```

**Console experiment:**
- Start a conversation, establish preferences
- Clear the conversation
- Start new conversation — preferences are gone
- Discuss: How would you persist them?

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Marketer uses AI Page Creation weekly
- What should the agent remember? Brand voice, past pages, favorite templates?
- How does this change the experience?

**Key Tradeoff:** Relevance vs recency — old memories might be outdated

### Session 10: Advanced RAG Patterns
**Concept:** Making retrieval smarter

**Start with WHY:**
- Basic RAG: embed query → find similar → done
- But what if the user's query is vague? Or results aren't quite right?
- Advanced patterns improve retrieval quality

**Pattern 1: Hybrid Search**
```
SEMANTIC: "fast shipping" → finds "quick delivery", "express fulfillment"
KEYWORD: "fast shipping" → finds exact phrase matches

HYBRID: Combine both scores → best of both worlds
```

**Pattern 2: Query Transformation**
```
USER: "pages that convert well"

TRANSFORM TO:
- "high conversion rate landing pages"
- "landing pages with good performance metrics"
- "successful landing page examples"

Search with ALL variations → more comprehensive results
```

**Pattern 3: Reranking**
```
STEP 1: Retrieve top 20 results (fast, approximate)
STEP 2: Use Claude to rerank by relevance (slow, accurate)
STEP 3: Return top 5 reranked results
```

**Console experiment:**
- Give Claude 10 search results, ask it to rank by relevance to a query
- See how it reorders them
- This IS reranking

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Marketer searches "holiday email" — vague query
- Which pattern helps most?

**Key Tradeoff:** Complexity vs accuracy improvement — is 5% better retrieval worth 2x complexity?

### Session 11: Corrective & Autonomous RAG
**Concept:** RAG that checks and fixes itself

**Start with WHY:**
- Basic RAG retrieves and generates
- But what if retrieved content is wrong? Or the answer doesn't actually use it?
- Self-correcting RAG validates its own work

**Pattern: Corrective RAG**
```
1. Retrieve chunks
2. Check: "Are these chunks relevant to the question?"
   - If NO → try different search, broader query
3. Generate answer
4. Check: "Does the answer use the retrieved content?"
   - If NO → regenerate with explicit instruction
5. Check: "Is the answer factually consistent with chunks?"
   - If NO → flag for human review
```

**Console experiment:**
- Give Claude chunks + question
- Ask it to: (a) answer, then (b) grade whether its answer used the chunks faithfully
- See self-evaluation in action

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- AI generates a landing page
- How would you check: Did it follow brand guidelines? Did it use approved copy only?

**Key Tradeoff:** Quality vs latency — more checks = better quality but slower

### Session 12: When RAG Fails — Agentic Search Alternatives
**Concept:** Real-world cases where RAG underperforms, and how agentic search wins

**Start with WHY:**
- You've learned RAG is powerful — but it's not always the answer
- Anthropic abandoned RAG for Claude Code because it underperformed
- Sometimes simpler approaches work better

**RAG's Hidden Costs:**
```
STALENESS:
  Code changes → Index is outdated → Wrong results
  How often do you re-index? Real-time? Hourly? Daily?

RELIABILITY:
  Embedding quality varies
  "Semantic similarity" doesn't always mean "relevant"

SECURITY:
  Indexed data = stored data = attack surface
  Anthropic deemed their own codebase too sensitive to index
```

**Visual: RAG vs Agentic Search**
```
RAG APPROACH:
  1. Pre-index all content → Vector DB
  2. User query → Embed → Search index → Return chunks

  Problems: Stale, requires infrastructure, security risk

AGENTIC SEARCH APPROACH:
  1. User query → Agent thinks: "What do I need?"
  2. Agent uses tools: grep, glob, file read
  3. Agent iterates: search → read → search more → synthesize

  Benefits: Always fresh, simple tools, no index to secure
```

**Case Study: Claude Code**
- Early versions used standard RAG for codebase search
- Boris Cherny (Anthropic engineer) shared why they abandoned it:
  - Staleness: Code changes faster than indexes update
  - Reliability: Retrieval quality was inconsistent
  - Security: Even internal indexing was a liability
  - "Vibes": It just didn't feel as helpful
- Agentic search (grep + glob + iterate) outperformed RAG "by a lot"
- Result: 70% per-engineer productivity growth

**The "Vibes" Metric:**
- Benchmarks can lie — a system can score well but feel wrong
- Real test: Does it help you accomplish your goal?
- Sometimes simpler = better user experience

**Console experiment:**
- Scenario: Find all mentions of "pricing" in a codebase
- RAG approach: Embed "pricing" → search → get chunks
- Agentic approach: grep "pricing" → read files → refine search
- Compare: Which gives you better, more actionable results?

**Decision Heuristic: When to Index vs Search Dynamically**
```
USE RAG WHEN:
  - Massive corpus (millions of documents)
  - Sub-second latency required
  - Content is relatively static
  - Security/privacy isn't critical

USE AGENTIC SEARCH WHEN:
  - Content changes frequently
  - Security is paramount
  - "Good enough" retrieval is fine
  - You want simplicity over infrastructure
```

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Template library: RAG might make sense (static, needs speed)
- Brand guidelines doc: Agentic search? (changes, security matters)
- Customer's uploaded assets: Which approach?

**Key Tradeoff:** Infrastructure complexity vs model capability — as models improve, simpler often wins

---

### Session 13: Voice & Multimodal Agents
**Concept:** Beyond text — images, audio, video

**Start with WHY:**
- Claude can SEE images (vision)
- This unlocks: analyze screenshots, review designs, understand charts
- For landing pages: "Look at this page and tell me what's wrong"

**Console experiment:**
- Upload a landing page screenshot to Claude
- Ask: "What's the headline? What's the CTA? What could be improved?"
- Claude describes what it SEES

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Marketer uploads competitor's landing page: "Make me something like this"
- Claude analyzes: layout, colors, sections, copy patterns
- Generates similar output using your product's components

**Voice concepts (discussion):**
- Voice → text → Claude → text → voice
- Real-time voice agents
- When does voice make sense for your product?

**Key Tradeoff:** Modality richness vs complexity — vision is powerful but harder to debug

---

## Phase 3: Multi-Agent Systems (Sessions 14-19)

### Session 14: Multi-Agent Architecture Patterns
**Concept:** When one agent isn't enough

**Start with WHY:**
- Single agent handles simple tasks
- Complex tasks need specialists: one researches, one writes, one reviews
- Like a team, not a solo worker

**Visual: Single vs Multi-Agent**
```
SINGLE AGENT:
User → Agent → Response
(Agent does everything)

MULTI-AGENT:
User → Orchestrator → [Research Agent] → [Writing Agent] → [Review Agent] → Response
(Specialists collaborate)
```

**Patterns:**
| Pattern | How it works | Best for |
|---------|--------------|----------|
| Sequential | A → B → C | Pipelines (research → write → edit) |
| Parallel | A, B, C simultaneously | Independent subtasks |
| Hierarchical | Boss agent delegates to workers | Complex projects |

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- "Build a landing page for summer sale"
- Agent 1: Research past summer campaigns
- Agent 2: Generate copy options
- Agent 3: Assemble layout
- Agent 4: Review for compliance
- Is this overkill? When is multi-agent worth it?

**Key Tradeoff:** Specialization vs coordination overhead

### Session 15: CrewAI for Role-Based Teams
**Concept:** Agents with personas — roles, goals, backstories

**Start with WHY:**
- Generic agents are good
- But agents with ROLES perform better: "You are a senior copywriter..."
- CrewAI makes this pattern easy

**Visual: CrewAI Crew**
```
CREW: Landing Page Team

AGENT: Research Analyst
  Role: Find relevant data and examples
  Goal: Provide comprehensive research
  Backstory: "10 years in market research..."

AGENT: Copywriter
  Role: Write compelling copy
  Goal: Maximize conversions
  Backstory: "Award-winning direct response writer..."

AGENT: Editor
  Role: Review and polish
  Goal: Ensure quality and brand consistency
  Backstory: "Former brand manager at Fortune 500..."

TASK FLOW: Analyst → Copywriter → Editor → Final output
```

**Conceptual exercise:**
- Define roles for your product's AI crew
- What's each agent's goal? Backstory?
- How do they hand off work?

**Key Tradeoff:** Role clarity vs flexibility — strict roles can limit creativity

### Session 16: LangGraph for Complex Workflows
**Concept:** Workflows as graphs — with branches and loops

**Start with WHY:**
- Linear workflows: A → B → C
- But real work has: "If X then do Y, else do Z", loops, human approval steps
- Graphs let you model this complexity

**Visual: Graph Workflow**
```
        [Start]
           ↓
      [Generate Draft]
           ↓
      [Review Quality]
         /    \
    [PASS]    [FAIL]
       ↓         ↓
   [Publish]  [Revise] ──→ [Review Quality] (loop)
```

**Key concepts:**
- **Nodes:** Steps in the workflow (generate, review, publish)
- **Edges:** Connections between steps
- **Conditional edges:** If/then branching
- **Human-in-the-loop:** Pause for approval

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Landing page creation workflow
- Where do you need human approval?
- Where can you loop (revise until approved)?

**Key Tradeoff:** Expressiveness vs debuggability — complex graphs are hard to troubleshoot

### Session 17: OpenAI Agents SDK Deep Dive
**Concept:** How OpenAI approaches agents — compare to Anthropic

**Start with WHY:**
- Different vendors, different philosophies
- Understanding both helps you choose — and avoid lock-in
- OpenAI SDK vs direct Claude API — tradeoffs

**Compare:**
| Aspect | OpenAI Agents SDK | Claude API + tools |
|--------|-------------------|-------------------|
| Abstraction | High (SDK handles orchestration) | Low (you build it) |
| Flexibility | Constrained to their patterns | Build anything |
| Lock-in | High (their SDK, their models) | Lower (swap models easier) |

**Discussion:**
- When does an SDK help vs constrain you?
- For your product: build custom or use a framework?

**Key Tradeoff:** Ecosystem lock-in vs specialized features

### Session 18: Google ADK for Enterprise Agents
**Concept:** Enterprise requirements — compliance, scale, integration

**Start with WHY:**
- Startups can move fast and break things
- Enterprises need: audit logs, data residency, SSO, compliance
- Google ADK designed for this

**Enterprise requirements checklist:**
- [ ] Data stays in region (GDPR, etc.)
- [ ] Audit logs for all AI decisions
- [ ] Role-based access control
- [ ] Integration with existing identity systems
- [ ] SLAs and support

**Discussion:**
- Which of these matter for your enterprise clients?
- How do you evaluate vendors on enterprise readiness?

**Key Tradeoff:** Enterprise features vs agility — compliance slows things down

### Session 19: MCP & Standardized Tool Calling
**Concept:** Model Context Protocol — universal standard for AI tools

**Start with WHY:**
- Every AI system invents its own tool format
- MCP: one standard for connecting AI to tools
- Like USB for AI — plug and play

**Visual: MCP Architecture**
```
[Claude Desktop] ←→ [MCP Server: File System]
                 ←→ [MCP Server: Database]
                 ←→ [MCP Server: Your API]

One protocol, many connections
```

**Demo (if Claude Desktop available):**
- Show MCP servers in Claude Desktop
- Connect to a file system MCP
- Watch Claude read/write files

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- MCP server that exposes: templates, brand assets, compliance rules
- Any AI tool (Claude, GPT, etc.) can connect
- Build once, use everywhere

**Key Tradeoff:** Standardization vs innovation speed — standards slow early adoption

---

## Phase 4: Production (Sessions 20-25)

### Session 20: Evaluation Frameworks That Matter
**Concept:** How to know if your AI actually works

**Start with WHY:**
- You shipped an AI feature — is it good?
- "Feels good" isn't enough — you need metrics
- But AI is hard to evaluate — outputs vary

**Evaluation types:**
| Type | How it works | Pros | Cons |
|------|--------------|------|------|
| Human eval | People rate outputs | Gold standard | Expensive, slow |
| Automated | Model grades model | Fast, cheap | Can miss nuances |
| A/B testing | Compare versions | Real user signal | Needs traffic |

**Key metrics for AI features:**
- Task completion rate (did it work?)
- User satisfaction (did they like it?)
- Accuracy (was it correct?)
- Latency (was it fast enough?)

**Console experiment:**
- Generate 5 landing page headlines
- Grade them yourself (1-5)
- Ask Claude to grade them (1-5)
- Compare: Do you agree?

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- How do you measure if AI Page Creation is "good"?
- What's the bar for shipping?

**Key Tradeoff:** Evaluation cost vs confidence — more testing = more confidence but slower shipping

### Session 21: Safety, Guardrails & Responsible AI
**Concept:** Preventing AI from doing harm

**Start with WHY:**
- AI can generate bad stuff: false claims, offensive content, legal risks
- Your job as PM: define guardrails before shipping
- Balance: too strict = useless, too loose = dangerous

**Guardrail types:**
```
INPUT GUARDRAILS:
  Block: "Write me malware"
  Allow: "Write me a landing page"

OUTPUT GUARDRAILS:
  Block: Medical claims, price guarantees, fake testimonials
  Allow: Marketing copy, product descriptions

TOPIC GUARDRAILS:
  Block: Politics, competitors, legal advice
  Allow: Your product, general marketing
```

**Console experiment:**
- Try to get Claude to write something inappropriate for a landing page
- See how Claude refuses
- Discuss: What guardrails does your product need?

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- AI can't promise "100% guaranteed results"
- AI can't use competitor names
- AI must follow FTC guidelines for testimonials
- How do you enforce these?

**Key Tradeoff:** Safety vs utility — over-filtering kills usefulness

### Session 22: RLHF & Alignment Deep Dive
**Concept:** How Claude became helpful and safe

**Start with WHY:**
- Raw language models are chaotic — just predict next word
- RLHF (Reinforcement Learning from Human Feedback) trains them to be helpful
- Understanding this helps you understand Claude's behavior

**Visual: RLHF Process**
```
1. PRE-TRAINING: Read the internet, learn language
2. FINE-TUNING: Train on helpful examples
3. RLHF:
   - Generate responses
   - Humans rank: "This response is better than that one"
   - Model learns from rankings
4. CONSTITUTIONAL AI (Anthropic):
   - Model self-corrects based on principles
   - "Would this response be harmful?"
```

**Discussion:**
- Why does Claude refuse some requests?
- Why does Claude ask clarifying questions?
- How does this affect your product design?

**Key Tradeoff:** Helpfulness vs harmlessness — can't maximize both

### Session 23: System Design for AI Products
**Concept:** Architecture that works at scale

**Start with WHY:**
- Prototype works on your laptop
- Production needs: multiple users, reliability, cost control
- Architecture decisions now affect you later

**Visual: AI Product Architecture**
```
USER → [Your App] → [API Gateway] → [Claude API]
                         ↓
                  [Vector DB (Pinecone)]
                         ↓
                  [Your Database]
                         ↓
                  [Caching Layer]
```

**Key decisions:**
| Decision | Options | Tradeoff |
|----------|---------|----------|
| Sync vs async | Wait for response vs background job | UX vs complexity |
| Caching | Cache responses vs always fresh | Cost vs accuracy |
| Fallbacks | What happens when Claude is down? | Reliability vs cost |

**Draw together:**
- Your product's AI feature architecture
- Where's the vector DB? Where's Claude? Where's caching?
- What's the critical path?

**Key Tradeoff:** Latency vs accuracy vs cost — pick two

### Session 24: Fine-tuning vs RAG vs Agentic Search Decision Framework
**Concept:** When to fine-tune, when to RAG, when to search dynamically, when to prompt engineer

**Start with WHY:**
- You now know FOUR approaches to giving Claude knowledge:
  1. Prompt engineering: Just tell Claude what you want
  2. Agentic search: Let Claude dynamically search with tools
  3. RAG: Pre-index content, retrieve at query time
  4. Fine-tuning: Train Claude on your data permanently
- Each has different strengths — choosing wrong = wasted effort

**The Four Options Spectrum:**
```
SIMPLEST ←————————————————————————————————→ MOST COMPLEX

Prompt Engineering → Agentic Search → RAG → Fine-tuning
     ↓                    ↓            ↓         ↓
  "Just ask"         "Search live"  "Index it"  "Train it"
```

**Decision Framework:**
```
START HERE: Can you just prompt it?
  YES → Use prompt engineering (few-shot, system prompts)
  NO → Continue...

Is the content SENSITIVE or SECURITY-CRITICAL?
  YES → Agentic search (no index to secure)
  NO → Continue...

How DYNAMIC is the content?
  Changes hourly/daily → Agentic search
  Changes weekly/monthly → RAG with re-indexing
  Rarely changes → RAG or fine-tuning

How LARGE is the corpus?
  Small (<100 docs) → Agentic search
  Medium (100-10K docs) → RAG
  Massive (>10K docs) → RAG with good chunking

Latency requirements?
  Sub-second required → RAG (pre-indexed)
  2-5 seconds OK → Agentic search

Is it STYLE or KNOWLEDGE?
  Style (write like us) → Fine-tuning or few-shot
  Knowledge (facts about products) → RAG or agentic
```

**When Agentic Search Beats RAG:**
| Scenario | Why Agentic Wins |
|----------|------------------|
| Codebase search | Code changes constantly, security matters |
| Internal docs | Freshness > speed |
| Exploratory queries | Need to iterate and refine |
| Small corpus | Index overhead not worth it |

**When RAG Still Wins:**
| Scenario | Why RAG Wins |
|----------|--------------|
| Customer support KB | Massive, needs instant answers |
| Product catalog | Structured, changes predictably |
| Legal/compliance docs | Needs audit trail of what was retrieved |

**Hybrid Strategies:**
```
STABLE + DYNAMIC DATA:
  RAG for: Product specs, pricing (changes weekly)
  Agentic for: Inventory, real-time data

TIERED RETRIEVAL:
  1. Fast RAG search (80% of queries)
  2. Fall back to agentic search (complex queries)
```

**Apply to Your Product:** *(see MY_PRODUCT.md)*
- Brand guidelines: Prompt engineering + few-shot? (small, stable)
- Template library: RAG (large, structured, needs speed)
- Customer's uploaded assets: Agentic? (varies per customer, security)
- Compliance rules: Prompt + RAG hybrid?

**Cost/Benefit Analysis Exercise:**
| Approach | Setup Cost | Maintenance | Query Cost | Latency |
|----------|------------|-------------|------------|---------|
| Prompt | Low | Low | Medium | Fast |
| Agentic | Low | Low | High (more tokens) | Medium |
| RAG | High | Medium | Low | Fast |
| Fine-tune | Very High | High | Low | Fast |

**Key Tradeoff:** Customization vs maintenance vs simplicity — there's no universal best answer

### Session 25: Capstone Integration
**Concept:** Put it all together — design the full feature

**You've learned:**
- Phase 1: How AI works (LLMs, embeddings, vector DBs, RAG)
- Phase 2: Agents (tools, memory, self-correction, agentic search, multimodal)
- Phase 3: Multi-agent (teams, workflows, standards)
- Phase 4: Production (eval, safety, scale, decisions)

**Capstone exercise:**
- Design the full AI feature for your product (see MY_PRODUCT.md)
- Draw the architecture
- List the components (RAG? Agents? What tools?)
- Define the evaluation metrics
- Identify build vs buy decisions
- Write a 1-page spec

**Deliverable:** Product spec for AI Page Creation

**Quiz:** Comprehensive review of all concepts

---

## Session Checklist Template

Each session should include:
- [ ] Start with WHY (no code, explain the problem)
- [ ] Visual or analogy to anchor the concept
- [ ] Hands-on exercise (Console preferred, simple Python if needed)
- [ ] Apply to your product (see MY_PRODUCT.md)
- [ ] Discuss key tradeoff
- [ ] Check understanding before moving on
- [ ] 8-question quiz
- [ ] Update progress
