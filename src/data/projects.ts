import type { Project } from '../types/content.js'
import miner from '../Assets/Projects/miner.png'
import ivy from '../Assets/Projects/ivy.png'
import nft from '../Assets/Projects/nft.png'
import door from '../Assets/Projects/door.png'
import shift from '../Assets/Projects/shift.png'

export const projects: Project[] = [
  {
    id: 'stacklead',
    name: 'StackLead',
    company: 'SMS Holdings',
    tags: ['React.js', 'Node.js', 'LLM APIs', 'Voice AI', 'Email Automation', 'Agentic Workflows'],
    problem:
      'Sales teams drown in unqualified leads and manual, multi-tool prospecting — there was no single system to find, validate, contact, and track leads through to a booked meeting.',
    description:
      "A conversational AI chatbot lets reps query and analyze lead data in plain language, kicking off a trackable background job that searches and enriches results in real time. Underneath, an agentic pipeline handles lead discovery, deduplication, and campaign creation, then places AI voice calls to understand a lead's interests and sequences automated email outreach — with Calendly-based meeting booking and CSV/PDF export throughout.",
    architectureHighlight:
      'A modular full-stack platform (AI Chatbot, Campaigns, Contacts, Jobs, Analytics) built around an asynchronous job pipeline — search, validation, deduplication, and campaign-creation stages tracked in real time on a live Jobs dashboard — with LLM-backed natural-language querying, AI voice calling, and automated email sequencing orchestrated through tool-calling workflows.',
    impact:
      'Gives sales teams a single system to go from a plain-language ask to a qualified, contacted, and tracked lead — with call-connection rate, email success rate, and meetings booked all measured automatically on a built-in analytics dashboard instead of assembled by hand across disconnected tools.',
    storyLayout: true,
    image: null,
    demoUrl: 'https://stacklead.net/',
    demoLabel: 'Live Product',
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
    impact:
      'Collapses invention documentation from concept to structured, patent-ready drafts — with an automated video explainer generated for every submission.',
    storyLayout: true,
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
    impact: null,
    storyLayout: false,
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
    impact: null,
    storyLayout: false,
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
    impact: null,
    storyLayout: false,
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
    impact: null,
    storyLayout: false,
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
    impact: null,
    storyLayout: false,
    image: shift,
    demoUrl: 'https://www.shifterp.com/',
    demoLabel: 'Demo',
  },
]
