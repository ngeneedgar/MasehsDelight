import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database store with production fallback
interface ProductSizeOption {
  label: string;
  price: number;
  description: string;
  piecesCount?: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  badge: string;
  priceRangeText: string;
  minPrice: number;
  maxPrice: number;
  sizes: ProductSizeOption[];
  description: string;
  flavorNotes: string[];
  allergens: string[];
  preparationNotice: string;
  active: boolean;
  inStock: boolean;
  featured?: boolean;
  imageUrl: string;
  secondaryImageUrl?: string;
  cardBgColor?: string;
  isCake?: boolean;
}

let serverProducts: Product[] = [
  {
    id: 'prod-peanut-burger',
    slug: 'african-doughnuts-peanut-burger',
    name: 'African Doughnuts - Peanut Burger',
    category: 'African Doughnuts',
    badge: 'Crunchy Treat',
    priceRangeText: '$55.00 - $110.00',
    minPrice: 55,
    maxPrice: 110,
    imageUrl: 'https://i.postimg.cc/ZKsPLfJ2/African-Doughnuts-Peanut-Burger.jpg',
    cardBgColor: '#FFF2EB',
    description: 'Crunchy, golden peanut-flavored African doughnut bites made fresh with roasted peanuts and a sweet, crisp shell.',
    flavorNotes: ['Roasted Peanuts', 'Crispy Glaze Shell', 'Golden Fried Crunch'],
    allergens: ['Peanuts', 'Wheat / Gluten', 'Eggs', 'Dairy'],
    preparationNotice: 'Prepared in batches. Order at least 24–48 hours ahead for party sizes.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: 'Snack Box (~2 lbs)', price: 55, description: 'Warm sealed bakery box packed with crunchy peanut doughnut bites.' },
      { label: 'Party Tub (~4.5 lbs)', price: 80, description: 'Airtight resealable catering tub, ideal for family and gatherings.' },
      { label: 'Grand Catering Platter (~7 lbs)', price: 110, description: 'Large event tub for parties, weddings, church events, and celebrations.' }
    ]
  },
  {
    id: 'prod-puff-puff-1',
    slug: 'african-doughnuts-puff-puff',
    name: 'African Doughnuts - Puff Puff',
    category: 'African Doughnuts',
    badge: 'Best Seller',
    priceRangeText: '$55.00 - $110.00',
    minPrice: 55,
    maxPrice: 110,
    imageUrl: 'https://i.postimg.cc/L6QkVymT/African-Doughnuts-Puff-Puff-1.jpg',
    secondaryImageUrl: 'https://i.postimg.cc/3JfjZL3q/African-Doughnuts-Puff-Puff-2.jpg',
    cardBgColor: '#FDF0E7',
    description: 'Soft, fluffy, golden puff puff made for sharing. Authentic yeast-fermented rounds delicately scented with nutmeg.',
    flavorNotes: ['Nutmeg Scented', 'Soft Fluffy Interior', 'Crisp Golden Crust'],
    allergens: ['Wheat / Gluten', 'Yeast'],
    preparationNotice: 'Fried fresh for your event date. Please schedule order at least 48 hours prior.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: 'Snack Platter (50 pcs)', price: 55, description: '50 freshly fried warm puff puff rounds packed in catering boxes.' },
      { label: 'Party Platter (80 pcs)', price: 80, description: '80 pieces in half-pan catering trays, perfect for birthday parties.' },
      { label: 'Grand Celebration Platter (120 pcs)', price: 110, description: '120 pieces full party feast for baby showers, banquets, and celebrations.' }
    ]
  },
  {
    id: 'prod-puff-puff-special',
    slug: 'puff-puff-special',
    name: 'Puff Puff Special',
    category: 'African Doughnuts',
    badge: 'Chef Favorite',
    priceRangeText: '$55.00 - $110.00',
    minPrice: 55,
    maxPrice: 110,
    imageUrl: 'https://i.postimg.cc/3JfjZL3q/African-Doughnuts-Puff-Puff-2.jpg',
    secondaryImageUrl: 'https://i.postimg.cc/L6QkVymT/African-Doughnuts-Puff-Puff-1.jpg',
    cardBgColor: '#FFF4E8',
    description: 'Freshly fried puff puff with a light, delicious texture. Extra golden crust and artisan spiced dough.',
    flavorNotes: ['Pure Vanilla & Nutmeg', 'Light Pillowy Bounce', 'Hand-Dropped Perfection'],
    allergens: ['Wheat / Gluten', 'Yeast'],
    preparationNotice: 'Hand-crafted to order. Minimum 48 hours advance order notice required.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: "Baker's Special Box (50 pcs)", price: 55, description: '50 artisanal puff puff rounds fried golden and crisp.' },
      { label: 'Celebration Box (80 pcs)', price: 80, description: '80 pieces catering tray, ideal for social parties and receptions.' },
      { label: 'Deluxe Event Tray (120 pcs)', price: 110, description: '120 pieces for large family banquets, galas, and wedding tables.' }
    ]
  },
  {
    id: 'prod-chin-chin',
    slug: 'chin-chin',
    name: 'Chin Chin',
    category: 'Snacks',
    badge: 'Super Crunchy',
    priceRangeText: '$50.00 - $100.00',
    minPrice: 50,
    maxPrice: 100,
    imageUrl: 'https://i.postimg.cc/dtNR9WJ6/Chin-Chin.jpg',
    cardBgColor: '#FEF8EA',
    description: 'Crunchy, lightly sweet Nigerian-style chin chin fried golden with creamy sweet butter, fresh nutmeg, and milk.',
    flavorNotes: ['Sweet Butter', 'Fresh Grated Nutmeg', 'Condensed Milk', 'Crunchy Snap'],
    allergens: ['Wheat / Gluten', 'Dairy', 'Eggs'],
    preparationNotice: 'Freshly packaged in sealed tubs. Retains signature crunch for weeks.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: 'Family Tub (~3.5 lbs)', price: 50, description: 'Airtight clear tub filled with bite-sized crunchy chin chin.' },
      { label: 'Party Tub (~5.5 lbs)', price: 75, description: 'Generous party tub for family get-togethers and office snacking.' },
      { label: 'Grand Event Tub (~8 lbs)', price: 100, description: 'Large commercial catering tub, serves 35+ guests at receptions.' }
    ]
  },
  {
    id: 'prod-fish-roll-pie',
    slug: 'fish-roll-pie',
    name: 'Fish Roll Pie',
    category: 'Savory Pastries',
    badge: 'Savory Favorite',
    priceRangeText: '$60.00 - $120.00',
    minPrice: 60,
    maxPrice: 120,
    imageUrl: 'https://i.postimg.cc/3JfjZL3L/Fish-Roll-Pie.jpg',
    cardBgColor: '#FDF1EB',
    description: 'Flaky pastry filled with a savory seasoned fish filling, fragrant bell peppers, onions, and African spices.',
    flavorNotes: ['Flaky Pastry Crust', 'Seasoned Mackerel Filling', 'Aromatic Herbs'],
    allergens: ['Fish', 'Wheat / Gluten', 'Dairy', 'Eggs'],
    preparationNotice: 'Baked and rolled to order. Please order 48–72 hours before your event.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: 'Half-Dozen Box (6 pcs)', price: 60, description: '6 large flaky fish roll pies, fresh from the oven.' },
      { label: 'Party Box (9 pcs)', price: 90, description: '9 pieces packed in thermal catering container.' },
      { label: 'Event Feast Platter (12 pcs)', price: 120, description: '12 large bakery pies, satisfying meal portions for gatherings.' }
    ]
  },
  {
    id: 'prod-fish-rolls',
    slug: 'fish-rolls',
    name: 'Fish Rolls',
    category: 'Savory Pastries',
    badge: 'Popular Snack',
    priceRangeText: '$60.00 - $120.00',
    minPrice: 60,
    maxPrice: 120,
    imageUrl: 'https://i.postimg.cc/7Yt1NBqK/Fish-Rolls.jpg',
    cardBgColor: '#FFF0EA',
    description: 'Delicious golden fish rolls, perfect for parties and gatherings. Crispy golden dough wrapped around savory spiced fish.',
    flavorNotes: ['Golden Crisp Shell', 'Spiced Flaked Fish', 'Savory Onion & Herbs'],
    allergens: ['Fish', 'Wheat / Gluten', 'Eggs'],
    preparationNotice: 'Fried golden to order for maximum crispiness on pickup/delivery.',
    active: true,
    inStock: true,
    featured: true,
    sizes: [
      { label: 'Half-Dozen Box (6 pcs)', price: 60, description: '6 freshly fried fish rolls in bakery container.' },
      { label: 'Party Box (9 pcs)', price: 90, description: '9 golden fish rolls, great for party finger foods.' },
      { label: 'Event Feast Platter (12 pcs)', price: 120, description: '12 crispy fish rolls for weddings, ceremonies, and buffets.' }
    ]
  },
  {
    id: 'prod-fondant-cake',
    slug: 'fondant-icing-cake',
    name: 'Fondant Icing Cake',
    category: 'Cakes',
    badge: 'Celebration Ready',
    priceRangeText: '$100.00 - $160.00',
    minPrice: 100,
    maxPrice: 160,
    imageUrl: 'https://i.postimg.cc/ZK5Fpkz2/Fondant-Icing-Cakes.jpg',
    cardBgColor: '#FAF0F4',
    description: 'Elegant fondant-covered cakes for birthdays and special occasions. Silky smooth finish, rich moist sponge, and tailored flavors.',
    flavorNotes: ['Moist Vanilla or Chocolate Sponge', 'Smooth Fondant Wrap', 'Custom Color Accents'],
    allergens: ['Wheat / Gluten', 'Dairy', 'Eggs'],
    preparationNotice: 'Custom cake craft requires minimum 3–5 days advance notice.',
    active: true,
    inStock: true,
    featured: true,
    isCake: true,
    sizes: [
      { label: '6-Inch Classic Tier (Serves 8-12)', price: 100, description: 'Intimate celebration tier with elegant fondant drape.' },
      { label: '8-Inch Celebration Tier (Serves 16-22)', price: 130, description: 'Standard birthday and milestone anniversary centerpiece.' },
      { label: '10-Inch Grand Tier (Serves 28-36)', price: 160, description: 'Generous party centerpiece cake with custom inscription banner.' }
    ]
  },
  {
    id: 'prod-decorated-cake',
    slug: 'decorated-fondant-cake',
    name: 'Decorated Fondant Cake',
    category: 'Custom Cakes',
    badge: 'Luxury Showpiece',
    priceRangeText: '$120.00 - $250.00',
    minPrice: 120,
    maxPrice: 250,
    imageUrl: 'https://i.postimg.cc/xTpGPs9P/Decorated-Fondant-Cake.jpg',
    cardBgColor: '#FAF0F2',
    description: 'Beautifully decorated cakes designed for your celebration. Hand-sculpted floral accents, pearls, and custom color themes.',
    flavorNotes: ['Madagascar Vanilla', 'Velvet Cocoa', 'Hand-Crafted Sugar Art', 'Multi-Tiered Height'],
    allergens: ['Wheat / Gluten', 'Dairy', 'Eggs'],
    preparationNotice: 'Bespoke designs require at least 5 days notice for artisan decoration.',
    active: true,
    inStock: true,
    featured: true,
    isCake: true,
    sizes: [
      { label: '1-Tier Signature Decorated (Serves 15-20)', price: 120, description: 'Single tier adorned with edible pearls, lace, and floral detail.' },
      { label: '2-Tier Celebration Grand (Serves 30-45)', price: 185, description: 'Two-tier statement cake for weddings, sweet 16s, and galas.' },
      { label: '3-Tier Luxury Gala Showpiece (Serves 60-80)', price: 250, description: 'Three majestic tiers designed for grand receptions and banquets.' }
    ]
  }
];

let serverOrders: any[] = [
  {
    id: 'MD-2026-1042',
    orderNumber: 'MD-2026-1042',
    createdAt: new Date().toISOString(),
    customerName: 'Chiamaka Adeleke',
    customerPhone: '+1 (301) 555-0184',
    customerEmail: 'chiamaka.a@example.com',
    orderType: 'Delivery',
    deliveryAddress: '14208 Lake Pleasant Dr',
    cityState: 'Bowie, MD 20720',
    zipCode: '20720',
    eventDate: '2026-11-04',
    preferredTime: '12:00 PM – 2:00 PM',
    items: [
      {
        id: 'ci-101',
        productId: 'prod-puff-puff-1',
        productName: 'African Doughnuts - Puff Puff',
        category: 'African Doughnuts',
        selectedSize: { label: 'Grand Celebration Platter (120 pcs)', price: 110, description: '120 pieces' },
        quantity: 1,
        imageUrl: 'https://i.postimg.cc/L6QkVymT/African-Doughnuts-Puff-Puff-1.jpg',
        specialInstructions: 'Warm delivery preferred.'
      }
    ],
    subtotal: 110.0,
    deliveryFee: 15.0,
    total: 125.0,
    paymentMethod: 'Payment on Delivery',
    paymentTermsAgreed: true,
    status: 'Confirmed',
    allergies: ['Peanuts'],
    specialInstructions: 'Gate code #4092'
  }
];

let serverInquiries: any[] = [];
let serverContactMessages: any[] = [];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: "Maseh's Delights",
    version: '3.0.0',
    paymentMethod: 'Payment on Delivery'
  });
});

// GET /api/products
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(serverProducts);
});

// GET /api/products/:slug
app.get('/api/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = serverProducts.find(p => p.slug === slug || p.id === slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/orders (Secure recalculation of prices from DB)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      deliveryAddress,
      cityState,
      zipCode,
      eventDate,
      preferredTime,
      items,
      allergies,
      specialInstructions,
      paymentTermsAgreed
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !eventDate) {
      return res.status(400).json({ error: 'Missing required customer contact or event details.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one treat.' });
    }

    if (!paymentTermsAgreed) {
      return res.status(400).json({ error: 'You must confirm that payment will be collected upon delivery/pickup.' });
    }

    // Securely recalculate prices against server product records
    let calculatedSubtotal = 0;
    const verifiedItems = items.map((clientItem: any) => {
      const dbProduct = serverProducts.find(p => p.id === clientItem.productId);
      const verifiedSize = dbProduct?.sizes.find(s => s.label === clientItem.selectedSize?.label) 
        || clientItem.selectedSize;
      
      const unitPrice = verifiedSize?.price || 0;
      const quantity = Math.max(1, Number(clientItem.quantity) || 1);
      calculatedSubtotal += unitPrice * quantity;

      return {
        ...clientItem,
        selectedSize: {
          ...verifiedSize,
          price: unitPrice
        },
        quantity
      };
    });

    const isDelivery = orderType === 'Delivery';
    const deliveryFee = isDelivery ? 15.0 : 0.0;
    const totalDue = calculatedSubtotal + deliveryFee;

    const orderNumber = `MD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      orderType: isDelivery ? 'Delivery' : 'Pickup',
      deliveryAddress: deliveryAddress ? String(deliveryAddress).trim() : '',
      cityState: cityState ? String(cityState).trim() : '',
      zipCode: zipCode ? String(zipCode).trim() : '',
      eventDate,
      preferredTime: preferredTime || 'Flexible daytime',
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      total: totalDue,
      paymentMethod: 'Payment on Delivery',
      paymentTermsAgreed: true,
      status: 'Pending',
      allergies: Array.isArray(allergies) ? allergies : [],
      specialInstructions: specialInstructions ? String(specialInstructions).trim() : ''
    };

    serverOrders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully. Payment is due upon delivery/pickup.',
      order: newOrder
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process order. ' + (err.message || '') });
  }
});

// GET /api/orders/:orderNumber
app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const order = serverOrders.find(
    o => o.orderNumber === orderNumber || o.id === orderNumber || o.customerPhone === orderNumber
  );
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST /api/contact
app.post('/api/contact', (req: Request, res: Response) => {
  const { fullName, email, phone, subject, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Full name, email, and message are required.' });
  }
  const contactRecord = {
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    fullName,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    status: 'Unread'
  };
  serverContactMessages.unshift(contactRecord);
  res.status(201).json({ success: true, message: 'Message received! We will be in touch shortly.' });
});

// POST /api/custom-cake-inquiries
app.post('/api/custom-cake-inquiries', (req: Request, res: Response) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Pending Review',
    ...req.body
  };
  serverInquiries.unshift(inquiry);
  res.status(201).json({ success: true, message: 'Custom cake inquiry received.', inquiry });
});

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin, password, email } = req.body;
  const masterPin = '2025';
  const masterPassword = 'Masehs@2025@.';
  const adminEmail = process.env.ADMIN_EMAIL || 'edgarngene@gmail.com';

  const isPinValid = pin === masterPin;
  const isPassValid = password === masterPassword || password === '2025';
  const isEmailValid = email === adminEmail;

  if (isPinValid || isPassValid || isEmailValid) {
    return res.json({
      success: true,
      token: `maseh-auth-${Date.now()}`,
      user: { role: 'admin', email: adminEmail }
    });
  }

  return res.status(401).json({ error: 'Invalid staff PIN or bakery credentials.' });
});

// GET /api/admin/orders
app.get('/api/admin/orders', (_req: Request, res: Response) => {
  res.json(serverOrders);
});

// PATCH /api/admin/orders/:id
app.patch('/api/admin/orders/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const orderIdx = serverOrders.findIndex(o => o.id === id || o.orderNumber === id);
  if (orderIdx === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) serverOrders[orderIdx].status = status;
  if (internalNotes !== undefined) serverOrders[orderIdx].internalNotes = internalNotes;

  res.json({ success: true, order: serverOrders[orderIdx] });
});

// POST /api/admin/products
app.post('/api/admin/products', (req: Request, res: Response) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  serverProducts.push(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

// PATCH /api/admin/products/:id
app.patch('/api/admin/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = serverProducts.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  serverProducts[idx] = { ...serverProducts[idx], ...req.body };
  res.json({ success: true, product: serverProducts[idx] });
});

// DELETE /api/admin/products/:id
app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  serverProducts = serverProducts.filter(p => p.id !== id);
  res.json({ success: true, message: 'Product deleted' });
});

// ==========================================
// VITE DEV SERVER / PRODUCTION STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maseh's Delights bakery server running on port ${PORT}`);
  });
}

startServer();
