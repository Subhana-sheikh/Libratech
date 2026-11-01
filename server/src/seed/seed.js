import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Book from '../models/Book.js';
import BookCopy from '../models/BookCopy.js';
import Loan from '../models/Loan.js';
import Fine from '../models/Fine.js';
import Notification from '../models/Notification.js';
import LibrarySetting from '../models/LibrarySetting.js';
import AuditLog from '../models/AuditLog.js';
import { ROLES, LOAN_STATUS, FINE_STATUS, COPY_STATUS, NOTIFICATION_TYPES } from '../config/constants.js';

export const runSeed = async () => {
  console.log('[Seed] Starting database seed process...');
  await connectDB();

  // 1. Clear existing collections for a clean, deterministic seed
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Book.deleteMany({}),
    BookCopy.deleteMany({}),
    Loan.deleteMany({}),
    Fine.deleteMany({}),
    Notification.deleteMany({}),
    LibrarySetting.deleteMany({}),
    AuditLog.deleteMany({})
  ]);
  console.log('[Seed] Cleared existing records.');

  // 2. Create Library Policy Settings
  const settings = await LibrarySetting.create({
    loanDurationDays: 14,
    gracePeriodDays: 0,
    finePerDay: 5,
    maxFine: 500,
    maxBooksPerStudent: 4,
    timezone: 'Asia/Kolkata',
    libraryName: 'Libratech Central University Library',
    contactEmail: 'library-desk@libratech.edu'
  });

  // 3. Create Users
  const defaultPasswordHash = await User.hashPassword('Password@123');

  const admin = await User.create({
    name: 'Subhana Sheikh (Admin)',
    email: 'admin@libratech.edu',
    passwordHash: defaultPasswordHash,
    role: ROLES.ADMIN,
    department: 'Chief Library Administration',
    isActive: true
  });

  const librarian = await User.create({
    name: 'Marcus Vance (Librarian)',
    email: 'librarian@libratech.edu',
    passwordHash: defaultPasswordHash,
    role: ROLES.LIBRARIAN,
    department: 'Circulation Desk',
    isActive: true
  });

  const studentsData = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', studentId: 'STU-2024-001', department: 'Computer Science' },
    { name: 'Ananya Iyer', email: 'ananya.iyer@student.edu', studentId: 'STU-2024-002', department: 'Information Science' },
    { name: 'Rohan Gupta', email: 'rohan.gupta@student.edu', studentId: 'STU-2024-003', department: 'Electronics & Comm.' },
    { name: 'Priya Nair', email: 'priya.nair@student.edu', studentId: 'STU-2024-004', department: 'Data Science & AI' },
    { name: 'Devendra Patel', email: 'dev.patel@student.edu', studentId: 'STU-2024-005', department: 'Mechanical Eng.' },
    { name: 'Sneha Reddy', email: 'sneha.reddy@student.edu', studentId: 'STU-2024-006', department: 'Biotechnology' }
  ];

  const students = [];
  for (const stu of studentsData) {
    const created = await User.create({
      ...stu,
      passwordHash: defaultPasswordHash,
      role: ROLES.STUDENT,
      isActive: true
    });
    students.push(created);
  }
  console.log(`[Seed] Created ${students.length + 2} users (Admin, Librarian, ${students.length} Students).`);

  // 4. Categories
  const categoriesData = [
    { name: 'Computer Science & Software', slug: 'computer-science', description: 'Algorithms, system design, web architecture, and programming languages.', icon: 'Laptop' },
    { name: 'Artificial Intelligence & ML', slug: 'ai-ml', description: 'Machine learning, neural networks, computer vision, and LLM applications.', icon: 'Cpu' },
    { name: 'Mathematics & Algorithms', slug: 'mathematics', description: 'Discrete mathematics, linear algebra, statistics, and graph theory.', icon: 'Binary' },
    { name: 'Engineering & Systems', slug: 'engineering', description: 'Operating systems, networks, embedded systems, and robotics.', icon: 'Layers' },
    { name: 'Literature & Philosophy', slug: 'literature', description: 'Classic fiction, philosophy of mind, history, and scientific ethics.', icon: 'BookOpen' }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const c = await Category.create(cat);
    categoryMap[c.slug] = c._id;
  }
  console.log(`[Seed] Created ${categoriesData.length} categories.`);

  // 5. 30 Sample Books across categories
  const booksData = [
    {
      title: 'Designing Data-Intensive Applications',
      authors: ['Martin Kleppmann'],
      isbn: '978-1449373320',
      description: 'The definitive guide to the architecture, scalability, and reliability of modern distributed systems and database engines.',
      categorySlug: 'computer-science',
      subjects: ['Distributed Systems', 'Databases', 'Reliability'],
      publisher: "O'Reilly Media",
      publicationYear: 2017,
      totalCopies: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      authors: ['Robert C. Martin'],
      isbn: '978-0132350884',
      description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
      categorySlug: 'computer-science',
      subjects: ['Refactoring', 'Agile', 'Software Craftsmanship'],
      publisher: 'Prentice Hall',
      publicationYear: 2008,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Introduction to Algorithms (CLRS)',
      authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
      isbn: '978-0262033848',
      description: 'Comprehensive textbook on algorithms covering sorting, dynamic programming, greedy algorithms, and graph theory.',
      categorySlug: 'mathematics',
      subjects: ['Algorithms', 'Data Structures', 'Graph Theory'],
      publisher: 'MIT Press',
      publicationYear: 2009,
      totalCopies: 6,
      coverImageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Deep Learning',
      authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
      isbn: '978-0262035613',
      description: 'The quintessential text on deep learning by pioneering researchers in the field of neural networks.',
      categorySlug: 'ai-ml',
      subjects: ['Neural Networks', 'Optimization', 'Representation Learning'],
      publisher: 'MIT Press',
      publicationYear: 2016,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Operating Systems: Three Easy Pieces',
      authors: ['Remzi H. Arpaci-Dusseau', 'Andrea C. Arpaci-Dusseau'],
      isbn: '978-1985086593',
      description: 'A deep, accessible exploration of virtualization, concurrency, and persistence in modern operating systems.',
      categorySlug: 'engineering',
      subjects: ['Virtualization', 'Concurrency', 'File Systems'],
      publisher: 'Arpaci-Dusseau Books',
      publicationYear: 2018,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Artificial Intelligence: A Modern Approach',
      authors: ['Stuart Russell', 'Peter Norvig'],
      isbn: '978-0134610993',
      description: 'The standard and most cited university textbook worldwide on artificial intelligence and search agents.',
      categorySlug: 'ai-ml',
      subjects: ['Search', 'Knowledge Representation', 'Reinforcement Learning'],
      publisher: 'Pearson',
      publicationYear: 2020,
      totalCopies: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Computer Networks: A Systems Approach',
      authors: ['Larry L. Peterson', 'Bruce S. Davie'],
      isbn: '978-0123850591',
      description: 'Explores how network protocols interoperate across the Internet stack from routing to congestion control.',
      categorySlug: 'engineering',
      subjects: ['TCP/IP', 'Routing', 'Congestion Control'],
      publisher: 'Morgan Kaufmann',
      publicationYear: 2011,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Structure and Interpretation of Computer Programs',
      authors: ['Harold Abelson', 'Gerald Jay Sussman'],
      isbn: '978-0262510875',
      description: 'Legendary MIT curriculum exploring functional programming, abstraction, interpreters, and metalinguistic abstraction.',
      categorySlug: 'computer-science',
      subjects: ['Lisp', 'Interpreters', 'Abstraction'],
      publisher: 'MIT Press',
      publicationYear: 1996,
      totalCopies: 3,
      coverImageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd5?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Database System Concepts',
      authors: ['Abraham Silberschatz', 'Henry F. Korth', 'S. Sudarshan'],
      isbn: '978-0078022159',
      description: 'Fundamental concepts of database management, SQL, relational calculus, transaction isolation, and indexing.',
      categorySlug: 'computer-science',
      subjects: ['Relational DB', 'ACID Transactions', 'SQL'],
      publisher: 'McGraw-Hill',
      publicationYear: 2019,
      totalCopies: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Pattern Recognition and Machine Learning',
      authors: ['Christopher M. Bishop'],
      isbn: '978-0387310732',
      description: 'Bayesian treatment of machine learning, graphical models, expectation-maximization, and approximate inference.',
      categorySlug: 'ai-ml',
      subjects: ['Bayesian Methods', 'Probability', 'Inference'],
      publisher: 'Springer',
      publicationYear: 2006,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'The Pragmatic Programmer: Your Journey To Mastery',
      authors: ['David Thomas', 'Andrew Hunt'],
      isbn: '978-0135957059',
      description: 'Timeless career lessons for software developers on pragmatic philosophy, tooling, orthogonal design, and testing.',
      categorySlug: 'computer-science',
      subjects: ['Career', 'Software Engineering', 'Best Practices'],
      publisher: 'Addison-Wesley',
      publicationYear: 2019,
      totalCopies: 5,
      coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Discrete Mathematics and Its Applications',
      authors: ['Kenneth H. Rosen'],
      isbn: '978-1259676512',
      description: 'Comprehensive foundation in logic, set theory, combinatorics, proof methods, and modular arithmetic.',
      categorySlug: 'mathematics',
      subjects: ['Combinatorics', 'Logic', 'Proofs'],
      publisher: 'McGraw-Hill',
      publicationYear: 2018,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Computer Architecture: A Quantitative Approach',
      authors: ['John L. Hennessy', 'David A. Patterson'],
      isbn: '978-0128119051',
      description: 'The seminal authority on microprocessor pipeline design, instruction-level parallelism, memory hierarchies, and vector units.',
      categorySlug: 'engineering',
      subjects: ['Hardware', 'Pipelines', 'RISC-V'],
      publisher: 'Morgan Kaufmann',
      publicationYear: 2017,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Reinforcement Learning: An Introduction',
      authors: ['Richard S. Sutton', 'Andrew G. Barto'],
      isbn: '978-0262039246',
      description: 'Clear and comprehensive account of Markov decision processes, temporal difference learning, and policy gradients.',
      categorySlug: 'ai-ml',
      subjects: ['MDP', 'Q-Learning', 'Policy Gradient'],
      publisher: 'MIT Press',
      publicationYear: 2018,
      totalCopies: 3,
      coverImageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'Zen and the Art of Motorcycle Maintenance',
      authors: ['Robert M. Pirsig'],
      isbn: '978-0060589462',
      description: 'An inquiry into values, technology, the metaphysics of quality, and human sanity.',
      categorySlug: 'literature',
      subjects: ['Philosophy', 'Metaphysics', 'Quality'],
      publisher: 'HarperTorch',
      publicationYear: 1974,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600'
    },
    {
      title: 'The Design of Everyday Things',
      authors: ['Don Norman'],
      isbn: '978-0465050659',
      description: 'The foundation of usability and cognitive ergonomics. Why doors are hard to open and software interfaces confusing.',
      categorySlug: 'computer-science',
      subjects: ['UX/UI', 'Human Factors', 'Ergonomics'],
      publisher: 'Basic Books',
      publicationYear: 2013,
      totalCopies: 4,
      coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const createdBooks = [];
  const createdCopies = [];

  for (const b of booksData) {
    const categoryId = categoryMap[b.categorySlug];
    const totalCopies = b.totalCopies;

    const book = await Book.create({
      title: b.title,
      authors: b.authors,
      isbn: b.isbn,
      description: b.description,
      categoryId,
      subjects: b.subjects,
      publisher: b.publisher,
      publicationYear: b.publicationYear,
      language: 'English',
      coverImageUrl: b.coverImageUrl,
      totalCopies: totalCopies,
      availableCopies: totalCopies,
      popularityCount: Math.floor(Math.random() * 25) + 5
    });

    createdBooks.push(book);

    // Create physical copies
    const cleanIsbn = b.isbn.replace(/[^0-9]/g, '').slice(-6);
    for (let c = 1; c <= totalCopies; c++) {
      const code = String(c).padStart(3, '0');
      const copy = await BookCopy.create({
        bookId: book._id,
        accessionCode: `ACC-${cleanIsbn}-${code}`,
        barcodeValue: `LIB-${cleanIsbn}-${code}`,
        status: COPY_STATUS.AVAILABLE,
        location: `Stack-${b.categorySlug.substring(0, 3).toUpperCase()}-Rack${c}`
      });
      createdCopies.push(copy);
    }
  }
  console.log(`[Seed] Created ${createdBooks.length} books and ${createdCopies.length} physical copies.`);

  // 6. Create realistic mix of Active, Overdue, and Returned Loans
  const now = new Date();

  // Active Loan 1 (Due in 5 days) for student 0
  const book1 = createdBooks[0];
  const copy1 = createdCopies.find(c => c.bookId.equals(book1._id) && c.status === COPY_STATUS.AVAILABLE);
  copy1.status = COPY_STATUS.ISSUED;
  await copy1.save();
  book1.availableCopies -= 1;
  await book1.save();

  const loanActive1 = await Loan.create({
    userId: students[0]._id,
    bookId: book1._id,
    bookCopyId: copy1._id,
    issuedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
    status: LOAN_STATUS.ACTIVE,
    issuedBy: librarian._id,
    finePolicySnapshot: { finePerDay: 5, maxFine: 500, gracePeriodDays: 0 }
  });

  // Active Loan 2 (Due tomorrow) for student 0
  const book2 = createdBooks[1];
  const copy2 = createdCopies.find(c => c.bookId.equals(book2._id) && c.status === COPY_STATUS.AVAILABLE);
  copy2.status = COPY_STATUS.ISSUED;
  await copy2.save();
  book2.availableCopies -= 1;
  await book2.save();

  const loanActive2 = await Loan.create({
    userId: students[0]._id,
    bookId: book2._id,
    bookCopyId: copy2._id,
    issuedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
    status: LOAN_STATUS.ACTIVE,
    issuedBy: librarian._id,
    finePolicySnapshot: { finePerDay: 5, maxFine: 500, gracePeriodDays: 0 }
  });

  // Overdue Loan (Due 4 days ago) for student 1
  const book3 = createdBooks[2];
  const copy3 = createdCopies.find(c => c.bookId.equals(book3._id) && c.status === COPY_STATUS.AVAILABLE);
  copy3.status = COPY_STATUS.ISSUED;
  await copy3.save();
  book3.availableCopies -= 1;
  await book3.save();

  const loanOverdue = await Loan.create({
    userId: students[1]._id,
    bookId: book3._id,
    bookCopyId: copy3._id,
    issuedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    status: LOAN_STATUS.OVERDUE,
    issuedBy: librarian._id,
    finePolicySnapshot: { finePerDay: 5, maxFine: 500, gracePeriodDays: 0 }
  });

  // Returned Loan with fine for student 2
  const book4 = createdBooks[3];
  const loanReturnedWithFine = await Loan.create({
    userId: students[2]._id,
    bookId: book4._id,
    issuedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
    returnedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    status: LOAN_STATUS.RETURNED,
    issuedBy: librarian._id,
    returnedBy: librarian._id,
    fineAtReturn: 30, // 6 days late * ₹5 = ₹30
    finePolicySnapshot: { finePerDay: 5, maxFine: 500, gracePeriodDays: 0 }
  });

  // Fine document for returned loan
  await Fine.create({
    loanId: loanReturnedWithFine._id,
    userId: students[2]._id,
    amount: 30,
    paidAmount: 0,
    status: FINE_STATUS.UNPAID,
    reason: 'Returned 6 days past due date'
  });

  // Returned Loan on time for student 0
  const book5 = createdBooks[4];
  await Loan.create({
    userId: students[0]._id,
    bookId: book5._id,
    issuedAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
    dueAt: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
    returnedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
    status: LOAN_STATUS.RETURNED,
    issuedBy: librarian._id,
    returnedBy: librarian._id,
    fineAtReturn: 0,
    finePolicySnapshot: { finePerDay: 5, maxFine: 500, gracePeriodDays: 0 }
  });

  // 7. Notifications
  await Notification.create([
    {
      userId: students[0]._id,
      type: NOTIFICATION_TYPES.DUE_SOON,
      title: 'Book Due Tomorrow',
      message: `"${book2.title}" is due tomorrow. Please return or renew on time.`,
      relatedLoanId: loanActive2._id,
      deduplicationKey: `seed-notif-1`
    },
    {
      userId: students[1]._id,
      type: NOTIFICATION_TYPES.OVERDUE,
      title: 'Book Overdue Alert',
      message: `"${book3.title}" is 4 days overdue. Accumulated fine is accumulating at ₹5/day.`,
      relatedLoanId: loanOverdue._id,
      deduplicationKey: `seed-notif-2`
    },
    {
      userId: students[2]._id,
      type: NOTIFICATION_TYPES.FINE_ISSUED,
      title: 'Outstanding Fine Notice',
      message: `An overdue fine of ₹30 was assessed for "${book4.title}".`,
      relatedLoanId: loanReturnedWithFine._id,
      deduplicationKey: `seed-notif-3`
    }
  ]);

  // 8. Initial Audit Logs
  await AuditLog.create([
    {
      actorUserId: admin._id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      metadata: { note: 'Initial seed database migration populated' }
    },
    {
      actorUserId: librarian._id,
      action: 'LOAN_ISSUE',
      entityType: 'Loan',
      entityId: loanActive1._id,
      metadata: { bookTitle: book1.title, studentName: students[0].name }
    }
  ]);

  console.log(`[Seed] Seed process completed successfully!`);
  console.log(`-------------------------------------------------------------------`);
  console.log(`Development Accounts created:`);
  console.log(`  Admin:     admin@libratech.edu     / Password@123`);
  console.log(`  Librarian: librarian@libratech.edu / Password@123`);
  console.log(`  Student 1: aarav.sharma@student.edu / Password@123 (Active loans)`);
  console.log(`  Student 2: ananya.iyer@student.edu  / Password@123 (Overdue loan)`);
  console.log(`  Student 3: rohan.gupta@student.edu  / Password@123 (Unpaid fine)`);
  console.log(`-------------------------------------------------------------------`);

  await disconnectDB();
};

// Execute if run directly
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
