// UK Top 5 Premium Air Purifiers Catalog - Unbranded & Generic Lineup
const productsData = [
  {
    id: "apex-air-450",
    name: "ApexAir 450 Smart HEPA Air Purifier",
    tagline: "High-performance H14 HEPA 99.995% filtration with real-time Laser PM2.5 display (up to 85m²)",
    price: 180.20,
    originalPrice: 250.40,
    rating: 4.95,
    reviewCount: 2340,
    badge: "Top Pick for Whole Home",
    badgeColor: "bg-emerald-600 text-white",
    category: "Whole-Home & Living Room",
    image: "images/aurapure-pro.jpg",
    gallery: [
      "images/aurapure-pro.jpg",
      "images/breathemax-tower.jpg",
      "images/aeroshield-compact.jpg"
    ],
    inStock: 11,
    cadRate: "450 m³/h CADR (Cleans 85m² in 18 mins)",
    powerUsage: "38W (Less than 1.2p per hour)",
    deliveryDays: "3-4 Working Days",
    features: [
      "True Medical H14 HEPA: Captures 99.995% of mould spores, viruses, dust & allergens down to 0.1 microns",
      "High-precision laser PM2.5 monitor with 4-colour air quality halo ring & digital readout",
      "Thick granular coconut-shell activated carbon filter neutralises damp smells, smoke & cooking odours",
      "Whisper-quiet Sleep Mode (21dB) with dimmable display for undisturbed nights",
      "Smart WiFi App control with automated scheduling and timer modes"
    ],
    ukSellingPoints: [
      "Critical for UK winter homes with sealed double glazing trapping condensation & mould spores",
      "High-standard H14 filtration recommended for respiratory comfort",
      "High-efficiency motor engineered for continuous low-cost daily operation"
    ],
    merchantInsights: {
      sourcingCost: "£52.00",
      recommendedMSRP: "£180.20",
      grossProfit: "£128.20 (71.1% margin)",
      shippingProfile: "DPD / Royal Mail Tracked 48 (~£5.95 / 5.2kg)",
      targetAudience: "Asthma/allergy sufferers, parents with young children, homeowners in damp UK Victorian houses",
      primaryAdAngle: "'Waking up with a stuffy nose and seeing mould in window corners? This H14 purifier cleans an entire home floor in 20 minutes.'"
    },
    reviews: [
      { author: "Dr. Rachel Thorne", location: "Cheadle, Greater Manchester", rating: 5, date: "3 days ago", comment: "Living in a damp Victorian terrace in Manchester, the laser PM2.5 reader showed our air quality was poor. Within 30 minutes of running the ApexAir, PM2.5 dropped from 68 to 4. Our morning congestion has vanished." },
      { author: "James M.", location: "Richmond, London", rating: 5, date: "1 week ago", comment: "Arrived in 3 days with Royal Mail Tracked. Incredibly quiet on auto mode and the app integration works seamlessly." }
    ]
  },
  {
    id: "thermo-flow-3in1",
    name: "ThermoFlow 3-in-1 HEPA Ceramic Heater, Fan & Air Purifier",
    tagline: "The all-in-one year-round solution: 2000W instant heating, cooling breeze & H13 HEPA",
    price: 220.40,
    originalPrice: 310.30,
    rating: 4.9,
    reviewCount: 1680,
    badge: "3-in-1 Year-Round Climate System",
    badgeColor: "bg-rose-600 text-white",
    category: "Multifunction & Heating",
    image: "images/thermabreathe-3in1.jpg",
    gallery: [
      "images/thermabreathe-3in1.jpg",
      "images/aurapure-pro.jpg",
      "images/purepet-master.jpg"
    ],
    inStock: 7,
    cadRate: "320 m³/h CADR (Covers up to 55m²)",
    powerUsage: "40W (Purifier) / 2000W PTC (Ceramic Heat)",
    deliveryDays: "3-4 Working Days",
    features: [
      "3-in-1 functionality: Medical H13 HEPA purification, fast ceramic winter heating & summer cooling airflow",
      "Rapid 2000W PTC ceramic elements heat rooms in 3 seconds with precision digital thermostat (15°C–35°C)",
      "Continuous air purification running independently or simultaneously with heat/cooling",
      "80° wide-angle oscillation with tip-over safety auto-shutoff and cool-touch exterior (Child & pet safe)",
      "Sleek bladeless tower design with magnetic remote control docking on top"
    ],
    ukSellingPoints: [
      "High performance multi-function tower providing year-round utility",
      "High urgency during cold UK weather: combines heat with clean allergen-free air",
      "No seasonal obsolescence: heats in winter, cools in summer, purifies 365 days a year"
    ],
    merchantInsights: {
      sourcingCost: "£68.00",
      recommendedMSRP: "£220.40",
      grossProfit: "£152.40 (69.1% margin)",
      shippingProfile: "DPD Express Parcel (~£6.50 / 6.1kg)",
      targetAudience: "UK Homeowners looking for space-saving appliances, work-from-home pros, apartment dwellers",
      primaryAdAngle: "'Why buy separate heaters and purifiers? This 3-in-1 HEPA purifier and ceramic tower heater does the whole job.'"
    },
    reviews: [
      { author: "Mark Bellingham", location: "Solihull, West Midlands", rating: 5, date: "Yesterday", comment: "Literally the best appliance I've ever bought. It heated our conservatory in 5 minutes while filtering out our dog's dander. Completely silent and looks stunning." },
      { author: "Fiona G.", location: "Edinburgh, Scotland", rating: 5, date: "4 days ago", comment: "Scottish winters are brutally cold. This keeps our home office toasty warm without running the expensive gas boiler all day." }
    ]
  },
  {
    id: "steril-tower-uvc",
    name: "SterilTower 360 UV-C Sanitising Air Purifier",
    tagline: "Medical H13 HEPA with germicidal UV-C light destroying airborne viruses & bacteria",
    price: 140.30,
    originalPrice: 190.20,
    rating: 4.88,
    reviewCount: 1890,
    badge: "UV-C Sterilisation Chamber",
    badgeColor: "bg-indigo-600 text-white",
    category: "Tower & Sterilisation",
    image: "images/breathemax-tower.jpg",
    gallery: [
      "images/breathemax-tower.jpg",
      "images/aurapure-pro.jpg",
      "images/thermabreathe-3in1.jpg"
    ],
    inStock: 14,
    cadRate: "380 m³/h CADR (Covers up to 65m²)",
    powerUsage: "32W (Under 1p per hour)",
    deliveryDays: "3-4 Working Days",
    features: [
      "Hospital-grade UV-C sanitising chamber destroys DNA of airborne cold/flu viruses, bacteria & mould spores",
      "3-stage cylindrical filter: Pre-filter mesh, Medical H13 HEPA & honeycomb activated carbon",
      "360-degree all-angle air intake draws polluted air from every corner of the room",
      "Auto Smart Sensor adjusts fan speed dynamically based on detected pollution levels",
      "Filter replacement indicator alerts when filter needs refreshing (approx. 8-12 months)"
    ],
    ukSellingPoints: [
      "Top seller during UK winter cold/flu season and school illness spikes",
      "Loved by dental practices, clinics, and families with vulnerable elderly members",
      "High perceived health security value with laboratory-tested 99.9% germ eradication"
    ],
    merchantInsights: {
      sourcingCost: "£41.50",
      recommendedMSRP: "£140.30",
      grossProfit: "£98.80 (70.4% margin)",
      shippingProfile: "Royal Mail Tracked 48 (~£4.85 / 4.1kg)",
      targetAudience: "Health-conscious families, nursery/school parents, elderly, private clinics",
      primaryAdAngle: "'Stop passing winter bugs and flu back and forth around your house. UV-C sterilisation kills 99.9% of airborne germs on contact.'"
    },
    reviews: [
      { author: "Helen Richardson", location: "Harrogate, North Yorkshire", rating: 5, date: "5 days ago", comment: "Both my kids brought home heavy winter coughs. Kept this running in their rooms and the living area — for the first time ever, neither my husband nor I caught it. UV-C feature gives great peace of mind." },
      { author: "Liam B.", location: "Bristol", rating: 5, date: "2 weeks ago", comment: "Tower profile fits neatly beside the TV unit without taking up floor space. Air smells noticeably crisp and clean." }
    ]
  },
  {
    id: "pet-shield-carbon",
    name: "PetShield Dual-Filter Pet & Odour Air Purifier",
    tagline: "Engineered specifically for pet dander, shedding fur, wet dog odours & litter dust",
    price: 120.20,
    originalPrice: 160.40,
    rating: 4.92,
    reviewCount: 2950,
    badge: "Dual Activated Carbon Filter",
    badgeColor: "bg-amber-600 text-white",
    category: "Pet Allergies & Odour",
    image: "images/purepet-master.jpg",
    gallery: [
      "images/purepet-master.jpg",
      "images/aurapure-pro.jpg",
      "images/aeroshield-compact.jpg"
    ],
    inStock: 19,
    cadRate: "350 m³/h CADR (Covers up to 50m²)",
    powerUsage: "28W (Under 0.9p per hour)",
    deliveryDays: "3-4 Working Days",
    features: [
      "Wide-aperture pet hair intake grill prevents clogs from flying dog/cat fur",
      "Extra-thick 450g high-grade activated carbon pellets eliminate wet dog smell, cat litter ammonia & dander",
      "Medical H13 True HEPA traps microscopic pet allergens causing sneezing, watery eyes & itchy skin",
      "Pet-safe Child Lock prevents playful paws or tails from changing settings or turning off",
      "Removable and washable pre-filter mesh extends primary HEPA filter lifespan"
    ],
    ukSellingPoints: [
      "The UK has over 13 million dogs and 12 million cats (60%+ of households own a pet)",
      "High emotional attachment: pet owners eagerly spend to stop family allergy complaints",
      "Exceptional repeat subscription revenue for replacement carbon filter packs"
    ],
    merchantInsights: {
      sourcingCost: "£33.00",
      recommendedMSRP: "£120.20",
      grossProfit: "£87.20 (72.5% margin)",
      shippingProfile: "Royal Mail Tracked 48 (~£4.20 / 3.6kg)",
      targetAudience: "Dog & cat owners, allergic partners living with pets, multi-pet households",
      primaryAdAngle: "'Love your dog but hate the wet winter dog smell and constant fur in the air? This purifier wipes out pet dander and odours in 15 minutes.'"
    },
    reviews: [
      { author: "Gemma Fitzpatrick", location: "Chester, Cheshire", rating: 5, date: "3 days ago", comment: "My partner is allergic to my Golden Retriever. We were at our wits' end until we plugged this in. Within 48 hours, his sneezing stopped and the doggy smell in our lounge completely vanished. Lifesaver!" },
      { author: "Tom W.", location: "Cardiff, Wales", rating: 5, date: "1 week ago", comment: "Takes care of 2 cats and a spaniel with ease. You can see the fur trapped on the outer mesh rather than settling on furniture." }
    ]
  },
  {
    id: "whisper-air-compact",
    name: "WhisperAir Compact Bedside & Desk HEPA Purifier",
    tagline: "Ultra-quiet 20dB bedside purifier with ambient night light & aromatherapy aroma tray",
    price: 60.40,
    originalPrice: 80.30,
    rating: 4.86,
    reviewCount: 3410,
    badge: "Whisper-Quiet 20dB Night Mode",
    badgeColor: "bg-sky-600 text-white",
    category: "Bedroom & Desk",
    image: "images/aeroshield-compact.jpg",
    gallery: [
      "images/aeroshield-compact.jpg",
      "images/purepet-master.jpg",
      "images/breathemax-tower.jpg"
    ],
    inStock: 26,
    cadRate: "180 m³/h CADR (Covers up to 25m²)",
    powerUsage: "12W (Under 0.4p per hour)",
    deliveryDays: "3-4 Working Days",
    features: [
      "Whisper-Quiet Sleep Technology running at just 20dB — quieter than a gentle whisper",
      "3-in-1 cylindrical True H13 HEPA filter capturing 99.97% of fine dust, pollen & night-time allergens",
      "Built-in Essential Oil Sponge Tray: diffuse lavender or eucalyptus for deeper, restorative sleep",
      "Warm ambient night-light with 2 brightness levels and automatic 2/4/8 hour shut-off timer",
      "Compact footprint (only 18cm diameter) ideal for bedside tables, children's nurseries & home office desks"
    ],
    ukSellingPoints: [
      "Perfect introductory impulse item for bedrooms, nurseries, and university halls",
      "High conversion as a second or third unit for multi-room UK households",
      "Extremely low shipping weight and under-£17 sourcing cost"
    ],
    merchantInsights: {
      sourcingCost: "£16.50",
      recommendedMSRP: "£60.40",
      grossProfit: "£43.90 (72.7% margin)",
      shippingProfile: "Royal Mail Tracked 48 (~£2.85 / 1.6kg)",
      targetAudience: "Light sleepers, night-time allergy sufferers, parents, WFH desk workers",
      primaryAdAngle: "'Waking up with dry throat, clogged sinuses, or sneezing in bed? Pop this 20dB silent purifier on your bedside table tonight.'"
    },
    reviews: [
      { author: "Sophie Turner", location: "Bath, Somerset", rating: 5, date: "Yesterday", comment: "I am an exceptionally light sleeper and can't stand noisy fans. This is dead silent on sleep mode. Added lavender oil to the tray and my sleep score on my Apple watch went up 15%." },
      { author: "Danielle K.", location: "Norwich", rating: 5, date: "5 days ago", comment: "Bought for my 6-year-old's bedroom who suffered from night-time pollen coughs. It cleared his breathing up within days." }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = productsData;
}
