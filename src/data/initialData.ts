import { Product, Order, CustomBespokeInquiry, BlogPost } from '../types/bakery';

export const MASEH_ASSETS = {
  logoColor: 'https://i.postimg.cc/QN2hWDTv/maseh-color.png',
  logoWhite: 'https://i.postimg.cc/bY7p2PtW/maseh-white.png',
  favicon: 'https://i.postimg.cc/L4c2ZS17/maseh-fav.png',
  peanutBurger: 'https://i.postimg.cc/ZKsPLfJ2/African-Doughnuts-Peanut-Burger.jpg',
  puffPuff1: 'https://i.postimg.cc/L6QkVymT/African-Doughnuts-Puff-Puff-1.jpg',
  puffPuff2: 'https://i.postimg.cc/3JfjZL3q/African-Doughnuts-Puff-Puff-2.jpg',
  chinChin: 'https://i.postimg.cc/dtNR9WJ6/Chin-Chin.jpg',
  decoratedCake: 'https://i.postimg.cc/xTpGPs9P/Decorated-Fondant-Cake.jpg',
  fishRollPie: 'https://i.postimg.cc/3JfjZL3L/Fish-Roll-Pie.jpg',
  fishRolls: 'https://i.postimg.cc/7Yt1NBqK/Fish-Rolls.jpg',
  fondantCakes: 'https://i.postimg.cc/ZK5Fpkz2/Fondant-Icing-Cakes.jpg',
  scotchEggs: 'https://i.postimg.cc/65bVhHBF/Scotch-Eggs.jpg',
};

export const MASEH_SOCIAL_LINKS = {
  handle: '@masehsdelight',
  phone: '+1 (240) 619-0313',
  whatsappUrl: 'https://wa.me/12406190313',
  tiktok: 'https://www.tiktok.com/@masehsdelight',
  instagram: 'https://www.instagram.com/masehsdelight',
  facebook: 'https://www.facebook.com/masehsdelight',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-puff-puff',
    name: 'African Doughnuts (Puff Puff)',
    category: 'Chewable',
    badge: 'Party Favorite',
    priceRangeText: '$25.00–$115.00',
    minPrice: 25,
    maxPrice: 115,
    imageUrl: MASEH_ASSETS.puffPuff1,
    secondaryImageUrl: MASEH_ASSETS.puffPuff2,
    cardBgColor: '#FCE1D4',
    description: 'Golden-fried pillowy yeast doughnuts scented with ground nutmeg and vanilla. Crispy exterior, airy fluffy center. A staple at every African party and gathering.',
    flavorNotes: ['Nutmeg Scented', 'Airy Yeast Center', 'Crispy Golden Shell'],
    active: true,
    inStock: true,
    imageTheme: 'puffpuff',
    sizes: [
      {
        label: 'Snack Box (25 pcs)',
        price: 25,
        description: 'Warm sealed bakery box with 25 fresh puff puff rounds.',
        piecesCount: '25 pieces'
      },
      {
        label: 'Party Tray (50 pcs)',
        price: 45,
        description: 'Half-pan catering tray, great for family get-togethers and birthdays.',
        piecesCount: '50 pieces'
      },
      {
        label: 'Grand Celebration Platter (100 pcs)',
        price: 80,
        description: 'Full-pan party platter. Our #1 best seller for events and celebrations.',
        piecesCount: '100 pieces'
      },
      {
        label: 'Mega Event Platter (150 pcs)',
        price: 115,
        description: 'Extra large catering platter for weddings, church banquets, and galas.',
        piecesCount: '150 pieces'
      }
    ]
  },
  {
    id: 'prod-chin-chin',
    name: 'West African Chin Chin',
    category: 'Chewable',
    badge: 'Ultra Crunchy',
    priceRangeText: '$16.00–$65.00',
    minPrice: 16,
    maxPrice: 65,
    imageUrl: MASEH_ASSETS.chinChin,
    cardBgColor: '#FDE89C',
    description: 'Traditional crunchy diamond-cut pastry nuggets enriched with creamy sweet butter, fresh nutmeg, and condensed milk. Deep fried to a satisfying snap.',
    flavorNotes: ['Sweet Butter', 'Grated Nutmeg', 'Condensed Milk', 'Crunchy Snap'],
    active: true,
    inStock: true,
    imageTheme: 'chinchin',
    sizes: [
      {
        label: 'Snack Pouch (1 lb)',
        price: 16,
        description: 'Resealable stand-up pouch for personal snacking and on-the-go cravings.',
        piecesCount: '1 lb pouch'
      },
      {
        label: 'Family Tub (2.5 lbs)',
        price: 35,
        description: 'Airtight round clear tub, serves 10-15 snackers.',
        piecesCount: '2.5 lbs tub'
      },
      {
        label: 'Grand Celebration Tub (5 lbs)',
        price: 65,
        description: 'Large catering bucket for holiday parties, weddings, and party favors.',
        piecesCount: '5 lbs bucket'
      }
    ]
  },
  {
    id: 'prod-fish-roll-pie',
    name: 'Fish Roll (Savory Pie)',
    category: 'Chewable',
    badge: 'Savory Best Seller',
    priceRangeText: '$30.00–$100.00',
    minPrice: 30,
    maxPrice: 100,
    imageUrl: MASEH_ASSETS.fishRollPie,
    secondaryImageUrl: MASEH_ASSETS.fishRolls,
    cardBgColor: '#C8EDFA',
    description: 'Buttery, golden shortcrust pastry folded around a seasoned filling of smoked Atlantic mackerel, sweet shallots, thyme, and mild Cameroon pepper.',
    flavorNotes: ['Flaky Shortcrust', 'Seasoned Mackerel', 'Thyme & Herbs', 'Mild Pepper'],
    active: true,
    inStock: true,
    imageTheme: 'fishroll',
    sizes: [
      {
        label: 'Box of 10 Fresh Rolls',
        price: 30,
        description: '10 warm savory rolls ($3.00 each) packed in grease-proof bakery boxes.',
        piecesCount: '10 rolls'
      },
      {
        label: 'Party Box of 20 Rolls',
        price: 55,
        description: '20 savory rolls ($2.75 each), perfect for office lunches and family brunches.',
        piecesCount: '20 rolls'
      },
      {
        label: 'Caterer Platter of 40 Rolls',
        price: 100,
        description: '40 rolls ($2.50 each) on a presentation platter, ready to serve guests.',
        piecesCount: '40 rolls'
      }
    ]
  },
  {
    id: 'prod-fondant-cake',
    name: 'Fondant Celebration Cakes',
    category: 'Fondant Cakes',
    badge: 'Bespoke Art',
    priceRangeText: '$95.00–$385.00',
    minPrice: 95,
    maxPrice: 385,
    imageUrl: MASEH_ASSETS.fondantCakes,
    secondaryImageUrl: MASEH_ASSETS.decoratedCake,
    cardBgColor: '#FCE1D4',
    description: 'Bespoke celebration cakes covered in smooth artisanal marshmallow fondant. Customized with African Ankara-embossed patterns, edible gold leaf, and custom hand-piped inscriptions.',
    flavorNotes: ['Vanilla Bean Sponge', 'Swiss Buttercream', 'Red Velvet Silk', 'Marshmallow Fondant'],
    active: true,
    inStock: true,
    imageTheme: 'fondantcake',
    sizes: [
      {
        label: '6" Petite Cake (Feeds 8-10)',
        price: 95,
        description: 'Single tier 6-inch cake. Great for intimate birthday dinners and smash cakes.',
        piecesCount: '8-10 servings'
      },
      {
        label: '8" Classic Tier (Feeds 18-22)',
        price: 145,
        description: 'Single tier 8-inch cake. Includes custom color palette and cake board ribbon.',
        piecesCount: '18-22 servings'
      },
      {
        label: '2-Tier Celebration (Feeds 30-35)',
        price: 220,
        description: 'Two tiers (8" base + 6" top). Includes internal dowels and floral topper accents.',
        piecesCount: '30-35 servings'
      },
      {
        label: '3-Tier Grand Wedding (Feeds 60-75)',
        price: 385,
        description: 'Three stately tiers (10" + 8" + 6"). Reinforced structural dowels and gold leaf trim.',
        piecesCount: '60-75 servings'
      }
    ]
  },
  {
    id: 'prod-scotch-eggs',
    name: 'African Scotch Eggs',
    category: 'Chewable',
    badge: 'Savory Favorite',
    priceRangeText: '$22.00–$75.00',
    minPrice: 22,
    maxPrice: 75,
    imageUrl: MASEH_ASSETS.scotchEggs,
    cardBgColor: '#E8DFF5',
    description: 'Fresh hard-boiled eggs wrapped in Cameroon-spiced minced beef sausage meat, coated with seasoned golden breadcrumbs, and deep-fried till deeply crisp.',
    flavorNotes: ['Boiled Egg Core', 'Seasoned Beef Sausage', 'Crispy Golden Crumb'],
    active: true,
    inStock: true,
    imageTheme: 'scotchegg',
    sizes: [
      {
        label: 'Half-Dozen Box (6 pcs)',
        price: 22,
        description: '6 golden savory scotch eggs with dipping sauce.',
        piecesCount: '6 pieces'
      },
      {
        label: 'Dozen Platter (12 pcs)',
        price: 40,
        description: '12 scotch eggs halved or whole for brunch and cocktail parties.',
        piecesCount: '12 pieces'
      },
      {
        label: 'Party Platter (24 pcs)',
        price: 75,
        description: '24 savory scotch eggs arranged on a party tray.',
        piecesCount: '24 pieces'
      }
    ]
  },
  {
    id: 'prod-peanut-burger',
    name: 'Peanut Burger Crunch',
    category: 'Chewable',
    badge: 'Nutty Crunch',
    priceRangeText: '$15.00–$58.00',
    minPrice: 15,
    maxPrice: 58,
    imageUrl: MASEH_ASSETS.peanutBurger,
    cardBgColor: '#D1F2DE',
    description: 'Roasted crunchy peanuts coated in a sweetened, vanilla-flavored crispy baked flour shell. The ultimate authentic African movie and cocktail snack.',
    flavorNotes: ['Roasted Peanuts', 'Sweet Vanilla Crust', 'Audible Crunch'],
    active: true,
    inStock: true,
    imageTheme: 'puffpuff',
    sizes: [
      {
        label: '1 lb Snack Jar',
        price: 15,
        description: 'Clear airtight jar of peanut burger crunch.',
        piecesCount: '1 lb jar'
      },
      {
        label: '2.5 lbs Party Tub',
        price: 32,
        description: 'Medium party tub for game nights and gatherings.',
        piecesCount: '2.5 lbs tub'
      },
      {
        label: '5 lbs Event Bucket',
        price: 58,
        description: 'Bulk bucket for wedding favor bags and celebrations.',
        piecesCount: '5 lbs bucket'
      }
    ]
  },
  {
    id: 'prod-heritage-combo',
    name: 'Maseh’s Heritage Party Sampler Box',
    category: 'Chewable',
    badge: 'Ultimate Sampler',
    priceRangeText: '$55.00–$145.00',
    minPrice: 55,
    maxPrice: 145,
    imageUrl: MASEH_ASSETS.puffPuff2,
    secondaryImageUrl: MASEH_ASSETS.fishRollPie,
    cardBgColor: '#FBE48E',
    description: 'The ultimate tasting feast! Freshly packed assortment of warm fluffy Puff Puff, savory flaky Fish Rolls, crunchy Chin Chin, and golden Scotch Eggs. Perfect for parties, meetings, and family feasts.',
    flavorNotes: ['Puff Puff Rounds', 'Savory Fish Rolls', 'Crunchy Chin Chin', 'Scotch Eggs'],
    active: true,
    inStock: true,
    imageTheme: 'puffpuff',
    sizes: [
      {
        label: 'Tasting Box (Feeds 4-6)',
        price: 55,
        description: '20 Puff Puff, 6 Fish Rolls, 1 lb Chin Chin, and 4 Scotch Eggs.',
        piecesCount: 'Tasting Box'
      },
      {
        label: 'Party Platter (Feeds 12-15)',
        price: 95,
        description: '45 Puff Puff, 12 Fish Rolls, 2 lbs Chin Chin, and 8 Scotch Eggs.',
        piecesCount: 'Party Platter'
      },
      {
        label: 'Grand Banquet Spread (Feeds 25-30)',
        price: 145,
        description: '80 Puff Puff, 20 Fish Rolls, 3 lbs Chin Chin, and 16 Scotch Eggs.',
        piecesCount: 'Banquet Spread'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'MD-8492',
    createdAt: '2026-10-27T14:30:00Z',
    customerName: 'Amina Adebayo',
    customerPhone: '+1 (240) 555-8931',
    customerEmail: 'amina.adebayo@example.com',
    orderType: 'Delivery',
    deliveryAddress: '9204 Silver Spring Way, Silver Spring, MD 20910',
    eventDate: '2026-11-02',
    items: [
      {
        id: 'item-1',
        productId: 'prod-puff-puff',
        productName: 'African Doughnuts (Puff Puff)',
        category: 'Chewable',
        imageUrl: MASEH_ASSETS.puffPuff1,
        selectedSize: {
          label: 'Grand Celebration Platter (100 pcs)',
          price: 80,
          description: 'Full-pan party platter.',
          piecesCount: '100 pieces'
        },
        quantity: 1
      },
      {
        id: 'item-2',
        productId: 'prod-fish-roll-pie',
        productName: 'Fish Roll (Savory Pie)',
        category: 'Chewable',
        imageUrl: MASEH_ASSETS.fishRollPie,
        selectedSize: {
          label: 'Party Box of 20 Rolls',
          price: 55,
          description: '20 savory rolls.',
          piecesCount: '20 rolls'
        },
        quantity: 1
      }
    ],
    subtotal: 135,
    deliveryFee: 15,
    total: 150,
    depositAmount: 75,
    balanceDue: 75,
    status: 'Preparing',
    allergies: ['Fish', 'Gluten', 'Eggs'],
    specialInstructions: 'Please fry extra golden-brown and deliver by 1:00 PM for the baby naming ceremony!'
  },
  {
    id: 'MD-8491',
    createdAt: '2026-10-26T10:15:00Z',
    customerName: 'David Kalu',
    customerPhone: '+1 (301) 489-0144',
    customerEmail: 'david.kalu@example.com',
    orderType: 'Pickup',
    eventDate: '2026-10-31',
    items: [
      {
        id: 'item-3',
        productId: 'prod-chin-chin',
        productName: 'West African Chin Chin',
        category: 'Chewable',
        imageUrl: MASEH_ASSETS.chinChin,
        selectedSize: {
          label: 'Grand Celebration Tub (5 lbs)',
          price: 65,
          description: 'Large catering bucket.',
          piecesCount: '5 lbs bucket'
        },
        quantity: 2
      }
    ],
    subtotal: 130,
    deliveryFee: 0,
    total: 130,
    depositAmount: 65,
    balanceDue: 65,
    status: 'Ready',
    allergies: ['Dairy', 'Gluten'],
    specialInstructions: 'Customer requested 5 miniature decorative ribbon bows on each tub.'
  },
  {
    id: 'MD-8490',
    createdAt: '2026-10-25T16:45:00Z',
    customerName: 'Chidinma Okafor',
    customerPhone: '+1 (202) 773-4912',
    customerEmail: 'chidinma.o@example.com',
    orderType: 'Delivery',
    deliveryAddress: '1421 Constitution Ave NW, Washington, DC 20002',
    eventDate: '2026-11-04',
    items: [
      {
        id: 'item-4',
        productId: 'prod-fondant-cake',
        productName: 'Fondant Celebration Cakes',
        category: 'Fondant Cakes',
        imageUrl: MASEH_ASSETS.fondantCakes,
        selectedSize: {
          label: '2-Tier Celebration (Feeds 30-35)',
          price: 220,
          description: 'Two tiers (8" base + 6" top).',
          piecesCount: '30-35 servings'
        },
        quantity: 1
      }
    ],
    subtotal: 220,
    deliveryFee: 15,
    total: 235,
    depositAmount: 117.5,
    balanceDue: 117.5,
    status: 'Awaiting Confirmation',
    allergies: ['Gluten', 'Eggs', 'Dairy'],
    specialInstructions: 'Inscription on cake: Happy 40th Birthday Queen Chidinma! With gold leaf highlights.'
  }
];

export const INITIAL_BESPOKE_INQUIRIES: CustomBespokeInquiry[] = [
  {
    id: 'INQ-501',
    createdAt: '2026-10-27T18:20:00Z',
    customerName: 'Kwame Mensah',
    customerPhone: '+1 (240) 812-9904',
    customerEmail: 'kwame.mensah@example.com',
    requestedDate: '2026-11-07',
    eventType: 'Wedding Reception',
    guestCount: 65,
    cakeTiers: '3-Tier Grand Wedding (10", 8", 6")',
    flavorSelection: 'Red Velvet & Vanilla Bean Sponge with Passionfruit Curd',
    pastryAddons: ['50 pcs Puff-Puff Tray', '20 pcs Savory Fish Rolls'],
    designNotes: 'Cascading ombre blush pink sugar ruffles with 24K edible gold flecks and fresh cherries. Inscription: K & E Forever.',
    estimatedPrice: 485,
    status: 'Pending Review',
    bakerQuotePrice: 485
  },
  {
    id: 'INQ-502',
    createdAt: '2026-10-26T11:00:00Z',
    customerName: 'Fatima Conteh',
    customerPhone: '+1 (301) 994-3210',
    customerEmail: 'fatima.c@example.com',
    requestedDate: '2026-11-12',
    eventType: 'Baby Shower',
    guestCount: 30,
    cakeTiers: '2-Tier Classic Tier (8" + 6")',
    flavorSelection: 'Nutmeg Spice Chiffon with Salted Caramel Buttercream',
    pastryAddons: ['100 pcs Puff-Puff Platter', '5 lbs Tub of Chin-Chin'],
    designNotes: 'Pastel mint and cream fondant with baby booties topper and gold sprinkle details.',
    estimatedPrice: 335,
    status: 'Approved',
    bakerQuotePrice: 335,
    bakerNotes: 'Confirmed baking slot. 50% deposit received via invoice.'
  }
];

export const WEEKLY_SALES_DATA = [
  { day: 'Mon', revenue: 260, orders: 3 },
  { day: 'Tue', revenue: 380, orders: 4 },
  { day: 'Wed', revenue: 540, orders: 6 },
  { day: 'Thu', revenue: 490, orders: 5 },
  { day: 'Fri', revenue: 980, orders: 11 },
  { day: 'Sat', revenue: 1650, orders: 18 },
  { day: 'Sun', revenue: 1220, orders: 14 }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of Cloud-Soft Puff Puff: Proofing Secrets & The Nutmeg Ratio',
    slug: 'art-of-cloud-soft-puff-puff',
    excerpt: 'Why patience in yeast blooming, whole-grated nutmeg, and precise 365°F frying create the pillowy golden texture that defines authentic West African celebrations.',
    content: [
      'If you grew up with West African parties, you know the sound before you even smell it: the gentle bubbling sizzle of golden dough dropping into hot vegetable oil, followed by the intoxicating aroma of fried yeast and sweet nutmeg wafting through the house.',
      'At Maseh’s Delight, our Puff Puff recipe is rooted in decades of family tradition, but elevated by precise pastry craftsmanship. The most common mistake people make at home is rushing the yeast bloom. We allow our enriched dough to slow-proof for a minimum of 2.5 hours in temperature-controlled proofing boxes.',
      'This slow proofing develops complex fermented aromatics while trapping millions of micro air bubbles. When the batter is hand-dropped into pure oil at exactly 365°F (185°C), the exterior instantly seals into a delicate crispy caramel skin, while the interior steams into an airy, cloud-soft sponge.',
      'Our secret? Freshly grated whole Indonesian nutmeg, a splash of real vanilla bean extract, and just enough sugar to caramelize the shell without leaving an oily aftertaste. Try pairing a warm batch with a cold glass of hibiscus zobo or ginger lemonade!'
    ],
    category: 'Kitchen Secrets',
    readTime: '4 min read',
    publishedDate: 'October 24, 2026',
    author: {
      name: 'Chef Maseh',
      role: 'Founder & Head Pastry Chef'
    },
    featuredImage: MASEH_ASSETS.puffPuff1,
    tags: ['Puff Puff', 'Baking Secrets', 'Tradition', 'Street Food'],
    relatedProductId: 'prod-puff-puff'
  },
  {
    id: 'post-2',
    title: 'Why Real European Butter & Condensed Milk Define Legendary Chin Chin',
    slug: 'secrets-to-legendary-chin-chin',
    excerpt: 'Not all Chin Chin is created equal. Learn why we skip vegetable shortening in favor of high-butterfat European butter and whole milk.',
    content: [
      'Chin Chin is perhaps the most beloved, addictive snack across Nigeria, Cameroon, and Ghana. Everyone remembers opening festive tins during Christmas, weddings, and naming ceremonies.',
      'Yet so many commercial versions sold in supermarkets today taste dry, chalky, or unpleasantly hard. Why? Because industrial bakeries replace butter with cheap shortening and use artificial vanilla powders.',
      'In our Silver Spring studio, we craft Chin Chin with 82% European-style sweet butter, whole evaporated milk, and freshly ground whole spices. The high butterfat content creates micro-layers in the dough that yield a crisp, delicate snap rather than a rock-hard crunch.',
      'Each batch is hand-rolled, diamond-cut with fluted pastry wheels, and gently fried in small 5-pound batches until uniformly amber. The result? A buttery, fragrant snack that literally melts on your tongue. We seal every tub with airtight foil liners so they stay ultra-fresh for over 60 days!'
    ],
    category: 'Heritage Baking',
    readTime: '3 min read',
    publishedDate: 'October 18, 2026',
    author: {
      name: 'Amina N.',
      role: 'Master Baker'
    },
    featuredImage: MASEH_ASSETS.chinChin,
    tags: ['Chin Chin', 'Ingredients', 'Butter Pastry', 'Snacks'],
    relatedProductId: 'prod-chin-chin'
  },
  {
    id: 'post-3',
    title: 'Designing African Wedding Cakes in the USA: Fondant, Ankara & Structural Pride',
    slug: 'designing-african-wedding-cakes-usa',
    excerpt: 'How modern African couples in the diaspora are blending contemporary tier elegance with rich cultural prints, gold foil, and tropical sponge flavors.',
    content: [
      'Planning an African wedding in Washington DC, Maryland, or Virginia is a grand affair: traditional engagement ceremonies with vibrant George and Kente fabrics, followed by a majestic white wedding reception for 200+ joyful guests.',
      'The wedding cake must honor both realms. It needs the pristine structural balance of a modern architectural centerpiece, but with the warm soul, flavors, and regal aesthetics of the motherland.',
      'Our bespoke wedding cakes feature custom fondant work textured with edible Ankara lace patterns, 24-karat gold leaf gilding, and cascading handcrafted sugar hibiscus and gardenias.',
      'Inside, we move beyond generic white sponge. Couples love our signature moist Red Velvet paired with passionfruit curd, Madagascar vanilla chiffon infused with fresh lime zest, and spiced Cameroon honey cake. Because our cakes are structurally pinned with internal food-grade acrylic dowels, they stand tall and flawless throughout hours of lively afrobeats dancing!'
    ],
    category: 'Cake Studio',
    readTime: '5 min read',
    publishedDate: 'October 12, 2026',
    author: {
      name: 'Chef Maseh',
      role: 'Founder & Head Pastry Chef'
    },
    featuredImage: MASEH_ASSETS.fondantCakes,
    tags: ['Wedding Cakes', 'Fondant', 'Ankara Design', 'Celebrations'],
    relatedProductId: 'prod-fondant-cake'
  },
  {
    id: 'post-4',
    title: 'The Party Host Guide: How to Calculate Pastry Quantities for 50 to 300 Guests',
    slug: 'party-host-pastry-calculation-guide',
    excerpt: 'Never run out of Puff Puff or Fish Rolls again. Here is our official catering matrix for birthdays, church celebrations, and wedding cocktail hours.',
    content: [
      'One of the most frequent questions we receive on WhatsApp is: "Maseh, I have 120 guests coming this Saturday—how many Puff Puff and Fish Rolls do I need?"',
      'African gatherings are famous for generosity. Running out of small chops before the main jollof rice is served is every host’s nightmare! Here is our tested formula based on hundreds of catering events across the DMV:',
      '1. Cocktail Hour Only: Plan for 3 to 4 Puff Puff rounds, 1 Fish Roll, and a half cup of Chin Chin per adult guest.',
      '2. Full Party Grazing Table: Plan for 5 to 6 Puff Puff rounds, 1.5 Fish Rolls, 1 Scotch Egg, and individual Chin Chin snack cones.',
      '3. Wedding Dessert Bar: For 150 guests, we recommend 1 Grand Celebration Platter (100 pcs Puff Puff), 2 Party Trays of Fish Rolls (40 pcs), 2 Party Platters of Scotch Eggs (48 pcs), and two 5-lb Tubs of Chin Chin for grazing.',
      'Remember our strict 3-day lead time rule: large party orders must be confirmed at least 72 hours in advance so our kitchen can schedule the dough proofing and overnight marination of our Atlantic mackerel fillings!'
    ],
    category: 'Party Planning',
    readTime: '4 min read',
    publishedDate: 'October 05, 2026',
    author: {
      name: 'David O.',
      role: 'Catering Director'
    },
    featuredImage: MASEH_ASSETS.fishRollPie,
    tags: ['Catering', 'Party Planning', 'Small Chops', 'Hosting'],
    relatedProductId: 'prod-heritage-combo'
  }
];

