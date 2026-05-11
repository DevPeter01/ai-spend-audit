import { describe, it, expect } from 'vitest'
import { runAudit } from './auditEngine'
import type { AuditInput } from '@/types'

describe('runAudit — core audit engine', () => {

  it('Test 1: Claude Max with 5 seats should recommend Team plan and save $350/mo', () => {
    const input: AuditInput = {
      tools: [{ tool: 'claude', plan: 'Max', monthlySpend: 500, seats: 5 }],
      teamSize: 5,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const claudeRec = result.recommendations[0]
    expect(claudeRec.monthlySavings).toBe(350)
    expect(claudeRec.recommendedPlan).toBe('Team')
    expect(result.totalMonthlySavings).toBe(350)
    expect(result.totalAnnualSavings).toBe(4200)
  })

  it('Test 2: Cursor Business with 3 seats should recommend Pro and save $60/mo', () => {
    const input: AuditInput = {
      tools: [{ tool: 'cursor', plan: 'Business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const cursorRec = result.recommendations[0]
    expect(cursorRec.monthlySavings).toBe(60)
    expect(cursorRec.recommendedPlan).toBe('Pro')
  })

  it('Test 3: Already optimal plan should return zero savings', () => {
    const input: AuditInput = {
      tools: [{ tool: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.recommendations[0].monthlySavings).toBe(0)
    expect(result.isOptimal).toBe(true)
  })

  it('Test 4: Total savings equals sum of all individual tool savings', () => {
    const input: AuditInput = {
      tools: [
        { tool: 'claude', plan: 'Max', monthlySpend: 500, seats: 5 },
        { tool: 'cursor', plan: 'Business', monthlySpend: 120, seats: 3 },
      ],
      teamSize: 5,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const sumOfTools = result.recommendations.reduce((sum, r) => sum + r.monthlySavings, 0)
    expect(result.totalMonthlySavings).toBe(sumOfTools)
    expect(result.totalMonthlySavings).toBe(410)
  })

  it('Test 5: Anthropic API high spend should recommend usage audit with savings', () => {
    const input: AuditInput = {
      tools: [{ tool: 'anthropic-api', plan: 'Pay as you go', monthlySpend: 600, seats: 1 }],
      teamSize: 3,
      useCase: 'mixed',
    }
    const result = runAudit(input)
    expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
  })

  it('Test 6: GitHub Copilot Enterprise under 10 seats should recommend Business plan', () => {
    const input: AuditInput = {
      tools: [{ tool: 'github-copilot', plan: 'Enterprise', monthlySpend: 390, seats: 10 }],
      teamSize: 10,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.recommendations[0].recommendedPlan).toBe('Business')
  })

  it('Test 7: monthlySavings is never negative for any input', () => {
    const input: AuditInput = {
      tools: [
        { tool: 'cursor', plan: 'Hobby', monthlySpend: 0, seats: 1 },
        { tool: 'claude', plan: 'Free', monthlySpend: 0, seats: 1 },
      ],
      teamSize: 1,
      useCase: 'writing',
    }
    const result = runAudit(input)
    result.recommendations.forEach((rec) => {
      expect(rec.monthlySavings).toBeGreaterThanOrEqual(0)
    })
  })

  it('Test 8: Annual savings equals monthly savings times 12', () => {
    const input: AuditInput = {
      tools: [{ tool: 'claude', plan: 'Max', monthlySpend: 500, seats: 5 }],
      teamSize: 5,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

})
