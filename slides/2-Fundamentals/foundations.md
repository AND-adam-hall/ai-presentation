# AI Fundamentals<!--.element: class="r-fit-text" -->
### Demystifying Core Concepts

Note: To use these tools effectively, we must first understand what they ARE and, more importantly, what they ARE NOT.

---
### How it Works
- Pattern Matching vs. Understanding
- Probability over Logic

Note: AI does not "think" or "understand" in the human sense. It uses mathematics to find complex patterns in data. When an LLM writes text, it is calculating the statistical probability of the next word. It is probabilistic, not deterministic—it makes "educated guesses." This is why verification via the "Three-Gate Check" is mandatory; AI can be "confidently wrong."

---
### Data: The Core Engine
- **Garbage In, Garbage Out (GIGO)**
- The role of high-quality training data
- Why PA Media's archive is a goldmine

Note: GIGO is the ultimate risk to AI adoption. AI acts as an amplifier—it magnifies both the value (signal) and the errors (noise) in the input. To succeed, we must move our data up the hierarchy from "Bronze" (unstructured noise like loose PDFs) to "Gold" (structured, linked signal). PA Media's archive is a "Gold" mine waiting to be activated.

---
### Human in the Loop (HITL)
- From **Executor** to **Conductor**
- The Three-Gate Check
- "Eject to Human" Pattern

Note: As we move into Agentic work, the human role shifts from doing the work (Executor) to supervising it (Conductor). You define the 'Intent' and set the 'Constraints', while AI manages the execution. To ensure safety, we use the "Three-Gate Check": 1. Immediate Scan (30s), 2. Validation (5m fact-check), and 3. Integration (Final sign-off). High-stakes systems should include an "Eject to Human" pattern, where the AI transfers the task to an expert if its confidence score drops.

---
### Guardrails (Quick Look)
- **Three-Layer Defence**: Technical, Process, Culture
- **Lenses**: The Six Lenses of Readiness

Note: Safety isn't just about filters. We use a Three-Layer Defence: Technical controls (APIs/Firewalls), Process controls (verification steps), and Cultural controls (knowing the limits). We assess our maturity through the "Six Lenses of Readiness": Skills, Culture, Systems & Data, Use-Case Portfolio, Operating Model, and Workforce.
