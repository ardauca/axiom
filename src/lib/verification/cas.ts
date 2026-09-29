/**
 * Axiom Computer Algebra System (CAS) & Answer Verification Engine:
 * Implements deterministic mathematical evaluation, symbolic algebraic equivalence,
 * trigonometric and rational identity testing via multi-point sampling,
 * and high-precision numerical parsing.
 * 
 * Epistemic Honesty:
 * Algebraic equivalence is verified via multi-point numerical sampling over real domain test vectors.
 * While numerically decisive for polynomials, rational functions, and analytic identities,
 * it is not a formal theorem prover over complex branch cuts.
 */

export interface VerificationResult {
  isCorrect: boolean;
  feedback?: string;
  normalizedUserAnswer: string;
  normalizedExpectedAnswer: string;
  verificationMethod?: 'EXACT_MATCH' | 'NUMERIC_TOLERANCE' | 'MULTI_POINT_SAMPLING' | 'SET_EQUIVALENCE';
  pointsTested?: number;
}

const RESERVED_WORDS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
  'sqrt', 'cbrt', 'ln', 'log', 'log10', 'log2', 'exp', 'abs',
  'pi', 'e'
]);

/**
 * Clean and normalize mathematical strings:
 * Removes LaTeX artifacts, normalizes fractions, powers, trig powers, and whitespace.
 */
export function normalizeMathString(input: string): string {
  if (!input) return '';
  let s = input.trim();

  // KaTeX fractions: \frac{a}{b} -> ((a)/(b))
  // Handle nested fractions recursively up to 3 levels
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  }

  // Common LaTeX symbols and functions
  s = s
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '(')
    .replace(/\\right\]/g, ')')
    .replace(/\\cdot/g, '*')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\pi\b/g, 'pi')
    .replace(/\\theta\b/g, 'theta')
    .replace(/\\sin\b/g, 'sin')
    .replace(/\\cos\b/g, 'cos')
    .replace(/\\tan\b/g, 'tan')
    .replace(/\\sec\b/g, 'sec')
    .replace(/\\csc\b/g, 'csc')
    .replace(/\\cot\b/g, 'cot')
    .replace(/\\ln\b/g, 'ln')
    .replace(/\\log\b/g, 'log')
    .replace(/\\exp\b/g, 'exp')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\sqrt\b/g, 'sqrt')
    .replace(/\{([^{}]+)\}/g, '($1)');

  // Trig power notation: sin^2(x) -> (sin(x))^2, \cos^2(x) -> (cos(x))^2
  s = s.replace(/\b(sin|cos|tan|cot|sec|csc)\^(\d+)\s*\(([^)]+)\)/g, '($1($3))^$2');
  s = s.replace(/\b(sin|cos|tan|cot|sec|csc)\^(\d+)\s*([a-zA-Z])/g, '($1($3))^$2');

  // Convert ^ to ** for powers if needed, or leave ^ for parser
  s = s.replace(/\s+/g, '');
  return s;
}

/**
 * Detect all free variables in an expression (e.g. 'x', 'n', 'k', 't', 'theta').
 */
export function extractVariables(expr: string): string[] {
  const norm = normalizeMathString(expr);
  // Match identifiers
  const matches = norm.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  const vars = new Set<string>();

  for (const m of matches) {
    const lower = m.toLowerCase();
    if (!RESERVED_WORDS.has(lower) && lower !== 'pi' && lower !== 'e') {
      vars.add(m);
    }
  }

  return Array.from(vars);
}

/**
 * Tokenize a mathematical expression for safe recursive descent parsing.
 */
type TokenType = 'NUMBER' | 'IDENT' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = expr.length;

  while (i < n) {
    const ch = expr[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/\d/.test(ch) || (ch === '.' && i + 1 < n && /\d/.test(expr[i + 1]))) {
      let numStr = ch;
      i++;
      while (i < n && (/[\d.]/.test(expr[i]))) {
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let ident = ch;
      i++;
      while (i < n && /[a-zA-Z0-9_]/.test(expr[i])) {
        ident += expr[i];
        i++;
      }
      tokens.push({ type: 'IDENT', value: ident });
      continue;
    }

    if (ch === '(' || ch === '[') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')' || ch === ']') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if (ch === '*' && i + 1 < n && expr[i + 1] === '*') {
      tokens.push({ type: 'OP', value: '^' });
      i += 2;
      continue;
    }

    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    // Skip unhandled characters safely
    i++;
  }

  // Insert implicit multiplication tokens:
  // e.g. 2x -> 2 * x, (x+1)(x-1) -> (x+1) * (x-1), 2(x) -> 2 * (x), x y -> x * y
  const expanded: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    expanded.push(tokens[j]);
    if (j + 1 < tokens.length) {
      const curr = tokens[j];
      const next = tokens[j + 1];

      const currCanBeFollowedByMul =
        curr.type === 'NUMBER' ||
        curr.type === 'IDENT' ||
        curr.type === 'RPAREN';

      const nextCanBePrecededByMul =
        next.type === 'IDENT' ||
        next.type === 'LPAREN' ||
        (next.type === 'NUMBER' && curr.type === 'RPAREN');

      const isFunctionCall =
        curr.type === 'IDENT' &&
        RESERVED_WORDS.has(curr.value.toLowerCase()) &&
        next.type === 'LPAREN';

      if (!isFunctionCall && currCanBeFollowedByMul && nextCanBePrecededByMul) {
        expanded.push({ type: 'OP', value: '*' });
      }
    }
  }

  return expanded;
}

/**
 * Safe Recursive Descent Math Evaluator.
 * Zero eval, zero new Function, fully sandboxed AST/recursive evaluation.
 */
class MathEvaluator {
  private tokens: Token[];
  private pos: number = 0;
  private vars: Record<string, number>;

  constructor(tokens: Token[], vars: Record<string, number> = {}) {
    this.tokens = tokens;
    this.vars = vars;
  }

  public parse(): number {
    this.pos = 0;
    const res = this.parseExpression();
    return res;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  // Expression: Addition & Subtraction
  private parseExpression(): number {
    let val = this.parseTerm();

    while (this.pos < this.tokens.length) {
      const tok = this.peek();
      if (tok && tok.type === 'OP' && (tok.value === '+' || tok.value === '-')) {
        this.consume();
        const rhs = this.parseTerm();
        val = tok.value === '+' ? val + rhs : val - rhs;
      } else {
        break;
      }
    }
    return val;
  }

  // Term: Multiplication & Division
  private parseTerm(): number {
    let val = this.parseFactor();

    while (this.pos < this.tokens.length) {
      const tok = this.peek();
      if (tok && tok.type === 'OP' && (tok.value === '*' || tok.value === '/')) {
        this.consume();
        const rhs = this.parseFactor();
        if (tok.value === '/') {
          if (Math.abs(rhs) < 1e-14) {
            val = NaN; // division by zero
          } else {
            val = val / rhs;
          }
        } else {
          val = val * rhs;
        }
      } else {
        break;
      }
    }
    return val;
  }

  // Factor: Exponentiation (right-associative: 2^3^2 = 2^(3^2))
  private parseFactor(): number {
    let base = this.parseUnary();

    const tok = this.peek();
    if (tok && tok.type === 'OP' && tok.value === '^') {
      this.consume();
      const exp = this.parseFactor();
      return Math.pow(base, exp);
    }
    return base;
  }

  // Unary operators: + -
  private parseUnary(): number {
    const tok = this.peek();
    if (tok && tok.type === 'OP' && (tok.value === '+' || tok.value === '-')) {
      this.consume();
      const operand = this.parseUnary();
      return tok.value === '-' ? -operand : operand;
    }
    return this.parsePrimary();
  }

  // Primary: Number, Identifier, Function Call, or Parenthesized expr
  private parsePrimary(): number {
    const tok = this.peek();
    if (!tok) return NaN;

    if (tok.type === 'NUMBER') {
      this.consume();
      return Number(tok.value);
    }

    if (tok.type === 'LPAREN') {
      this.consume();
      const inner = this.parseExpression();
      if (this.peek()?.type === 'RPAREN') {
        this.consume();
      }
      return inner;
    }

    if (tok.type === 'IDENT') {
      const name = this.consume().value;
      const lower = name.toLowerCase();

      // Constants
      if (lower === 'pi') return Math.PI;
      if (lower === 'e') return Math.E;

      // Function calls: ident followed by '('
      if (this.peek()?.type === 'LPAREN') {
        this.consume(); // eat '('
        const arg = this.parseExpression();
        if (this.peek()?.type === 'RPAREN') {
          this.consume(); // eat ')'
        }

        switch (lower) {
          case 'sin': return Math.sin(arg);
          case 'cos': return Math.cos(arg);
          case 'tan': return Math.tan(arg);
          case 'cot': return 1 / Math.tan(arg);
          case 'sec': return 1 / Math.cos(arg);
          case 'csc': return 1 / Math.sin(arg);
          case 'sqrt': return arg < 0 ? NaN : Math.sqrt(arg);
          case 'cbrt': return Math.cbrt(arg);
          case 'abs': return Math.abs(arg);
          case 'ln': return arg <= 0 ? NaN : Math.log(arg);
          case 'log': return arg <= 0 ? NaN : Math.log10(arg);
          case 'exp': return Math.exp(arg);
          default: return NaN;
        }
      }

      // Variable evaluation
      if (name in this.vars) {
        return this.vars[name];
      }
      if (lower in this.vars) {
        return this.vars[lower];
      }

      return NaN;
    }

    return NaN;
  }
}

/**
 * Safely evaluates a normalized math expression given variable assignments.
 */
export function evaluateExpression(expr: string, vars: Record<string, number> = {}): number {
  try {
    const normalized = normalizeMathString(expr);
    const tokens = tokenize(normalized);
    const evaluator = new MathEvaluator(tokens, vars);
    return evaluator.parse();
  } catch {
    return NaN;
  }
}

/**
 * Parse numeric or fractional values (e.g., "7", "-14", "3/4", "0.25", "1/2")
 */
export function parseNumericValue(input: string): number | null {
  if (!input) return null;
  const cleaned = input.trim().replace(/\s+/g, '');

  // Check fraction "a/b"
  if (/^-?\d+\s*\/\s*-?\d+$/.test(cleaned)) {
    const [num, den] = cleaned.split('/').map(Number);
    if (den === 0) return null;
    return num / den;
  }

  // Support single decimal or integer
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Algebraic Equivalence Tester via Multi-Point Evaluation:
 * Evaluates algebraic/trigonometric expressions at multiple pseudo-irrational/fractional points.
 * Handles auto-detection of variables (x, n, k, t, etc.), rational singularities,
 * and trigonometric identities (e.g., sin^2(x) + cos^2(x) = 1).
 */
export function testAlgebraicEquivalence(
  userExpr: string,
  expectedExpr: string,
  explicitVariable?: string
): { isEquivalent: boolean; pointsTested: number } {
  const normUser = normalizeMathString(userExpr);
  const normExpected = normalizeMathString(expectedExpr);

  if (normUser === normExpected) {
    return { isEquivalent: true, pointsTested: 0 };
  }

  // Extract variables
  const userVars = extractVariables(userExpr);
  const expectedVars = extractVariables(expectedExpr);
  const allVars = Array.from(new Set([...userVars, ...expectedVars]));

  // If explicit variable given and not in allVars, include it
  if (explicitVariable && !allVars.includes(explicitVariable)) {
    allVars.push(explicitVariable);
  }

  // If no variables found, treat as constant expressions
  if (allVars.length === 0) {
    const valUser = evaluateExpression(userExpr);
    const valExpected = evaluateExpression(expectedExpr);
    if (!isNaN(valUser) && !isNaN(valExpected) && Math.abs(valUser - valExpected) < 1e-6) {
      return { isEquivalent: true, pointsTested: 1 };
    }
    return { isEquivalent: false, pointsTested: 0 };
  }

  // Generate test sample points that avoid integers (to prevent poles like x=1, x=2, x=0)
  // and choose diverse coordinates
  const sampleValues = [
    0.7329,
    1.6180,
    2.4142,
    -0.5821,
    3.1415 / 4,
    4.8213,
    -2.3175,
    0.3491,
    5.6189,
    -1.1274
  ];

  let successfulMatches = 0;
  const targetMatches = 5;

  for (let step = 0; step < sampleValues.length && successfulMatches < targetMatches; step++) {
    const baseVal = sampleValues[step];
    const pointVars: Record<string, number> = {};

    allVars.forEach((v, idx) => {
      // Offset each variable slightly to prevent artificial symmetry
      pointVars[v] = baseVal + idx * 0.4142;
    });

    const userVal = evaluateExpression(userExpr, pointVars);
    const expectedVal = evaluateExpression(expectedExpr, pointVars);

    // Skip singularities or domain out-of-bounds (e.g. division by zero, negative sqrt)
    if (isNaN(userVal) || isNaN(expectedVal) || !isFinite(userVal) || !isFinite(expectedVal)) {
      continue;
    }

    // Relative and absolute error check
    const diff = Math.abs(userVal - expectedVal);
    const scale = 1 + Math.max(Math.abs(userVal), Math.abs(expectedVal));
    if (diff / scale > 1e-5) {
      return { isEquivalent: false, pointsTested: successfulMatches + 1 };
    }

    successfulMatches++;
  }

  return {
    isEquivalent: successfulMatches >= 3,
    pointsTested: successfulMatches
  };
}

export function areAlgebraicallyEquivalent(
  userExpr: string,
  expectedExpr: string,
  explicitVariable?: string
): boolean {
  return testAlgebraicEquivalence(userExpr, expectedExpr, explicitVariable).isEquivalent;
}

/**
 * Master Verification Dispatcher:
 * Handles MULTIPLE_CHOICE, NUMERIC, ALGEBRAIC, MULTI_STEP, etc.
 */
export function verifyAnswer({
  userAnswer,
  correctAnswer,
  questionType,
}: {
  userAnswer: string;
  correctAnswer: string;
  questionType: string;
}): VerificationResult {
  const cleanUser = userAnswer ? userAnswer.trim() : '';
  const cleanCorrect = correctAnswer ? correctAnswer.trim() : '';

  // 1. Multiple Choice / Categorical / Code exact token match
  if (
    questionType === 'MULTIPLE_CHOICE' ||
    questionType === 'DEBUGGING' ||
    questionType === 'PROOF_REASONING'
  ) {
    const isCorrect =
      cleanUser.toLowerCase() === cleanCorrect.toLowerCase() ||
      cleanUser === cleanCorrect;
    return {
      isCorrect,
      normalizedUserAnswer: cleanUser,
      normalizedExpectedAnswer: cleanCorrect,
      verificationMethod: 'EXACT_MATCH',
    };
  }

  // 2. Numeric Input (supports fractions, decimals, negative integers, expressions)
  if (questionType === 'NUMERIC') {
    const userNum = parseNumericValue(cleanUser);
    const correctNum = parseNumericValue(cleanCorrect);

    if (userNum !== null && correctNum !== null) {
      const isCorrect = Math.abs(userNum - correctNum) < 1e-5;
      return {
        isCorrect,
        normalizedUserAnswer: String(userNum),
        normalizedExpectedAnswer: String(correctNum),
        verificationMethod: 'NUMERIC_TOLERANCE',
      };
    }

    // Try evaluating both expressions if numeric parse wasn't plain
    const evalUser = evaluateExpression(cleanUser);
    const evalCorrect = evaluateExpression(cleanCorrect);
    if (!isNaN(evalUser) && !isNaN(evalCorrect)) {
      const isCorrect = Math.abs(evalUser - evalCorrect) < 1e-5;
      return {
        isCorrect,
        normalizedUserAnswer: String(evalUser),
        normalizedExpectedAnswer: String(evalCorrect),
        verificationMethod: 'NUMERIC_TOLERANCE',
      };
    }
  }

  // 3. Algebraic Input
  if (questionType === 'ALGEBRAIC') {
    const { isEquivalent, pointsTested } = testAlgebraicEquivalence(cleanUser, cleanCorrect);
    return {
      isCorrect: isEquivalent,
      normalizedUserAnswer: cleanUser,
      normalizedExpectedAnswer: cleanCorrect,
      verificationMethod: 'MULTI_POINT_SAMPLING',
      pointsTested,
    };
  }

  // 4. Multi-step answers (JSON stringified array or comma-separated)
  if (questionType === 'MULTI_STEP') {
    try {
      const userArr = JSON.parse(cleanUser);
      const correctArr = JSON.parse(cleanCorrect);
      if (Array.isArray(userArr) && Array.isArray(correctArr)) {
        const isCorrect =
          userArr.length === correctArr.length &&
          userArr.every((val, i) => String(val).trim() === String(correctArr[i]).trim());
        return {
          isCorrect,
          normalizedUserAnswer: cleanUser,
          normalizedExpectedAnswer: cleanCorrect,
          verificationMethod: 'SET_EQUIVALENCE',
        };
      }
    } catch {
      // Fallback to literal string match
    }
  }

  // Default fallback (checks algebraic equivalence or literal match)
  const directMatch = normalizeMathString(cleanUser) === normalizeMathString(cleanCorrect);
  if (directMatch) {
    return {
      isCorrect: true,
      normalizedUserAnswer: cleanUser,
      normalizedExpectedAnswer: cleanCorrect,
      verificationMethod: 'EXACT_MATCH',
    };
  }

  const { isEquivalent, pointsTested } = testAlgebraicEquivalence(cleanUser, cleanCorrect);
  return {
    isCorrect: isEquivalent,
    normalizedUserAnswer: cleanUser,
    normalizedExpectedAnswer: cleanCorrect,
    verificationMethod: isEquivalent ? 'MULTI_POINT_SAMPLING' : 'EXACT_MATCH',
    pointsTested,
  };
}
