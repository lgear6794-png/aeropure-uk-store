// AeroPure UK Product Catalogue — Curated Home, Tech, Kitchen & Garden Essentials
const productsData = [
  {
    id: "storage-bed-160",
    sku: "EK-3002",
    name: "Double Storage Bed 160 x 200 cm with Hydraulic Lift",
    tagline: "Upholstered 160 x 200 cm grey double bed with hydraulic lift-up slatted base and spacious storage.",
    description: "This upholstered bed combines style with practical convenience. Beneath the hydraulic lift-up slatted base, you will find generous storage space for bedding and more.",
    price: 279.99,
    category: "Home & Furniture",
    image: "images/storage-bed-160-1.jpg",
    gallery: [
      "images/storage-bed-160-1.jpg",
      "images/storage-bed-160-2.jpg"
    ],
    badge: "Hydraulic Storage",
    badgeColor: "bg-slate-800 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Grey" },
      { label: "Dimensions", value: "160 x 200 cm" },
      { label: "Storage Space", value: "Yes (under-bed compartment)" },
      { label: "Slatted Base", value: "Included" },
      { label: "Mattress", value: "Not included" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Upholstered 160 x 200 cm double bed frame in grey",
      "Hydraulic lift-up slatted base reveals spacious under-bed storage",
      "Slatted base included (mattress not included)",
      "Ideal for storing bedding and seasonal items neatly out of sight"
    ]
  },
  {
    id: "velvet-corner-sofa",
    sku: "EK-3001",
    name: "3-Seater Velvet Corner Sofa, Beige",
    tagline: "Soft beige velvet 3-seater corner sofa with reversible left or right chaise longue and cushions.",
    description: "A comfortable corner sofa with soft velvet upholstery and a sturdy wooden frame. The chaise longue can be positioned on either the left or right side. Scatter cushions included.",
    price: 469.99,
    category: "Home & Furniture",
    image: "images/velvet-corner-sofa-1.jpg",
    gallery: [
      "images/velvet-corner-sofa-1.jpg",
      "images/velvet-corner-sofa-2.jpg"
    ],
    badge: "Reversible Chaise",
    badgeColor: "bg-amber-700 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Beige" },
      { label: "Dimensions", value: "250 x 160 x 85 cm" },
      { label: "Materials", value: "Velvet, wood" },
      { label: "Seating Capacity", value: "3 seats" },
      { label: "Assembly", value: "Simple" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Soft beige velvet upholstery with a sturdy wooden frame",
      "Reversible chaise longue can be fitted on the left or right",
      "Generous 250 x 160 x 85 cm footprint with 3-seater capacity",
      "Includes matching scatter cushions and simple assembly"
    ]
  },
  {
    id: "anc-wireless-earbuds",
    sku: "EK-1001",
    name: "Wireless Earbuds with Active Noise Cancellation (ANC)",
    tagline: "Bluetooth 5.3 earbuds with Active Noise Cancellation, transparency mode, and 30h USB-C case.",
    description: "Enjoy clear sound without distractions. These wireless earbuds feature Active Noise Cancellation (ANC), a transparency mode, and Bluetooth 5.3 for a stable connection. With the compact charging case you get up to 30 hours of listening time. Splash-resistant (IPX4) with intuitive touch controls.",
    price: 34.99,
    category: "Tech & Gadgets",
    image: "images/anc-wireless-earbuds-1.jpg",
    gallery: [
      "images/anc-wireless-earbuds-1.jpg",
      "images/anc-wireless-earbuds-2.jpg"
    ],
    badge: "30h Playtime • ANC",
    badgeColor: "bg-indigo-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Black" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Playtime", value: "Up to 30 hours (incl. case)" },
      { label: "Water Resistance", value: "IPX4 splash-resistant" },
      { label: "Connection", value: "USB-C" },
      { label: "Weight", value: "45 g" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Active Noise Cancellation (ANC) plus transparency mode",
      "Bluetooth 5.3 wireless connectivity with touch controls",
      "Up to 30 hours total playtime with the compact USB-C charging case",
      "Lightweight 45 g design with IPX4 splash resistance"
    ]
  },
  {
    id: "gps-smartwatch",
    sku: "EK-1002",
    name: "GPS Smartwatch with Heart Rate Monitor",
    tagline: "Lightweight 1.4\" AMOLED smartwatch with GPS, heart rate monitor, 100+ sports modes, and 10-day battery.",
    description: "Track your health and daily activity with this lightweight smartwatch. The bright AMOLED display shows notifications, heart rate, sleep tracking, and over 100 sports modes. Water-resistant to 5 ATM with up to 10 days of battery life.",
    price: 46.99,
    category: "Tech & Gadgets",
    image: "images/gps-smartwatch-1.jpg",
    gallery: [
      "images/gps-smartwatch-1.jpg",
      "images/gps-smartwatch-2.jpg"
    ],
    badge: "1.4\" AMOLED • GPS",
    badgeColor: "bg-sky-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Black" },
      { label: "Display", value: "1.4\" AMOLED" },
      { label: "Battery Life", value: "Up to 10 days" },
      { label: "Water Resistance", value: "5 ATM" },
      { label: "Compatibility", value: "iOS & Android" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Bright 1.4\" AMOLED display for notifications, heart rate, and sleep tracking",
      "Built-in GPS with more than 100 sports modes",
      "Up to 10 days of battery life on a single charge",
      "Water-resistant to 5 ATM and compatible with iOS & Android"
    ]
  },
  {
    id: "powerbank-20000",
    sku: "EK-1004",
    name: "20,000 mAh Power Bank with 22.5W USB-C Fast Charging",
    tagline: "20,000 mAh portable charger with 22.5W USB-C PD fast charging, LED indicator, and 3 outputs.",
    description: "Never run out of battery on the go. This high-capacity 20,000 mAh power bank supports 22.5W fast charging via USB-C PD, complete with an LED charge indicator and three output ports.",
    price: 21.99,
    category: "Tech & Gadgets",
    image: "images/powerbank-20000-1.jpg",
    gallery: [
      "images/powerbank-20000-1.jpg",
      "images/powerbank-20000-2.jpg"
    ],
    badge: "20,000 mAh • 22.5W",
    badgeColor: "bg-cyan-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "White" },
      { label: "Capacity", value: "20,000 mAh" },
      { label: "Outputs", value: "2x USB-A, 1x USB-C" },
      { label: "Max. Output", value: "22.5 W (USB-C PD)" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "High 20,000 mAh capacity for multiple device recharges",
      "Supports up to 22.5W fast charging via USB-C PD",
      "Three output ports (2x USB-A, 1x USB-C) for charging multiple devices",
      "Built-in LED battery level indicator"
    ]
  },
  {
    id: "stand-mixer-1200w",
    sku: "EK-2001",
    name: "1200W Stand Mixer with 5L Stainless Steel Bowl",
    tagline: "1200W planetary stand mixer in mint green with 5L stainless steel bowl, 6 speeds, and 4 accessories.",
    description: "Make home baking effortless with this powerful stand mixer. Its 5-litre stainless steel bowl, 6 speed settings, and planetary mixing action deliver smooth dough, cake batter, and whipped cream.",
    price: 99.99,
    category: "Kitchen & Personal Care",
    image: "images/stand-mixer-1200w-1.jpg",
    gallery: [
      "images/stand-mixer-1200w-1.jpg",
      "images/stand-mixer-1200w-2.jpg"
    ],
    badge: "1200W • 5L Bowl",
    badgeColor: "bg-teal-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Mint green" },
      { label: "Power", value: "1200 W" },
      { label: "Bowl Capacity", value: "5 L stainless steel" },
      { label: "Speeds", value: "6 + pulse" },
      { label: "Accessories", value: "Dough hook, whisk, flat beater, splash guard" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Powerful 1200W motor with planetary mixing action",
      "Generous 5-litre stainless steel mixing bowl",
      "6 speed settings plus pulse control for dough, batter, and cream",
      "Includes dough hook, whisk, flat beater, and splash guard"
    ]
  },
  {
    id: "sonic-toothbrush",
    sku: "EK-7001",
    name: "Sonic Electric Toothbrush with 4 Brush Heads",
    tagline: "USB-rechargeable sonic toothbrush with 5 brushing modes, 2-minute smart timer, and 4 brush heads.",
    description: "Thorough yet gentle cleaning powered by sonic technology. Features 5 brushing modes, a smart 2-minute timer, and a rechargeable battery that lasts up to 30 days.",
    price: 24.99,
    category: "Kitchen & Personal Care",
    image: "images/sonic-toothbrush-1.jpg",
    gallery: [
      "images/sonic-toothbrush-1.jpg",
      "images/sonic-toothbrush-2.jpg"
    ],
    badge: "30-Day Battery • 4 Heads",
    badgeColor: "bg-emerald-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "White" },
      { label: "Brushing Modes", value: "5" },
      { label: "Battery Life", value: "Up to 30 days" },
      { label: "Brush Heads", value: "4 included" },
      { label: "Charging", value: "USB" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Sonic cleaning technology for thorough, gentle daily care",
      "5 brushing modes and a smart 2-minute brushing timer",
      "Up to 30 days of battery life with convenient USB charging",
      "Supplied with 4 replacement brush heads"
    ]
  },
  {
    id: "electric-city-bike",
    sku: "EK-5001",
    name: "28\" Electric City Bike, 7-Speed",
    tagline: "28-inch step-through electric city bike with 7 speeds, removable 36V 13Ah battery, and lights.",
    description: "Comfortable step-through electric city bike featuring a rear hub motor and removable 36V battery offering a range of up to 80 km. Complete with integrated lights, rear luggage rack, and mudguards.",
    price: 849.99,
    category: "Outdoor & Garden",
    image: "images/electric-city-bike-1.jpg",
    gallery: [
      "images/electric-city-bike-1.jpg",
      "images/electric-city-bike-2.jpg"
    ],
    badge: "Up to 80 km Range",
    badgeColor: "bg-emerald-700 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Mint green" },
      { label: "Wheel Size", value: "28 inch" },
      { label: "Range", value: "Up to 80 km" },
      { label: "Gears", value: "7-speed" },
      { label: "Battery", value: "36V 13Ah (removable)" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Low step-through frame with rear hub motor and 7-speed gearing",
      "Removable 36V 13Ah battery providing up to 80 km range",
      "28-inch wheels in a mint green finish",
      "Comes equipped with lights, rear luggage rack, and mudguards"
    ]
  },
  {
    id: "robot-lawn-mower",
    sku: "EK-4002",
    name: "App-Controlled Robot Lawn Mower (up to 600 m²)",
    tagline: "Quiet 58 dB robotic lawn mower for lawns up to 600 m² with Wi-Fi app scheduling and auto-docking.",
    description: "Keep your lawn neatly trimmed without the effort. This robot lawn mower covers areas up to 600 m², returns automatically to its charging station, and can be scheduled via Wi-Fi app.",
    price: 339.99,
    category: "Outdoor & Garden",
    image: "images/robot-lawn-mower-1.jpg",
    gallery: [
      "images/robot-lawn-mower-1.jpg",
      "images/robot-lawn-mower-2.jpg"
    ],
    badge: "Up to 600 m² • Wi-Fi App",
    badgeColor: "bg-green-700 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "White" },
      { label: "Lawn Area", value: "Up to 600 m²" },
      { label: "Cutting Height", value: "20–60 mm" },
      { label: "Noise Level", value: "58 dB" },
      { label: "App Control", value: "Yes (Wi-Fi)" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "Automatically mows lawns up to 600 m² at a quiet 58 dB",
      "Adjustable 20–60 mm cutting height for tailored grass length",
      "Returns to its charging station automatically when done",
      "Wi-Fi app control lets you set mowing schedules from your phone"
    ]
  },
  {
    id: "pressure-washer-150",
    sku: "EK-4001",
    name: "150 Bar Pressure Washer with Patio & Jet Accessories",
    tagline: "2000W 150 bar pressure washer with 8 m hose, patio cleaner, dirt blaster, and detergent tank.",
    description: "Clean patios, cars, and garden furniture with ease. This powerful 2000W pressure washer delivers up to 150 bar and comes complete with a patio cleaner, dirt blaster nozzle, and detergent tank.",
    price: 109.99,
    category: "Outdoor & Garden",
    image: "images/pressure-washer-150-1.jpg",
    gallery: [
      "images/pressure-washer-150-1.jpg",
      "images/pressure-washer-150-2.jpg"
    ],
    badge: "150 Bar • 2000W",
    badgeColor: "bg-amber-600 text-white",
    deliveryDays: "3–4 Working Days",
    specs: [
      { label: "Colour", value: "Yellow" },
      { label: "Pressure", value: "150 bar" },
      { label: "Power", value: "2000 W" },
      { label: "Flow Rate", value: "450 L/h" },
      { label: "Hose Length", value: "8 m" },
      { label: "Condition", value: "New" }
    ],
    features: [
      "High-pressure 150 bar output powered by a 2000W motor",
      "Strong 450 L/h flow rate with an 8-metre reach hose",
      "Includes patio cleaner attachment, dirt blaster nozzle, and detergent tank",
      "Ideal for driveways, patios, vehicles, and outdoor furniture"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = productsData;
}
