import type { SkillGroup } from '../types/content.js'

export const skillGroups: SkillGroup[] = [
  {
    group: 'Frontend',
    items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'Redux', 'GraphQL', 'Angular', 'Vue'],
  },
  {
    group: 'Backend & Mobile',
    items: [
      'Node.js', 'Express', 'NestJS', 'React Native', 'Java', 'Spring Boot', 'Ruby on Rails', 'Python', 'C++', 'SQL',
    ],
  },
  {
    group: 'AI & LLM',
    items: [
      'Anthropic Claude', 'OpenAI GPT-4/4o', 'Google Gemini', 'DeepSeek', 'Llama',
      'RAG', 'Vector Search & Embeddings', 'Agentic Workflows', 'MCP', 'LangChain', 'LangGraph', 'Vercel AI SDK',
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: ['AWS (ECS, ECR, Fargate, EC2, CloudWatch)', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'GitLab CI'],
  },
  {
    group: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Neo4j', 'Firebase', 'Pinecone / pgvector'],
  },
  {
    group: 'Distributed Systems',
    items: ['Microservices', 'Apache Kafka', 'RabbitMQ', 'Pub/Sub', 'Event-Driven Architecture'],
  },
]
