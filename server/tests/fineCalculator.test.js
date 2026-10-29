import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateFine } from '../src/utils/fineCalculator.js';

describe('Fine Calculation Engine (fineCalculator)', () => {
  it('should return zero fine if returned on the exact due date', () => {
    const dueAt = new Date('2026-10-15T12:00:00Z');
    const returnedAt = new Date('2026-10-15T18:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 5,
      maxFine: 500,
      gracePeriodDays: 0
    });

    assert.strictEqual(result.isOverdue, false);
    assert.strictEqual(result.overdueDays, 0);
    assert.strictEqual(result.fineAmount, 0);
  });

  it('should calculate fine for 1 calendar day past due date without grace period', () => {
    const dueAt = new Date('2026-10-15T10:00:00Z');
    const returnedAt = new Date('2026-10-16T14:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 5,
      maxFine: 500,
      gracePeriodDays: 0
    });

    assert.strictEqual(result.isOverdue, true);
    assert.strictEqual(result.overdueDays, 1);
    assert.strictEqual(result.fineAmount, 5);
  });

  it('should calculate fine for 5 calendar days overdue at configured rate', () => {
    const dueAt = new Date('2026-10-10T10:00:00Z');
    const returnedAt = new Date('2026-10-15T14:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 10,
      maxFine: 500,
      gracePeriodDays: 0
    });

    assert.strictEqual(result.isOverdue, true);
    assert.strictEqual(result.overdueDays, 5);
    assert.strictEqual(result.fineAmount, 50); // 5 * 10
  });

  it('should respect grace period: within grace period is zero fine', () => {
    const dueAt = new Date('2026-10-10T10:00:00Z');
    // 2 days late, but grace period is 2 days
    const returnedAt = new Date('2026-10-12T14:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 5,
      maxFine: 500,
      gracePeriodDays: 2
    });

    assert.strictEqual(result.isOverdue, false);
    assert.strictEqual(result.overdueDays, 0);
    assert.strictEqual(result.fineAmount, 0);
  });

  it('should charge only days past grace period boundary', () => {
    const dueAt = new Date('2026-10-10T10:00:00Z');
    // 4 days late, grace period is 2 days -> 2 days overdue
    const returnedAt = new Date('2026-10-14T14:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 5,
      maxFine: 500,
      gracePeriodDays: 2
    });

    assert.strictEqual(result.isOverdue, true);
    assert.strictEqual(result.overdueDays, 2);
    assert.strictEqual(result.fineAmount, 10);
  });

  it('should cap fine at configured maximum ceiling', () => {
    const dueAt = new Date('2026-01-01T10:00:00Z');
    // 200 days late * ₹5 = ₹1000, but ceiling is ₹500
    const returnedAt = new Date('2026-07-20T10:00:00Z');

    const result = calculateFine({
      dueAt,
      returnedAt,
      finePerDay: 5,
      maxFine: 500,
      gracePeriodDays: 0
    });

    assert.strictEqual(result.isOverdue, true);
    assert.strictEqual(result.fineAmount, 500);
  });

  it('should return 0 fine for unreturned loans that are not yet due', () => {
    const dueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days in future

    const result = calculateFine({
      dueAt,
      returnedAt: null,
      referenceDate: new Date(),
      finePerDay: 5,
      maxFine: 500
    });

    assert.strictEqual(result.isOverdue, false);
    assert.strictEqual(result.overdueDays, 0);
    assert.strictEqual(result.fineAmount, 0);
  });
});
