import Book from '../models/Book.js';
import Loan from '../models/Loan.js';
import SavedBook from '../models/SavedBook.js';

export const getRecommendationsForUser = async (userId, limit = 8) => {
  try {
    // 1. Gather user's interactions: borrowed books and saved books
    const userLoans = await Loan.find({ userId }).select('bookId').populate('bookId', 'categoryId subjects');
    const userSaves = await SavedBook.find({ userId }).populate('bookId', 'categoryId subjects');

    const interactedBookIds = new Set();
    const preferredCategoryIds = new Set();
    const preferredSubjects = new Set();

    for (const l of userLoans) {
      if (l.bookId) {
        interactedBookIds.add(l.bookId._id.toString());
        if (l.bookId.categoryId) preferredCategoryIds.add(l.bookId.categoryId.toString());
        (l.bookId.subjects || []).forEach(s => preferredSubjects.add(s));
      }
    }

    for (const s of userSaves) {
      if (s.bookId) {
        interactedBookIds.add(s.bookId._id.toString());
        if (s.bookId.categoryId) preferredCategoryIds.add(s.bookId.categoryId.toString());
        (s.bookId.subjects || []).forEach(subj => preferredSubjects.add(subj));
      }
    }

    let recommendations = [];

    // 2. If user has category/subject history, fetch related books first
    if (preferredCategoryIds.size > 0 || preferredSubjects.size > 0) {
      const matchCriteria = {
        _id: { $nin: Array.from(interactedBookIds) },
        isArchived: false,
        $or: [
          { categoryId: { $in: Array.from(preferredCategoryIds) } },
          { subjects: { $in: Array.from(preferredSubjects) } }
        ]
      };

      recommendations = await Book.find(matchCriteria)
        .populate('categoryId', 'name slug')
        .sort({ popularityCount: -1, createdAt: -1 })
        .limit(limit);
    }

    // 3. Fallback or pad with overall popular & trending books if needed
    if (recommendations.length < limit) {
      const existingIds = new Set([...interactedBookIds, ...recommendations.map(b => b._id.toString())]);
      const padding = await Book.find({
        _id: { $nin: Array.from(existingIds) },
        isArchived: false
      })
        .populate('categoryId', 'name slug')
        .sort({ popularityCount: -1, createdAt: -1 })
        .limit(limit - recommendations.length);

      recommendations = [...recommendations, ...padding];
    }

    return recommendations;
  } catch (err) {
    console.error('[Recommendation Engine Error]', err);
    // Graceful fallback to trending books
    return Book.find({ isArchived: false })
      .populate('categoryId', 'name slug')
      .sort({ popularityCount: -1 })
      .limit(limit);
  }
};
