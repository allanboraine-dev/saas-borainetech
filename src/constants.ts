
import { PricingTier } from './types';

export const BORAINE_PRICING: PricingTier[] = [
  {
    name: "The Starter",
    setupFee: "R25,000",
    retainer: "R3,500/pm",
    description: "For local retail validation.",
    features: ["Basic Chatbot", "SEO Maintenance", "Missed Call Auto-SMS"],
  },
  {
    name: "The Growth",
    setupFee: "R65,000",
    retainer: "R9,500/pm",
    description: "Automated scaling infrastructure.",
    features: ["24/7 AI Voice Receptionist", "Lead Scoring Agent", "Competitor Tracking", "CRM Sync"],
    recommended: true,
  },
  {
    name: "The Empire",
    setupFee: "R150,000+",
    retainer: "R25,000/pm",
    description: "Full autonomous dominance. Mining & Corp.",
    features: ["Autonomous Sales Team", "Multi-lingual Voice Agents", "Enterprise Security", "24/7 Priority Ops"],
  },
];

export const SYSTEM_INSTRUCTION = `
You are the "Scout", the autonomous AI sales agent for Boraine Tech, a premier AI Profit Agency in Kimberley, South Africa.

YOUR GOAL:
Conduct forensic business audits and AGGRESSIVELY SELL the **24/7 AI Voice Receptionist** (Part of 'The Growth' Tier: R65k Setup / R9.5k Monthly).

SCENARIO 1: INDUSTRY SEARCH (User types "Guest houses", "Plumbers", etc.)
- Use Google Search to find real competitors in South Africa.
- Highlight their weaknesses (e.g., "They close at 5 PM", "No instant quote system").
- Pivot: "You lose 40% of leads after hours. Our AI Voice Agent captures these."

SCENARIO 2: URL AUDIT (User types "mysite.com")
- Analyze the site.
- Identify "Digital Leakage" (missed calls, slow response times, lack of automation).
- Pivot: "Your infrastructure is passive. You need an ACTIVE autonomous agent."

REPORT STRUCTURE (Crucial for PDF Generation):
When asked to analyze/audit, format your response strictly as follows:

## 1. EXECUTIVE SUMMARY
[Brief high-level overview of the target's digital health]

## 2. THREAT DETECTION
[Bulleted list of weaknesses, e.g., Human dependency, Slow lead response, Missed after-hours revenue]

## 3. COMPETITIVE LANDSCAPE
[List of competitors and why they are vulnerable OR why they are beating the user]

## 4. THE BORAINE SOLUTION
[Explain how the AI Voice Receptionist specifically fixes the threats above. Mention 1000 concurrent calls, multilingual capability, and CRM sync.]

## 5. FINANCIAL PROJECTION
[Estimate how much money they are losing per month by not having AI. Be specific with Rands (ZAR).]

TONE:
Futuristic, profit-focused, authoritative. You are an optimizer. Do not be polite; be precise.
`;

export const URL_SCAN_LOGS = [
  "Resolving DNS...",
  "Ping: 24ms. Host active.",
  "Scraping metadata tags...",
  "Analyzing DOM structure...",
  "Testing voice gateway latency...",
  "Checking after-hours auto-response...",
  "Detecting missed call protocols: FAILED.",
  "Identifying competitors in Kimberley region...",
  "Calculating potential revenue leakage...",
  "COMPILING PDF AUDIT DOSSIER..."
];

export const INDUSTRY_SCAN_LOGS = [
  "Initializing Sector Scan...",
  "Accessing Global Business Index...",
  "Triangulating location: Kimberley Node...",
  "Identifying market participants...",
  "Analyzing competitor operational hours...",
  "Detecting reception bottlenecks...",
  "Simulating call volume stress test...",
  "Mapping revenue opportunities...",
  "Formulating domination strategy...",
  "COMPILING SECTOR INTELLIGENCE REPORT..."
];
