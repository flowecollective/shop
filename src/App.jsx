import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, LINES } from './products';

/* ── Design tokens ── */
const C = {
  gold: "#C9A96E", goldDk: "#A8884D", cream: "#FAF6F0", char: "#1A1A1A",
  mut: "#6B6460", ln: "#E0DAD0", wh: "#FFFFFF", warm: "#F5F0EA", bleu: "#4A3580",
};

/* ── Components ── */

function Badge({ text }) {
  return (
    <span style={{
      position: "absolute", top: 10, left: 10, zIndex: 2, padding: "4px 10px",
      background: text === "New" ? C.char : text === "Award Winner" ? C.bleu : C.char,
      color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 9,
      letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 500,
    }}>{text}</span>
  );
}

function ProductCard({ product, onAdd, onClick, index }) {
  const [hover, setHover] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onClick(product)}
      style={{
        cursor: "pointer", position: "relative",
        opacity: 0, animation: `fadeUp .45s ease forwards`, animationDelay: `${index * 0.05}s`,
      }}
    >
      {product.badge && <Badge text={product.badge} />}
      <div style={{
        position: "relative", overflow: "hidden", background: C.warm,
        aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!imgErr ? (
          <img
            src={product.img} alt={product.name}
            onError={() => setImgErr(true)}
            style={{
              width: "75%", height: "75%", objectFit: "contain",
              transition: "transform .4s ease", transform: hover ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.15 }}>⬡</div>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, color: C.ln, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {product.name}
            </span>
          </div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, padding: 14,
          background: "linear-gradient(transparent, rgba(26,26,26,.85))",
          transform: hover ? "translateY(0)" : "translateY(100%)", transition: "transform .3s ease",
        }}>
          <button
            onClick={e => { e.stopPropagation(); onAdd(product); }}
            style={{
              width: "100%", padding: 10, background: C.gold, color: C.char, border: "none",
              fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "1.5px",
              textTransform: "uppercase", cursor: "pointer", fontWeight: 500,
            }}
          >Add to Cart</button>
        </div>
      </div>
      <div style={{ padding: "12px 0" }}>
        {product.line === "R+Co BLEU" && (
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.bleu, margin: "0 0 3px", fontWeight: 600 }}>BLEU</p>
        )}
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: C.char, margin: "0 0 2px", lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.mut, margin: "0 0 5px", lineHeight: 1.4 }}>{product.sub}</p>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.char, margin: 0 }}>${product.price}</p>
      </div>
    </div>
  );
}

function CartSlide({ cart, open, onClose, onQty, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [fulfillment, setFulfillment] = useState('shipping');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, fulfillment }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout error. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      alert('Unable to connect to checkout. Please try again.');
      setLoading(false);
    }
  };

  return (<>
    {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,.3)", zIndex: 998 }} />}
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,90vw)", background: C.cream,
      zIndex: 999, transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform .35s cubic-bezier(.16,1,.3,1)", display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "24px 24px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.ln}` }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: C.char, margin: 0 }}>Your Cart</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.mut, fontSize: 18 }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {cart.length === 0 ? (
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.mut, textAlign: "center", marginTop: 50 }}>Your cart is empty</p>
        ) : cart.map(item => (
          <div key={item.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.ln}` }}>
            <img src={item.img} alt={item.name}
              style={{ width: 56, height: 56, objectFit: "contain", background: C.warm, borderRadius: 2, flexShrink: 0 }}
              onError={e => e.target.style.display = "none"} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 500, margin: "0 0 2px", color: C.char }}>{item.name}</h4>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.mut, margin: "0 0 8px" }}>{item.sub} · ${item.price}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", border: `1px solid ${C.ln}` }}>
                  <button onClick={() => onQty(item.id, item.qty - 1)} style={{ width: 26, height: 26, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.mut }}>−</button>
                  <span style={{ width: 26, textAlign: "center", fontSize: 12, color: C.char, lineHeight: "26px" }}>{item.qty}</span>
                  <button onClick={() => onQty(item.id, item.qty + 1)} style={{ width: 26, height: 26, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.mut }}>+</button>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.mut, textDecoration: "underline", textUnderlineOffset: 3 }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: "18px 24px 24px", borderTop: `1px solid ${C.ln}` }}>
          {/* Fulfillment toggle */}
          <div style={{ display: "flex", marginBottom: 14 }}>
            {[{ key: 'shipping', label: 'Ship to Me' }, { key: 'pickup', label: 'Local Pickup' }].map(opt => (
              <button key={opt.key} onClick={() => setFulfillment(opt.key)} style={{
                flex: 1, padding: "8px", background: fulfillment === opt.key ? C.char : "transparent",
                color: fulfillment === opt.key ? C.cream : C.char,
                border: `1px solid ${C.char}`, fontFamily: "'Outfit',sans-serif",
                fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer",
              }}>{opt.label}</button>
            ))}
          </div>

          {fulfillment === 'pickup' && (
            <div style={{ padding: "10px 14px", background: C.warm, marginBottom: 14, borderLeft: `3px solid ${C.gold}` }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.char, lineHeight: 1.5, margin: 0 }}>
                Pickup at Flowe Collective<br />
                <span style={{ color: C.mut }}>Houston, TX · Details sent via email</span>
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: C.mut }}>Subtotal</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 500, color: C.char }}>${total}</span>
          </div>

          {fulfillment === 'shipping' && total < 75 && (
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.goldDk, textAlign: "center", marginBottom: 10 }}>
              Add ${75 - total} more for free shipping
            </p>
          )}

          <button onClick={handleCheckout} disabled={loading} style={{
            width: "100%", padding: 14, background: loading ? C.mut : C.char, color: C.cream, border: "none",
            fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
          }}>{loading ? "Redirecting to checkout..." : `Checkout · $${total}`}</button>
        </div>
      )}
    </div>
  </>);
}

function Detail({ product, onAdd, onClose }) {
  const [imgErr, setImgErr] = useState(false);
  if (!product) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(26,26,26,.5)", zIndex: 997,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.cream, width: "min(700px,100%)", maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexWrap: "wrap",
      }}>
        <div style={{
          flex: "1 1 280px", minHeight: 300, background: C.warm,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
        }}>
          {!imgErr ? (
            <img src={product.img} alt={product.name} onError={() => setImgErr(true)}
              style={{ maxWidth: "80%", maxHeight: 300, objectFit: "contain" }} />
          ) : null}
        </div>
        <div style={{ flex: "1 1 280px", padding: "36px 32px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.mut }}>✕</button>
          {product.line === "R+Co BLEU" && (
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: C.bleu, margin: "0 0 6px", fontWeight: 600 }}>R+Co BLEU</p>
          )}
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 500, color: C.char, margin: "0 0 4px", lineHeight: 1.2 }}>{product.name}</h2>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.mut, margin: "0 0 10px" }}>{product.sub}</p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, color: C.char, margin: "0 0 6px" }}>${product.price}</p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.mut, margin: "0 0 20px" }}>{product.sz}</p>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.mut, lineHeight: 1.7, margin: "0 0 24px" }}>
            {product.line === "R+Co BLEU"
              ? "From R+Co's premium BLEU capsule collection. Couture-caliber formulation with breakthrough innovation in sustainability and design."
              : "Vegan, cruelty-free, and formulated without parabens, sulfates, petrolatum, or mineral oil. Color-safe for all hair types."}
          </p>
          <button onClick={() => { onAdd(product); onClose(); }} style={{
            width: "100%", padding: 14, background: C.char, color: C.cream, border: "none",
            fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
          }}>Add to Cart</button>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.mut, textAlign: "center", marginTop: 10 }}>Free shipping on orders $75+</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Shop ── */
export default function App() {
  const [activeCat, setActiveCat] = useState("All");
  const [activeLine, setActiveLine] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PRODUCTS.filter(p =>
      (activeCat === "All" || p.cat === activeCat) &&
      (activeLine === "All" || p.line === activeLine) &&
      (!q || p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.line.toLowerCase().includes(q))
    );
  }, [activeCat, activeLine, search]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
    setToast(`Added ${p.name}`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream }}>
      {/* Nav */}
      <header style={{ padding: "22px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.ln}` }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: C.char, letterSpacing: 1 }}>FLOWE COLLECTIVE</h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: C.gold, marginTop: 1 }}>Shop</p>
        </div>
        <button onClick={() => setCartOpen(true)} style={{
          background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.char, display: "flex", alignItems: "center", gap: 7,
        }}>
          Cart
          {cartCount > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 20, height: 20, borderRadius: "50%", background: C.char, color: C.cream, fontSize: 9, fontWeight: 500,
            }}>{cartCount}</span>
          )}
        </button>
      </header>

      {/* Hero */}
      <section style={{ padding: "48px 32px 36px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 400, color: C.char, lineHeight: 1.2, marginBottom: 10 }}>
          Salon-Curated Products
        </h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.mut, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
          The same R+Co and R+Co BLEU products we use behind the chair. Free shipping on orders over $75.
        </p>
      </section>

      {/* Filters */}
      <div style={{ padding: "0 32px 12px", display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        {LINES.map(l => (
          <button key={l} onClick={() => setActiveLine(l)} style={{
            padding: "7px 16px", background: activeLine === l ? C.char : "transparent",
            color: activeLine === l ? C.cream : C.mut,
            border: `1px solid ${activeLine === l ? C.char : C.ln}`,
            fontFamily: "'Outfit',sans-serif", fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer",
          }}>{l}</button>
        ))}
      </div>
      <nav style={{ padding: "0 32px 32px", display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{
            padding: "7px 16px", background: activeCat === c ? C.gold : "transparent",
            color: activeCat === c ? C.wh : C.mut,
            border: `1px solid ${activeCat === c ? C.gold : C.ln}`,
            fontFamily: "'Outfit',sans-serif", fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer",
          }}>{c}</button>
        ))}
      </nav>

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 32px 24px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: C.mut, fontSize: 14, pointerEvents: "none",
          }}>&#9906;</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: "100%", padding: "11px 16px 11px 38px",
              border: `1px solid ${C.ln}`, background: C.wh,
              fontFamily: "'Outfit',sans-serif", fontSize: 13, color: C.char,
              outline: "none", borderRadius: 0, transition: "border-color .2s ease, box-shadow .2s ease",
              letterSpacing: 0.3,
            }}
            onFocus={e => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.gold}22`; }}
            onBlur={e => { e.target.style.borderColor = C.ln; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: C.mut, fontSize: 14,
                padding: 4, lineHeight: 1,
              }}
            >✕</button>
          )}
        </div>
      </div>

      <p style={{ textAlign: "center", fontFamily: "'Outfit',sans-serif", fontSize: 11, color: C.mut, marginBottom: 20 }}>
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <main style={{
        padding: "0 32px 64px", maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 28,
      }}>
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} onClick={setDetail} index={i} />
        ))}
      </main>

      {/* Footer */}
      <footer style={{ padding: "28px 32px", borderTop: `1px solid ${C.ln}`, textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: C.mut }}>
          Flowe Collective · Houston, TX · Powered by Stripe
        </p>
      </footer>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: C.char, color: C.cream, padding: "10px 22px",
          fontFamily: "'Outfit',sans-serif", fontSize: 12, zIndex: 1001, animation: "slideIn .25s ease",
        }}>{toast}</div>
      )}

      <Detail product={detail} onAdd={addToCart} onClose={() => setDetail(null)} />

      <CartSlide
        cart={cart} open={cartOpen}
        onClose={() => setCartOpen(false)}
        onQty={(id, q) => setCart(prev => q < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty: q } : i))}
        onRemove={id => setCart(prev => prev.filter(i => i.id !== id))}
      />
    </div>
  );
}
