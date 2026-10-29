/**
 * Authoritative fine calculation utility.
 *
 * Rules:
 * 1. The due date itself is fine-free. Fines begin accumulating on the next calendar day after due date + grace period.
 * 2. Overdue days are calculated as full calendar days elapsed past (dueAt + gracePeriodDays).
 * 3. overdueDays = Math.max(0, calendarDaysBetween(effectiveDueDate, returnedAtOrNow))
 * 4. fineAmount = Math.min(overdueDays * finePerDay, maxFine)
 * 5. Returns detailed breakdown: { isOverdue, overdueDays, fineAmount, policyApplied }
 */

export const calculateFine = ({
  dueAt,
  returnedAt = null,
  referenceDate = new Date(),
  finePerDay = null,
  maxFine = null,
  gracePeriodDays = null
} = {}) => {
  // Parse policy defaults from env or arguments
  const rate = finePerDay !== null && finePerDay !== undefined
    ? Number(finePerDay)
    : Number(process.env.FINE_PER_DAY || 5);

  const ceiling = maxFine !== null && maxFine !== undefined
    ? Number(maxFine)
    : Number(process.env.MAX_FINE || 500);

  const grace = gracePeriodDays !== null && gracePeriodDays !== undefined
    ? Number(gracePeriodDays)
    : Number(process.env.GRACE_PERIOD_DAYS || 0);

  if (!dueAt) {
    return {
      isOverdue: false,
      overdueDays: 0,
      fineAmount: 0,
      policyApplied: { rate, ceiling, grace }
    };
  }

  const dueDate = new Date(dueAt);
  const checkDate = returnedAt ? new Date(returnedAt) : new Date(referenceDate);

  // Normalize dates to midnight in UTC / consistent calendar boundaries
  const dueMidnight = new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()));
  const checkMidnight = new Date(Date.UTC(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate()));

  // Add grace period days to due date
  const effectiveDueMidnight = new Date(dueMidnight.getTime() + grace * 24 * 60 * 60 * 1000);

  // Calendar days difference
  const diffTime = checkMidnight.getTime() - effectiveDueMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const overdueDays = Math.max(0, diffDays);
  const isOverdue = overdueDays > 0;
  const fineAmount = Math.min(overdueDays * rate, ceiling);

  return {
    isOverdue,
    overdueDays,
    fineAmount,
    policyApplied: {
      rate,
      ceiling,
      grace,
      dueAt: dueDate.toISOString(),
      effectiveDueAt: effectiveDueMidnight.toISOString(),
      calculatedAt: checkDate.toISOString()
    }
  };
};
