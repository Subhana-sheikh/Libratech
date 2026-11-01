// Premium Curated Library Dataset for Libratech — Smart Library Platform

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
    id: 'cat-bio',
    name: 'Biography & Memoir',
    slug: 'biography',
    bookCount: '620+ Books',
    description: 'Lives of visionary leaders, scientists, mathematicians, and innovators.',
    icon: 'UserCheck',
    bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    accentColor: '#F59E0B'
  },
  {
    id: 'cat-bib',
    name: 'Bibliography & Library Science',
    slug: 'bibliography',
    bookCount: '390+ Books',
    description: 'History of books, archival science, cataloguing, and information theory.',
    icon: 'Bookmark',
    bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600',
    accentColor: '#6366F1'
  },
  {
    id: 'cat-phy',
    name: 'Physiology & Health Science',
    slug: 'physiology',
    bookCount: '540+ Books',
    description: 'Human organ systems, cellular biology, neuroscience, and medical anatomy.',
    icon: 'Activity',
    bgImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
    accentColor: '#EF4444'
  },
  {
    id: 'cat-psy',
    name: 'Psychology & Human Behavior',
    slug: 'psychology',
    bookCount: '780+ Books',
    description: 'Cognitive biases, behavioural economics, emotional intelligence, and decision making.',
    icon: 'Brain',
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    accentColor: '#EC4899'
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
  // ----------------------------------------------------
  // DATA SCIENCE BOOKS
  // ----------------------------------------------------
  {
    _id: 'book-ds-01',
    title: 'Python for Data Analysis: Data Wrangling with Pandas, NumPy & Jupyter',
    authors: ['Wes McKinney'],
    isbn: '978-1098104030',
    barcode: 'BC-DS-101',
    description: 'Written by the creator of the Python pandas project, this complete guide provides hands-on instructions for manipulating, processing, cleaning, and crunching datasets in Python.',
    category: 'Data Science',
    categorySlug: 'data-science',
    publisher: "O'Reilly Media",
    publicationYear: 2022,
    totalCopies: 8,
    availableCopies: 6,
    rating: 4.92,
    reviewCount: 1850,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    badge: 'TRENDING',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 68,
    shelfLocation: 'Stack DS-01 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Preliminaries & The Python Data Science Ecosystem',
        content: `Data analysis is fundamentally about transforming unstructured observations into empirical insights. While computing capabilities have exploded in raw capacity over the last twenty years, the limiting factor in actual scientific and industry analytics is rarely CPU cycle availability—it is the human velocity of understanding, restructuring, and testing hypotheses against real-world data.\n\n### Section 1: The Emergence of Scientific Python\nPython was not originally conceived strictly as a numerical computing language. In the late 1990s and early 2000s, specialized environments like MATLAB, SAS, and R dominated statistical workflows. However, Python possessed unique ergonomic strengths: an intuitive syntax, first-class support for software engineering patterns, and a standard library capable of web networking, operating system orchestration, and database connectivity.\n\nWhen Travis Oliphant unified numeric arrays into NumPy in 2006, followed by the birth of Matplotlib, IPython, and SciPy, Python crossed the threshold into high-performance scientific computing. It enabled researchers to build entire end-to-end pipelines—from scraping web endpoints to training multi-threaded regressions—in a single cohesive syntax without switching between disjointed command languages.\n\n### Section 2: What is Pandas and Why Does it Exist?\nWhen I joined AQR Capital Management in 2007, quantitative researchers were wrestling with messy time-series data. Relational databases forced rigid table schemas, while raw array matrices lacked labels, alignment semantics, and native handling for missing values (NaNs). \n\nPandas was designed from the ground up to solve three fundamental challenges:\n• Integrated Indexing: Slicing matrices by semantic labels (timestamps, tickers, user IDs) rather than arbitrary integer indexes.\n• Automated Alignment: Operating on two datasets with different date ranges automatically aligns matching keys, preventing off-by-one errors in quantitative modeling.\n• Flexible Grouping & Aggregation: A unified split-apply-combine idiom allowing lightning-fast computations across millions of grouped records.\n\n### Section 3: Essential Development Tools\nA modern data scientist does not work in an isolated terminal text file. The interactive computing loop—formulating a question, loading a slice of data, inspecting summaries, generating visualizations, and refining queries—is best supported by Jupyter Notebooks and modern IDE integrations. Mastering keyboard shortcuts, memory profiling with %timeit, and vectorized vectorized operations is what separates amateur script writers from professional data architects.`
      },
      {
        title: 'Chapter 2: Essential NumPy & Vectorized Computation',
        content: `At the foundation of virtually every data science package in Python lies NumPy (Numerical Python). Understanding how NumPy arranges memory in contiguous blocks and applies vector operations is crucial for writing efficient algorithms.\n\n### Section 1: Memory Layout & The C-Contiguous Array\nStandard Python lists are arrays of pointers pointing to scattered memory addresses. When you iterate through a million numbers in a Python list, the CPU cache suffers continuous cache misses as it dereferences each PyObject pointer.\n\nNumPy arrays (ndarray), by contrast, store primitive C-types (float64, int32) in contiguous, uninterrupted physical RAM. This allows the modern processor to leverage Single Instruction Multiple Data (SIMD) vector registers, applying mathematical operations across 4 to 8 floating point numbers simultaneously in a single clock cycle.\n\n### Section 2: Vectorization vs. Explicit Python Loops\nConsider calculating the Euclidean distance between two vectors of 10 million coordinates. An explicit for-loop in pure Python takes approximately 2.4 seconds due to dynamic type dispatching on every loop iteration. The equivalent vectorized statement (np.sqrt(np.sum((a - b)**2))) completes in less than 9 milliseconds—over 250 times faster.\n\n### Section 3: Broadcasting Rules in Practice\nBroadcasting allows NumPy to treat arrays with different shapes during arithmetic operations without making unnecessary in-memory copies. When operating on two arrays, NumPy compares their shapes element-wise from right to left:\n1. Dimensions are compatible if they are equal, or\n2. If one of the dimensions is exactly 1.\nThis elegant mechanism powers matrix normalizations, feature scaling, and distance metric computations across multidimensional tensors.`
      },
      {
        title: 'Chapter 3: Data Cleaning, Missing Values & Reshaping',
        content: `In production environments, datasets are rarely clean. They arrive contaminated with malformed dates, duplicate transactions, unexpected null values, and shifted column delimiters.\n\n### Section 1: Handling Missing and Sentinel Data\nPandas adopts NaN (IEEE floating-point Not a Number) and the modern pandas.NA sentinel to denote missing values. Developing systematic strategies for imputation (mean, median, forward-fill, or k-nearest neighbours) is essential to preserve analytical validity without introducing synthetic bias into downstream statistical inferences.\n\n### Section 2: Pivoting, Stacking, and Melting\nDatasets exist in either "wide" or "long" formats. While wide tables are comfortable for human inspection, machine learning feature stores and regression engines require tidy, normalized long structures. Using pd.melt(), df.pivot_table(), and hierarchical MultiIndexes allows analysts to restructure terabytes of raw signals in seconds.`
      }
    ]
  },
  {
    _id: 'book-ds-02',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
    authors: ['Aurélien Géron'],
    isbn: '978-1098125974',
    barcode: 'BC-DS-102',
    description: 'Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. This best-selling book shows you how to build intelligent systems using concrete examples and minimal theory.',
    category: 'Data Science',
    categorySlug: 'data-science',
    publisher: "O'Reilly Media",
    publicationYear: 2022,
    totalCopies: 7,
    availableCopies: 5,
    rating: 4.96,
    reviewCount: 2410,
    matchPercentage: 98,
    coverImageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack DS-02 / Shelf A',
    ebookContent: [
      {
        title: 'Chapter 1: The Machine Learning Landscape',
        content: `When most people hear "Machine Learning", they immediately envision futuristic robots or superintelligent agents. But Machine Learning is not science fiction: it is already here, powering web search algorithms, credit card fraud detection, recommendation carousels, and automated medical diagnosis.\n\n### Section 1: What Is Machine Learning?\nMachine Learning is the science (and art) of programming computers so that they can learn from data. Arthur Samuel famously defined it in 1959 as: "The field of study that gives computers the ability to learn without being explicitly programmed."\n\nA computer program is said to learn from experience E with respect to some task T and performance measure P, if its performance on T, as measured by P, improves with experience E.\n\n### Section 2: Supervised vs. Unsupervised Learning\nMachine learning systems can be classified according to the amount and type of supervision they receive during training:\n• Supervised Learning: The training data fed to the algorithm includes the desired solutions, called labels. Typical tasks include Classification (e.g. spam detection) and Regression (e.g. predicting car prices based on mileage and brand).\n• Unsupervised Learning: The training data is unlabeled. The system attempts to learn patterns without a teacher. Examples include clustering customer segments, anomaly detection, and dimensionality reduction (PCA).\n• Semi-Supervised & Self-Supervised: Large pools of unlabeled data combined with sparse human labels, which forms the core training methodology for modern Large Language Models.\n\n### Section 3: The Danger of Overfitting & Underfitting\nThe central challenge in all predictive modeling is ensuring that the model generalizes well to unseen instances. Overfitting happens when the model is too complex relative to the amount and noisiness of the training data. Regularization techniques (L1 Lasso, L2 Ridge, Dropout) and rigorous Cross-Validation are vital safeguards every practitioner must implement.`
      },
      {
        title: 'Chapter 2: End-to-End Machine Learning Project Architecture',
        content: `Building a real-world predictive system involves far more than simply calling model.fit(). The modeling phase represents less than 15% of total project effort.\n\n### Section 1: Framing the Business Problem\nBefore writing a single line of code, you must clarify the overarching business objective: How will the enterprise benefit from this model? What is the current human or heuristic baseline? What metric (RMSE, MAE, ROC-AUC, F1-Score) directly reflects business success?\n\n### Section 2: Data Exploration & Feature Engineering\nInspecting distributions with histograms, calculating Pearson correlation matrices, identifying skewness, and creating synthetic features (e.g. rooms_per_household rather than raw total_rooms) yields monumental improvements in accuracy compared to hyperparameter tuning alone.\n\n### Section 3: Automated Scikit-Learn Pipelines\nProduction systems demand automated, reproducible pipelines that handle numerical scaling (StandardScaler), categorical one-hot encoding, and missing value imputation uniformly during both training and live inference.`
      }
    ]
  },
  {
    _id: 'book-ds-03',
    title: 'Practical Statistics for Data Scientists: 50+ Essential Concepts',
    authors: ['Peter Bruce', 'Andrew Bruce', 'Peter Gedeck'],
    isbn: '978-1492072942',
    barcode: 'BC-DS-103',
    description: 'Statistical methods are a key part of data science, yet very few data scientists have formal statistical training. This course bridges the gap with practical examples in Python and R.',
    category: 'Data Science',
    categorySlug: 'data-science',
    publisher: "O'Reilly Media",
    publicationYear: 2020,
    totalCopies: 6,
    availableCopies: 4,
    rating: 4.88,
    reviewCount: 940,
    matchPercentage: 94,
    coverImageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=600',
    badge: 'NEW ARRIVAL',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack DS-03 / Shelf C',
    ebookContent: [
      {
        title: 'Chapter 1: Exploratory Data Analysis & Estimates of Location',
        content: `In classical statistics, data analysis is approached with hypothesis testing and formal proofs. In data science, however, the primary ethos is exploratory data analysis (EDA): allowing the data to reveal its internal structures, anomalies, and relationships.\n\n### Section 1: Means, Medians, and Robust Metrics\nThe arithmetic mean is the most common estimate of central tendency, yet it is notoriously sensitive to extreme outliers. In financial distributions or internet click logs, a single multi-millionaire or automated web crawler will heavily distort the sample mean. Trimmed means and the median provide robust location estimates that remain stable regardless of outlier presence.\n\n### Section 2: Variability & Dispersion\nLocation is just one dimension of understanding a feature; the other is dispersion. Variance and standard deviation measure squared deviations from the center, while Interquartile Range (IQR) and Median Absolute Deviation (MAD) offer resilient alternatives for non-Gaussian distributions.`
      }
    ]
  },

  // ----------------------------------------------------
  // WEB DEVELOPMENT BOOKS
  // ----------------------------------------------------
  {
    _id: 'book-wd-01',
    title: 'Full-Stack React, TypeScript, and Node',
    authors: ['David Choi'],
    isbn: '978-1800206458',
    barcode: 'BC-WD-201',
    description: 'Build enterprise-grade, end-to-end full-stack web applications using React 18, Node.js, Express, TypeScript, GraphQL, PostgreSQL, and modern Tailwind CSS design patterns.',
    category: 'Web Development',
    categorySlug: 'web-development',
    publisher: 'Packt Publishing',
    publicationYear: 2023,
    totalCopies: 6,
    availableCopies: 5,
    rating: 4.94,
    reviewCount: 1120,
    matchPercentage: 97,
    coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    badge: 'TRENDING',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 82,
    shelfLocation: 'Stack WD-01 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: Modern Full-Stack System Architecture',
        content: `The paradigm of web application engineering has shifted dramatically over the past decade. Where early web applications relied on server-side rendering of static HTML with light sprinkling of jQuery, modern platforms require real-time interactivity, rich client-side state coordination, and strictly typed API contracts connecting the client with the backend.\n\n### Section 1: The Three Pillars of Modern Web Craftsmanship\nA resilient full-stack architecture balances three distinct concerns:\n1. Declarative Component Hierarchies: User interfaces constructed as pure functions of state. When state updates, React handles efficient reconciliation via the Virtual DOM and Concurrent Mode scheduling.\n2. End-to-End Type Safety: Utilizing TypeScript across both the client-side single page app (SPA) and backend Express/Node APIs eliminates runtime "Cannot read properties of undefined" exceptions before code ever hits staging.\n3. Layered Service Boundaries: Decoupling HTTP transport handlers (controllers) from core business logic (services) and database persistence mechanisms (ORMs/ODMs), ensuring auditability and frictionless unit testing.\n\n### Section 2: State Management in 2024\nState management in React has matured. For years, developers reached for monolithic global Redux stores for every button click. Modern best practices separate Server State (caching, revalidation, optimistic updates via TanStack Query) from ephemeral UI State (React Context, local hooks). This architectural clarity reduces boilerplate by up to 70% while improving page responsiveness.\n\n### Section 3: Performance, Bundling, and Vite\nGone are the days of sluggish Webpack cold starts that took two minutes to recompile on every change. The introduction of native ES modules and native Go/Rust bundlers like Vite and ESBuild has transformed developer productivity. We now achieve sub-50ms Hot Module Replacement (HMR), enabling rapid feedback cycles while crafting complex interactive components.`
      },
      {
        title: 'Chapter 2: Designing High-Performance REST & GraphQL APIs',
        content: `An application is only as resilient as its underlying communication channels. When client devices range from high-speed desktop fiber connections to intermittent mobile 4G in remote regions, API efficiency is paramount.\n\n### Section 1: RESTful Conventions Done Right\nA well-architected REST API leverages HTTP verbs semantically: GET for idempotent reads, POST for creation, PUT/PATCH for mutations, and DELETE for removals. Standardized JSON response envelopes featuring status flags, error codes, and paginated cursors ensure predictable client consumption.\n\n### Section 2: Authentication with JWT & Secure Cookies\nStoring authentication tokens in localStorage makes web applications vulnerable to Cross-Site Scripting (XSS) attacks. Enterprise architectures employ HttpOnly, Secure, SameSite cookies containing short-lived JSON Web Tokens (JWT) paired with rotatable refresh tokens stored in database sessions.\n\n### Section 3: Rate Limiting and Circuit Breakers\nProtecting backend infrastructure from denial-of-service spikes requires distributed token-bucket rate limiting (Redis) and circuit breaker patterns that degrade gracefully when downstream dependencies slow down.`
      }
    ]
  },
  {
    _id: 'book-wd-02',
    title: 'The Pragmatic Programmer: Your Journey To Mastery (20th Anniv.)',
    authors: ['David Thomas', 'Andrew Hunt'],
    isbn: '978-0135957059',
    barcode: 'BC-WD-202',
    description: 'Straight from the programming trenches, this 20th Anniversary Edition cuts through modern software development complexities to teach timeless craftsmanship, DRY principles, and debugging mastery.',
    category: 'Web Development',
    categorySlug: 'web-development',
    publisher: 'Addison-Wesley',
    publicationYear: 2019,
    totalCopies: 8,
    availableCopies: 4,
    rating: 4.95,
    reviewCount: 3200,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&q=80&w=600',
    badge: 'TOP PICK',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack WD-02 / Shelf B',
    ebookContent: [
      {
        title: 'Chapter 1: A Pragmatic Philosophy & The Broken Windows Theory',
        content: `What distinguishes a master craftsman from an ordinary coder? It is not merely the number of programming languages memorized or the speed at which syntax is typed into an editor. It is an attitude: a continuous care for the software organism, personal responsibility for outcomes, and the refusal to let entropy take over.\n\n### Section 1: The Broken Window Syndrome\nPsychologists have demonstrated that a single broken window left unrepaired in an urban building quickly leads to widespread vandalism, littering, and decay. The psychology is simple: if no one cares enough to fix the first obvious defect, others conclude that negligence is acceptable.\n\nThe same phenomenon destroys software codebases. A single poorly named variable, a skipped unit test, an ignored compiler warning, or a hasty copy-pasted hack signals to the entire engineering team that code quality does not matter. Within six months, technical debt multiplies exponentially until shipping a single feature feels like swimming through wet concrete.\n\n### Section 2: Tip #1: Care About Your Craft\nWhy spend your life writing software if you don't care about doing it well? Pragmatic programmers take immense pride in their systems. They invest regularly in their knowledge portfolio—learning a new paradigm every year, reading source code of legendary libraries, and refining their command-line toolchain.\n\n### Section 3: Good-Enough Software\nYou must balance the pursuit of craftsmanship with economic reality. Software that is shipped today and iterated tomorrow is infinitely more valuable than a theoretical masterpiece that never leaves the developer's workstation. Know when to declare a system good enough for user testing.`
      },
      {
        title: 'Chapter 2: The DRY Principle: Don’t Repeat Yourself',
        content: `The DRY principle (Don't Repeat Yourself) is perhaps the most famous guideline introduced in this book, yet it is also the most frequently misunderstood.\n\n### Section 1: Duplication of Knowledge vs. Duplication of Code\nDRY is not about having two pieces of code that look textually identical. DRY states that: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."\n\nWhen two functions perform different business tasks but happen to share similar lines of arithmetic, unifying them into an awkward shared abstraction creates coupling rather than elegance. True duplication occurs when the same business rule—such as customer tax calculation—is codified independently in the frontend form validator, backend database schema, and reporting batch script.\n\n### Section 2: Orthogonality and Decoupled Systems\nTwo or more things are orthogonal if changes in one do not affect any of the others. In a well-designed computer system, database changes do not break UI components, and changing the billing provider does not require rewrites of customer account management.`
      }
    ]
  },
  {
    _id: 'book-wd-03',
    title: 'Eloquent JavaScript: A Modern Introduction to Programming',
    authors: ['Marijn Haverbeke'],
    isbn: '978-1593279509',
    barcode: 'BC-WD-203',
    description: 'This much-praised book goes beyond syntax to explore the philosophy, expressive power, functional paradigms, and asynchronous event loop mechanisms of modern JavaScript.',
    category: 'Web Development',
    categorySlug: 'web-development',
    publisher: 'No Starch Press',
    publicationYear: 2018,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.89,
    reviewCount: 1650,
    matchPercentage: 93,
    coverImageUrl: 'https://images.unsplash.com/photo-1579468118864-dd0928ff4e71?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack WD-03 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Values, Types, and Operators in JavaScript',
        content: `Below the surface of the computer screen, the machine lives on electric pulses. Everything in a computer is ultimately represented as vast oceans of bits: zeroes and ones. To make these bits do meaningful human work, we construct abstractions called types.\n\n### Section 1: Numbers, Strings, and Booleans\nJavaScript represents numbers using the 64-bit float format (IEEE 754), meaning all numbers from integers to decimals share the same computational representation. Strings represent arbitrary text enclosed in quotes, with template literals providing expressive interpolation.\n\n### Section 2: The Strange Behavior of Type Coercion\nJavaScript goes out of its way to avoid throwing runtime errors when incompatible types are combined. When you evaluate ('5' - 1), it converts the string to a number and produces 4. But when you evaluate ('5' + 1), it concatenates and yields '51'. Understanding strict equality (===) versus loose equality (==) is foundational to avoiding subtle production bugs.`
      }
    ]
  },

  // ----------------------------------------------------
  // BIOGRAPHY BOOKS
  // ----------------------------------------------------
  {
    _id: 'book-bio-01',
    title: 'Steve Jobs: The Exclusive Biography',
    authors: ['Walter Isaacson'],
    isbn: '978-1451648539',
    barcode: 'BC-BIO-301',
    description: 'Based on more than forty interviews with Steve Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues.',
    category: 'Biography & Memoir',
    categorySlug: 'biography',
    publisher: 'Simon & Schuster',
    publicationYear: 2011,
    totalCopies: 8,
    availableCopies: 5,
    rating: 4.96,
    reviewCount: 4200,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    badge: 'BESTSELLER',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack BIO-01 / Shelf A',
    ebookContent: [
      {
        title: 'Chapter 1: Childhood & The Garage in Silicon Valley',
        content: `When Paul Jobs was discharged from the Coast Guard after World War II, he made a wager with his shipmates that he could find a wife within two weeks. In San Francisco, he met Clara Hagopian, and they married in 1946. Unable to have biological children, in 1955 they adopted a baby boy born to a graduate student named Joanne Schieble. They named him Steven Paul Jobs.\n\n### Section 1: The Soul of the Craftsman\nPaul Jobs was a machinist who restored old cars. In their garage in Mountain View, California, Paul gave Steve a workbench of his own. Steve watched his father work with meticulous devotion: "He loved doing things right. He even cared about the look of the parts you couldn't see." \n\nYears later, when Apple built the Macintosh, Steve insisted that the circuit boards inside the sealed plastic casing be beautifully laid out: "A real carpenter doesn't use lousy plywood for the back of a cabinet, even though nobody's going to see it. You know it's there, so you're going to use a beautiful piece of wood on the back."\n\n### Section 2: Meeting Steve Wozniak\nIn 1971, Steve was introduced to an electronics prodigy five years older than him: Steve Wozniak. While Wozniak was interested purely in the aesthetic purity of engineering design, Jobs possessed an instinct for productization, user experience, and aesthetic packaging that would spark the personal computer revolution.`
      },
      {
        title: 'Chapter 2: The Reality Distortion Field',
        content: `Colleagues at Apple frequently spoke of Jobs's "Reality Distortion Field"—a phrase borrowed from Star Trek to describe his confounding ability to convince anyone that the seemingly impossible was feasible through pure force of will.\n\n### Section 1: Pushing Beyond Perceived Human Limits\nWhen engineer Larry Kenyon complained that it was impossible to make the Macintosh operating system boot five seconds faster, Jobs asked him: "If it would save a person's life, could you find a way to shave five seconds off the boot time?" Kenyon admitted he could. Jobs calculated that five million Mac users booting up each day for ten seconds saved 300 million hours a year—equivalent to several hundred human lifespans. Kenyon returned to his desk and trimmed the boot sequence by twenty-eight seconds.`
      }
    ]
  },
  {
    _id: 'book-bio-02',
    title: 'The Man Who Knew Infinity: A Life of the Genius Ramanujan',
    authors: ['Robert Kanigel'],
    isbn: '978-0671750619',
    barcode: 'BC-BIO-302',
    description: 'The spellbinding biography of Srinivasa Ramanujan, the uneducated clerk from South India who revolutionized 20th-century mathematics alongside G.H. Hardy at Cambridge University.',
    category: 'Biography & Memoir',
    categorySlug: 'biography',
    publisher: 'Washington Square Press',
    publicationYear: 1991,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.93,
    reviewCount: 1780,
    matchPercentage: 96,
    coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    badge: 'STAFF PICK',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    shelfLocation: 'Stack BIO-02 / Row 3',
    ebookContent: [
      {
        title: 'Chapter 1: The Temple Town of Kumbakonam',
        content: `In the temple-studded town of Kumbakonam along the sacred Kaveri River, young Srinivasa Ramanujan grew up in modest Brahmin surroundings. With no formal higher education and using scraps of wrapping paper to write equations in red ink, his mind pierced directly into the deepest mysteries of number theory, infinite series, and continued fractions.\n\n### Section 1: Equations from the Goddess Namagiri\nRamanujan famously claimed that the mathematical formulas he recorded were revealed to him in dreams by the goddess Namagiri of Namakkal: "An equation for me has no meaning unless it expresses a thought of God." When his famous letter containing dozens of theorems arrived on the desk of G.H. Hardy at Trinity College Cambridge in 1913, Hardy was initially stunned, writing that the theorems "must be true because, if they were not true, no one would have had the imagination to invent them."`
      }
    ]
  },
  {
    _id: 'book-bio-03',
    title: 'Alan Turing: The Enigma',
    authors: ['Andrew Hodges'],
    isbn: '978-0691164724',
    barcode: 'BC-BIO-303',
    description: 'The definitive biography of the mathematical genius and founder of modern computer science who broke the German U-boat Enigma cipher at Bletchley Park and pioneered artificial intelligence.',
    category: 'Biography & Memoir',
    categorySlug: 'biography',
    publisher: 'Princeton University Press',
    publicationYear: 2014,
    totalCopies: 6,
    availableCopies: 4,
    rating: 4.91,
    reviewCount: 1540,
    matchPercentage: 95,
    coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack BIO-03 / Shelf C',
    ebookContent: [
      {
        title: 'Chapter 1: The Universal Machine & Decidable Truth',
        content: `In 1936, a 24-year-old Cambridge fellow named Alan Mathison Turing published a paper titled "On Computable Numbers, with an Application to the Entscheidungsproblem." In this paper, without building a single physical circuit, Turing laid down the theoretical foundations of the digital computer: the Universal Turing Machine.\n\n### Section 1: Breaking the Enigma at Bletchley Park\nDuring the darkest hours of World War II, stationed at Hut 8 in Bletchley Park, Turing developed the electro-mechanical Bombe machines that decrypted intercepted German naval messages, fundamentally altering the trajectory of the Battle of the Atlantic and saving an estimated fourteen million lives.`
      }
    ]
  },

  // ----------------------------------------------------
  // BIBLIOGRAPHY & LIBRARY SCIENCE
  // ----------------------------------------------------
  {
    _id: 'book-bib-01',
    title: 'The Library Book',
    authors: ['Susan Orlean'],
    isbn: '978-1476740188',
    barcode: 'BC-LIB-601',
    description: 'A dazzling, passionate exploration of the role of libraries in human civilization, interwoven with the unsolved mystery of the 1986 catastrophic fire at the Los Angeles Public Library.',
    category: 'Bibliography & Library Science',
    categorySlug: 'bibliography',
    publisher: 'Simon & Schuster',
    publicationYear: 2018,
    totalCopies: 7,
    availableCopies: 5,
    rating: 4.88,
    reviewCount: 1320,
    matchPercentage: 94,
    coverImageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600',
    badge: 'CURATED',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    shelfLocation: 'Stack LIB-01 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: The Sanctuary of Human Memory',
        content: `On the morning of April 29, 1986, an alarm sounded in the Los Angeles Central Library. By nightfall, 400,000 volumes had burned to ash, and another 700,000 were heavily water damaged in the largest library fire in American history.\n\n### Section 1: What a Library Means to a City\nLibraries are not merely storage buildings for paper wrapped in cardboard. They are sanctuaries where human consciousness is preserved across centuries. In a library, a scholar from 15th-century Florence can whisper directly into the mind of a student in modern Tokyo. To destroy a library is to sever the connective tissue of civilization.`
      }
    ]
  },
  {
    _id: 'book-bib-02',
    title: 'The Information: A History, A Theory, A Flood',
    authors: ['James Gleick'],
    isbn: '978-1400096237',
    barcode: 'BC-LIB-602',
    description: 'From the invention of talking drums to Claude Shannon’s mathematical theory of communication, this masterwork chronicles how humanity transformed into an information species.',
    category: 'Bibliography & Library Science',
    categorySlug: 'bibliography',
    publisher: 'Vintage Books',
    publicationYear: 2011,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.9,
    reviewCount: 1210,
    matchPercentage: 93,
    coverImageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    badge: 'CLASSIC',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack LIB-02 / Shelf B',
    ebookContent: [
      {
        title: 'Chapter 1: Drums That Talk & Symbols That Endure',
        content: `Before the written word, before fiber cables and quantum transceivers, African tribes transmitted complex messages over miles through the acoustic modulation of hollow wooden talking drums. Information has always sought channels of transmission.\n\n### Section 1: Claude Shannon and the Birth of the Bit\nIn 1948, a quiet researcher at Bell Labs named Claude Shannon published a twenty-nine-page paper: "A Mathematical Theory of Communication." In it, he stripped information of its semantic meaning, defining it purely as the reduction of uncertainty, measured in fundamental binary units: bits.`
      }
    ]
  },

  // ----------------------------------------------------
  // PHYSIOLOGY & MEDICAL SCIENCE
  // ----------------------------------------------------
  {
    _id: 'book-phy-01',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    authors: ['John E. Hall', 'Michael E. Hall'],
    isbn: '978-0323597128',
    barcode: 'BC-MED-401',
    description: 'The world’s foremost medical physiology textbook. Clearly conveys complex cellular principles, cardiovascular mechanics, renal balance, and neurophysiology in an authoritative, readable narrative.',
    category: 'Physiology & Health Science',
    categorySlug: 'physiology',
    publisher: 'Elsevier',
    publicationYear: 2021,
    totalCopies: 6,
    availableCopies: 4,
    rating: 4.97,
    reviewCount: 2890,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
    badge: 'CORE TEXTBOOK',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 55,
    shelfLocation: 'Stack MED-01 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Functional Organization of the Human Body & Control of the Internal Environment',
        content: `Physiology is the biological discipline that explains the physical and chemical mechanisms responsible for the origin, development, and progression of life. From the single cell bacterium to the complex human with 37 trillion cooperating cells, the beauty of physiology lies in continuous feedback regulation.\n\n### Section 1: Cells as the Living Units of the Body\nThe basic living unit of the body is the cell. Each organ is an aggregate of many different cells held together by intercellular supporting structures. Although the diverse cells of the body differ marked in physical geometry, all cells share common metabolic traits: oxygen combines with carbohydrate, fat, and protein breakdown products to release the energy required for cellular function.\n\n### Section 2: The Extracellular Fluid — The "Internal Environment" (Milieu Intérieur)\nAbout 60 percent of the adult human body is fluid. Although most of this fluid is inside the cells (intracellular fluid), about one third is in the spaces outside the cells (extracellular fluid). This extracellular fluid is in constant motion throughout the body and is continually mixed by blood circulation.\n\nIt was the great 19th-century French physiologist Claude Bernard who first formulated the concept that the internal environment (milieu intérieur) must remain constant for life to persist. Walter Cannon later coined the term homeostasis to describe the dynamic equilibrium that maintains bodily parameters—from blood pH (7.35 to 7.45) to arterial pressure—within tight, life-sustaining boundaries.\n\n### Section 3: Negative and Positive Feedback Control Systems\nThe body possesses thousands of control systems. Most systems operate by negative feedback: if a factor becomes excessive or deficient, the control mechanism initiates responses that push the parameter back toward the mean. Conversely, uncontrolled positive feedback leads to instability and death (vicious cycles), except in rare, highly specialized physiological events such as blood clotting cascades and uterine contractions during childbirth.`
      },
      {
        title: 'Chapter 2: The Cell Membrane & Transport Across Cellular Boundaries',
        content: `The cell membrane is a lipid bilayer with floating globular proteins. It acts not merely as a passive container, but as an active gatekeeper controlling ionic electrical potentials and metabolic substrates.\n\n### Section 1: The Lipid Bilayer and Diffusion\nThe basic lipid structure of the cell membrane consists of phospholipid molecules with hydrophilic phosphate heads and hydrophobic fatty acid tails. Lipid-soluble substances like oxygen, carbon dioxide, and alcohol diffuse directly through the lipid layer with immense speed.\n\n### Section 2: Active Transport & The Sodium-Potassium Pump (Na+/K+-ATPase)\nFor ions that cannot permeate lipids (Na+, K+, Ca2+), specialized membrane proteins perform active transport against steep concentration gradients. The Na+/K+ pump transports three sodium ions out of the cell for every two potassium ions pumped in, consuming up to 60 percent of a resting cell's total ATP budget. This electrogenic gradient powers nerve impulse transmission and muscle contraction.`
      }
    ]
  },
  {
    _id: 'book-phy-02',
    title: 'The Body: A Guide for Occupants',
    authors: ['Bill Bryson'],
    isbn: '978-0385539302',
    barcode: 'BC-MED-402',
    description: 'A head-to-toe tour of the astonishing marvel that is the human organism. Filled with brilliant facts and astonishing insights into how our bodies heal, breathe, and keep us alive.',
    category: 'Physiology & Health Science',
    categorySlug: 'physiology',
    publisher: 'Doubleday',
    publicationYear: 2019,
    totalCopies: 7,
    availableCopies: 6,
    rating: 4.92,
    reviewCount: 3100,
    matchPercentage: 96,
    coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    shelfLocation: 'Stack MED-02 / Shelf A',
    ebookContent: [
      {
        title: 'Chapter 1: How to Build a Human',
        content: `You spend your entire existence inside a warm, moist casing of skin and bone, yet most of us have very little idea of how it functions. If you were to purchase all the basic chemical elements required to assemble an adult human at retail market prices—oxygen, carbon, hydrogen, nitrogen, calcium, and a dash of copper, iron, and zinc—it would cost approximately $115. Yet nobody on Earth can assemble those ingredients into a beating human heart.\n\n### Section 1: The Miraculous Cell Factory\nEvery second of every day, your bone marrow produces two million brand-new red blood cells. Your heart pumps 7,500 liters of blood each day through 100,000 kilometers of blood vessels—enough to circle the Earth twice. Your immune system fends off billions of potentially fatal microbial invaders without you ever noticing.`
      }
    ]
  },

  // ----------------------------------------------------
  // PSYCHOLOGY & HUMAN BEHAVIOR
  // ----------------------------------------------------
  {
    _id: 'book-psy-01',
    title: 'Thinking, Fast and Slow',
    authors: ['Daniel Kahneman'],
    isbn: '978-0374533557',
    barcode: 'BC-PSY-501',
    description: 'Nobel Memorial Prize winner Daniel Kahneman takes us on an unprecedented tour of the mind, analyzing the two systems that drive the way we make decisions: the fast, intuitive System 1 and the slow, deliberate System 2.',
    category: 'Psychology & Human Behavior',
    categorySlug: 'psychology',
    publisher: 'Farrar, Straus and Giroux',
    publicationYear: 2011,
    totalCopies: 9,
    availableCopies: 5,
    rating: 4.93,
    reviewCount: 5200,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600',
    badge: 'TOP PICK',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 72,
    shelfLocation: 'Stack PSY-01 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: Two Systems of the Mind',
        content: `To understand the cognitive biases that distort human reasoning, we must visualize the mind as an interaction between two fictional characters: System 1 and System 2.\n\n### Section 1: Defining System 1 and System 2\n• System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control. It perceives distance, turns toward sudden sounds, detects anger in a voice, and completes the phrase "bread and..." without hesitation.\n• System 2 allocates attention to the effortful mental operations that demand concentration: calculating 17 × 24, checking the validity of a complex logical argument, parking a vehicle in a tight space, or maintaining self-control when provoked.\n\n### Section 2: Cognitive Laziness & The Law of Least Effort\nSystem 2 is naturally lazy; it expends mental glucose reluctantly. Because System 1 is continuously generating impressions, feelings, and impulses, System 2 usually adopts those suggestions without verification. This heuristics-driven efficiency allows humans to survive, but it also produces systematic, predictable cognitive illusions: anchoring effects, confirmation bias, and the availability heuristic.\n\n### Section 3: The Gorilla Experiment & Inattentional Blindness\nIn the famous experiment by Christopher Chabris and Daniel Simons, participants were instructed to count passes between basketball players. Halfway through, a person in a full gorilla suit walked onto the court, beat their chest, and walked away. Over 50% of viewers completely failed to see the gorilla because their System 2 attentional budget was entirely occupied by counting. We are blind to the obvious, and we are blind to our blindness.`
      },
      {
        title: 'Chapter 2: Heuristics, Biases & The Illusion of Validity',
        content: `When faced with a difficult question, System 1 automatically substitutes an easier question without you realizing that a substitution took place.\n\n### Section 1: The Availability Heuristic\nHow frequent are plane crashes compared to car accidents? How common is violent crime compared to cardiovascular disease? Humans do not evaluate risks by consulting actuarial tables; we evaluate risks based on the ease with which dramatic examples come to mind. Sensational media headlines hijack System 1 availability, causing distorted public policy and unwarranted anxiety.`
      }
    ]
  },
  {
    _id: 'book-psy-02',
    title: 'The Psychology of Money: Timeless Lessons on Wealth, Greed & Happiness',
    authors: ['Morgan Housel'],
    isbn: '978-0857197689',
    barcode: 'BC-PSY-502',
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people. 19 short stories exploring the strange ways people think about money.',
    category: 'Psychology & Human Behavior',
    categorySlug: 'psychology',
    publisher: 'Harriman House',
    publicationYear: 2020,
    totalCopies: 8,
    availableCopies: 7,
    rating: 4.95,
    reviewCount: 3800,
    matchPercentage: 98,
    coverImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack PSY-02 / Shelf B',
    ebookContent: [
      {
        title: 'Chapter 1: No One’s Crazy & Compounding Magic',
        content: `Your personal experiences with money make up maybe 0.00000001% of what’s happened in the world, but maybe 80% of how you think the world works.\n\n### Section 1: The Janitor and the Executive\nRonald Read was a philanthropist, investor, janitor, and gas station attendant from rural Vermont. When he died at age 92 in 2014, he left $6 million to his local library and hospital. He had no finance degree, no inside connections, and no inherited fortune; he simply saved what little he earned and let compound interest work silently across six decades.\n\nContrast Read with Richard Fuscone, a Harvard-educated Merrill Lynch vice president who borrowed heavily, built a 18,000-square-foot mansion with eleven bathrooms, and filed for bankruptcy during the 2008 financial crisis. In what other industry does a novice without formal education outperform a Wall Street executive? Only in financial psychology, where behavior trumps raw intelligence.`
      }
    ]
  },
  {
    _id: 'book-psy-03',
    title: 'Atomic Habits: Tiny Changes, Remarkable Results',
    authors: ['James Clear'],
    isbn: '978-0735211292',
    barcode: 'BC-PSY-503',
    description: 'A proven framework for improving every day. James Clear, one of the world’s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors.',
    category: 'Psychology & Human Behavior',
    categorySlug: 'psychology',
    publisher: 'Avery',
    publicationYear: 2018,
    totalCopies: 10,
    availableCopies: 6,
    rating: 4.97,
    reviewCount: 6100,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    badge: 'BESTSELLER',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 90,
    shelfLocation: 'Stack PSY-03 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: The Surprising Power of Atomic Habits',
        content: `It is so easy to overestimate the importance of one defining breakthrough and underestimate the value of making small improvements on a daily basis.\n\n### Section 1: The Aggregation of Marginal Gains\nIn 2003, British Cycling hired Dave Brailsford. For nearly a century, British cyclists had been mediocre, winning only a single gold medal in 76 years. Brailsford instituted the strategy of the aggregation of marginal gains: searching for a tiny 1 percent improvement in everything you do. They redesigned bicycle seats for comfort, tested wind tunnel fabrics in racing suits, determined which massage gel led to the fastest muscle recovery, and taught riders the best hand-washing technique to avoid colds.\n\nFive years later at the 2008 Beijing Olympics, the British team won 60 percent of all available gold medals. If you get 1 percent better each day for one year, you end up thirty-seven times better (1.01^365 = 37.78). Conversely, if you get 1 percent worse each day, you decline down nearly to zero (0.99^365 = 0.03).\n\n### Section 2: Forget Goals, Focus on Systems\nGoals are about the results you want to achieve. Systems are about the processes that lead to those results. Winners and losers share the exact same goals (every Olympian wants gold; every student wants top grades). The goal cannot be what differentiates the winners; it is their underlying daily system.`
      }
    ]
  },

  // ----------------------------------------------------
  // COMPUTER SCIENCE & ARCHITECTURE
  // ----------------------------------------------------
  {
    _id: 'book-cs-01',
    title: 'Designing Data-Intensive Applications',
    authors: ['Martin Kleppmann'],
    isbn: '978-1449373320',
    barcode: 'BC-CS-001',
    description: 'The definitive architectural guide to distributed systems, consensus protocols, replication models, partitioned storage, and modern streaming database engines.',
    category: 'Computer Science',
    categorySlug: 'computer-science',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    totalCopies: 8,
    availableCopies: 5,
    rating: 4.96,
    reviewCount: 3890,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    badge: 'CORE MONOGRAPH',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    progress: 74,
    shelfLocation: 'Stack CS-04 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: Reliable, Scalable, and Maintainable Applications',
        content: `Today, many software applications are data-intensive, as opposed to compute-intensive. Raw CPU power is rarely the primary constraint; rather, modern bottlenecks stem from the sheer volume of data, the complexity of data structures, and the rate at which data mutates.\n\n### Section 1: The Three Core Engineering Requirements\nA resilient software system must satisfy three fundamental pillars:\n1. Reliability: The system should continue to perform correctly (at the expected level of performance) even in the face of adversity (hardware faults, software bugs, human errors).\n2. Scalability: As the system grows in data volume, traffic volume, or complexity, there should be reasonable ways of dealing with that growth without degrading service.\n3. Maintainability: Over time, many different people will work on the system. They should all be able to work on it productively without breaking existing guarantees.\n\n### Section 2: Faults vs. Failures\nA fault is defined as one component of the system deviating from its spec, whereas a failure is when the entire system as a whole stops providing the required service to the user. We design fault-tolerant systems using active replication, consensus algorithms (Raft, Paxos), and graceful degradation.`
      },
      {
        title: 'Chapter 2: Data Models, Storage Engines & LSM-Trees',
        content: `How do database engines organize bits on magnetic disks and solid-state NVMe storage to achieve millions of writes per second?\n\n### Section 1: Hash Indexes vs. SSTables and LSM-Trees\nTraditional databases utilize B-Trees with fixed 4KB page allocations. In write-heavy distributed architectures, Log-Structured Merge-Trees (LSM-Trees) append mutations to an in-memory sorted MemTable before flushing to immutable Sorted String Tables (SSTables) on disk. Background compaction merges duplicate keys, yielding unprecedented write throughput.`
      }
    ]
  },
  {
    _id: 'book-cs-02',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    authors: ['Robert C. Martin'],
    isbn: '978-0132350884',
    barcode: 'BC-CS-002',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Master naming conventions, pure functions, and refactoring.',
    category: 'Computer Science',
    categorySlug: 'computer-science',
    publisher: 'Prentice Hall',
    publicationYear: 2008,
    totalCopies: 6,
    availableCopies: 3,
    rating: 4.86,
    reviewCount: 2950,
    matchPercentage: 95,
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    badge: 'CLASSIC',
    isEbook: true,
    isTrending: false,
    isRecommended: true,
    shelfLocation: 'Stack CS-01 / Shelf C',
    ebookContent: [
      {
        title: 'Chapter 1: The Philosophy of Clean Code',
        content: `You are reading this book for two reasons: First, you are a programmer. Second, you want to be a better programmer. Good. We need better programmers.\n\n### Section 1: The Total Cost of Owning a Mess\nEvery developer has experienced the slow, grinding pain of working in a bad codebase. In the beginning, progress is fast. But as hacks accumulate, every new feature requires weeks of patching regressions. Eventually, management demands a total rewrite—only for the replacement system to recreate the same mess within two years unless discipline is maintained.`
      }
    ]
  },

  // ----------------------------------------------------
  // INTERESTING MONOGRAPHS & UNIVERSAL CLASSICS
  // ----------------------------------------------------
  {
    _id: 'book-int-01',
    title: 'Sapiens: A Brief History of Humankind',
    authors: ['Yuval Noah Harari'],
    isbn: '978-0062316097',
    barcode: 'BC-INT-701',
    description: '100,000 years ago, at least six human species inhabited the Earth. Today there is just one: Homo sapiens. How did our species succeed in the battle for dominance? Explore the cognitive, agricultural, and scientific revolutions.',
    category: 'Science & Technology',
    categorySlug: 'science-technology',
    publisher: 'Harper',
    publicationYear: 2015,
    totalCopies: 9,
    availableCopies: 6,
    rating: 4.96,
    reviewCount: 6800,
    matchPercentage: 99,
    coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600',
    badge: 'GLOBAL BESTSELLER',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    isEditorsPick: true,
    shelfLocation: 'Stack ST-04 / Row 1',
    ebookContent: [
      {
        title: 'Chapter 1: An Animal of No Significance',
        content: `About 13.8 billion years ago, matter, energy, time, and space came into being in the Big Bang. The story of these fundamental features of our universe is called physics. 70,000 years ago, organisms belonging to the species Homo sapiens started to form yet more elaborate structures called cultures. The subsequent development of these human cultures is called history.\n\n### Section 1: The Cognitive Revolution & Fictional Realities\nWhat allowed Homo sapiens to cooperate in groups of hundreds of thousands, whereas chimpanzees can only organize in troops of up to fifty? It was the invention of fictional realities. Sapiens rule the world because we are the only animal that can create and believe in shared mythologies: nations, legal corporations, human rights, and paper currency.`
      }
    ]
  },
  {
    _id: 'book-int-02',
    title: 'Astrophysics for People in a Hurry',
    authors: ['Neil deGrasse Tyson'],
    isbn: '978-0393609394',
    barcode: 'BC-INT-702',
    description: 'What is the nature of space and time? How do we fit within the universe? Explore black holes, quantum mechanics, dark energy, and cosmic expansion in witty, mind-expanding chapters.',
    category: 'Science & Technology',
    categorySlug: 'science-technology',
    publisher: 'W. W. Norton & Company',
    publicationYear: 2017,
    totalCopies: 6,
    availableCopies: 5,
    rating: 4.89,
    reviewCount: 2200,
    matchPercentage: 95,
    coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    badge: 'POPULAR',
    isEbook: true,
    isTrending: true,
    isRecommended: true,
    shelfLocation: 'Stack ST-01 / Row 2',
    ebookContent: [
      {
        title: 'Chapter 1: The Greatest Story Ever Told',
        content: `In the beginning, nearly fourteen billion years ago, all the space, all the matter, and all the energy of the known universe was contained in a volume less than one-trillionth the size of the point of a pin.\n\n### Section 1: The Big Bang & Cosmic Expansion\nConditions were so hot, the basic forces of nature that collectively describe the universe were unified into a single theoretical force. Then cosmic expansion began. In a fraction of a nanosecond, gravity split off, followed by the strong and electroweak forces, freezing quarks and photons into existence.`
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
