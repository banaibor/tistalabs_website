import type { IconType } from 'react-icons';
import { HiCodeBracket, HiDevicePhoneMobile } from 'react-icons/hi2';
import { RiRobot2Fill } from 'react-icons/ri';
import { TbBrandReactNative } from 'react-icons/tb';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { GiArtificialIntelligence } from 'react-icons/gi';

export interface Service {
  id: string;
  title: string;
  headline: string;
  description: string;
  features: string[];
  cta: string;
  icon: IconType;
  // visual sections removed per request
  useCases?: Array<{
    title: string;
    description: string;
    image?: string;
    metrics?: Array<{ label: string; value: string }>;
  }>;
  stack?: string[];
  metrics?: Array<{ label: string; value: string; hint?: string }>;
  ideaStarters?: string[];
}

export const servicesData: Service[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    headline: 'Building Digital Spaces That Work Smarter',
    description: 'Your website isn\'t just a digital address—it\'s an active organism. Our developers design interfaces that respond, backends that think, and ecosystems that adapt with your business.',
    features: [
      'Front-end development (UI, accessibility, performance)',
      'Back-end development (APIs, auth, business logic)',
      'Full-stack development (end-to-end delivery)',
      'Custom websites and CMS',
      'Web applications (dashboards, portals, SaaS)',
      'E-Commerce development',
      'Progressive Web Apps (installable, offline)',
      'SEO and web performance optimization',
      'Web integrations (ERP, CRM, payments)',
      'Maintenance, support, and upgrades'
    ],
    cta: 'Turn your website into more than a presence—make it a partner in growth.',
    icon: HiCodeBracket,
    useCases: [
      {
        title: 'B2B Portal Modernization',
        description: 'Replatformed a legacy portal with modern SPA + API, cutting page load from 6.1s to 1.2s and boosting conversions 22%.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=60',
        metrics: [
          { label: 'Load time', value: '−80%' },
          { label: 'Conversion', value: '+22%' }
        ]
      },
      {
        title: 'Headless Commerce',
        description: 'Headless storefront with Next.js + Commerce APIs enabling <200ms TTFB globally.',
        image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1400&q=60',
        metrics: [
          { label: 'TTFB', value: '<200ms' },
          { label: 'Regions', value: '8' }
        ]
      },
      {
        title: 'Analytics Dashboards',
        description: 'Secure, role-based data apps with realtime streaming widgets and exports.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=60'
      }
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    metrics: [
      { label: 'Avg Lighthouse', value: '95+', hint: 'Performance' },
      { label: 'Deploy freq', value: 'Daily' },
      { label: 'SEO uplift', value: '+30%' }
    ],
    ideaStarters: [
      'Modular component system for consistent UI',
      'Role-based dashboards with export flows',
      'Multi-tenant architecture with feature flags',
      'Headless CMS for marketing speed'
    ]
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    headline: 'Your Business, in Everyone\'s Pocket',
    description: 'In a world where people carry expectations in their pockets, we design mobile apps that perform like personal assistants—always ready, always adaptive.',
    features: [
      'Native iOS & Android',
      'Cross-platform apps (Flutter, React Native, KMP)',
      'Mobile backends and APIs',
      'App store readiness & release management',
      'Mobile UI/UX & prototyping',
      'App modernization & migration',
      'Mobile QA & automation',
      'App optimization & ASO',
      'Ongoing maintenance & support'
    ],
    cta: 'Put intelligence in motion—let your brand travel with your users.',
    icon: HiDevicePhoneMobile,
    useCases: [
      {
        title: 'Fintech Superapp',
        description: 'Wallet + payments + rewards in one secure app with biometric auth.',
        image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1400&q=60'
      },
      {
        title: 'Field Ops',
        description: 'Offline-first field app with sync and conflict resolution.',
        image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1400&q=60'
      }
    ],
    stack: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'Firebase', 'GraphQL'],
    metrics: [
      { label: 'Crash-free users', value: '99.7%' },
      { label: 'App size', value: '−25%' }
    ],
    ideaStarters: ['In-app growth loops', 'Modular feature flags', 'Offline-first strategy']
  },
  {
    id: 'cross-cutting',
    title: 'Cross-Cutting Services',
    headline: 'Technology That Threads Everything Together',
    description: 'Our cross-cutting services serve as the bloodstream of your technology. They infuse resilience, intelligence, and speed into everything we build.',
    features: [
      'Solution discovery & scoping',
      'Cloud, DevOps, and CI/CD',
      'Security & compliance',
      'Data & analytics',
      'QA & testing',
      'Documentation & handover'
    ],
    cta: 'Complete your technology ecosystem with services that bind and protect every layer.',
    icon: TbBrandReactNative,
    useCases: [
      {
        title: 'CI/CD at Scale',
        description: 'Trunk-based dev, ephemeral envs, DORA elite metrics across teams.'
      },
      {
        title: 'Security Hardening',
        description: 'SSO, least privilege, secret rotation, SAST/DAST in the pipeline.'
      }
    ],
    stack: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    metrics: [
      { label: 'Lead time', value: 'Hours' },
      { label: 'Change fail rate', value: '<5%' }
    ],
    ideaStarters: ['Golden paths', 'Paved road tooling', 'Policy-as-code']
  },
  {
    id: 'ai-mcp',
    title: 'AI & MCP Server Solutions',
    headline: 'Transform Your Business with Next-Generation AI',
    description: 'Advanced AI technologies including Model Context Protocol (MCP) Servers, Custom AI Development, RAG systems, Edge AI Computing, and Agentic AI Workflows.',
    features: [
      'Model Context Protocol (MCP) Servers',
      'Custom AI Development & Multi-modal capabilities',
      'Retrieval-Augmented Generation (RAG)',
      'Edge AI Computing with sub-millisecond response',
      'Agentic AI Workflows',
      'Industry Solutions (Finance, Healthcare, Manufacturing, Retail)',
      'Advanced AI Frameworks (TensorFlow, PyTorch, MLflow)',
      'Multi-Cloud Infrastructure',
      'AI governance & compliance (NIST, EU AI Act)',
      '3.7x average ROI within first year'
    ],
    cta: 'Ready to accelerate your business with intelligent automation?',
    icon: GiArtificialIntelligence,
    useCases: [
      { title: 'RAG Search', description: 'Domain-grounded answers with citations for service desks.' },
      { title: 'Agent Workflows', description: 'Automate complex SOPs with human-in-the-loop.' }
    ],
    stack: ['Python', 'PyTorch', 'OpenAI', 'LangChain', 'MCP', 'Azure'],
    metrics: [
      { label: 'Time saved', value: '3.7x' },
      { label: 'Retrieval precision', value: '90%+' }
    ],
    ideaStarters: ['Data contracts for RAG', 'Guardrails and evals', 'Agent safety policies']
  },
  {
    id: 'automation',
    title: 'Software Automation & Scripting',
    headline: 'Transform Manual Tasks into Automated Workflows',
    description: 'Expert automation solutions using VBA, Python, PowerShell, JavaScript, and Web Automation to eliminate manual processes and boost productivity.',
    features: [
      'VBA Automation (Excel, Office, macros)',
      'Python Scripting (Selenium, Pandas, APIs)',
      'Web Automation (Selenium WebDriver)',
      'PowerShell Scripts (Windows administration)',
      'JavaScript/Node.js (Server-side automation)',
      'Business process automation',
      '80% reduction in manual processing time',
      '95% error elimination',
      '500-800% ROI with 3-6 month payback',
      'Multi-cloud automation (AWS, Azure, GCP)'
    ],
    cta: 'Ready to eliminate manual tasks and boost productivity?',
    icon: RiRobot2Fill,
    useCases: [
      { title: 'Excel to API', description: 'Automate report consolidation and push to BI tools.' },
      { title: 'Web Automation', description: 'RPA-lite for repetitive browser flows.' }
    ],
    stack: ['Python', 'VBA', 'PowerShell', 'Node.js', 'Selenium'],
    metrics: [ { label: 'Manual time', value: '−80%' }, { label: 'Errors', value: '−95%' } ],
    ideaStarters: ['Scheduler + audit logs', 'Idempotent pipelines']
  },
  {
    id: 'kaspersky-edr',
    title: 'Kaspersky EDR',
    headline: 'Smart Security for Smarter Threats',
    description: 'Kaspersky Endpoint Detection and Response (EDR) detects, analyzes, and stops advanced attacks at the endpoint level—before they spread across your organization.',
    features: [
      'AI-powered threat detection',
      'Automatic investigation & response',
      'Real-time threat isolation',
      'Ransomware & zero-day protection',
      'Centralized endpoint management',
      'Compliance reporting (audit-ready)',
      'Trusted by 220,000+ organizations',
      'Global threat intelligence',
      '24/7 security monitoring',
      'Scalable for all organization sizes'
    ],
    cta: 'Take control of your security today—prevention is always cheaper than recovery.',
    icon: IoShieldCheckmarkSharp,
    useCases: [
      { title: 'Ransomware Containment', description: 'Isolate and remediate across fleet in minutes.' },
      { title: 'Threat Hunting', description: 'Investigate IOCs and respond with playbooks.' }
    ],
    stack: ['EDR', 'SIEM', 'SOAR', 'MITRE ATT&CK'],
    metrics: [ { label: 'MTTR', value: '−60%' }, { label: 'Coverage', value: '100% endpoints' } ],
    ideaStarters: ['Zero trust baseline', 'Least privilege rollout']
  }
];
