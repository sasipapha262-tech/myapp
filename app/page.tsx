"use client";

import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";

/* ================= types & data ================= */
type Product = {
  id: string;
  name: string;
  price: number;
  color: string;
  deco: string;
  desc: string;
};
type CartItem = {
  key: string;
  productId: string;
  size: string;
  qty: number;
};
type ScreenName = "splash" | "home" | "menu" | "detail" | "cart" | "profile" | "success";
type Screen = { name: ScreenName; productId?: string };
type Order = { no: string; total: number; count: number; time: string };

const PINK = "#d63a7a";
const PINK_DARK = "#b82c66";
const PINK_LIGHT = "#fde7ef";

const SIZES = [
  { key: "S", label: "(เล็ก)", add: 0 },
  { key: "M", label: "(กลาง)", add: 10 },
  { key: "L", label: "(ใหญ่)", add: 20 },
];

const PRODUCTS: Product[] = [
  { id: "straw", name: "สตรอว์เบอร์รีปั่น", price: 45, color: "#f48fb1", deco: "🍓", desc: "สตรอว์เบอร์รีสด ปั่นเนียนนุ่ม หอม หวาน อร่อย สดชื่น" },
  { id: "mango", name: "มะม่วงปั่น", price: 45, color: "#ffb74d", deco: "🥭", desc: "มะม่วงสุกหวานฉ่ำ ปั่นเย็นชื่นใจ รสชาติเข้มข้น" },
  { id: "choc", name: "ช็อกโกแลตปั่น", price: 50, color: "#8d6e63", deco: "🍫", desc: "ช็อกโกแลตเข้มข้น ปั่นนุ่ม หวานมันกำลังดี" },
  { id: "matcha", name: "ชาเขียวปั่น", price: 50, color: "#aed581", deco: "🍃", desc: "ชาเขียวมัทฉะแท้ หอมละมุน ขมนิดๆ หวานหน่อยๆ" },
  { id: "blue", name: "บลูเบอร์รีปั่น", price: 55, color: "#9fa8da", deco: "🫐", desc: "บลูเบอร์รีเปรี้ยวอมหวาน ปั่นเนียน สีสวย" },
  { id: "orange", name: "ส้มปั่น", price: 40, color: "#ffcc80", deco: "🍊", desc: "ส้มสดคั้นปั่น วิตามินซีสูง สดชื่นรับวันใหม่" },
];

const SLIDES = [
  { l1: "ความสดชื่น", l2: "ที่คุณเลือกได้", bg: "linear-gradient(110deg,#f9b9cf,#ffe0b8 55%,#fff)", cups: ["#f48fb1", "#ffcc80", "#c5e1a5"] },
  { l1: "ปั่นสดใหม่", l2: "ทุกแก้วทุกวัน", bg: "linear-gradient(110deg,#ffd7a8,#ffe9c7 55%,#fff)", cups: ["#ffb74d", "#ffcc80", "#f48fb1"] },
  { l1: "หวานน้อย", l2: "สั่งได้ตามใจ", bg: "linear-gradient(110deg,#d7ecc0,#f2f8d8 55%,#fff)", cups: ["#aed581", "#c5e1a5", "#9fa8da"] },
];

const priceOf = (p: Product, size: string) =>
  p.price + (SIZES.find((s) => s.key === size)?.add ?? 0);

/* ================= small components ================= */
function Cup({ color, size = 120 }: { color: string; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 120 150"
      style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.12))", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity=".85" />
          <stop offset=".5" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity=".8" />
        </linearGradient>
      </defs>
      <line x1="68" y1="4" x2="62" y2="60" stroke="#4e342e" strokeWidth="5" strokeLinecap="round" />
      <path d="M18 56 Q60 -6 102 56 Z" fill="#fff" fillOpacity=".55" stroke="#fff" strokeWidth="2" />
      <path d="M16 56 H104 L94 140 Q60 150 26 140 Z" fill={`url(#g${uid})`} />
      <rect x="12" y="52" width="96" height="9" rx="4" fill="#fff" fillOpacity=".8" />
      <path d="M30 70 Q34 100 32 128" stroke="#fff" strokeOpacity=".5" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TabBar({
  active,
  cartCount,
  onTab,
}: {
  active: ScreenName;
  cartCount: number;
  onTab: (n: ScreenName) => void;
}) {
  const tabs: { name: ScreenName; icon: string; label: string }[] = [
    { name: "home", icon: "🏠", label: "หน้าหลัก" },
    { name: "menu", icon: "🧾", label: "เมนู" },
    { name: "cart", icon: "🛍️", label: "คำสั่งซื้อ" },
    { name: "profile", icon: "👤", label: "โปรไฟล์" },
  ];
  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <button
          key={t.name}
          onClick={() => onTab(t.name)}
          className={t.name === active ? "tab on" : "tab"}
        >
          <span className="ic">
            {t.icon}
            {t.name === "cart" && cartCount > 0 && <i className="badge">{cartCount}</i>}
          </span>
          <small>{t.label}</small>
        </button>
      ))}
    </nav>
  );
}

function TopBar({ left, center, right }: { left?: ReactNode; center: ReactNode; right?: ReactNode }) {
  return (
    <div className="topbar">
      <div className="slot l">{left}</div>
      <div className="center-title">{center}</div>
      <div className="slot r">{right}</div>
    </div>
  );
}

/* ================= app ================= */
export default function Page() {
  const [stack, setStack] = useState<Screen[]>([{ name: "splash" }]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [toast, setToast] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const cur = stack[stack.length - 1];
  const go = (name: ScreenName, productId?: string) =>
    setStack((s) => [...s, { name, productId }]);
  const tab = (name: ScreenName) => setStack([{ name }]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1600);
  };

  const openProduct = (id: string) => {
    setSize("S");
    setQty(1);
    go("detail", id);
  };

  const addToCart = (productId: string, sz: string, q: number) => {
    const key = `${productId}-${sz}`;
    setCart((c) => {
      const found = c.find((i) => i.key === key);
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + q } : i));
      return [...c, { key, productId, size: sz, qty: q }];
    });
  };

  const changeQty = (key: string, d: number) =>
    setCart((c) =>
      c.flatMap((i) => {
        if (i.key !== key) return [i];
        const n = i.qty + d;
        return n < 1 ? [] : [{ ...i, qty: n }];
      })
    );

  const getP = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + priceOf(getP(i.productId), i.size) * i.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;
    const order: Order = {
      no: `PF${Math.floor(1000 + Math.random() * 9000)}`,
      total,
      count,
      time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };
    setOrders((o) => [order, ...o]);
    setLastOrder(order);
    setCart([]);
    setStack([{ name: "success" }]);
  };

  // เลื่อนแบนเนอร์อัตโนมัติ
  useEffect(() => {
    if (cur.name !== "home") return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, [cur.name]);

  const showTabs = ["home", "menu", "cart", "profile"].includes(cur.name);
  const product = getP(cur.productId ?? "straw");

  return (
    <main className="stage">
      <style>{css}</style>

      <div className="phone">
        <div className={showTabs ? "body has-tab" : "body"} key={cur.name + (cur.productId ?? "")}>
          {/* ============ SPLASH ============ */}
          {cur.name === "splash" && (
            <div className="splash">
              <div className="splash-cup">
                <span className="berry b1">🍓</span>
                <span className="berry b2">🍓</span>
                <span className="leaf l1">🍃</span>
                <Cup color="#f48fb1" size={190} />
              </div>
              <h1 className="logo">
                ปั่นฟินๆ <span>🥤</span>
              </h1>
              <p className="slogan">“อร่อย สดชื่น ทุกแก้ว”</p>
              <button className="cta" onClick={() => tab("home")}>
                เริ่มสั่งเครื่องดื่ม <span>→</span>
              </button>
              <div className="wave" />
            </div>
          )}

          {/* ============ HOME ============ */}
          {cur.name === "home" && (
            <>
              <TopBar
                left={<span className="icon-btn">☰</span>}
                center={<span className="logo-sm">ปั่นฟินๆ 🥤</span>}
                right={
                  <button className="icon-btn" onClick={() => tab("cart")} aria-label="ตะกร้า">
                    🛒{count > 0 && <i className="badge">{count}</i>}
                  </button>
                }
              />
              <div className="banner" style={{ background: SLIDES[slide].bg }}>
                <div className="bottles">
                  {SLIDES[slide].cups.map((c, i) => (
                    <Cup key={i} color={c} size={56} />
                  ))}
                </div>
                <div className="banner-text">
                  <p>{SLIDES[slide].l1}</p>
                  <p>{SLIDES[slide].l2}</p>
                </div>
              </div>
              <div className="dots">
                {SLIDES.map((_, d) => (
                  <i key={d} onClick={() => setSlide(d)} className={d === slide ? "on" : ""} />
                ))}
              </div>

              <div className="sec-head">
                <b>🥤 เมนูแนะนำ</b>
                <button className="link" onClick={() => tab("menu")}>
                  ดูทั้งหมด ›
                </button>
              </div>
              <div className="cards">
                {PRODUCTS.slice(0, 4).map((m) => (
                  <button className="card" key={m.id} onClick={() => openProduct(m.id)}>
                    <div className="card-img">
                      <Cup color={m.color} size={64} />
                      <span className="deco">{m.deco}</span>
                    </div>
                    <div className="card-name">{m.name}</div>
                    <div className="price-pill">฿{m.price}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ============ MENU ============ */}
          {cur.name === "menu" && (
            <>
              <TopBar center={<b>เมนูทั้งหมด</b>} right={
                <button className="icon-btn" onClick={() => tab("cart")}>
                  🛒{count > 0 && <i className="badge">{count}</i>}
                </button>
              } />
              <div className="list">
                {PRODUCTS.map((m) => (
                  <div className="row-card" key={m.id}>
                    <button className="thumb" onClick={() => openProduct(m.id)}>
                      <Cup color={m.color} size={42} />
                    </button>
                    <button className="row-info" onClick={() => openProduct(m.id)}>
                      <b>
                        {m.deco} {m.name}
                      </b>
                      <small>เริ่มต้น ฿{m.price}</small>
                    </button>
                    <button
                      className="plus"
                      aria-label="เพิ่มลงตะกร้า"
                      onClick={() => {
                        addToCart(m.id, "S", 1);
                        showToast(`เพิ่ม ${m.name} แล้ว`);
                      }}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ============ DETAIL ============ */}
          {cur.name === "detail" && (
            <>
              <TopBar
                left={<button className="icon-btn" onClick={back}>‹</button>}
                center={<b>รายละเอียดสินค้า</b>}
                right={
                  <button
                    className="icon-btn"
                    style={{ color: PINK }}
                    onClick={() =>
                      setFavs((f) =>
                        f.includes(product.id) ? f.filter((x) => x !== product.id) : [...f, product.id]
                      )
                    }
                  >
                    {favs.includes(product.id) ? "♥" : "♡"}
                  </button>
                }
              />
              <div className="detail-hero">
                <span className="berry b1">{product.deco}</span>
                <span className="leaf l1">🍃</span>
                <Cup color={product.color} size={150} />
              </div>
              <div className="center">
                <h3 className="d-title">{product.name}</h3>
                <div className="big-price">฿{priceOf(product, size)}</div>
                <p className="desc">{product.desc}</p>
              </div>

              <div className="label">🥤 ขนาดที่ต้องการ</div>
              <div className="sizes">
                {SIZES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSize(s.key)}
                    className={s.key === size ? "size on" : "size"}
                  >
                    {s.key === size && <i className="tick">✓</i>}
                    <b>{s.key}</b>
                    <small>{s.label}</small>
                    <span>฿{priceOf(product, s.key)}</span>
                  </button>
                ))}
              </div>

              <div className="qty-row">
                <span>🛒 จำนวน</span>
                <div className="stepper">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <b>{qty}</b>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              </div>

              <button
                className="cta add"
                onClick={() => {
                  addToCart(product.id, size, qty);
                  showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
                  setQty(1);
                }}
              >
                🧺 เพิ่มลงตะกร้า · ฿{priceOf(product, size) * qty}
              </button>
            </>
          )}

          {/* ============ CART ============ */}
          {cur.name === "cart" && (
            <>
              <TopBar
                left={<button className="icon-btn" onClick={() => tab("home")}>‹</button>}
                center={<b>ตะกร้าสินค้า</b>}
                right={
                  <button className="icon-btn" onClick={() => setCart([])} aria-label="ล้างตะกร้า">
                    🗑
                  </button>
                }
              />
              <div className="list">
                {cart.length === 0 && (
                  <div className="empty">
                    <div style={{ fontSize: 48 }}>🥤</div>
                    <p>ยังไม่มีสินค้าในตะกร้า</p>
                    <button className="ghost" onClick={() => tab("menu")}>
                      ไปเลือกเมนู
                    </button>
                  </div>
                )}
                {cart.map((i) => {
                  const p = getP(i.productId);
                  const unit = priceOf(p, i.size);
                  return (
                    <div className="cart-item" key={i.key}>
                      <div className="thumb">
                        <Cup color={p.color} size={44} />
                      </div>
                      <div className="info">
                        <b>{p.name}</b>
                        <small>ขนาด {i.size}</small>
                        <span className="unit">฿{unit}</span>
                        <div className="row">
                          <div className="stepper sm">
                            <button onClick={() => changeQty(i.key, -1)}>−</button>
                            <b>{i.qty}</b>
                            <button onClick={() => changeQty(i.key, 1)}>+</button>
                          </div>
                          <span className="line-price">฿{unit * i.qty}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cart.length > 0 && (
                <div className="checkout">
                  <div className="total-row">
                    <b>รวมทั้งหมด</b>
                    <span className="total">฿{total}</span>
                  </div>
                  <button className="cta" onClick={checkout}>
                    💳 สั่งซื้อเลย
                  </button>
                  <button className="ghost" onClick={() => tab("menu")}>
                    เลือกเมนูเพิ่มเติม
                  </button>
                </div>
              )}
            </>
          )}

          {/* ============ PROFILE ============ */}
          {cur.name === "profile" && (
            <>
              <TopBar center={<b>โปรไฟล์</b>} />
              <div className="profile-head">
                <div className="avatar">🙂</div>
                <b>ลูกค้าปั่นฟินๆ</b>
                <small>สมาชิกใหม่</small>
              </div>
              <div className="label">🧾 ประวัติการสั่งซื้อ</div>
              <div className="list">
                {orders.length === 0 && <p className="empty-text">ยังไม่มีประวัติการสั่งซื้อ</p>}
                {orders.map((o) => (
                  <div className="order" key={o.no}>
                    <div>
                      <b>#{o.no}</b>
                      <small>
                        {o.count} แก้ว · {o.time} น.
                      </small>
                    </div>
                    <span className="line-price">฿{o.total}</span>
                  </div>
                ))}
              </div>
              {favs.length > 0 && (
                <>
                  <div className="label" style={{ marginTop: 14 }}>♥ เมนูที่ถูกใจ</div>
                  <div className="chips">
                    {favs.map((f) => (
                      <button key={f} className="chip" onClick={() => openProduct(f)}>
                        {getP(f).deco} {getP(f).name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ============ SUCCESS ============ */}
          {cur.name === "success" && lastOrder && (
            <div className="success">
              <div className="check">✓</div>
              <h2>สั่งซื้อสำเร็จ!</h2>
              <p>
                หมายเลขคำสั่งซื้อ <b>#{lastOrder.no}</b>
              </p>
              <p>
                {lastOrder.count} แก้ว · รวม <b style={{ color: PINK }}>฿{lastOrder.total}</b>
              </p>
              <p className="muted">ร้านกำลังปั่นให้คุณ รอสักครู่นะ 🥤</p>
              <button className="cta" onClick={() => tab("home")}>
                กลับหน้าหลัก
              </button>
              <button className="ghost" onClick={() => tab("profile")}>
                ดูประวัติการสั่งซื้อ
              </button>
            </div>
          )}
        </div>

        {showTabs && <TabBar active={cur.name} cartCount={count} onTab={tab} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </main>
  );
}

/* ================= styles ================= */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Prompt:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{margin:0}
button{font-family:inherit;color:inherit}
.stage{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:16px;background:#fbe6ee;font-family:'Prompt',sans-serif;color:#4a1d33}
.phone{position:relative;width:390px;max-width:100%;height:820px;max-height:calc(100dvh - 32px);border-radius:40px;border:2px solid #f3b6cb;overflow:hidden;
 background:linear-gradient(180deg,#fff 0%,#fff3f7 60%,#fde4ec 100%);box-shadow:0 12px 40px rgba(214,58,122,.25);display:flex;flex-direction:column}
@media(max-width:480px){.stage{padding:0;background:#fff}.phone{width:100vw;height:100dvh;max-height:none;border-radius:0;border:0;box-shadow:none}}

.body{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;padding:18px 20px 16px;scrollbar-width:none;animation:fade .25s ease}
.body::-webkit-scrollbar{display:none}
.body.has-tab{padding-bottom:84px}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:4px 0 12px;min-height:44px}
.slot{width:44px;display:flex}
.slot.r{justify-content:flex-end}
.center-title{flex:1;text-align:center;font-size:16px}
.icon-btn{position:relative;background:none;border:0;font-size:22px;cursor:pointer;padding:4px 6px;line-height:1}
.logo-sm{font-family:'Mali',cursive;font-size:26px;color:${PINK};font-weight:700}
.link{background:none;border:0;color:${PINK};font-size:12px;cursor:pointer}

/* splash */
.splash{flex:1;display:flex;flex-direction:column;align-items:center;position:relative;margin:-18px -20px -16px;padding:50px 28px 0;
 background:radial-gradient(circle at 50% 30%,#ffe3ec,#f9bfd2)}
.splash-cup{position:relative;margin-top:10px}
.logo{font-family:'Mali',cursive;font-size:52px;font-weight:700;color:#7a1f48;margin:18px 0 0;line-height:1;text-shadow:2px 2px 0 #fff}
.logo span{font-size:30px}
.slogan{font-family:'Mali',cursive;font-weight:600;margin:12px 0 28px;font-size:18px}
.wave{position:absolute;left:0;right:0;bottom:0;height:110px;background:#f7a8c2;border-radius:50% 50% 0 0/50px 50px 0 0;opacity:.6;z-index:0}
.splash .cta{margin-top:auto;margin-bottom:60px}

.cta{position:relative;z-index:1;width:100%;border:0;border-radius:999px;padding:15px 18px;color:#fff;font:600 15px 'Prompt',sans-serif;
 background:linear-gradient(90deg,${PINK},${PINK_DARK});display:flex;justify-content:center;align-items:center;gap:14px;cursor:pointer;box-shadow:0 6px 14px rgba(214,58,122,.35);transition:transform .1s}
.cta:active{transform:scale(.97)}
.ghost{width:100%;border:1.5px solid ${PINK};background:#fff;color:${PINK_DARK};border-radius:999px;padding:12px;font:500 14px 'Prompt';cursor:pointer;margin-top:8px}
.berry{position:absolute;font-size:38px;z-index:2}
.berry.b1{right:-22px;bottom:6px}
.berry.b2{left:-22px;bottom:30px;font-size:30px}
.leaf{position:absolute;font-size:28px}
.leaf.l1{right:-30px;top:20px}

/* home */
.banner{border-radius:18px;height:124px;overflow:hidden;display:flex;align-items:center;justify-content:space-between;padding:0 12px;transition:background .4s}
.bottles{display:flex;align-items:flex-end;margin-top:18px}
.banner-text{font-family:'Mali',cursive;color:#7a1f48;font-weight:700;font-size:17px;text-align:right;line-height:1.35}
.banner-text p{margin:0}
.dots{display:flex;gap:6px;justify-content:center;margin:10px 0 8px}
.dots i{width:7px;height:7px;border-radius:50%;background:#e7c0cf;cursor:pointer;transition:all .2s}
.dots i.on{background:${PINK};width:18px;border-radius:99px}
.sec-head{display:flex;justify-content:space-between;align-items:center;font-size:14px;margin:6px 0 10px}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.card{background:#fff;border-radius:18px;padding:8px 8px 12px;text-align:center;border:1px solid #fbd7e3;box-shadow:0 3px 8px rgba(214,58,122,.08);cursor:pointer;transition:transform .1s}
.card:active{transform:scale(.97)}
.card-img{position:relative;display:flex;justify-content:center;background:${PINK_LIGHT};border-radius:14px;padding-top:8px;height:104px;overflow:hidden}
.deco{position:absolute;left:8px;bottom:4px;font-size:18px}
.card-name{font-size:12px;margin:8px 0 5px;font-weight:500}
.price-pill{display:inline-block;background:${PINK_LIGHT};color:${PINK};font-weight:700;font-size:12px;padding:2px 14px;border-radius:999px}

.tabbar{position:absolute;left:0;right:0;bottom:0;background:#fff;display:flex;justify-content:space-around;padding:8px 6px 14px;border-top:1px solid #fbd7e3;z-index:5}
.tab{background:none;border:0;display:flex;flex-direction:column;align-items:center;color:#8a6a78;font-size:10px;gap:2px;cursor:pointer;padding:2px 10px}
.tab.on{color:${PINK};font-weight:600}
.ic{position:relative;font-size:20px}
.badge{position:absolute;top:-6px;right:-10px;background:${PINK};color:#fff;font-style:normal;font-size:10px;min-width:16px;height:16px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-family:'Prompt';font-weight:600;padding:0 4px}

/* menu / lists */
.list{display:flex;flex-direction:column;gap:10px}
.row-card{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #fbd7e3;border-radius:16px;padding:8px}
.thumb{width:62px;height:76px;border-radius:12px;background:${PINK_LIGHT};display:flex;align-items:center;justify-content:center;flex-shrink:0;border:0;cursor:pointer}
.row-info{flex:1;background:none;border:0;text-align:left;display:flex;flex-direction:column;gap:2px;cursor:pointer;padding:0}
.row-info b{font-size:14px;color:#7a1f48}
.row-info small{font-size:12px;color:#8a6a78}
.plus{width:34px;height:34px;border-radius:50%;border:0;background:${PINK};color:#fff;font-size:20px;cursor:pointer;line-height:1}
.plus:active{transform:scale(.9)}

/* detail */
.detail-hero{position:relative;display:flex;justify-content:center;align-items:center;height:200px;margin:0 24px;background:radial-gradient(circle,#ffe0ea,#fff0f5 70%);border-radius:50%}
.center{text-align:center}
.d-title{font-size:22px;margin:10px 0 6px;color:#7a1f48}
.big-price{display:inline-block;background:#f9c5d8;color:${PINK_DARK};font-weight:700;font-size:22px;padding:0 26px;border-radius:999px}
.desc{font-size:12px;margin:8px 0 10px;line-height:1.6;color:#6b4254}
.label{font-size:13px;font-weight:600;margin-bottom:8px;color:#7a1f48}
.sizes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.size{position:relative;background:#fff;border:1.5px solid #f3c9d8;border-radius:14px;padding:8px 2px;display:flex;flex-direction:column;align-items:center;cursor:pointer;color:#4a1d33}
.size b{font-size:18px}
.size small{font-size:10px;color:#8a6a78}
.size span{font-size:13px;font-weight:600}
.size.on{background:#fde1ec;border-color:${PINK}}
.tick{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;background:${PINK};color:#fff;font-style:normal;font-size:12px;display:flex;align-items:center;justify-content:center}
.qty-row{display:flex;justify-content:space-between;align-items:center;margin:14px 0 12px;font-size:13px;font-weight:600;color:#7a1f48}
.stepper{display:flex;align-items:center;gap:14px}
.stepper button{width:30px;height:30px;border-radius:50%;border:0;background:#fbd7e3;color:${PINK};font-size:18px;cursor:pointer;line-height:1}
.stepper button:last-child{background:${PINK};color:#fff}
.stepper b{min-width:16px;text-align:center}
.add{margin-top:auto}

/* cart */
.cart-item{display:flex;gap:12px;background:#fff;border:1px solid #fbd7e3;border-radius:16px;padding:8px}
.info{flex:1;display:flex;flex-direction:column}
.info b{font-size:13px;color:#7a1f48}
.info small{font-size:11px;color:#8a6a78}
.info .unit{font-size:12px;font-weight:700;color:#7a1f48}
.row{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.stepper.sm{gap:8px}
.stepper.sm button,.stepper.sm button:last-child{width:24px;height:24px;font-size:15px;background:#fbd7e3;color:${PINK}}
.line-price{font-weight:700;font-size:15px;color:${PINK_DARK}}
.checkout{margin-top:auto;padding-top:14px}
.total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:15px}
.total{font-size:24px;font-weight:700;color:${PINK}}
.empty{text-align:center;color:#8a6a78;font-size:14px;margin-top:70px}
.empty-text{text-align:center;color:#8a6a78;font-size:13px;margin:16px 0}

/* profile */
.profile-head{display:flex;flex-direction:column;align-items:center;gap:2px;margin:6px 0 18px}
.avatar{width:76px;height:76px;border-radius:50%;background:${PINK_LIGHT};display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:6px}
.profile-head small{color:#8a6a78}
.order{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #fbd7e3;border-radius:14px;padding:10px 14px}
.order div{display:flex;flex-direction:column}
.order small{color:#8a6a78;font-size:11px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid #f3c9d8;background:#fff;border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer}

/* success */
.success{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px}
.success h2{margin:10px 0 4px;color:#7a1f48}
.success p{margin:2px 0;font-size:14px}
.muted{color:#8a6a78;margin:10px 0 24px !important;font-size:13px !important}
.check{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,${PINK},${PINK_DARK});color:#fff;font-size:46px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(214,58,122,.4);animation:pop .4s ease}
@keyframes pop{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}

.toast{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:#4a1d33;color:#fff;font-size:13px;padding:10px 18px;border-radius:999px;z-index:10;white-space:nowrap;animation:fade .2s ease;box-shadow:0 6px 16px rgba(0,0,0,.25)}
`;