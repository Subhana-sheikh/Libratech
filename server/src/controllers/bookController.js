import Book from '../models/Book.js';
import BookCopy from '../models/BookCopy.js';
import Loan from '../models/Loan.js';
import SavedBook from '../models/SavedBook.js';
import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { COPY_STATUS } from '../config/constants.js';
import { logAudit } from '../utils/auditLogger.js';
import { getRecommendationsForUser } from '../services/recommendationService.js';

export const getAllBooks = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      availability = 'all',
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isArchived: false };

    // Search query
    if (search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { authors: { $regex: term, $options: 'i' } },
        { isbn: { $regex: term, $options: 'i' } },
        { subjects: { $regex: term, $options: 'i' } },
        { publisher: { $regex: term, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }]
      });
      if (catDoc) {
        query.categoryId = catDoc._id;
      }
    }

    // Availability filter
    if (availability === 'available') {
      query.availableCopies = { $gt: 0 };
    } else if (availability === 'unavailable') {
      query.availableCopies = { $lte: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'title') sortOptions = { title: 1 };
    else if (sort === 'author') sortOptions = { 'authors.0': 1 };
    else if (sort === 'popularity') sortOptions = { popularityCount: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * pageSize;

    const [books, total] = await Promise.all([
      Book.find(query)
        .populate('categoryId', 'name slug icon')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Book.countDocuments(query)
    ]);

    // If user is authenticated, check which books are saved
    let savedBookIds = new Set();
    if (req.user) {
      const saves = await SavedBook.find({
        userId: req.user._id,
        bookId: { $in: books.map(b => b._id) }
      });
      savedBookIds = new Set(saves.map(s => s.bookId.toString()));
    }

    const booksWithSaved = books.map(b => ({
      ...b.toObject(),
      isSaved: savedBookIds.has(b._id.toString())
    }));

    return successResponse(res, booksWithSaved, 'Books fetched successfully.', 200, {
      page: pageNum,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    next(err);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('categoryId', 'name slug description');
    if (!book || book.isArchived) {
      return errorResponse(res, 'Book not found.', 404);
    }

    // Physical copies info
    const copies = await BookCopy.find({ bookId: book._id }).select('accessionCode barcodeValue status location');

    // Is saved by current user
    let isSaved = false;
    if (req.user) {
      const save = await SavedBook.findOne({ userId: req.user._id, bookId: book._id });
      isSaved = !!save;
    }

    // Similar / Recommended books in same category
    const similarBooks = await Book.find({
      categoryId: book.categoryId,
      _id: { $ne: book._id },
      isArchived: false
    })
      .populate('categoryId', 'name slug')
      .limit(4);

    return successResponse(res, {
      ...book.toObject(),
      copies,
      isSaved,
      similarBooks
    });
  } catch (err) {
    next(err);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const {
      title,
      authors,
      isbn,
      description,
      categoryId,
      subjects,
      publisher,
      publicationYear,
      language,
      coverImageUrl,
      totalCopies = 1
    } = req.body;

    if (!title || !authors || !categoryId) {
      return errorResponse(res, 'Title, author(s), and category are required.', 400);
    }

    const parsedAuthors = Array.isArray(authors)
      ? authors
      : String(authors).split(',').map(a => a.trim()).filter(Boolean);

    const parsedSubjects = Array.isArray(subjects)
      ? subjects
      : String(subjects || '').split(',').map(s => s.trim()).filter(Boolean);

    const copiesCount = Math.max(1, parseInt(totalCopies, 10));

    const book = await Book.create({
      title: title.trim(),
      authors: parsedAuthors,
      isbn: isbn ? isbn.trim() : undefined,
      description: description ? description.trim() : undefined,
      categoryId,
      subjects: parsedSubjects,
      publisher: publisher ? publisher.trim() : undefined,
      publicationYear: publicationYear ? parseInt(publicationYear, 10) : undefined,
      language: language || 'English',
      coverImageUrl: coverImageUrl || undefined,
      totalCopies: copiesCount,
      availableCopies: copiesCount
    });

    // Automatically create physical copies
    const copyDocs = [];
    const baseCode = (isbn ? isbn.replace(/[^a-zA-Z0-9]/g, '') : book._id.toString().substring(18)).toUpperCase();

    for (let i = 1; i <= copiesCount; i++) {
      const copyNum = String(i).padStart(3, '0');
      copyDocs.push({
        bookId: book._id,
        accessionCode: `ACC-${baseCode}-${copyNum}`,
        barcodeValue: `LIB-${baseCode}-${copyNum}`,
        status: COPY_STATUS.AVAILABLE,
        location: 'Main Stacks'
      });
    }

    await BookCopy.insertMany(copyDocs);

    await logAudit({
      actorUserId: req.user._id,
      action: 'BOOK_CREATE',
      entityType: 'Book',
      entityId: book._id,
      metadata: { title: book.title, totalCopies: copiesCount }
    });

    return successResponse(res, book, 'Book created with physical copies.', 201);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return errorResponse(res, 'Book not found.', 404);

    const allowedFields = [
      'title', 'authors', 'isbn', 'description', 'categoryId',
      'subjects', 'publisher', 'publicationYear', 'language', 'coverImageUrl'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'authors' || field === 'subjects') {
          book[field] = Array.isArray(req.body[field])
            ? req.body[field]
            : String(req.body[field]).split(',').map(s => s.trim()).filter(Boolean);
        } else {
          book[field] = req.body[field];
        }
      }
    });

    // If totalCopies is increased, append physical copies
    if (req.body.totalCopies !== undefined) {
      const newTotal = parseInt(req.body.totalCopies, 10);
      if (newTotal > book.totalCopies) {
        const diff = newTotal - book.totalCopies;
        const currentCopiesCount = await BookCopy.countDocuments({ bookId: book._id });
        const baseCode = (book.isbn ? book.isbn.replace(/[^a-zA-Z0-9]/g, '') : book._id.toString().substring(18)).toUpperCase();

        const newCopies = [];
        for (let i = 1; i <= diff; i++) {
          const num = String(currentCopiesCount + i).padStart(3, '0');
          newCopies.push({
            bookId: book._id,
            accessionCode: `ACC-${baseCode}-${num}`,
            barcodeValue: `LIB-${baseCode}-${num}`,
            status: COPY_STATUS.AVAILABLE,
            location: 'Main Stacks'
          });
        }
        await BookCopy.insertMany(newCopies);
        book.availableCopies += diff;
        book.totalCopies = newTotal;
      }
    }

    await book.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'BOOK_UPDATE',
      entityType: 'Book',
      entityId: book._id,
      metadata: { title: book.title }
    });

    return successResponse(res, book, 'Book updated successfully.');
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return errorResponse(res, 'Book not found.', 404);

    // Check if loans exist
    const hasLoans = await Loan.exists({ bookId: book._id });

    if (hasLoans) {
      // Soft-delete / archive
      book.isArchived = true;
      book.availableCopies = 0;
      await book.save();
      await BookCopy.updateMany({ bookId: book._id }, { status: COPY_STATUS.DAMAGED });

      await logAudit({
        actorUserId: req.user._id,
        action: 'BOOK_ARCHIVE',
        entityType: 'Book',
        entityId: book._id,
        metadata: { title: book.title, reason: 'Historical loans exist, archived instead of hard delete' }
      });

      return successResponse(res, null, 'Book has historical loans; archived safely.');
    } else {
      await BookCopy.deleteMany({ bookId: book._id });
      await SavedBook.deleteMany({ bookId: book._id });
      await Book.findByIdAndDelete(book._id);

      await logAudit({
        actorUserId: req.user._id,
        action: 'BOOK_DELETE',
        entityType: 'Book',
        entityId: book._id,
        metadata: { title: book.title }
      });

      return successResponse(res, null, 'Book and physical copies deleted successfully.');
    }
  } catch (err) {
    next(err);
  }
};

export const getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ isArchived: false })
      .populate('categoryId', 'name slug')
      .sort({ popularityCount: -1, availableCopies: -1 })
      .limit(8);

    return successResponse(res, books, 'Featured books fetched.');
  } catch (err) {
    next(err);
  }
};

export const saveBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) return errorResponse(res, 'Book not found.', 404);

    await SavedBook.findOneAndUpdate(
      { userId, bookId },
      { userId, bookId },
      { upsert: true, new: true }
    );

    return successResponse(res, { bookId, isSaved: true }, 'Book saved to your reading list.');
  } catch (err) {
    next(err);
  }
};

export const unsaveBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    await SavedBook.findOneAndDelete({ userId, bookId });
    return successResponse(res, { bookId, isSaved: false }, 'Book removed from saved list.');
  } catch (err) {
    next(err);
  }
};

export const getSavedBooks = async (req, res, next) => {
  try {
    const saved = await SavedBook.find({ userId: req.user._id })
      .populate({
        path: 'bookId',
        populate: { path: 'categoryId', select: 'name slug' }
      })
      .sort({ createdAt: -1 });

    const books = saved.map(s => s.bookId).filter(Boolean).map(b => ({
      ...b.toObject(),
      isSaved: true
    }));

    return successResponse(res, books, 'Saved books fetched.');
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const books = await getRecommendationsForUser(req.user._id, 8);
    return successResponse(res, books, 'Personalized recommendations fetched.');
  } catch (err) {
    next(err);
  }
};

export const getPublicStats = async (req, res, next) => {
  try {
    const [totalTitles, totalCopiesAgg, activeLoans] = await Promise.all([
      Book.countDocuments({ isArchived: false }),
      Book.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: null, totalCopies: { $sum: '$totalCopies' }, availableCopies: { $sum: '$availableCopies' } } }
      ]),
      Loan.countDocuments({ status: { $in: ['ACTIVE', 'OVERDUE'] } })
    ]);

    const totalCopies = totalCopiesAgg.length > 0 ? totalCopiesAgg[0].totalCopies : 0;
    const availableCopies = totalCopiesAgg.length > 0 ? totalCopiesAgg[0].availableCopies : 0;

    return successResponse(res, {
      totalTitles,
      totalCopies,
      availableCopies,
      activeLoans
    }, 'Public library statistics retrieved.');
  } catch (err) {
    next(err);
  }
};
