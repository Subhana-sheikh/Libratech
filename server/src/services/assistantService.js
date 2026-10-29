import Book from '../models/Book.js';
import Loan from '../models/Loan.js';
import Fine from '../models/Fine.js';
import { LOAN_STATUS, FINE_STATUS } from '../config/constants.js';
import { getLibrarySettings } from './circulationService.js';

export const handleAssistantQuery = async ({ query, user = null }) => {
  const normalized = (query || '').trim().toLowerCase();
  const settings = await getLibrarySettings();

  // Response structure
  const response = {
    message: '',
    books: [],
    mode: process.env.AI_PROVIDER && process.env.AI_PROVIDER !== 'none' ? process.env.AI_PROVIDER : 'catalogue-policy-fallback',
    disclaimer: 'Libratech Library Assistant operates with real catalogue & circulation data. Recommendations are informational; official circulation records remain authoritative.',
    suggestions: [
      'What are the loan duration and fine policies?',
      'Find books on computer science',
      'What are my active loans and due dates?',
      'Recommend popular fiction books'
    ]
  };

  // 1. User loan/fine personal questions (strictly scoped to authenticated user)
  if (normalized.includes('due date') || normalized.includes('my loan') || normalized.includes('borrowed') || normalized.includes('my book')) {
    if (!user) {
      response.message = 'To view your personal loans and due dates, please sign in to your student account.';
      return response;
    }

    const activeLoans = await Loan.find({
      userId: user._id,
      status: { $in: [LOAN_STATUS.ACTIVE, LOAN_STATUS.OVERDUE] }
    }).populate('bookId', 'title authors coverImageUrl');

    if (activeLoans.length === 0) {
      response.message = `Hello ${user.name}! You currently have no active borrowed books. Feel free to explore our catalogue to find your next read!`;
      return response;
    }

    const loanList = activeLoans.map(l => {
      const isLate = new Date() > new Date(l.dueAt);
      const daysLeft = Math.ceil((new Date(l.dueAt) - new Date()) / (1000 * 60 * 60 * 24));
      return `• "${l.bookId?.title}": Due on ${new Date(l.dueAt).toLocaleDateString()} (${isLate ? 'OVERDUE' : `${daysLeft} days remaining`})`;
    }).join('\n');

    response.message = `Here are your current active loans:\n\n${loanList}\n\nPlease remember to return or renew before the due date to avoid overdue fines.`;
    response.books = activeLoans.map(l => l.bookId).filter(Boolean);
    return response;
  }

  // 2. Personal fine status
  if (normalized.includes('fine') && (normalized.includes('my') || normalized.includes('owe') || normalized.includes('pay'))) {
    if (!user) {
      response.message = 'Please sign in to check your outstanding fine balance.';
      return response;
    }

    const unpaidFines = await Fine.find({
      userId: user._id,
      status: { $in: [FINE_STATUS.UNPAID, FINE_STATUS.PARTIALLY_PAID] }
    }).populate('loanId');

    const totalDue = unpaidFines.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0);

    if (totalDue === 0) {
      response.message = `Great news, ${user.name}! You have zero outstanding fines. Your account is in good standing.`;
    } else {
      response.message = `You currently have ₹${totalDue} in outstanding overdue fines across ${unpaidFines.length} record(s). You can review details in the Fines section or visit the circulation desk to settle your balance.`;
    }
    return response;
  }

  // 3. Policy and rules questions
  if (normalized.includes('policy') || normalized.includes('rule') || normalized.includes('how long') || normalized.includes('fine rate') || normalized.includes('duration') || normalized.includes('limit')) {
    response.message = `Here is our current library circulation policy:\n\n` +
      `• Loan Period: Standard borrowing period is ${settings.loanDurationDays} days.\n` +
      `• Borrowing Limit: Each student may borrow up to ${settings.maxBooksPerStudent} books at a time.\n` +
      `• Grace Period: ${settings.gracePeriodDays} days after due date before fines apply.\n` +
      `• Overdue Fines: ₹${settings.finePerDay} per calendar day overdue, capped at a maximum of ₹${settings.maxFine} per book.\n` +
      `• Returns: Return books at the circulation desk or drop box during operating hours.`;
    return response;
  }

  // 4. Catalogue search queries
  // Extract topic terms
  const searchKeywords = query
    .replace(/(find|search|recommend|books?|about|on|show|me|any|give|good|please|the|a)/gi, ' ')
    .trim();

  let books = [];
  if (searchKeywords.length > 1) {
    books = await Book.find({
      isArchived: false,
      $or: [
        { title: { $regex: searchKeywords, $options: 'i' } },
        { authors: { $regex: searchKeywords, $options: 'i' } },
        { subjects: { $regex: searchKeywords, $options: 'i' } },
        { description: { $regex: searchKeywords, $options: 'i' } }
      ]
    })
      .populate('categoryId', 'name slug')
      .sort({ availableCopies: -1, popularityCount: -1 })
      .limit(6);
  }

  if (books.length > 0) {
    response.message = `I found ${books.length} matching book(s) in our collection for "${searchKeywords}":`;
    response.books = books;
    return response;
  }

  // 5. Default fallback recommendations
  const popular = await Book.find({ isArchived: false, availableCopies: { $gt: 0 } })
    .populate('categoryId', 'name slug')
    .sort({ popularityCount: -1 })
    .limit(4);

  response.message = `I didn't find specific titles matching "${query}", but here are some of our most popular available titles from the library collection:`;
  response.books = popular;
  return response;
};
