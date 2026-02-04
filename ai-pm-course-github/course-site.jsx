import React, { useState, useEffect } from 'react';
import { BookOpen, Terminal, Brain, Zap, CheckCircle, ChevronRight, ChevronDown, Github, ExternalLink, Cpu, Database, Bot, Shield, Layers, ArrowLeft, X, Menu } from 'lucide-react';

const phases = [
  {
    id: 1,
    name: "Foundations",
    color: "purple",
    sessions: [
      {
        id: 1,
        title: "LLM Architecture & API Fundamentals",
        desc: "How LLMs work, tokens, parameters",
        duration: "1 hour",
        copyAssistant: "Basic headline generation",
        keyTradeoff: "Creativity vs consistency (temperature)",
        topics: [
          "What LLMs actually do (next-token prediction)",
          "Tokens: the atomic unit of LLM processing",
          "Temperature and sampling parameters",
          "Context windows and their tradeoffs",
          "The API mental model: inputs, outputs, costs",
          "Model families: Claude Opus 4.5, Sonnet 4.5, Haiku 4.5"
        ],
        exercises: [
          "Temperature slider (0 vs 1) — see deterministic vs varied outputs",
          "System prompts (surfer bro vs formal) — see personality switching",
          "Token counting — understand costs",
          "Hallucination demo (no grounding vs grounded)"
        ],
        outcome: "Confidently make API calls, understand pricing, and explain temperature/tokens to stakeholders."
      },
      {
        id: 2,
        title: "Prompt Engineering Patterns",
        desc: "Few-shot, chain-of-thought, structured output",
        duration: "1 hour",
        copyAssistant: "Smarter headline generation with examples and reasoning",
        keyTradeoff: "Quality vs cost (chain-of-thought uses more tokens)",
        topics: [
          "Few-shot learning: teaching by example",
          "Chain-of-thought: forcing step-by-step reasoning",
          "Structured outputs: getting reliable JSON",
          "Combining all three patterns together",
          "2026 Update: Extended Thinking is built into Claude 4.5"
        ],
        exercises: [
          "Few-shot: show example headlines → get similar style",
          "Chain-of-thought: reason through audience/pain/benefit",
          "Structured output: get JSON { headline, subheadline, cta }",
          "Combine all three in one prompt"
        ],
        outcome: "Write prompts that consistently produce high-quality, parseable outputs."
      },
      {
        id: 3,
        title: "Embeddings & Semantic Similarity",
        desc: "Text → numbers, meaning positions, similarity",
        duration: "1 hour",
        copyAssistant: "Find similar headlines that performed well",
        keyTradeoff: "Generate new vs find existing",
        topics: [
          "What embeddings are (text → high-dimensional vectors)",
          "Semantic similarity and meaning positions",
          "Chat API vs Embedding API comparison",
          "Cosine similarity and distance metrics",
          "How headline search would work conceptually"
        ],
        exercises: [
          "TensorFlow Embedding Projector (king → queen visualization)",
          "Chat API vs Embedding API comparison",
          "Conceptual: how headline search would work"
        ],
        outcome: "Understand how machines 'understand' meaning and find related content."
      },
      {
        id: 4,
        title: "Vector Databases Deep Dive",
        desc: "Storing and searching embeddings at scale",
        duration: "1 hour",
        copyAssistant: "Store all historical headlines, search by meaning",
        keyTradeoff: "Speed vs accuracy (approximate vs exact search)",
        topics: [
          "Why embeddings need special databases",
          "Indexing strategies (HNSW, IVF)",
          "Pinecone vs Chroma vs pgvector comparison",
          "Similarity search mechanics",
          "Metadata filtering for refined results"
        ],
        exercises: [
          "Explore Pinecone console (free tier)",
          "See how similarity search works",
          "Understand indexing and metadata filtering"
        ],
        outcome: "Choose and implement the right vector database for your use case."
      },
      {
        id: 5,
        title: "Document Processing & Chunking",
        desc: "Breaking documents into pieces for embedding",
        duration: "1 hour",
        copyAssistant: "Process landing page templates, brand guidelines",
        keyTradeoff: "Chunk size (small = precise but no context, large = context but noisy)",
        topics: [
          "Why chunking matters for RAG",
          "Chunk size tradeoffs (small vs large)",
          "Overlap strategies",
          "Metadata tagging",
          "Handling different document types"
        ],
        exercises: [
          "See how different chunk sizes affect retrieval",
          "Overlap strategies comparison",
          "Metadata tagging best practices"
        ],
        outcome: "Process documents optimally for retrieval-augmented generation."
      },
      {
        id: 6,
        title: "Building Your First RAG Pipeline",
        desc: "Retrieval Augmented Generation end-to-end",
        duration: "1 hour",
        copyAssistant: "Ground suggestions in real brand data + past winners",
        keyTradeoff: "Retrieval quality vs generation quality",
        topics: [
          "The RAG architecture pattern",
          "End-to-end flow: query → embed → search → inject → generate",
          "Connecting embeddings + vector DB + LLM",
          "Failure modes and debugging",
          "When RAG beats fine-tuning"
        ],
        exercises: [
          "Conceptual walkthrough: user query → embed → search → inject → generate",
          "See a RAG demo in action",
          "Understand the failure modes"
        ],
        outcome: "Build a working RAG system that grounds LLM responses in your data."
      },
    ]
  },
  {
    id: 2,
    name: "Agentic AI",
    color: "blue",
    sessions: [
      {
        id: 7,
        title: "Function Calling & Tool Use",
        desc: "LLMs calling external functions/APIs",
        duration: "1 hour",
        copyAssistant: "Check headline length, fetch brand colors, validate CTAs",
        keyTradeoff: "Autonomy vs control (let Claude decide vs force tool use)",
        topics: [
          "Function calling syntax and patterns",
          "Tool definitions and schemas",
          "When Claude decides to use tools",
          "Handling tool responses and errors"
        ],
        exercises: [
          "Anthropic Console: tool use feature",
          "Define a simple tool (e.g., character counter)",
          "See Claude decide when to use tools"
        ],
        outcome: "Create agents that can interact with external systems."
      },
      {
        id: 8,
        title: "ReAct Agents & Extended Thinking",
        desc: "Reason → Act → Observe → Repeat + Claude's built-in thinking",
        duration: "1 hour",
        copyAssistant: "Agent that researches competitor headlines → drafts → refines",
        keyTradeoff: "Thoroughness vs cost/latency (thinking budget affects both)",
        topics: [
          "ReAct pattern: Thought → Action → Observation",
          "Extended Thinking: Claude's built-in reasoning",
          "Interleaved Thinking: Claude thinks between tool calls",
          "Thinking budget and cost implications",
          "Prompting for CoT vs Extended Thinking API"
        ],
        exercises: [
          "See ReAct pattern in action",
          "Enable Claude's built-in reasoning with thinking budget",
          "Compare: prompting for CoT vs Extended Thinking API"
        ],
        outcome: "Implement agents that reason before acting, using Claude's latest capabilities."
      },
      {
        id: 9,
        title: "Memory Systems for Stateful Agents",
        desc: "Short-term, long-term, and episodic memory",
        duration: "1 hour",
        copyAssistant: "Remember user preferences, past feedback, brand voice",
        keyTradeoff: "Relevance vs recency",
        topics: [
          "Memory types: short-term, long-term, episodic",
          "Conversation memory (within session)",
          "Persistent memory (across sessions)",
          "Memory retrieval strategies"
        ],
        exercises: [
          "Implement conversation memory",
          "Add persistent memory across sessions",
          "Memory retrieval strategies"
        ],
        outcome: "Build agents that remember context across sessions."
      },
      {
        id: 10,
        title: "Advanced RAG Patterns",
        desc: "Hybrid search, reranking, query transformation",
        duration: "1 hour",
        copyAssistant: "Smarter retrieval for edge cases",
        keyTradeoff: "Complexity vs accuracy improvement",
        topics: [
          "Hybrid search (keywords + embeddings)",
          "Reranking retrieved results",
          "Query expansion and transformation",
          "Multi-hop retrieval"
        ],
        exercises: [
          "Implement hybrid search",
          "Add reranking to improve results",
          "Query expansion techniques"
        ],
        outcome: "Significantly improve RAG quality with advanced techniques."
      },
      {
        id: 11,
        title: "Corrective & Autonomous RAG",
        desc: "Self-checking, validation, autonomous improvement",
        duration: "1 hour",
        copyAssistant: "Validate suggestions against brand rules",
        keyTradeoff: "Quality vs latency (more checks = slower)",
        topics: [
          "Self-RAG pattern",
          "Corrective RAG (check and retry)",
          "Confidence scoring",
          "Autonomous improvement loops"
        ],
        exercises: [
          "Implement Self-RAG pattern",
          "Add corrective retrieval",
          "Build confidence scoring"
        ],
        outcome: "Create RAG systems that validate and improve their own responses."
      },
      {
        id: 12,
        title: "When RAG Fails — Agentic Search Alternatives",
        desc: "Real-world cases where RAG underperforms, and how agentic search wins",
        duration: "1 hour",
        copyAssistant: "Should we index all brand assets, or let Claude search them dynamically?",
        keyTradeoff: "Infrastructure complexity vs model capability (simpler may be better)",
        topics: [
          "RAG's hidden costs: staleness, drift, index maintenance",
          "Security risks of pre-indexing sensitive data",
          "Agentic search pattern: grep/glob + iterative model reasoning",
          "Case study: Why Anthropic abandoned RAG for Claude Code",
          "The 'vibes' metric — when benchmarks lie",
          "Decision heuristic: When to index vs. when to search dynamically"
        ],
        exercises: [
          "Compare RAG retrieval vs. agentic grep search on same codebase",
          "Measure staleness: change a file, see how long until RAG catches it",
          "Build a simple agentic search loop (query → grep → refine → grep)",
          "Evaluate both approaches on 'vibes' — which feels more helpful?"
        ],
        outcome: "Know when RAG is overkill and how to implement simpler agentic alternatives."
      },
      {
        id: 13,
        title: "Voice & Multimodal Agents",
        desc: "Images, audio, video as inputs",
        duration: "1 hour",
        copyAssistant: "Analyze competitor landing page screenshots",
        keyTradeoff: "Modality richness vs complexity",
        topics: [
          "Image input to Claude (vision capabilities)",
          "Analyzing screenshots and mockups",
          "Voice input concepts",
          "Multimodal prompt design"
        ],
        exercises: [
          "Image input to Claude (analyze a landing page screenshot)",
          "Describe what you see → suggest improvements",
          "Voice input concepts"
        ],
        outcome: "Work with images and audio in your AI systems."
      },
    ]
  },
  {
    id: 3,
    name: "Multi-Agent Systems",
    color: "emerald",
    sessions: [
      {
        id: 14,
        title: "Multi-Agent Architecture Patterns",
        desc: "When and why to use multiple agents",
        duration: "1 hour",
        copyAssistant: "Separate agents for copy, design suggestions, compliance",
        keyTradeoff: "Specialization vs coordination overhead",
        topics: [
          "Single agent vs multi-agent comparison",
          "Orchestration patterns (sequential, parallel, hierarchical)",
          "Communication between agents",
          "When to use multiple agents"
        ],
        exercises: [
          "Compare single vs multi-agent approaches",
          "Design orchestration patterns",
          "Implement agent communication"
        ],
        outcome: "Architect systems with multiple specialized agents."
      },
      {
        id: 15,
        title: "CrewAI for Role-Based Teams",
        desc: "Agents with roles, goals, and backstories",
        duration: "1 hour",
        copyAssistant: '"Creative Director" + "Brand Compliance Officer" + "Conversion Specialist"',
        keyTradeoff: "Role clarity vs flexibility",
        topics: [
          "CrewAI framework overview",
          "Defining agent roles, goals, backstories",
          "How agents collaborate",
          "Task handoffs between agents"
        ],
        exercises: [
          "Define agent roles",
          "See how they collaborate",
          "Observe handoffs"
        ],
        outcome: "Use CrewAI to coordinate agent teams."
      },
      {
        id: 16,
        title: "LangGraph for Complex Workflows",
        desc: "State machines for agent workflows",
        duration: "1 hour",
        copyAssistant: "Approval workflows, conditional logic",
        keyTradeoff: "Expressiveness vs debuggability",
        topics: [
          "Graph-based workflow concepts",
          "State machines for agents",
          "Conditional branching",
          "Human-in-the-loop patterns"
        ],
        exercises: [
          "Understand graph-based workflows",
          "Implement conditional branching",
          "Add human-in-the-loop patterns"
        ],
        outcome: "Create complex agent workflows with LangGraph."
      },
      {
        id: 17,
        title: "OpenAI Agents SDK Deep Dive",
        desc: "OpenAI's approach to agents",
        duration: "1 hour",
        copyAssistant: "Compare implementation approaches",
        keyTradeoff: "Ecosystem lock-in vs specialized features",
        topics: [
          "OpenAI's agent patterns",
          "Comparing to Anthropic's approach",
          "Tool integration differences",
          "Vendor tradeoffs"
        ],
        exercises: [
          "Explore OpenAI's agent patterns",
          "Compare to Anthropic's approach",
          "Understand vendor tradeoffs"
        ],
        outcome: "Master OpenAI's agent development tools."
      },
      {
        id: 18,
        title: "Google ADK for Enterprise Agents",
        desc: "Google's Agent Development Kit",
        duration: "1 hour",
        copyAssistant: "Enterprise considerations (security, compliance, scale)",
        keyTradeoff: "Enterprise features vs agility",
        topics: [
          "Google ADK overview",
          "Enterprise requirements",
          "Security and compliance features",
          "Multi-cloud considerations"
        ],
        exercises: [
          "Explore Google's approach",
          "Evaluate enterprise requirements",
          "Multi-cloud considerations"
        ],
        outcome: "Build enterprise-ready agents with Google ADK."
      },
      {
        id: 19,
        title: "MCP & Standardized Tool Calling",
        desc: "Model Context Protocol — Anthropic's open standard",
        duration: "1 hour",
        copyAssistant: "Portable tools that work across models and platforms",
        keyTradeoff: "Standardization vs innovation speed",
        topics: [
          "MCP architecture (hosts, clients, servers)",
          "How Claude Desktop uses MCP",
          "Build vs integrate decision for tools",
          "Connecting to external data sources",
          "2026 Update: MCP is production-ready"
        ],
        exercises: [
          "Explore MCP architecture",
          "See how Claude Desktop uses MCP",
          "Connect to external data sources"
        ],
        outcome: "Build interoperable tools with MCP standard."
      },
    ]
  },
  {
    id: 4,
    name: "Production",
    color: "amber",
    sessions: [
      {
        id: 20,
        title: "Evaluation Frameworks That Matter",
        desc: "How to measure if your AI is working",
        duration: "1 hour",
        copyAssistant: "Is the copy assistant actually helpful?",
        keyTradeoff: "Evaluation cost vs confidence",
        topics: [
          "Defining success metrics",
          "Human eval vs automated eval",
          "A/B testing AI features",
          "Continuous evaluation pipelines"
        ],
        exercises: [
          "Define success metrics",
          "Set up human evaluation",
          "Design A/B tests for AI features"
        ],
        outcome: "Rigorously evaluate AI system quality."
      },
      {
        id: 21,
        title: "Safety, Guardrails & Responsible AI",
        desc: "Preventing misuse, harmful outputs, bias",
        duration: "1 hour",
        copyAssistant: "Ensure copy doesn't violate brand/legal/ethical guidelines",
        keyTradeoff: "Safety vs utility (over-filtering kills usefulness)",
        topics: [
          "Input/output guardrails",
          "Content filtering strategies",
          "Bias detection and mitigation",
          "Responsible AI frameworks"
        ],
        exercises: [
          "Implement input/output guardrails",
          "Set up content filtering",
          "Bias detection techniques"
        ],
        outcome: "Ship AI features responsibly."
      },
      {
        id: 22,
        title: "RLHF & Alignment Deep Dive",
        desc: "How models are trained to be helpful/harmless/honest",
        duration: "1 hour",
        copyAssistant: "Understanding why Claude behaves the way it does",
        keyTradeoff: "Helpfulness vs harmlessness",
        topics: [
          "RLHF conceptual walkthrough",
          "Constitutional AI",
          "Alignment implications for products",
          "Why Claude refuses certain requests"
        ],
        exercises: [
          "RLHF conceptual walkthrough",
          "Explore Constitutional AI",
          "Alignment implications for your product"
        ],
        outcome: "Deeply understand how models are aligned to human values."
      },
      {
        id: 23,
        title: "System Design for AI Products",
        desc: "Architecture patterns for production AI",
        duration: "1 hour",
        copyAssistant: "Full system design for the copy assistant",
        keyTradeoff: "Latency vs accuracy vs cost (pick two)",
        topics: [
          "End-to-end architecture design",
          "Identifying bottlenecks",
          "Scaling strategies",
          "Cost optimization patterns"
        ],
        exercises: [
          "Draw the full architecture",
          "Identify bottlenecks",
          "Plan for scale"
        ],
        outcome: "Architect AI products that scale."
      },
      {
        id: 24,
        title: "Fine-tuning vs RAG vs Agentic Search Decision Framework",
        desc: "When to fine-tune, when to RAG, when to search dynamically, when to prompt engineer",
        duration: "1 hour",
        copyAssistant: "Should we fine-tune on your data, build a RAG pipeline, or just let Claude search?",
        keyTradeoff: "Customization vs maintenance vs simplicity",
        topics: [
          "The four options: Prompt engineering → Agentic search → RAG → Fine-tuning",
          "Decision flowchart with real criteria",
          "Cost/benefit analysis for each approach",
          "When agentic search beats RAG (dynamic data, security concerns, 'good enough' retrieval)",
          "When RAG still wins (massive static corpora, sub-second latency requirements)",
          "Combining approaches (hybrid strategies)"
        ],
        exercises: [
          "Walk through decision framework for your product's AI feature",
          "Cost/benefit analysis: RAG infrastructure vs. agentic search simplicity",
          "Map your data characteristics to the right approach",
          "Design a hybrid: RAG for stable data, agentic for dynamic"
        ],
        outcome: "Make informed build decisions choosing the right approach for your specific context."
      },
      {
        id: 25,
        title: "Capstone Integration",
        desc: "Put it all together",
        duration: "2 hours",
        copyAssistant: "Complete AI Copy Assistant design",
        keyTradeoff: "Shipping vs perfection",
        topics: [
          "Design the full feature end-to-end",
          "Identify build vs buy decisions",
          "Create a roadmap",
          "Review all concepts from the course"
        ],
        exercises: [
          "Design the full feature",
          "Identify build vs buy decisions",
          "Create a roadmap"
        ],
        outcome: "Ship a production-ready AI feature with a complete product spec."
      },
    ]
  }
];

const navSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'who', label: 'Who This Is For' },
  { id: 'learn', label: 'What You\'ll Learn' },
  { id: 'personalization', label: 'How It Adapts' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'prereqs', label: 'Prerequisites' },
  { id: 'start', label: 'Get Started' },
  { id: 'about', label: 'About' },
];

// Session detail sections for right nav
const sessionDetailSections = [
  { id: 'session-overview', label: 'Overview' },
  { id: 'session-outcome', label: 'Outcome' },
  { id: 'session-topics', label: 'What You\'ll Learn' },
  { id: 'session-exercises', label: 'Exercises' },
];

// Session Detail Content Component (rendered inside main layout)
function SessionDetailContent({ session, phase, onBack, onNavigate, allSessions }) {
  const colorMap = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  };
  const colors = colorMap[phase.color];

  // Find prev/next sessions
  const prevSession = allSessions.find(s => s.session.id === session.id - 1);
  const nextSession = allSessions.find(s => s.session.id === session.id + 1);

  return (
    <>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Course Overview</span>
      </button>

      {/* Session Header */}
      <section id="session-overview" className="mb-8 scroll-mt-20">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
            Phase {phase.id}: {phase.name}
          </span>
          <span className="text-sm text-slate-500">Session {session.id} of 25</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{session.title}</h1>
        <p className="text-lg text-slate-600">{session.desc}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>{session.duration}</span>
          <span>{session.topics?.length || 0} topics</span>
          <span>{session.exercises?.length || 0} exercises</span>
        </div>
      </section>

      {/* Outcome */}
      {session.outcome && (
        <section id="session-outcome" className={`mb-8 p-4 rounded-xl ${colors.bg} ${colors.border} border scroll-mt-20`}>
          <div className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
            <div>
              <div className={`font-semibold ${colors.text} mb-1`}>By the end of this session</div>
              <p className="text-slate-700">{session.outcome}</p>
            </div>
          </div>
        </section>
      )}

      {/* Copy Assistant Feature + Key Tradeoff */}
      {(session.copyAssistant || session.keyTradeoff) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {session.copyAssistant && (
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Running Example</div>
              <div className="font-medium text-slate-900">AI Copy Assistant</div>
              <p className="text-sm text-slate-600 mt-1">{session.copyAssistant}</p>
            </div>
          )}
          {session.keyTradeoff && (
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Key Tradeoff</div>
              <p className="text-sm text-slate-700">{session.keyTradeoff}</p>
            </div>
          )}
        </div>
      )}

      {/* Topics */}
      {session.topics && (
        <section id="session-topics" className="mb-8 scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">What You'll Learn</h2>
          <div className="space-y-2">
            {session.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-sm font-mono text-slate-400 w-6">{i + 1}.</span>
                <span className="text-slate-700">{topic}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exercises */}
      {session.exercises && (
        <section id="session-exercises" className="mb-8 scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Hands-On Exercises</h2>
          <div className="space-y-2">
            {session.exercises.map((exercise, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <Zap className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <span className="text-slate-700">{exercise}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200 gap-4">
        {prevSession ? (
          <button
            onClick={() => onNavigate(prevSession.session, prevSession.phase)}
            className="text-sm text-slate-600 hover:text-purple-600 flex items-center gap-2 text-left"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span>← Session {prevSession.session.id}</span>
          </button>
        ) : <div />}
        {nextSession ? (
          <button
            onClick={() => onNavigate(nextSession.session, nextSession.phase)}
            className="text-sm text-slate-600 hover:text-purple-600 flex items-center gap-2 text-right"
          >
            <span>Session {nextSession.session.id} →</span>
          </button>
        ) : <div />}
      </div>
    </>
  );
}

// Main Course Site Component
export default function CourseSite() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({1: true});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Flatten all sessions for prev/next navigation
  const allSessions = phases.flatMap(phase =>
    phase.sessions.map(session => ({ session, phase }))
  );

  // Smooth scroll to anchor
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toggle phase expansion in sidebar
  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  // Open session detail
  const openSession = (session, phase) => {
    setSelectedSession(session);
    setSelectedPhase(phase);
    // Expand the phase this session belongs to
    setExpandedPhases(prev => ({ ...prev, [phase.id]: true }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go back to home
  const goHome = () => {
    setSelectedSession(null);
    setSelectedPhase(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which nav sections to show
  const currentNavSections = selectedSession ? sessionDetailSections : navSections;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-purple-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Brain className="w-6 h-6 text-purple-600" />
          <span className="font-semibold text-slate-900 hidden sm:inline">AI PM Technical Fluency</span>
          <span className="font-semibold text-slate-900 sm:hidden">AI PM</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => scrollToSection('start')} className="text-sm text-slate-600 hover:text-purple-600 hidden sm:block">
            Get Started
          </button>
          <a href="https://github.com" className="text-slate-400 hover:text-slate-600">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar - Module Navigation */}
        <aside className={`fixed left-0 top-14 bottom-0 w-80 bg-white border-r border-slate-200 overflow-y-auto p-4 z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="space-y-1">
            <button
              onClick={() => { goHome(); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                !selectedSession
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Home
            </button>

            {phases.map(phase => (
              <div key={phase.id} className="mt-3">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors gap-2"
                >
                  <span className="text-left">Phase {phase.id}: {phase.name}</span>
                  {expandedPhases[phase.id] ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {expandedPhases[phase.id] && (
                  <div className="mt-1 ml-2 border-l border-slate-200 pl-2">
                    {phase.sessions.map(session => (
                      <button
                        key={session.id}
                        onClick={() => { openSession(session, phase); setMobileMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors leading-tight ${
                          selectedSession?.id === session.id
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <span className="text-slate-400 mr-1">{session.id}.</span>
                        {session.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:ml-80 lg:mr-56 max-w-4xl mx-auto lg:mx-0">

          {/* Conditional: Session Detail or Home */}
          {selectedSession && selectedPhase ? (
            <SessionDetailContent
              session={selectedSession}
              phase={selectedPhase}
              onBack={goHome}
              onNavigate={openSession}
              allSessions={allSessions}
            />
          ) : (
          <>
          {/* Hero */}
          <section id="overview" className="mb-16 scroll-mt-20">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 mb-8 text-center">
              <pre className="text-purple-400 text-xs sm:text-sm font-mono leading-tight mb-4 inline-block text-left">
{`█████╗ ██╗    ██████╗ ███╗   ███╗
██╔══██╗██║    ██╔══██╗████╗ ████║
███████║██║    ██████╔╝██╔████╔██║
██╔══██║██║    ██╔═══╝ ██║╚██╔╝██║
██║  ██║██║    ██║     ██║ ╚═╝ ██║
╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝     ╚═╝`}
              </pre>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Technical Fluency</h1>
              <p className="text-purple-300">25 Sessions · Hands-On · Claude Code</p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-mono">
              The Course Taught INSIDE Claude Code
            </h2>

            <p className="text-lg text-slate-600 mb-6">
              Learn AI/LLM development by actually doing it — no videos, no passive reading, just real hands-on work inside Claude Code itself.
            </p>

            {/* Key Differentiator Callout */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-900 font-medium">
                <strong>Bring your own product idea.</strong> At setup, you'll describe your product and the AI feature you want to build. Every lesson adapts to YOUR context — no generic examples.
              </p>
            </div>

            <ul className="space-y-3 text-slate-700 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Clone the repo, type <code className="bg-slate-100 px-2 py-0.5 rounded text-purple-600">"Let's get started"</code> to begin setup</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Tell Claude about <strong>your product</strong> and the AI feature you want to explore</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Every session applies concepts to <strong>your specific use case</strong></span>
              </li>
            </ul>

            <button
              onClick={() => scrollToSection('start')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>

          {/* Who This Is For */}
          <section id="who" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">Who This Course Is For</h2>

            <p className="text-slate-600 mb-4">
              <strong>Product Managers and technical leaders</strong> who want to deeply understand AI/LLM technology — not just use ChatGPT, but actually build with it.
            </p>

            <p className="text-slate-600 mb-6">
              By the end, you'll be able to:
            </p>

            <ul className="space-y-2 text-slate-700 mb-6">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Have informed technical conversations with engineers about AI architecture</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Evaluate build vs. buy decisions for AI features</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Prototype AI features yourself before involving engineering</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Interview confidently at AI-first companies</span>
              </li>
            </ul>

            <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600">
              <strong>No coding experience required.</strong> If you can describe what you want in plain English, you can use Claude Code.
            </div>
          </section>

          {/* What You'll Learn */}
          <section id="learn" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">What You'll Learn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">LLM Fundamentals</h3>
                </div>
                <p className="text-sm text-slate-600">Tokens, temperature, context windows, prompt engineering patterns, and how models actually work.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">RAG & Embeddings</h3>
                </div>
                <p className="text-sm text-slate-600">Vector databases, semantic search, document chunking, and retrieval-augmented generation.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">AI Agents</h3>
                </div>
                <p className="text-sm text-slate-600">Function calling, ReAct loops, multi-agent systems, and autonomous workflows.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Production & Safety</h3>
                </div>
                <p className="text-sm text-slate-600">Evaluation frameworks, guardrails, RLHF, system design, and responsible AI practices.</p>
              </div>
            </div>
          </section>

          {/* Curriculum */}
          <section id="curriculum" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Curriculum</h2>

            <p className="text-slate-600 mb-6">
              25 sessions across 4 phases. Each session is ~1 hour of hands-on work. <strong>Click any session</strong> to see full details.
            </p>

            {phases.map(phase => (
              <div key={phase.id} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${phase.color}-100 text-${phase.color}-700`}>
                    Phase {phase.id}
                  </span>
                  <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                </div>
                <div className="space-y-2">
                  {phase.sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => openSession(session, phase)}
                      className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group"
                    >
                      <span className="text-sm font-mono text-slate-400 w-6">{session.id}</span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">{session.title}</div>
                        <div className="text-sm text-slate-500">{session.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 mt-1 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* How Personalization Works */}
          <section id="personalization" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">How It Adapts to You</h2>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Your Product = Your Curriculum
              </h3>
              <p className="text-slate-600 mb-4">
                This isn't a course with generic "build a chatbot" examples. When you start, you'll tell Claude about <strong>your actual product</strong> and the AI feature you want to explore. Every session then applies concepts directly to your use case.
              </p>
            </div>

            {/* Onboarding Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center mb-3">1</div>
                <h4 className="font-semibold text-slate-900 mb-2">Setup: Describe Your Product</h4>
                <p className="text-sm text-slate-600">Claude asks about your company, product, and users. This gets saved to <code className="text-xs bg-slate-100 px-1 rounded">MY_PRODUCT.md</code></p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center mb-3">2</div>
                <h4 className="font-semibold text-slate-900 mb-2">Define: Your AI Feature Idea</h4>
                <p className="text-sm text-slate-600">What AI capability do you want to build? A recommendation engine? Content generator? Smart search? You decide.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold flex items-center justify-center mb-3">3</div>
                <h4 className="font-semibold text-slate-900 mb-2">Learn: Applied to Your Context</h4>
                <p className="text-sm text-slate-600">Every "Apply to Your Product" section in each lesson references your specific product and feature.</p>
              </div>
            </div>

            {/* Example */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Example</div>
              <p className="text-sm text-slate-700 mb-2">
                <strong>Your product:</strong> "A recipe app for home cooks"
              </p>
              <p className="text-sm text-slate-700 mb-2">
                <strong>Your AI feature:</strong> "Generate personalized meal plans based on dietary preferences"
              </p>
              <p className="text-sm text-slate-600">
                → Session 6 (RAG) becomes: "Retrieve similar recipes from your database to inform meal suggestions"<br/>
                → Session 12 (Agentic Search) becomes: "Should you index all recipes, or let Claude search dynamically?"
              </p>
            </div>
          </section>

          {/* Prerequisites */}
          <section id="prereqs" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">Prerequisites</h2>

            <ul className="space-y-3 text-slate-700 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span><strong>Claude Pro or Max subscription</strong> ($20/month) — <a href="https://claude.ai" className="text-purple-600 hover:underline">Sign up here</a></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>Mac, Windows, or Linux computer</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>Anthropic API key (for hands-on exercises) — ~$20-30 for full course</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>~25 hours to complete (1 hour per session)</span>
              </li>
            </ul>

            <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800 border border-emerald-100">
              <strong>No coding or terminal experience required.</strong> If you can have a conversation, you can use Claude Code.
            </div>
          </section>

          {/* Get Started */}
          <section id="start" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">Get Started</h2>

            <div className="space-y-4">
              <a href="#" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Terminal className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">1. Install Claude Code</div>
                  <div className="text-sm text-slate-500">15 minute setup guide</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a href="#" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Github className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">2. Download Course Materials</div>
                  <div className="text-sm text-slate-500">Clone the repo or download zip</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a href="#" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">3. Start Session 1</div>
                  <div className="text-sm text-slate-500">Open Claude Code and say "Let's do Session 1"</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <div className="mt-6 p-4 bg-slate-100 rounded-xl">
              <p className="text-sm text-slate-600 font-mono">
                <span className="text-slate-400">$</span> cd ai-pm-course && claude<br/>
                <span className="text-slate-400">Claude:</span> <span className="text-purple-600">"Let's do Session 1 of my AI PM course"</span>
              </p>
            </div>
          </section>

          {/* About */}
          <section id="about" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-mono">About This Course</h2>

            <p className="text-slate-600 mb-4">
              Created for PMs who want Stanford-level AI technical credibility without going back to school.
            </p>

            <p className="text-slate-600 mb-4">
              The curriculum covers what you'd learn in a graduate AI course, but taught interactively through Claude Code with hands-on exercises building real features.
            </p>

            <div className="text-sm text-slate-500">
              Questions or feedback? Open an issue on GitHub or reach out directly.
            </div>
          </section>
          </>
          )}

        </main>

        {/* Right Sidebar - On This Page (anchor nav) - Hidden on mobile */}
        <aside className="hidden lg:block fixed right-0 top-14 bottom-0 w-56 bg-white border-l border-slate-200 overflow-y-auto p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            On This Page
          </div>
          <nav className="space-y-1">
            {currentNavSections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
