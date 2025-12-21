export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const CATEGORIES = {
  TEXTBOOK: 'textbook',
  NOTES: 'notes',
  CALCULATOR: 'calculator',
  STATIONERY: 'stationery',
  OTHER: 'other'
};

export const CATEGORY_LABELS = {
  [CATEGORIES.TEXTBOOK]: 'Textbooks',
  [CATEGORIES.NOTES]: 'Notes',
  [CATEGORIES.CALCULATOR]: 'Calculators',
  [CATEGORIES.STATIONERY]: 'Stationery',
  [CATEGORIES.OTHER]: 'Other'
};

export const SUBCATEGORIES = {
  [CATEGORIES.TEXTBOOK]: [
    'Mathematics',
    'Science',
    'Engineering',
    'Medical',
    'Business',
    'Arts',
    'Law',
    'Other'
  ],
  [CATEGORIES.NOTES]: [
    'Lecture Notes',
    'Study Guides',
    'Past Papers',
    'Summary Sheets'
  ],
  [CATEGORIES.CALCULATOR]: [
    'Scientific',
    'Graphing',
    'Basic',
    'Financial'
  ],
  [CATEGORIES.STATIONERY]: [
    'Notebooks',
    'Pens',
    'Highlighters',
    'Binders',
    'Other'
  ],
  [CATEGORIES.OTHER]: [
    'Lab Equipment',
    'Study Desk',
    'Chair',
    'Other'
  ]
};

export const CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like-new',
  GOOD: 'good',
  FAIR: 'fair'
};

export const CONDITION_LABELS = {
  [CONDITIONS.NEW]: 'New',
  [CONDITIONS.LIKE_NEW]: 'Like New',
  [CONDITIONS.GOOD]: 'Good',
  [CONDITIONS.FAIR]: 'Fair'
};

export const STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved'
};

export const STATUS_LABELS = {
  [STATUS.AVAILABLE]: 'Available',
  [STATUS.SOLD]: 'Sold',
  [STATUS.RESERVED]: 'Reserved'
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title: A-Z' },
  { value: '-title', label: 'Title: Z-A' }
];

export const UNIVERSITIES = [
  'Harvard University',
  'Stanford University',
  'MIT',
  'UC Berkeley',
  'University of Michigan',
  'University of Texas',
  'NYU',
  'UCLA',
  'Columbia University',
  'University of Illinois',
  'Penn State',
  'Ohio State University',
  'University of Florida',
  'University of Washington',
  'University of Wisconsin',
  'University of Southern California'
];

export const PRICE_RANGES = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $25', min: 10, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: 10000 }
];

export const RATING_OPTIONS = [
  { value: 5, label: '5 stars' },
  { value: 4, label: '4 stars & up' },
  { value: 3, label: '3 stars & up' },
  { value: 2, label: '2 stars & up' },
  { value: 1, label: '1 star & up' }
];

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Browse' },
  { path: '/create-product', label: 'Sell', auth: true },
  { path: '/dashboard', label: 'Dashboard', auth: true },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];

export const FOOTER_LINKS = {
  Marketplace: [
    { label: 'Browse Products', href: '/products' },
    { label: 'Categories', href: '/products?category=textbook' },
    { label: 'Sell Items', href: '/create-product' },
    { label: 'How It Works', href: '/about#how-it-works' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Safety Tips', href: '/safety' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Community Guidelines', href: '/guidelines' },
  ]
};

export const SOCIAL_LINKS = [
  { platform: 'Facebook', icon: 'facebook', href: '#' },
  { platform: 'Twitter', icon: 'twitter', href: '#' },
  { platform: 'Instagram', icon: 'instagram', href: '#' },
  { platform: 'LinkedIn', icon: 'linkedin', href: '#' }
];