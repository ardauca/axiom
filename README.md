# Axiom — Gymnasium for Mathematical & Algorithmic Reason

[![Next.js](https://img.shields.io/badge/Next.js-15.2.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![KaTeX](https://img.shields.io/badge/KaTeX-LaTeX%20Math-green?style=flat)](https://katex.org/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**Axiom** is a full-stack, university-level interactive learning and deliberate problem-solving platform for Mathematics and Computer Science. Inspired by first-principles pedagogical systems and competitive mathematical training, Axiom combines **adaptive problem solving**, **8-step structured concept learning**, **academic source provenance**, and **multi-level mathematical verification**.

---

## 🏛️ Pedagogical & Architectural Pillars

### 1. Three Complementary Learning Modes
1. **Learn Mode (The Academy):** Structured mini-lessons for users encountering a topic for the first time:
   $$\text{Intuition} \to \text{Formal Definition} \to \text{Mathematical Notation} \to \text{Worked Source Example} \to \text{Mini Knowledge Check} \to \text{Guided Practice}$$
2. **Practice Arena (The Gym):** Progressive difficulty problem sets calibrated with an adaptive Elo rating system (1000–2200+).
3. **Mastery Diagnostics (5-Dimensional Evaluation):** Assesses Conceptual Grasp, Formulaic Precision, Problem-Solving Depth, Cross-Topic Transfer, and Independence Score.

### 2. Dual-Track Epistemic Rigor (Authority ≠ Verification)
Axiom strictly separates academic provenance from mathematical truth:
- **Academic Authority:** Tracks professor authorship, official department curricula, and past university examination papers (e.g., Eskişehir Osmangazi University Department of Mathematics & Computer Science).
- **Content Verification Levels:**
  - `SOURCE_REFERENCED`: Grounded in official course notes with exact chapter/page citations.
  - `SOURCE_CROSS_CHECKED`: Corroborated across multiple independent textbooks (e.g., Adams & Essex *Calculus*).
  - `SYMBOLICALLY_VERIFIED`: Analytically validated via Computer Algebra Systems (SymPy, CAS).
  - `NUMERICALLY_VERIFIED`: Hardware bitfields or numerical bounds verified.
  - `CODE_VERIFIED`: Algorithm scripts executed and sandbox-tested.
  - `HUMAN_REVIEWED`: Handwritten exam papers inspected and transcribed.

### 3. Source-Grounded Problem Pipeline
Problems are never published blindly. Every source-adapted or generated exercise passes through an 8-stage gatekeeper:
$$\text{Parse} \to \text{Answer Generation} \to \text{CAS Verification} \to \text{Derivation Check} \to \text{Elo Difficulty} \to \text{Ambiguity Check} \to \text{Provenance Attachment} \to \text{Publish}$$

---

## 📂 Source Library & Course Curriculum

- **Hierarchical Multi-Repository Architecture:**
  - **Master Archive (`repo-master`):** Full 1st–3rd year undergraduate curriculum spanning 850+ academic assets across 12 distinct subjects.
  - **Active Semester Archive (`repo-active`):** 2nd Year Fall working directory with real examination papers and derivations.
  - **Deduplication:** 339 exact duplicate clusters mapped across repositories without redundant database duplication.
- **Interactive Source Library (`/sources`):**
  - Filtering by *Primary Theory*, *Exam Papers*, *Supporting Notes*, *Duplicates*, and *Conflicts*.
  - Live keyword-indexed search (e.g. *Laplace transform*, *Euler graph*, *Cache mapping*, *Bernoulli*).
  - Side-by-side **Source Comparison Matrix** (Authority, Coverage, Examples, Problems, Verification).
  - Explicit *"Why This Source?"* cards explaining pedagogical rationale.
- **Course Catalog (`/courses`):**
  - Displays undergraduate courses with active semester indicators and cross-course prerequisite links (`DIRECT_ACADEMIC` vs. `INFERRED_PREREQUISITE`).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15.2 (App Router)](https://nextjs.org/)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS 3.4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Mathematics & Typography:** [KaTeX](https://katex.org/) (Fast LaTeX rendering with delimiter preprocessing)
- **Database & ORM:** [SQLite](https://www.sqlite.org/) with [Prisma 6](https://www.prisma.io/)
- **Editor & Coding Arena:** [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Algorithms:** Glicko-2 / Elo Rating Engine, SM-2 Spaced Repetition

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ardauca/axiom.git
   cd axiom
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database & Seed Academic Knowledge:**
   ```bash
   npx prisma db push
   npx tsx scripts/seed_academic_knowledge.ts
   npx tsx scripts/seed_academic_lessons_and_problems.ts
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & End-to-End Tests

Axiom includes an automated end-to-end verification test suite covering 9 real university scenarios across Mathematics and Computer Science:

```bash
npx tsx scripts/run_academic_e2e_tests.ts
```

**Tested Scenarios (`Source -> Learn -> Example -> Practice -> Hint -> Solution -> Mastery`):**
1. **Analysis III:** Directional Derivatives & Gradient Vectors (ESOGÜ 2023 Final Exam)
2. **Differential Equations:** Bernoulli Nonlinear ODE Transformation (ESOGÜ 2025 Final Exam)
3. **Graph Theory:** Eulerian Graphs & Handshaking Lemma (Prof. Dr. İbrahim Günaltılı)
4. **Computer Architecture:** Cache Memory Mapping Bitfield Calculations (Doç. Dr. Özer Çelik, 2021 Final)
5. **Linear Algebra:** Eigenvalues & Characteristic Polynomials
6. **Discrete Mathematics:** Mathematical Induction
7. **Python Algorithms:** Euclidean Algorithm & Number Theory
8. **MATLAB / Scientific Computing:** Numerical Trapezoidal Integration (`trapz`)
9. **Visual Programming (C# .NET):** Event-Driven Programming & Multicast Delegates

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
