# TESTS.md

## Test Suite

Framework: Vitest
File: src/lib/auditEngine.test.ts

Run with:
```bash
npm test
```

## Test Coverage — Audit Engine

| Test | What it covers |
|------|---------------|
| Test 1 | Claude Max 5 seats → Team plan, saves $350/mo |
| Test 2 | Cursor Business 3 seats → Pro, saves $60/mo |
| Test 3 | Already optimal plan returns zero savings |
| Test 4 | Total savings equals sum of all tool savings |
| Test 5 | High API spend triggers usage audit recommendation |
| Test 6 | GitHub Copilot Enterprise under 10 seats → Business |
| Test 7 | monthlySavings is never negative for any input |
| Test 8 | Annual savings always equals monthly × 12 |

## How to Run

```bash
npm test
```

## Expected Output

All 8 tests should pass with zero failures.
The audit engine is deterministic — same input always produces same output.
