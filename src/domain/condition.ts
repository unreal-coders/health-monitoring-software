// Parser and evaluator for the `when` conditions of the threshold rules.
//
// Grammar (see data/indicator-schema.md, section 3.6):
//   condition  := and-group ( "or" and-group )*
//   and-group  := comparison ( "and" comparison )*
//   comparison := name ( "<" | "<=" | ">" | ">=" ) number
//
// "and" binds tighter than "or", as in most languages. Conditions are parsed
// once when the sheets load, so a malformed condition fails at build time.

type Operator = '<' | '<=' | '>' | '>='

interface Comparison {
  name: string
  operator: Operator
  number: number
}

// An expression in disjunctive form: OR of AND-groups of comparisons.
type Expression = Comparison[][]

export interface Condition {
  readonly text: string
  /** Names the condition reads, e.g. "value" or "systolic". */
  readonly variables: ReadonlySet<string>
  evaluate(values: Readonly<Record<string, number>>): boolean
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: Operator }
  | { type: 'word'; value: string }

const TOKEN = /\s*(?:(\d+(?:\.\d+)?)|(<=|>=|<|>)|([a-z_]+))/y

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  TOKEN.lastIndex = 0
  while (TOKEN.lastIndex < text.length) {
    if (/^\s*$/.test(text.slice(TOKEN.lastIndex))) break
    const start = TOKEN.lastIndex
    const match = TOKEN.exec(text)
    if (!match) {
      throw new Error(`Unexpected character at position ${start} in condition "${text}"`)
    }
    if (match[1] !== undefined) tokens.push({ type: 'number', value: Number(match[1]) })
    else if (match[2] !== undefined) tokens.push({ type: 'operator', value: match[2] as Operator })
    else tokens.push({ type: 'word', value: match[3] })
  }
  return tokens
}

function parse(text: string): Expression {
  const tokens = tokenize(text)
  let position = 0

  const fail = (expected: string): never => {
    const found = tokens[position]
    throw new Error(
      `Expected ${expected} but found ${found ? `"${found.value}"` : 'end of condition'} in condition "${text}"`,
    )
  }

  const comparison = (): Comparison => {
    const name = tokens[position]
    if (name?.type !== 'word' || name.value === 'and' || name.value === 'or') fail('a value name')
    position++
    const operator = tokens[position]
    if (operator?.type !== 'operator') fail('a comparison operator')
    position++
    const number = tokens[position]
    if (number?.type !== 'number') fail('a number')
    position++
    return {
      name: (name as { value: string }).value,
      operator: (operator as { value: Operator }).value,
      number: (number as { value: number }).value,
    }
  }

  const isWord = (word: string) => {
    const token = tokens[position]
    return token?.type === 'word' && token.value === word
  }

  const expression: Expression = []
  let group: Comparison[] = [comparison()]
  while (position < tokens.length) {
    if (isWord('and')) {
      position++
      group.push(comparison())
    } else if (isWord('or')) {
      position++
      expression.push(group)
      group = [comparison()]
    } else {
      fail('"and", "or", or the end of the condition')
    }
  }
  expression.push(group)
  return expression
}

function compare(left: number, operator: Operator, right: number): boolean {
  switch (operator) {
    case '<':
      return left < right
    case '<=':
      return left <= right
    case '>':
      return left > right
    case '>=':
      return left >= right
  }
}

export function compileCondition(text: string): Condition {
  const expression = parse(text)
  const variables = new Set(expression.flat().map((comparison) => comparison.name))
  return {
    text,
    variables,
    evaluate(values) {
      for (const name of variables) {
        if (typeof values[name] !== 'number' || !Number.isFinite(values[name])) {
          throw new Error(`Missing value "${name}" for condition "${text}"`)
        }
      }
      return expression.some((group) =>
        group.every(({ name, operator, number }) => compare(values[name], operator, number)),
      )
    },
  }
}
