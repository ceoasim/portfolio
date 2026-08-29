import type { Project } from '../types/content.js'
import miner from '../Assets/Projects/miner.png'
import ivy from '../Assets/Projects/ivy.png'
import nft from '../Assets/Projects/nft.png'
import door from '../Assets/Projects/door.png'
import shift from '../Assets/Projects/shift.png'

export const projects: Project[] = [
  {
    id: 'anywork-agent',
    name: 'AnyWork Agent',
    company: 'SMS Holdings',
    tags: ['React.js', 'Node.js', 'LLM APIs', 'Voice AI', 'Email Automation'],
    problem:
      'Turning a natural-language prompt into a qualified lead list and outreach campaign without manual prospecting.',
    description:
      'Conversational AI agent that discovers leads, generates a campaign, places AI voice calls, and sequences automated emails.',
    architectureHighlight:
      'Agentic tool-calling workflow spanning lead discovery, campaign generation, AI voice calling, and automated email sequencing — with human approval gates before any outbound action.',
    featured: true,
    image: null,
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'mindminer',
    name: 'MindMiner',
    company: 'CodingCops',
    tags: ['React.js', 'Node.js', 'AWS ECS/ECR/Fargate', 'Ethereum', 'LLM & Video Gen APIs'],
    problem:
      'Turning a described problem into candidate invention solutions and structured patent documentation.',
    description:
      'AI-assisted invention platform generating candidate solutions and drafting structured patent documentation via LLM pipelines, with automated multimedia explainer videos per invention.',
    architectureHighlight:
      'Web3 layer with wallet balances, on-chain burns, ERC-20/NFT transfers, crowdfunding contracts, and token minting — secure multi-step authenticated transactions with blockchain event verification.',
    featured: true,
    image: miner,
    demoUrl: 'https://dev.mindminer.ai/',
    demoLabel: 'Demo',
  },
  {
    id: 'smart-system',
    name: 'Smart System',
    company: 'SMS Holdings',
    tags: ['React Native', 'React.js', 'Node.js', 'AWS'],
    problem: null,
    description:
      'Mobile and web platform for on-demand household services, with an integrated admin panel for customer/partner monitoring and in-app commissioning support.',
    architectureHighlight: null,
    featured: false,
    image: null,
    demoUrl: null,
    demoLabel: null,
  },
  {
    id: 'ivy',
    name: 'IVY',
    company: 'CodingCops',
    tags: ['Ruby on Rails', 'React.js', 'Hanami', 'Heroku', 'Datadog', 'Redis'],
    problem: null,
    description:
      'Hospitality platform covering guest booking, task orchestration, SMS notifications, and an activity management system that improved staff task completion.',
    architectureHighlight: null,
    featured: false,
    image: ivy,
    demoUrl: 'https://www.revinate.com/solutions/revinate-ivy/',
    demoLabel: 'Learn more',
  },
  {
    id: 'smeisty',
    name: 'Smeisty',
    company: 'TectSoft',
    tags: ['React.js', 'Node.js', 'Ethereum', 'MetaMask', 'OpenSea'],
    problem: null,
    description:
      'NFT management platform handling contract addresses and wallet transactions, optimized for speed and cross-device responsiveness.',
    architectureHighlight: null,
    featured: false,
    image: nft,
    demoUrl: 'https://smeisty.app/',
    demoLabel: 'Demo',
  },
  {
    id: 'door-visualizer',
    name: 'Door Visualizer',
    company: null,
    tags: ['Augmented Reality', 'Mobile'],
    problem: null,
    description:
      'Augmented reality app for smartphones — people can see through their camera how new doors would look directly in their interior.',
    architectureHighlight: null,
    featured: false,
    image: door,
    demoUrl: 'https://www.door-visualizer.com/',
    demoLabel: 'Demo',
  },
  {
    id: 'shifterp',
    name: 'ShiftERP',
    company: null,
    tags: ['ERP', 'Supply Chain'],
    problem: null,
    description:
      'First fully integrated end-to-end ERP solution for co-packers and supply chain teams.',
    architectureHighlight: null,
    featured: false,
    image: shift,
    demoUrl: 'https://www.shifterp.com/',
    demoLabel: 'Demo',
  },
]
