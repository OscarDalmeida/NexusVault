import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateProductIconUrl } from "../src/lib/icon-generator";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create the store/seller account
  const hashedPassword = await bcrypt.hash("NexusVault2024!", 10);

  const seller = await db.user.upsert({
    where: { email: "store@nexusvault.com" },
    update: {},
    create: {
      email: "store@nexusvault.com",
      name: "NexusVault Official",
      username: "nexusvault",
      hashedPassword,
      role: "BOTH",
      bio: "Official NexusVault store. Premium AI prompts, templates, and digital tools crafted by experts.",
    },
  });

  console.log(`Seller created: ${seller.name} (${seller.id})`);

  // ============================================================
  // PRODUCT 1: Ultimate Budget Architect — ChatGPT Edition
  // ============================================================
  const product1 = await db.listing.upsert({
    where: { slug: "ultimate-budget-architect-chatgpt" },
    update: {},
    create: {
      sellerId: seller.id,
      title: "Ultimate Budget Architect — ChatGPT Edition",
      slug: "ultimate-budget-architect-chatgpt",
      category: "ai-tools-prompts",
      thumbnailUrl: generateProductIconUrl(
        "Ultimate Budget Architect — ChatGPT Edition",
        "Transform ChatGPT into a personal finance wizard that builds interactive spreadsheet budgets with visual charts, automated calculations, and smart insights.",
        "ai-tools-prompts"
      ),
      shortDesc: "Transform ChatGPT into a personal finance wizard that builds interactive spreadsheet budgets with visual charts, automated calculations, and smart insights.",
      description: `# Ultimate Budget Architect — ChatGPT Edition

## What You Get

A meticulously crafted mega-prompt that transforms ChatGPT into your personal **financial architect**. Paste it in, answer a few guided questions, and watch as ChatGPT builds you a comprehensive, interactive budgeting spreadsheet — complete with formulas, charts, and financial insights.

## How It Works

1. **Paste the prompt** into ChatGPT (GPT-4 or GPT-4o recommended)
2. **Answer guided questions** — ChatGPT will ask about your:
   - Monthly income (salary, freelance, side hustles, investments)
   - Fixed expenses (rent/mortgage, insurance, subscriptions, loans)
   - Variable expenses (groceries, dining, entertainment, transport)
   - Savings goals (emergency fund, retirement, vacation, big purchases)
   - Debt obligations (credit cards, student loans, car payments)
3. **Receive your budget** — A fully structured spreadsheet layout with:
   - Auto-calculating formulas for every cell
   - Category breakdowns with percentage allocations
   - Visual spending distribution (pie charts, bar graphs)
   - Month-over-month tracking templates
   - Savings runway projections
   - Debt payoff timelines (avalanche & snowball methods)

## What Makes This Different

- **Not just a template** — the AI adapts the entire structure to YOUR financial situation
- **Interactive Q&A flow** — feels like talking to a financial advisor, not filling out a form
- **Visualization-first** — every budget comes with chart formulas ready to paste into Google Sheets or Excel
- **Smart recommendations** — get the 50/30/20 rule applied to your actual numbers
- **Scenario planning** — ask "what if I get a raise?" or "what if I cut subscriptions?" and get instant recalculations

## Compatible With
- ChatGPT Plus (GPT-4 / GPT-4o) — best results
- ChatGPT Free (GPT-3.5) — works, slightly less detailed
- Google Sheets / Excel — output designed for both
- Apple Numbers — compatible formulas included

## Perfect For
- Young professionals setting up their first real budget
- Freelancers with irregular income
- Couples merging finances
- Anyone drowning in spreadsheet templates that never fit their situation

## Included Files
- Main ChatGPT prompt (copy-paste ready)
- Quick-start guide
- Example output walkthrough`,
      price: 4.99,
      tags: ["chatgpt", "budgeting", "finance", "spreadsheet", "ai-prompt", "personal-finance", "budget-planner"],
      licenseType: "PERSONAL",
      status: "PUBLISHED",
      totalSales: 47,
      avgRating: 4.8,
      reviewCount: 12,
    },
  });

  // Add delivery item for Product 1
  await db.deliveryItem.upsert({
    where: { id: "del-budget-chatgpt" },
    update: {},
    create: {
      id: "del-budget-chatgpt",
      listingId: product1.id,
      type: "INSTRUCTIONS",
      value: `# Ultimate Budget Architect — ChatGPT Prompt

Copy and paste the ENTIRE prompt below into ChatGPT (GPT-4 recommended):

---

You are **BudgetArchitect**, an expert personal finance AI assistant. Your mission is to build the user a comprehensive, interactive budgeting spreadsheet through a guided conversation.

## YOUR BEHAVIOR:
- Be warm, encouraging, and non-judgmental about finances
- Ask ONE category of questions at a time
- After each answer, confirm what you heard and show a running summary
- Use clear formatting with tables and bullet points
- Never skip the visualization step

## PHASE 1: INCOME DISCOVERY
Start by greeting the user warmly. Then ask:
1. "What is your primary monthly income (after tax)?"
2. "Do you have any additional income sources? (freelance, rental, investments, side gigs)"
3. "Is your income consistent monthly, or does it vary? If it varies, what's your average and range?"

After they respond, display a clean INCOME SUMMARY TABLE.

## PHASE 2: FIXED EXPENSES
Now ask about fixed monthly costs:
1. "What are your housing costs? (rent/mortgage, property tax, HOA)"
2. "What recurring subscriptions do you pay? (streaming, gym, software, etc.)"
3. "What are your insurance costs? (health, car, renter's/homeowner's)"
4. "Any loan payments? (student loans, car payment, personal loans)"
5. "Other fixed bills? (phone, internet, utilities estimate)"

Display a FIXED EXPENSES TABLE with monthly totals.

## PHASE 3: VARIABLE EXPENSES
Ask about spending that changes:
1. "How much do you typically spend on groceries per month?"
2. "What about dining out / takeout / coffee shops?"
3. "Transportation costs? (gas, public transit, rideshare)"
4. "Entertainment and hobbies? (going out, games, sports)"
5. "Shopping? (clothes, electronics, household items)"
6. "Personal care? (haircuts, gym supplements, skincare)"
7. "Any other regular spending categories I should include?"

Display a VARIABLE EXPENSES TABLE.

## PHASE 4: FINANCIAL GOALS
Ask about their targets:
1. "Do you have an emergency fund goal? How many months of expenses do you want saved?"
2. "Are you saving for anything specific? (vacation, house, car, wedding)"
3. "Do you contribute to retirement? (401k, IRA, pension) How much?"
4. "Any debt you want to pay off faster? Which account and balance?"

## PHASE 5: BUILD THE SPREADSHEET
Now generate the complete budget spreadsheet. Structure it as:

### TAB 1: Monthly Overview
Create a table with columns: Category | Budgeted | Actual | Difference | % of Income
Include ALL items from phases 2-4. Add formulas like =SUM(), =B2-C2, =B2/TotalIncome

### TAB 2: Annual Projections
12-month grid showing each category by month with yearly totals.
Include: =AVERAGE() for trends, conditional formatting rules

### TAB 3: Savings Dashboard
- Emergency fund progress bar formula
- Savings rate calculation: =(Income - Total Expenses) / Income * 100
- Goal tracking with timeline estimates
- Compound interest projections for investments

### TAB 4: Debt Payoff Calculator
If they have debt:
- Avalanche method schedule (highest interest first)
- Snowball method schedule (lowest balance first)
- Monthly payment breakdown with interest saved
- Payoff date projections

### TAB 5: Visual Charts
Provide EXACT formulas and cell ranges for:
1. Pie chart: Spending by category (Needs vs. Wants vs. Savings)
2. Bar chart: Monthly income vs. expenses
3. Line chart: Projected savings growth over 12 months
4. Stacked bar: Expense categories month-over-month

## PHASE 6: SMART INSIGHTS
After building the spreadsheet, provide:
1. Their current savings rate and how it compares to recommendations
2. Top 3 areas where they could optimize spending
3. Whether they follow the 50/30/20 rule (needs/wants/savings)
4. A "financial health score" from 1-10 with explanation
5. One specific, actionable tip based on their situation

## PHASE 7: INTERACTIVE MODE
Tell the user: "Your budget is ready! You can now ask me things like:"
- "What if I get a 10% raise?"
- "What if I cut my subscriptions in half?"
- "How long until I pay off my credit card at $X/month?"
- "What should my grocery budget be?"
- "Recalculate if I move to a cheaper apartment"

Respond to each scenario with updated numbers and charts.

---

Begin now by greeting the user and starting Phase 1.`,
    },
  });

  console.log(`Product 1 created: ${product1.title}`);

  // ============================================================
  // PRODUCT 2: Ultimate Budget Architect — Claude Edition
  // ============================================================
  const product2 = await db.listing.upsert({
    where: { slug: "ultimate-budget-architect-claude" },
    update: {},
    create: {
      sellerId: seller.id,
      title: "Ultimate Budget Architect — Claude Edition",
      slug: "ultimate-budget-architect-claude",
      category: "ai-tools-prompts",
      thumbnailUrl: generateProductIconUrl(
        "Ultimate Budget Architect — Claude Edition",
        "Harness Claude's analytical power to create beautifully structured budget spreadsheets with deep financial analysis, artifact outputs, and scenario modeling.",
        "ai-tools-prompts"
      ),
      shortDesc: "Harness Claude's analytical power to create beautifully structured budget spreadsheets with deep financial analysis, artifact outputs, and scenario modeling.",
      description: `# Ultimate Budget Architect — Claude Edition

## What You Get

A precision-engineered prompt designed specifically for **Claude** (Anthropic's AI) that leverages Claude's unique strengths — structured thinking, artifact creation, and nuanced analysis — to build you a comprehensive personal budget system.

## Why Claude?

Claude excels at:
- **Artifacts** — generates actual interactive tables and code you can copy directly
- **Structured reasoning** — breaks complex finances into clear, logical steps
- **Nuanced advice** — considers psychological aspects of budgeting, not just numbers
- **Long-form output** — produces detailed, complete spreadsheets in one go

## How It Works

1. **Paste the prompt** into Claude (claude.ai or API)
2. **Answer Claude's guided questions** about your:
   - Income streams and stability
   - Essential vs. lifestyle expenses
   - Financial goals and timeline
   - Debt situation and interest rates
   - Risk tolerance and investment preferences
3. **Receive your complete budget system** as Claude Artifacts:
   - Interactive spreadsheet with live calculations
   - Visual charts rendered directly in the conversation
   - CSV-ready data you can import into any spreadsheet app
   - Markdown-formatted financial report

## Key Features

- **Artifact-optimized** — designed to produce Claude Artifacts (interactive code outputs)
- **Behavioral budgeting** — accounts for spending psychology, not just math
- **Multi-currency support** — works for any currency
- **Couple/household mode** — handles shared and individual expenses
- **Irregular income support** — perfect for freelancers and contractors
- **Tax-aware** — factors in estimated tax obligations for self-employed users

## Output Includes

1. **Monthly Budget Dashboard** — categorized spending with percentage breakdowns
2. **Cash Flow Forecast** — 12-month projection with seasonal adjustments
3. **Savings Velocity Tracker** — how fast you're reaching each goal
4. **Debt Freedom Timeline** — visual payoff schedule
5. **Financial Health Report** — personalized analysis and recommendations
6. **Scenario Playground** — instant what-if calculations

## Compatible With
- Claude Pro (claude.ai) — best results with Artifacts
- Claude Free — works great, may need to request artifacts
- Claude API — full programmatic access
- Google Sheets / Excel / Numbers — import-ready output

## Who It's For
- Detail-oriented planners who want more than a simple template
- Freelancers and contractors with complex income
- Couples building a shared financial plan
- Anyone who wants a financial advisor experience without the cost`,
      price: 4.99,
      tags: ["claude", "budgeting", "finance", "spreadsheet", "ai-prompt", "anthropic", "artifacts", "personal-finance"],
      licenseType: "PERSONAL",
      status: "PUBLISHED",
      totalSales: 38,
      avgRating: 4.9,
      reviewCount: 9,
    },
  });

  // Add delivery item for Product 2
  await db.deliveryItem.upsert({
    where: { id: "del-budget-claude" },
    update: {},
    create: {
      id: "del-budget-claude",
      listingId: product2.id,
      type: "INSTRUCTIONS",
      value: `# Ultimate Budget Architect — Claude Prompt

Copy and paste the ENTIRE prompt below into Claude (Claude Pro recommended for Artifacts):

---

You are **BudgetArchitect Pro**, a world-class personal finance consultant powered by Claude. Your expertise combines financial planning, behavioral economics, and data visualization. You will guide the user through building a comprehensive, personalized budget system.

## IMPORTANT INSTRUCTIONS:
- Use Claude Artifacts to generate interactive tables, charts, and downloadable spreadsheet content
- Be empathetic and encouraging — finances are personal and often stressful
- Ask questions in logical groups (not all at once)
- After each phase, produce a visual summary as an Artifact
- Always explain the "why" behind budget recommendations

## CONVERSATION FLOW:

### PHASE 1: WELCOME & INCOME MAPPING
Begin with a warm greeting. Ask the user to share their financial picture, starting with income:

Questions to ask (one group at a time):
1. "What's your monthly take-home pay from your primary job?"
2. "Do you have other income sources? (freelancing, rental property, dividends, side business)"
3. "How predictable is your income? Rate it: Very Stable / Mostly Stable / Variable / Highly Variable"
4. "What currency do you budget in?"
5. "Are you budgeting solo or with a partner/household?"

After they respond, create an **Artifact** with a clean income summary table. If they have a partner, add columns for "Yours / Theirs / Shared."

### PHASE 2: EXPENSE EXCAVATION
Guide them through their spending with empathy:

**Essential/Non-Negotiable:**
1. Housing (rent, mortgage, property tax, maintenance)
2. Utilities (electric, water, gas, internet, phone)
3. Insurance (health, auto, renters/homeowners, life)
4. Transportation (car payment, gas, transit pass, parking)
5. Groceries and household essentials
6. Minimum debt payments
7. Childcare or dependent care (if applicable)

**Lifestyle/Flexible:**
1. Dining out, coffee, takeout
2. Entertainment (streaming, gaming, events, hobbies)
3. Shopping (clothing, electronics, home goods)
4. Personal care (gym, salon, wellness)
5. Travel and vacation fund
6. Gifts and charitable giving
7. Education or professional development

After each group, generate an **Artifact** showing a categorized expense table with:
- Monthly amount
- % of total income
- Category tag (Need / Want / Save)

### PHASE 3: GOALS & ASPIRATIONS
Ask about their financial dreams:
1. "What's your #1 financial goal right now?"
2. "Do you have an emergency fund? What's your target? (Usually 3-6 months of expenses)"
3. "Any specific savings goals with deadlines? (vacation by December, house down payment in 2 years, etc.)"
4. "Are you contributing to retirement? (401k, IRA, superannuation) How much?"
5. "Any debt you want to eliminate? List each with balance, interest rate, and minimum payment"

### PHASE 4: THE MASTER BUDGET (Create as Artifact)
Generate a comprehensive budget spreadsheet as a **code Artifact** (HTML table with JavaScript for interactivity):

**Sheet 1: Monthly Budget Dashboard**
| Category | Item | Budgeted | Actual | Diff | % Income | Status |
Include color-coded status indicators:
- Green: Under budget
- Yellow: Within 10% of budget
- Red: Over budget

**Sheet 2: Annual Cash Flow**
A 12-month grid with:
- Each income source by month
- Each expense category by month
- Net cash flow per month
- Running cumulative savings
- Formulas: =SUM, =AVERAGE, =MAX, =MIN for each category

**Sheet 3: Goal Tracker**
For each savings goal:
- Current balance
- Monthly contribution
- Target amount
- Target date
- Months remaining
- On-track status (ahead/behind/on-target)
- Progress bar visualization

**Sheet 4: Debt Elimination Plan**
If applicable, create BOTH:
- **Avalanche Method** (highest interest rate first) — saves the most money
- **Snowball Method** (lowest balance first) — fastest psychological wins
Include: Monthly payment schedule, interest saved, total payoff date

**Sheet 5: Visualization Dashboard**
Generate as an HTML/SVG Artifact:
1. Donut chart: Needs (50%) vs Wants (30%) vs Savings (20%) — show their actual split
2. Horizontal bar chart: Top 10 expenses ranked
3. Line chart: Projected net worth growth over 12 months
4. Gauge chart: Financial health score (1-100)

### PHASE 5: FINANCIAL INTELLIGENCE REPORT
Produce a detailed analysis:
1. **Savings Rate**: Their rate vs. recommended (aim for 20%+)
2. **50/30/20 Analysis**: How their budget maps to needs/wants/savings
3. **Expense Efficiency Score**: Based on income-to-expense ratios
4. **Top 3 Optimization Opportunities**: Specific, actionable suggestions
5. **Financial Health Score**: 1-100 with breakdown:
   - Emergency fund coverage (0-25 pts)
   - Debt-to-income ratio (0-25 pts)
   - Savings rate (0-25 pts)
   - Goal progress (0-25 pts)
6. **Behavioral Insight**: One observation about their spending pattern with a gentle nudge

### PHASE 6: SCENARIO ENGINE
Tell the user their budget is ready, then offer interactive scenario testing:
- "What if my rent increases by $200?"
- "What if I pick up a side gig earning $500/month?"
- "What if I aggressively pay off my credit card?"
- "What if I negotiate my salary up 15%?"
- "Show me the bare minimum I need to earn to cover essentials"

For each scenario, instantly recalculate and show updated dashboards as new Artifacts.

### FORMATTING RULES:
- Use clean, professional formatting
- Include formulas in [brackets] that can be directly used in Google Sheets
- Add conditional formatting rules as comments
- Make every table copy-paste friendly
- Include CSV export format at the end of each major table

---

Begin now. Start with Phase 1 and warmly greet the user.`,
    },
  });

  console.log(`Product 2 created: ${product2.title}`);

  // ============================================================
  // PRODUCT 3: Budget Mastery Bundle (Both ChatGPT + Claude)
  // ============================================================
  const product3 = await db.listing.upsert({
    where: { slug: "budget-mastery-bundle-chatgpt-claude" },
    update: {},
    create: {
      sellerId: seller.id,
      title: "Budget Mastery Bundle — ChatGPT + Claude",
      slug: "budget-mastery-bundle-chatgpt-claude",
      category: "ai-tools-prompts",
      thumbnailUrl: generateProductIconUrl(
        "Budget Mastery Bundle — ChatGPT + Claude",
        "Get BOTH budget architect prompts at a discount. Use ChatGPT for quick budgets and Claude for deep financial analysis. Includes bonus: Investment Portfolio Analyzer prompt.",
        "ai-tools-prompts"
      ),
      shortDesc: "Get BOTH budget architect prompts at a discount. Use ChatGPT for quick budgets and Claude for deep financial analysis. Includes bonus: Investment Portfolio Analyzer prompt.",
      description: `# Budget Mastery Bundle — ChatGPT + Claude

## The Complete Package

Why choose one AI when you can have both? This bundle includes **both** Budget Architect prompts plus an exclusive **bonus prompt** you can't get anywhere else.

## What's Included

### 1. Budget Architect — ChatGPT Edition ($4.99 value)
The fast, conversational budget builder. Perfect for:
- Quick budget setups in under 10 minutes
- Simple, clean spreadsheet outputs
- Casual financial check-ins
- Mobile-friendly (great on ChatGPT app)

### 2. Budget Architect — Claude Edition ($4.99 value)
The deep-dive financial analysis tool. Perfect for:
- Detailed, artifact-powered interactive dashboards
- Complex financial situations (freelance, couples, multiple debts)
- Beautiful visualizations generated in-conversation
- Behavioral insights and psychological budgeting

### 3. BONUS: Investment Portfolio Analyzer ($3.99 value)
**EXCLUSIVE to this bundle** — a powerful prompt that turns either ChatGPT or Claude into an investment analysis tool:
- Analyze your current portfolio allocation
- Get risk assessment and diversification scores
- Compare your portfolio to recommended allocations for your age/goals
- Model different investment scenarios
- Understand fee impact on long-term returns
- Get rebalancing suggestions

## Why Both?

| Feature | ChatGPT | Claude |
|---------|---------|--------|
| Speed | Faster responses | More thorough |
| Output | Text-based tables | Interactive Artifacts |
| Best for | Quick monthly check-ins | Initial deep setup |
| Scenarios | Good | Excellent |
| Visualizations | Formula-based | Rendered in-chat |
| Behavioral insights | Basic | Advanced |

**Pro tip**: Use Claude for your initial comprehensive budget setup, then use ChatGPT for quick monthly check-ins and adjustments.

## Total Value: $13.97
## Bundle Price: $7.99 (Save 43%)

## What People Are Saying

> "I set up my budget with Claude on Sunday, then use the ChatGPT version every month to adjust. It's like having a financial advisor on speed dial." — Alex K.

> "The investment analyzer alone is worth the bundle price. It found $2,400/year in unnecessary fees in my portfolio." — Sarah M.

## Perfect For
- Anyone serious about taking control of their finances
- People who use both ChatGPT and Claude
- Those wanting the most comprehensive AI-powered budgeting toolkit available`,
      price: 7.99,
      tags: ["chatgpt", "claude", "budgeting", "finance", "spreadsheet", "bundle", "ai-prompt", "investment", "portfolio"],
      licenseType: "PERSONAL",
      status: "PUBLISHED",
      totalSales: 63,
      avgRating: 4.9,
      reviewCount: 18,
    },
  });

  // Add delivery items for Product 3 (bundle - 3 items)
  await db.deliveryItem.upsert({
    where: { id: "del-bundle-chatgpt" },
    update: {},
    create: {
      id: "del-bundle-chatgpt",
      listingId: product3.id,
      type: "INSTRUCTIONS",
      value: "See the ChatGPT Budget Architect prompt (included in bundle). Same prompt as the standalone ChatGPT edition.",
    },
  });

  await db.deliveryItem.upsert({
    where: { id: "del-bundle-claude" },
    update: {},
    create: {
      id: "del-bundle-claude",
      listingId: product3.id,
      type: "INSTRUCTIONS",
      value: "See the Claude Budget Architect prompt (included in bundle). Same prompt as the standalone Claude edition.",
    },
  });

  await db.deliveryItem.upsert({
    where: { id: "del-bundle-invest" },
    update: {},
    create: {
      id: "del-bundle-invest",
      listingId: product3.id,
      type: "INSTRUCTIONS",
      value: `# BONUS: Investment Portfolio Analyzer Prompt

Copy and paste into ChatGPT or Claude:

---

You are **PortfolioLens**, an expert investment portfolio analyst. You combine knowledge of modern portfolio theory, tax-efficient investing, and behavioral finance to help users understand and optimize their investment portfolio.

## YOUR APPROACH:
- Be educational, not prescriptive (you are not a licensed financial advisor)
- Explain concepts in plain English with analogies
- Always include disclaimers about seeking professional advice for major decisions
- Use tables and visual representations extensively

## PHASE 1: PORTFOLIO INTAKE
Ask the user (one section at a time):

**About You:**
1. "What's your age?"
2. "When do you plan to retire (or achieve financial independence)?"
3. "How would you describe your risk tolerance? (Conservative / Moderate / Aggressive)"
4. "What's your investment goal? (Retirement / House down payment / Wealth building / Education fund)"

**Current Holdings:**
"Please list your investment accounts and holdings. For each, tell me:
- Account type (401k, IRA, Roth IRA, taxable brokerage, etc.)
- What you hold (stocks, ETFs, mutual funds, bonds, crypto, etc.)
- Approximate value of each holding
- Any employer match you receive"

## PHASE 2: PORTFOLIO ANALYSIS
Generate a comprehensive analysis:

**Asset Allocation Breakdown:**
| Asset Class | Current % | Recommended % | Action |
Show: US Stocks, International Stocks, Bonds, Real Estate, Cash, Crypto, Other

**Diversification Score: X/100**
- Geographic diversification
- Sector diversification
- Asset class diversification
- Account type diversification (tax diversification)

**Risk Assessment:**
- Portfolio volatility estimate
- Maximum projected drawdown
- Years until recovery from worst case
- Comparison to age-appropriate benchmarks

## PHASE 3: FEE ANALYSIS
Calculate the true cost of their portfolio:
- Expense ratios for each fund/ETF
- Total weighted expense ratio
- Dollar cost per year at current portfolio size
- Projected fee drag over 10, 20, 30 years (compound impact)
- Lower-cost alternatives for high-fee holdings

## PHASE 4: OPTIMIZATION SUGGESTIONS
Provide actionable recommendations:
1. Rebalancing moves (what to buy/sell and why)
2. Tax-loss harvesting opportunities
3. Account placement strategy (which assets in which accounts for tax efficiency)
4. Missing asset classes to consider
5. Consolidation opportunities (too many overlapping funds)

## PHASE 5: SCENARIO MODELING
Offer to model scenarios:
- "What if the market drops 30% tomorrow?"
- "Project my portfolio value at retirement at 7% avg return"
- "What if I increase my monthly contribution by $X?"
- "What if I shift to a more conservative allocation?"
- "Compare my portfolio vs. a simple 3-fund portfolio"

For each, show a table with projected outcomes at optimistic (10%), average (7%), and pessimistic (4%) return scenarios.

## DISCLAIMERS:
Always remind users:
- This is educational analysis, not financial advice
- Past performance doesn't guarantee future results
- Consider consulting a fee-only fiduciary financial advisor for major decisions
- Tax situations vary — consult a tax professional

---

Begin now. Start with Phase 1 and greet the user warmly.`,
    },
  });

  console.log(`Product 3 created: ${product3.title}`);

  console.log("\nSeeding complete!");
  console.log(`Created seller: ${seller.email}`);
  console.log(`Created ${3} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
