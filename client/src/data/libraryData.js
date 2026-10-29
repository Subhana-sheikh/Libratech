// Premium Curated Library Dataset for Libratech — Netflix of Books

export const CATEGORIES_DATA = [
  {
    id: 'cat-1',
    name: 'Computer Science',
    slug: 'computer-science',
    bookCount: '1,420+ Books',
    description: 'System design, operating systems, algorithms & computer architecture.',
    icon: 'Terminal',
    bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    accentColor: '#FF4B4B'
  },
  {
    id: 'cat-2',
    name: 'Artificial Intelligence',
    slug: 'ai-ml',
    bookCount: '980+ Books',
    description: 'Deep learning, neural networks, computer vision & LLMs.',
    icon: 'Cpu',
    bgImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    accentColor: '#8B5CF6'
  },
  {
    id: 'cat-3',
    name: 'Web Development',
    slug: 'web-development',
    bookCount: '1,150+ Books',
    description: 'Modern frontend frameworks, APIs, cloud backends & DevOps.',
    icon: 'Globe',
    bgImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    accentColor: '#06B6D4'
  },
  {
    id: 'cat-4',
    name: 'Data Science',
    slug: 'data-science',
    bookCount: '840+ Books',
    description: 'Statistical modeling, big data pipelines, Python & analytics.',
    icon: 'Database',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    accentColor: '#10B981'
  },
  {
    id: 'cat-5',
    name: 'Business & Management',
    slug: 'business-management',
    bookCount: '1,200+ Books',
    description: 'Product leadership, venture building, strategy & economics.',
    icon: 'TrendingUp',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    accentColor: '#F59E0B'
  },
  {
    id: 'cat-6',
    name: 'Fiction & Literature',
    slug: 'fiction-literature',
    bookCount: '2,800+ Books',
    description: 'Masterpieces of world literature, sci-fi epics & contemporary prose.',
    icon: 'BookOpen',
    bgImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    accentColor: '#EC4899'
  },
  {
    id: 'cat-7',
    name: 'Science & Technology',
    slug: 'science-technology',
    bookCount: '1,650+ Books',
    description: 'Quantum mechanics, astrophysics, biology & renewable energy.',
    icon: 'Zap',
    bgImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    accentColor: '#3B82F6'
  },
  {
    id: 'cat-8',
    name: 'Self-Development',
    slug: 'self-development',
    bookCount: '920+ Books',
    description: 'Psychology of success, habits, high performance & mindfulness.',
    icon: 'Sparkles',
    bgImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    accentColor: '#F43F5E'
  }
];

export const BOOKS_DATA = [
  {
    _id: 'book-01',
    title: 'Designing Data-Intensive Applications',
    authors: ['Martin Kleppmann'],
    isbn: '978-1449373320',
    description: 'The definitive guide to the architecture, scalability, consistency, and reliability of modern distributed systems and database engines.',
    category: 'Computer Science',
    categorySlug: 'computer-science',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    totalCopies: 8,
    availableCopies: 5,
    rating: 4.95,
    reviewCount: 1420,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    badge: 'TRENDING',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 74,
    currentChapter: 'Chapter 7: Transactions & Distributed Consensus',
    shelfLocation: 'Stack CS-04 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Reliable, Scalable, and Maintainable Applications',
        content: `Today, many applications are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely a limiting factor for these systems—bigger problems are usually the amount of data, the complexity of data, and the speed at which it is changing.\n\nA data-intensive application is typically built from standard building blocks that provide commonly needed functionality. For example, many applications need to:\n\n• Store data so that they or another application can find it again later (databases)\n• Remember the result of an expensive operation, to speed up reads (caches)\n• Allow users to search data by keyword or filter it in various ways (search indexes)\n• Send a message to another process, to be handled asynchronously (stream processing)\n• Periodically crunch a large chunk of accumulated data (batch processing)\n\nWhen we build an application, we have to figure out which tools and approaches are appropriate for the task at hand. Reliability means making systems work correctly, even when faults occur.`
      },
      {
        title: 'Chapter 2: Data Models and Query Languages',
        content: `Data models are perhaps the most important part of developing software, because they have such a profound effect: not only on how the software is written, but also on how we think about the problem that we are solving.\n\nMost applications are built by layering one data model on top of another. For each layer, the key question is: how is it represented in terms of the next-lower layer? Relational models, document databases, and graph-like data models each bring distinct trade-offs for developers.`
      }
    ]
  },
  {
    _id: 'book-02',
    title: 'Deep Learning with Python',
    authors: ['François Chollet'],
    isbn: '978-1617296864',
    description: 'Written by the creator of Keras, this hands-on guide introduces deep learning using Python, covering computer vision, NLP, and generative transformers.',
    category: 'Artificial Intelligence',
    categorySlug: 'ai-ml',
    publisher: 'Manning Publications',
    publicationYear: 2021,
    totalCopies: 6,
    availableCopies: 3,
    rating: 4.9,
    reviewCount: 960,
    matchPercentage: 98,
    coverImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: false,
    progress: 42,
    currentChapter: 'Chapter 4: Fundamentals of Machine Learning',
    shelfLocation: 'Stack AI-02 / Shelf B',
    ebookContent: [
      {
        title: 'Chapter 1: What is Deep Learning?',
        content: `In the past few years, artificial intelligence (AI) has been the subject of intense media hype. Machine learning, deep learning, and AI have become central buzzwords in the technology industry.\n\nDeep learning is a specific subfield of machine learning: a new take on learning representations from data that puts the emphasis on learning successive layers of increasingly meaningful representations. The "deep" in deep learning isn’t a reference to any kind of deeper understanding achieved by the approach; rather, it stands for this idea of successive layers of representations.`
      }
    ]
  },
  {
    _id: 'book-03',
    title: 'Atomic Habits: Tiny Changes, Remarkable Results',
    authors: ['James Clear'],
    isbn: '978-0735211292',
    description: 'A revolutionary system for getting 1 percent better every day. Learn how small changes can lead to remarkable results in study and life.',
    category: 'Self-Development',
    categorySlug: 'self-development',
    publisher: 'Avery',
    publicationYear: 2018,
    totalCopies: 10,
    availableCopies: 7,
    rating: 4.96,
    reviewCount: 3800,
    matchPercentage: 97,
    coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    badge: 'TOP PICK',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 88,
    currentChapter: 'Chapter 12: The Law of Least Effort',
    shelfLocation: 'Stack SD-01 / Row 1',
    ebookContent: [
      {
        title: 'The Fundamentals: Why Tiny Changes Make a Big Difference',
        content: `It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.\n\nMeanwhile, improving by 1 percent isn't particularly notable—sometimes it isn't even noticeable—but it can be far more meaningful, especially in the long run. The difference a tiny improvement can make over time is astounding: if you can get 1 percent better each day for one year, you'll end up thirty-seven times better.`
      }
    ]
  },
  {
    _id: 'book-04',
    title: 'Clean Code: Agile Software Craftsmanship',
    authors: ['Robert C. Martin'],
    isbn: '978-0132350884',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Master naming, functions, and unit testing.',
    category: 'Computer Science',
    categorySlug: 'computer-science',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    totalCopies: 5,
    availableCopies: 2,
    rating: 4.85,
    reviewCount: 2150,
    matchPercentage: 95,
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    badge: 'NEW ARRIVAL',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    isRecentlyAdded: true,
    isEditorsPick: false,
    shelfLocation: 'Stack CS-01 / Shelf C',
    ebookContent: [
      {
        title: 'Chapter 1: Clean Code',
        content: `You are reading this book for two reasons. First, you are a programmer. Second, you want to be a better programmer. Good. We need better programmers.\n\nThere will never be a time when code is unnecessary, because code represents the details of the requirements. At some level those details cannot be ignored or abstracted; they have to be specified.`
      }
    ]
  },
  {
    _id: 'book-05',
    title: 'Zero to One: Notes on Startups',
    authors: ['Peter Thiel', 'Blake Masters'],
    isbn: '978-0804139298',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. Learn how to build monopolies that last.',
    category: 'Business & Management',
    categorySlug: 'business-management',
    publisher: 'Crown Business',
    publicationYear: 2014,
    totalCopies: 6,
    availableCopies: 4,
    rating: 4.88,
    reviewCount: 1640,
    matchPercentage: 96,
    coverImageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack BM-03 / Row 3',
    ebookContent: [
      {
        title: 'Chapter 1: The Challenge of the Future',
        content: `Whenever I interview someone for a job, I like to ask this question: "What important truth do very few people agree with you on?"\n\nThis question sounds simple because it’s straightforward. Actually, it’s very hard to answer. It’s intellectually difficult because the knowledge that everyone is taught in school is by definition agreed upon. Progress takes two forms: horizontal progress (copying things that work) and vertical progress (doing new things).`
      }
    ]
  },
  {
    _id: 'book-06',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    authors: ['David Thomas', 'Andrew Hunt'],
    isbn: '978-0135957059',
    description: 'Straight from the programming trenches, this 20th Anniversary Edition cuts through modern software development complexities to teach timeless craft.',
    category: 'Web Development',
    categorySlug: 'web-development',
    publisher: 'Addison-Wesley',
    publicationYear: 2019,
    totalCopies: 7,
    availableCopies: 6,
    rating: 4.93,
    reviewCount: 1890,
    matchPercentage: 98,
    coverImageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&q=80&w=600',
    badge: 'TRENDING',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack WD-02 / Shelf A',
    ebookContent: [
      {
        title: 'A Pragmatic Philosophy: Care About Your Craft',
        content: `Why spend your life developing software unless you care about doing it well?\n\nOur philosophy is rooted in pragmatism: don't live with broken windows, be a catalyst for change, remember the big picture, and invest regularly in your knowledge portfolio.`
      }
    ]
  },
  {
    _id: 'book-07',
    title: 'Astrophysics for People in a Hurry',
    authors: ['Neil deGrasse Tyson'],
    isbn: '978-0393609394',
    description: 'What is the nature of space and time? How do we fit within the universe? Explore black holes, quantum mechanics, and the Big Bang in quick, witty chapters.',
    category: 'Science & Technology',
    categorySlug: 'science-technology',
    publisher: 'W. W. Norton & Company',
    publicationYear: 2017,
    totalCopies: 5,
    availableCopies: 4,
    rating: 4.87,
    reviewCount: 1310,
    matchPercentage: 94,
    coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    isEditorsPick: false,
    shelfLocation: 'Stack ST-01 / Row 2',
    ebookContent: [
      {
        title: '1. The Greatest Story Ever Told',
        content: `In the beginning, nearly fourteen billion years ago, all the space and all the matter and all the energy of the known universe was contained in a volume less than one-trillionth the size of the point of a pin.\n\nConditions were so hot, the basic forces of nature that collectively describe the universe were unified. Then cosmic expansion began.`
      }
    ]
  },
  {
    _id: 'book-08',
    title: 'Dune: The Masterpiece Sci-Fi Epic',
    authors: ['Frank Herbert'],
    isbn: '978-0441013593',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who will become the mysterious man known as Muad’Dib.',
    category: 'Fiction & Literature',
    categorySlug: 'fiction-literature',
    publisher: 'Ace Books',
    publicationYear: 1965,
    totalCopies: 9,
    availableCopies: 3,
    rating: 4.97,
    reviewCount: 4500,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
    badge: 'BESTSELLER',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack FL-05 / Row 1',
    ebookContent: [
      {
        title: 'Book One: Dune',
        content: `A beginning is the time for taking the most delicate care that the balances are correct. This every sister of the Bene Gesserit knows.\n\nTo begin your study of the life of Muad'Dib, then, take care that you first place him in his time: born in the 57th year of the Padishah Emperor, Shaddam IV. And take the most special care that you locate him in his place: the planet Arrakis.`
      }
    ]
  },
  {
    _id: 'book-09',
    title: 'Python for Data Analysis: Data Wrangling with Pandas',
    authors: ['Wes McKinney'],
    isbn: '978-1098104030',
    description: 'Written by the creator of Python pandas project, this is a practical guide to manipulating, processing, cleaning, and crunching datasets in Python.',
    category: 'Data Science',
    categorySlug: 'data-science',
    publisher: "O'Reilly Media",
    publicationYear: 2022,
    totalCopies: 5,
    availableCopies: 5,
    rating: 4.89,
    reviewCount: 880,
    matchPercentage: 95,
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    badge: 'NEW ARRIVAL',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    isRecentlyAdded: true,
    shelfLocation: 'Stack DS-02 / Shelf C',
    ebookContent: [
      {
        title: 'Chapter 1: Preliminaries',
        content: `Data analysis is fundamentally about asking questions of data and translating raw numbers into actionable insight. Python has emerged as the premier language for data science due to its vibrant ecosystem: NumPy, Pandas, Matplotlib, and Scikit-Learn.`
      }
    ]
  },
  {
    _id: 'book-10',
    title: 'Full-Stack React, TypeScript, and Node',
    authors: ['David Choi'],
    isbn: '978-1800206458',
    description: 'Build enterprise-grade full-stack web applications using React 18, Node.js, Express, TypeScript, GraphQL, and modern CSS frameworks.',
    category: 'Web Development',
    categorySlug: 'web-development',
    publisher: 'Packt Publishing',
    publicationYear: 2023,
    totalCopies: 4,
    availableCopies: 4,
    rating: 4.86,
    reviewCount: 620,
    matchPercentage: 93,
    coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    badge: 'NEW ARRIVAL',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    isRecentlyAdded: true,
    shelfLocation: 'Stack WD-04 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: Modern Web Architecture',
        content: `The modern web is built on component hierarchies, predictable unidirectional data flow, and type-safety across client and server boundaries.`
      }
    ]
  },
  {
    _id: 'book-11',
    title: 'Thinking, Fast and Slow',
    authors: ['Daniel Kahneman'],
    isbn: '978-0374533557',
    description: 'Nobel Memorial Prize winner Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    category: 'Self-Development',
    categorySlug: 'self-development',
    publisher: 'Farrar, Straus and Giroux',
    publicationYear: 2011,
    totalCopies: 7,
    availableCopies: 2,
    rating: 4.91,
    reviewCount: 3100,
    matchPercentage: 96,
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    shelfLocation: 'Stack SD-03 / Shelf B',
    ebookContent: [
      {
        title: 'Part 1: Two Systems',
        content: `System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. System 2 allocates attention to the effortful mental operations that demand it, including complex computations.`
      }
    ]
  },
  {
    _id: 'book-12',
    title: 'The Lean Startup: Continuous Innovation',
    authors: ['Eric Ries'],
    isbn: '978-0307887894',
    description: 'Most startups fail. But many of those failures are preventable. The Lean Startup approach creates companies that are both more capital efficient and leverage human creativity more effectively.',
    category: 'Business & Management',
    categorySlug: 'business-management',
    publisher: 'Crown Business',
    publicationYear: 2011,
    totalCopies: 6,
    availableCopies: 3,
    rating: 4.84,
    reviewCount: 1940,
    matchPercentage: 94,
    coverImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack BM-01 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Start',
        content: `Startup success is not a consequence of good genes or being in the right place at the right time. Success can be engineered by following the right process, which means it can be learned, which means it can be taught.`
      }
    ]
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Computer Science Scholar',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'Libratech completely transformed how I research. The horizontal carousels make finding rare systems engineering texts feel as smooth as Netflix, and the in-app due reminders have saved me countless library fines!'
  },
  {
    id: 2,
    name: 'Dr. Sarah Jenkins',
    role: 'Professor of Artificial Intelligence',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'The digital catalogue discovery and instant e-book reader are unparalleled. Our students check out research papers and textbook copies seamlessly. Libratech is the future of academic libraries.'
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    role: 'Postgraduate Researcher',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'Having camera-assisted barcode checkout and personal loan tracking in one unified dark interface makes studying late at night a pure delight. 10/10 platform!'
  }
];

export const FAQS_DATA = [
  {
    question: 'How does digital book borrowing work on Libratech?',
    answer: 'You can explore our catalogue online, check real-time shelf availability, and either read the digital e-book version directly in your browser or request the physical copy at the circulation desk via instant barcode scanning.'
  },
  {
    question: 'How many books can a student borrow concurrently?',
    answer: 'Enrolled students can borrow up to 4 books simultaneously for a standard period of 14 calendar days. Renewals can be requested through your student dashboard.'
  },
  {
    question: 'Are digital E-Books freely accessible on any device?',
    answer: 'Yes! Our built-in E-Book Reader works on mobile, tablet, and desktop with customizable typography, dark/light reading modes, and offline reading capability.'
  },
  {
    question: 'How do automated due-date reminders function?',
    answer: 'Libratech runs automated scheduled checks to alert you 3 days before due date, 1 day before, and on the due date via in-app notification bell and notifications page.'
  },
  {
    question: 'Can I chat with the library catalogue assistant?',
    answer: 'Yes, Libratech features a grounded AI Library Assistant that can query the exact university catalogue, explain circulation rules, and summarize your personal loan deadlines.'
  }
];
