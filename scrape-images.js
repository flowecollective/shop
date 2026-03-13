/**
 * R+Co Product Image Scraper
 * 
 * Shopify stores expose a JSON API at /products/[handle].json
 * This script fetches each product page and extracts the real image URL.
 * 
 * Run: node scrape-images.js
 * Output: Updates src/products.js with verified image URLs
 */

const PRODUCTS = [
  // R+Co
  { id: 1, handle: "television-perfect-hair-shampoo", name: "TELEVISION", sub: "Perfect Hair Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 38, badge: "Best Seller", line: "R+Co" },
  { id: 2, handle: "dallas-biotin-thickening-shampoo", name: "DALLAS", sub: "Biotin Thickening Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 38, badge: "Best Seller", line: "R+Co" },
  { id: 3, handle: "atlantis-moisturizing-b5-shampoo", name: "ATLANTIS", sub: "Moisturizing B5 Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 4, handle: "gemstone-color-shampoo", name: "GEMSTONE", sub: "Color Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 5, handle: "bel-air-smoothing-shampoo", name: "BEL AIR", sub: "Smoothing Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 6, handle: "cassette-curl-shampoo", name: "CASSETTE", sub: "Curl Shampoo", cat: "Shampoo", sz: "6 oz", price: 36, badge: "", line: "R+Co" },
  { id: 7, handle: "oblivion-clarifying-shampoo", name: "OBLIVION", sub: "Clarifying Shampoo", cat: "Shampoo", sz: "6 oz", price: 36, badge: "", line: "R+Co" },
  { id: 10, handle: "television-perfect-hair-conditioner", name: "TELEVISION", sub: "Perfect Hair Conditioner", cat: "Conditioner", sz: "8.5 oz", price: 38, badge: "Best Seller", line: "R+Co" },
  { id: 11, handle: "dallas-biotin-thickening-conditioner", name: "DALLAS", sub: "Biotin Thickening Conditioner", cat: "Conditioner", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 12, handle: "atlantis-moisturizing-b5-conditioner", name: "ATLANTIS", sub: "Moisturizing B5 Conditioner", cat: "Conditioner", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 13, handle: "gemstone-color-conditioner", name: "GEMSTONE", sub: "Color Conditioner", cat: "Conditioner", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 14, handle: "bel-air-smoothing-conditioner", name: "BEL AIR", sub: "Smoothing Conditioner", cat: "Conditioner", sz: "8.5 oz", price: 38, badge: "", line: "R+Co" },
  { id: 15, handle: "cassette-curl-conditioner", name: "CASSETTE", sub: "Curl Conditioner", cat: "Conditioner", sz: "6 oz", price: 36, badge: "", line: "R+Co" },
  { id: 20, handle: "dart-pomade-stick", name: "DART", sub: "Pomade Stick", cat: "Styling", sz: "0.5 oz", price: 25, badge: "Best Seller", line: "R+Co" },
  { id: 21, handle: "outer-space-flexible-hairspray", name: "OUTER SPACE", sub: "Flexible Hairspray", cat: "Styling", sz: "9.5 oz", price: 37, badge: "Best Seller", line: "R+Co" },
  { id: 22, handle: "badlands-dry-shampoo-paste", name: "BADLANDS", sub: "Dry Shampoo Paste", cat: "Styling", sz: "2.2 oz", price: 34, badge: "Best Seller", line: "R+Co" },
  { id: 23, handle: "cool-wind-ph-perfect-air-dry-creme", name: "COOL WIND", sub: "pH Perfect Air Dry Crème", cat: "Styling", sz: "5 oz", price: 36, badge: "Best Seller", line: "R+Co" },
  { id: 24, handle: "candy-stripe-detangling-spray", name: "CANDY STRIPE", sub: "Protect + Prep Detangling Spray", cat: "Styling", sz: "8.5 oz", price: 34, badge: "Award Winner", line: "R+Co" },
  { id: 25, handle: "death-valley-dry-shampoo", name: "DEATH VALLEY", sub: "Dry Shampoo", cat: "Styling", sz: "6.3 oz", price: 34, badge: "", line: "R+Co" },
  { id: 26, handle: "on-a-cloud-bond-building-repair-styling-oil", name: "ON A CLOUD", sub: "Bond Building Repair + Styling Oil", cat: "Styling", sz: "2 oz", price: 38, badge: "New", line: "R+Co" },
  { id: 27, handle: "sun-catcher-power-c-nourish-refresh-styling-spray", name: "SUN CATCHER", sub: "Power C Nourish + Refresh Styling Spray", cat: "Styling", sz: "6 oz", price: 36, badge: "New", line: "R+Co" },
  { id: 28, handle: "trophy-shine-texture-spray", name: "TROPHY", sub: "Shine + Texture Spray", cat: "Styling", sz: "6 oz", price: 34, badge: "", line: "R+Co" },
  { id: 29, handle: "rockaway-salt-spray", name: "ROCKAWAY", sub: "Salt Spray", cat: "Styling", sz: "4.2 oz", price: 34, badge: "", line: "R+Co" },
  { id: 30, handle: "mannequin-styling-paste", name: "MANNEQUIN", sub: "Styling Paste", cat: "Styling", sz: "2.5 oz", price: 32, badge: "", line: "R+Co" },
  { id: 31, handle: "high-dive-moisture-shine-creme", name: "HIGH DIVE", sub: "Moisture + Shine Crème", cat: "Styling", sz: "5 oz", price: 36, badge: "", line: "R+Co" },
  { id: 32, handle: "vicious-strong-hold-flexible-hairspray", name: "VICIOUS", sub: "Strong Hold Flexible Hairspray", cat: "Styling", sz: "9.5 oz", price: 37, badge: "", line: "R+Co" },
  { id: 33, handle: "twister-curl-primer", name: "TWISTER", sub: "Curl Primer", cat: "Styling", sz: "5 oz", price: 34, badge: "", line: "R+Co" },
  { id: 34, handle: "park-ave-blow-out-balm", name: "PARK AVE", sub: "Blow Out Balm", cat: "Styling", sz: "5 oz", price: 34, badge: "", line: "R+Co" },
  { id: 35, handle: "foil-frizz-static-control-spray", name: "FOIL", sub: "Frizz + Static Control Spray", cat: "Styling", sz: "5 oz", price: 34, badge: "", line: "R+Co" },
  { id: 36, handle: "dallas-thickening-spray", name: "DALLAS", sub: "Thickening Spray", cat: "Styling", sz: "6.7 oz", price: 32, badge: "", line: "R+Co" },
  { id: 37, handle: "continental-glossing-wax", name: "CONTINENTAL", sub: "Glossing Wax", cat: "Styling", sz: "2.2 oz", price: 32, badge: "", line: "R+Co" },
  { id: 38, handle: "grid-structural-hold-setting-spray", name: "GRID", sub: "Structural Hold Setting Spray", cat: "Styling", sz: "5 oz", price: 34, badge: "", line: "R+Co" },
  { id: 39, handle: "rodeo-star-thickening-foam", name: "RODEO STAR", sub: "Thickening Style Foam", cat: "Styling", sz: "5 oz", price: 34, badge: "", line: "R+Co" },
  { id: 40, handle: "centerpiece-ten-in-one-elixir-spray", name: "CENTERPIECE", sub: "All-In-One Elixir Spray", cat: "Styling", sz: "5.2 oz", price: 36, badge: "", line: "R+Co" },
  { id: 41, handle: "bright-shadows-root-touch-up-spray", name: "BRIGHT SHADOWS", sub: "Root Touch-Up Spray", cat: "Styling", sz: "1.5 oz", price: 28, badge: "", line: "R+Co" },
  { id: 50, handle: "television-perfect-hair-masque", name: "TELEVISION", sub: "Perfect Hair Masque", cat: "Treatment", sz: "5 oz", price: 45, badge: "", line: "R+Co" },
  { id: 51, handle: "crystal-halo-balancing-scalp-scrub-shampoo", name: "CRYSTAL HALO", sub: "Balancing Scalp Scrub + Shampoo", cat: "Treatment", sz: "3 oz", price: 38, badge: "", line: "R+Co" },
  { id: 52, handle: "hydroplane-water-activated-volumizing-compound", name: "HYDROPLANE", sub: "Water-Activated Volumizing Compound", cat: "Treatment", sz: "5 oz", price: 36, badge: "", line: "R+Co" },
  { id: 60, handle: "television-perfect-hair-shampoo-conditioner-set", name: "TELEVISION", sub: "Perfect Hair Shampoo + Conditioner Set", cat: "Set", sz: "8.5 oz ea", price: 76, badge: "", line: "R+Co" },
  { id: 61, handle: "dallas-biotin-thickening-shampoo-conditioner-set", name: "DALLAS", sub: "Biotin Thickening Shampoo + Conditioner Set", cat: "Set", sz: "8.5 oz ea", price: 76, badge: "", line: "R+Co" },
  // R+Co BLEU
  { id: 100, handle: "essential-shampoo", name: "ESSENTIAL", sub: "Essential Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 101, handle: "essential-conditioner", name: "ESSENTIAL", sub: "Essential Conditioner", cat: "Conditioner", sz: "6.8 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 102, handle: "de-luxe-reparative-shampoo", name: "DE LUXE", sub: "Reparative Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 52, badge: "", line: "R+Co BLEU" },
  { id: 103, handle: "de-luxe-reparative-conditioner", name: "DE LUXE", sub: "Reparative Conditioner", cat: "Conditioner", sz: "6.8 oz", price: 52, badge: "", line: "R+Co BLEU" },
  { id: 104, handle: "primary-color-shampoo", name: "PRIMARY COLOR", sub: "Color Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 105, handle: "primary-color-conditioner", name: "PRIMARY COLOR", sub: "Color Conditioner", cat: "Conditioner", sz: "6.8 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 106, handle: "ingenious-thickening-shampoo", name: "INGENIOUS", sub: "Thickening Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 107, handle: "soft-bounce-natural-texture-curl-shampoo", name: "SOFT BOUNCE", sub: "Natural Texture + Curl Shampoo", cat: "Shampoo", sz: "8.5 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 108, handle: "soft-bounce-natural-texture-curl-conditioner", name: "SOFT BOUNCE", sub: "Natural Texture + Curl Conditioner", cat: "Conditioner", sz: "6.8 oz", price: 59, badge: "", line: "R+Co BLEU" },
  { id: 110, handle: "super-style-creme", name: "SUPER STYLE", sub: "Super Style Crème", cat: "Styling", sz: "5 oz", price: 54, badge: "", line: "R+Co BLEU" },
  { id: 111, handle: "lifestyler-volume-texture-spray", name: "LIFESTYLER", sub: "Volume + Texture Spray", cat: "Styling", sz: "8.5 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 112, handle: "optical-illusion-smoothing-oil", name: "OPTICAL ILLUSION", sub: "Smoothing Oil", cat: "Styling", sz: "2 oz", price: 59, badge: "", line: "R+Co BLEU" },
  { id: 113, handle: "ultra-dry-texture-spray", name: "ULTRA DRY", sub: "Texture Spray", cat: "Styling", sz: "8 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 114, handle: "magnifier-thickening-spray", name: "MAGNIFIER", sub: "Thickening Spray", cat: "Styling", sz: "6.5 oz", price: 42, badge: "", line: "R+Co BLEU" },
  { id: 115, handle: "smooth-seal-blow-dry-mist", name: "SMOOTH AND SEAL", sub: "Blow Dry Mist", cat: "Styling", sz: "7 oz", price: 49, badge: "", line: "R+Co BLEU" },
  { id: 116, handle: "rebounce-natural-texture-curl-defining-creme", name: "REBOUNCE", sub: "Curl Defining Crème", cat: "Styling", sz: "5 oz", price: 44, badge: "", line: "R+Co BLEU" },
  { id: 117, handle: "surreal-styling-serum", name: "SURREAL", sub: "Styling Serum", cat: "Styling", sz: "3.4 oz", price: 58, badge: "", line: "R+Co BLEU" },
  { id: 118, handle: "air-dry-blow-dry-creme", name: "AIR DRY BLOW DRY", sub: "Air Dry Blow Dry Crème", cat: "Styling", sz: "5 oz", price: 49, badge: "New", line: "R+Co BLEU" },
  { id: 119, handle: "root-booster-volume-spray", name: "ROOT BOOSTER", sub: "Volume Spray", cat: "Styling", sz: "6.5 oz", price: 45, badge: "", line: "R+Co BLEU" },
  { id: 120, handle: "ingenious-thickening-masque", name: "INGENIOUS", sub: "Thickening Masque", cat: "Treatment", sz: "5.9 oz", price: 62, badge: "", line: "R+Co BLEU" },
  { id: 121, handle: "primary-color-masque", name: "PRIMARY", sub: "Primary Masque", cat: "Treatment", sz: "5 oz", price: 35, badge: "", line: "R+Co BLEU" },
  { id: 122, handle: "f-layer-deep-conditioning-serum", name: "F-LAYER", sub: "Deep Conditioning Serum", cat: "Treatment", sz: "3.4 oz", price: 58, badge: "", line: "R+Co BLEU" },
  { id: 123, handle: "scalp-therapy-pre-shampoo-exfoliating-scrub", name: "SCALP THERAPY", sub: "Pre-Shampoo Exfoliating Scrub", cat: "Treatment", sz: "5 oz", price: 54, badge: "", line: "R+Co BLEU" },
  { id: 124, handle: "scalp-therapy-densifying-rebalancing-leave-in-mist", name: "SCALP THERAPY", sub: "Densifying + Rebalancing Leave-In Mist", cat: "Treatment", sz: "6.5 oz", price: 54, badge: "", line: "R+Co BLEU" },
];

const BASE = "https://www.randco.com/products/";

async function scrapeImage(product) {
  const url = `${BASE}${product.handle}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const img = data.product?.image?.src || data.product?.images?.[0]?.src || "";
    // Get a clean, high-res version
    const cleanImg = img ? img.replace(/\?.*/, '') + "?width=400" : "";
    return { ...product, img: cleanImg };
  } catch (e) {
    console.error(`  ✗ ${product.name} (${product.handle}): ${e.message}`);
    return { ...product, img: "" };
  }
}

async function main() {
  console.log(`Scraping ${PRODUCTS.length} products from randco.com...\n`);
  
  const results = [];
  let success = 0;
  let fail = 0;

  // Process in batches of 5 to avoid rate limiting
  for (let i = 0; i < PRODUCTS.length; i += 5) {
    const batch = PRODUCTS.slice(i, i + 5);
    const batchResults = await Promise.all(batch.map(scrapeImage));
    
    for (const r of batchResults) {
      results.push(r);
      if (r.img) {
        console.log(`  ✓ ${r.name} - ${r.sub}`);
        success++;
      } else {
        fail++;
      }
    }
    
    // Small delay between batches
    if (i + 5 < PRODUCTS.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone: ${success} images found, ${fail} missing\n`);

  // Generate products.js
  const output = `// Auto-generated by scrape-images.js — ${new Date().toISOString()}
// ${success}/${results.length} products have verified image URLs

export const PRODUCTS = ${JSON.stringify(results.map(r => ({
    id: r.id,
    line: r.line,
    name: r.name,
    sub: r.sub,
    cat: r.cat,
    sz: r.sz,
    price: r.price,
    badge: r.badge,
    img: r.img,
  })), null, 2)};

export const CATEGORIES = ["All", "Shampoo", "Conditioner", "Styling", "Treatment", "Set"];
export const LINES = ["All", "R+Co", "R+Co BLEU"];
`;

  const fs = await import('fs');
  fs.writeFileSync('src/products.js', output);
  console.log('Written to src/products.js');
}

main();
