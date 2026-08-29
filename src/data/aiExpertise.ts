import type { AICapability } from '../types/content.js'

export const aiFraming =
  'I build products on top of frontier models, not just around an API call.'

export const aiCapabilities: AICapability[] = [
  {
    label: 'LLM Integration',
    items: ['Anthropic Claude', 'OpenAI GPT-4/4o', 'Google Gemini', 'DeepSeek', 'Llama'],
  },
  {
    label: 'RAG & Retrieval',
    items: ['Retrieval-Augmented Generation', 'Vector Search & Embeddings', 'Pinecone', 'pgvector'],
  },
  {
    label: 'Agentic Systems',
    items: ['Agentic Workflows', 'Function/Tool Calling', 'MCP (Model Context Protocol)'],
  },
  {
    label: 'Reliability & Cost',
    items: ['Prompt & Context Engineering', 'Structured Outputs', 'Streaming', 'Guardrails & Fallbacks', 'Token/Cost Optimization'],
  },
  {
    label: 'Applied AI Products',
    items: ['Voice AI & Conversational Agents', 'AI Video Generation'],
  },
  {
    label: 'AI Coding Tools (daily use)',
    items: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Windsurf', 'Codex', 'v0'],
  },
]
