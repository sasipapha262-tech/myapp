"use client";

import { useState, useId } from "react";
import type { ReactNode } from "react";

/* ---------- types & data ---------- */
type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
  color: string;
};

const PINK = "#d63a7a";
const PINK_DARK = "#b82c66";
const PINK_LIGHT = "#fde7ef";

const SIZES = [
  { key: "S", label: "(เล็ก)", price: 45 },
  { key: "M", label: "(กลาง)", price: 55 },
  { key: "L", label: "(ใหญ่)", price: 65 },
];

const MENUS = [
  { name: "สตรอว์เบอร์รีปั่น", price: 45, color: "#f7a1bd", deco: "🍓" },
  { name: "มะม่วงปั่น", price: 45, color: "#ffb74d", deco: "🍊" },
  { name: "ช็อกโกแลตปั่น", price: 50, color: "#6d4c41", deco: "☕" },
  { name: "ชาเขียวปั่น", price: 50, color: "#aed581", deco: "🍃" },
];

/* ---------- small components ---------- */
function Cup({ color, size = 120 }: { color: string; size?: number }) {
  // id ต้องไม่ซ้ำและไม่มีอักขระพิเศษ (เดิมใช้ "#สี" ทำให้ id ซ้ำ/ไม่ถูกต้อง)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 120 150"
      style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.12))" }}
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity=".85" />
          <stop offset=".5" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity=".8" />
        </linearGradient>
      </defs>
      {/* straw */}
      <line x1="68" y1="4" x2="62" y2="60" stroke="#4e342e" strokeWidth="5" strokeLinecap="round" />
      {/* lid dome */}
      <path d="M18 56 Q60 -6 102 56 Z" fill="#fff" fillOpacity=".55" stroke="#fff" strokeWidth="2" />
      {/* cup */}
      <path d="M16 56 H104 L94 140 Q60 150 26 140 Z" fill={`url(#g${uid})`} />
      <rect x="12" y="52" width="96" height="9" rx="4" fill="#fff" fillOpacity=".8" />
      <path d="M30 70 Q34 100 32 128" stroke="#fff" strokeOpacity=".5" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Phone({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="phone">
      <div className="status">
        <b>9:41</b>
        <span>▂▄▆ ◔ ▭</span>
      </div>
      {/* เนื้อหาเลื่อนได้ ไม่ถูกแถบเมนูด้านล่างทับ */}
      <div className={footer ? "body has-tab" : "body"}>{children}</div>
      {footer}
    </div>
  );
}

function TabBar({ active, cartCount = 0 }: { active: number; cartCount?: number }) {
  const tabs = [
    { icon: "🏠", label: "หน้าหลัก" },
    { icon: "🧾", label: "เมนู" },
    { icon: "📋", label: "ค่าสั่งซื้อ" },
    { icon: "👤", label: "โปรไฟล์" },
  ];
  return (
    <div className="tabbar">
      {tabs.map((t, i) => (
        <div key={t.label} className={i === active ? "tab on" : "tab"}>
          <span style={{ fontSize: 18, position: "relative" }}>
            {t.icon}
            {i === 2 && cartCount > 0 && <i className="badge">{cartCount}</i>}
          </span>
          <small>{t.label}</small>
        </div>
      ))}
    </div>
  );
}

/* ---------- page ---------- */
export default function Page() {
  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    { id: "a", name: "สตรอว์เบอร์รีปั่น", size: "S", price: 45, qty: 1, color: "#f7a1bd" },
    { id: "b", name: "ชาเขียวปั่น", size: "M", price: 50, qty: 1, color: "#aed581" },
  ]);
  const [banner, setBanner] = useState(0);

  const unit = SIZES.find((s) => s.key === size)!.price;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = () => {
    setCart((c) => {
      const found = c.find((i) => i.name === "สตรอว์เบอร์รีปั่น" && i.size === size);
      if (found)
        return c.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i));
      return [
        ...c,
        {
          id: `${Date.now()}`,
          name: "สตรอว์เบอร์รีปั่น",
          size,
          price: unit,
          qty,
          color: "#f7a1bd",
        },
      ];
    });
    setQty(1);
  };

  const changeQty = (id: string, d: number) =>
    setCart((c) =>
      c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))
    );

  return (
    <main className="wrap">
      <style>{css}</style>

      <div className="grid">
        {/* ============ 1. SPLASH ============ */}
        <Phone>
          <div className="splash">
            <div className="splash-cup">
              <span className="berry b1">🍓</span>
              <span className="berry b2">🍓</span>
              <span className="leaf l1">🍃</span>
              <Cup color="#f48fb1" size={170} />
            </div>
            <h1 className="logo">ปั่นฟินๆ <span>🥤</span></h1>
            <p className="slogan">“อร่อย สดชื่น ทุกแก้ว”</p>
            <button className="cta">
              เริ่มสั่งเครื่องดื่ม <span>→</span>
            </button>
            <div className="wave" />
          </div>
        </Phone>

        {/* ============ 2. HOME ============ */}
        <Phone footer={<TabBar active={0} cartCount={count} />}>
          <div className="topbar">
            <span style={{ fontSize: 20 }}>☰</span>
            <h2 className="logo-sm">ปั่นฟินๆ 🥤</h2>
            <span style={{ position: "relative", fontSize: 20 }}>
              🛒<i className="badge">{count}</i>
            </span>
          </div>

          <div className="banner">
            <div className="bottles">
              <Cup color="#f48fb1" size={52} />
              <Cup color="#ffcc80" size={52} />
              <Cup color="#c5e1a5" size={52} />
            </div>
            <div className="banner-text">
              <p>ความสดชื่น</p>
              <p>ที่คุณเลือกได้</p>
            </div>
          </div>
          <div className="dots">
            {[0, 1, 2].map((d) => (
              <i
                key={d}
                onClick={() => setBanner(d)}
                className={d === banner ? "on" : ""}
              />
            ))}
          </div>

          <div className="sec-head">
            <b>🥤 เมนูแนะนำ</b>
            <a>ดูทั้งหมด ›</a>
          </div>

          <div className="cards">
            {MENUS.map((m) => (
              <div className="card" key={m.name}>
                <div className="card-img">
                  <Cup color={m.color} size={62} />
                  <span className="deco">{m.deco}</span>
                </div>
                <div className="card-name">{m.name}</div>
                <div className="price-pill">฿{m.price}</div>
              </div>
            ))}
          </div>

        </Phone>

        {/* ============ 3. DETAIL ============ */}
        <Phone>
          <div className="topbar">
            <span style={{ fontSize: 20 }}>‹</span>
            <b>รายละเอียดสินค้า</b>
            <span
              style={{ fontSize: 20, color: PINK, cursor: "pointer" }}
              onClick={() => setFav(!fav)}
            >
              {fav ? "♥" : "♡"}
            </span>
          </div>

          <div className="detail-hero">
            <span className="berry b1">🍓</span>
            <span className="leaf l1">🍃</span>
            <Cup color="#f48fb1" size={140} />
          </div>

          <div className="center">
            <h3 className="d-title">สตรอว์เบอร์รีปั่น</h3>
            <div className="big-price">฿{unit}</div>
            <p className="desc">
              สตรอว์เบอร์รีสด ปั่นเนียนนุ่ม
              <br />
              หอม หวาน อร่อย สดชื่น
            </p>
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
                <span>฿{s.price}</span>
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

          <button className="cta add" onClick={addToCart}>
            🧺 เพิ่มลงตะกร้า
          </button>
        </Phone>

        {/* ============ 4. CART ============ */}
        <Phone footer={<TabBar active={2} cartCount={count} />}>
          <div className="topbar">
            <span style={{ fontSize: 20 }}>‹</span>
            <b>ตะกร้าสินค้า</b>
            <span
              style={{ fontSize: 18, cursor: "pointer" }}
              onClick={() => setCart([])}
            >
              🗑
            </span>
          </div>

          <div className="cart-list">
            {cart.length === 0 && <p className="empty">ยังไม่มีสินค้าในตะกร้า</p>}
            {cart.map((i) => (
              <div className="cart-item" key={i.id}>
                <div className="thumb">
                  <Cup color={i.color} size={44} />
                </div>
                <div className="info">
                  <b>{i.name}</b>
                  <small>ขนาด {i.size}</small>
                  <span className="unit">฿{i.price}</span>
                  <div className="row">
                    <div className="stepper sm">
                      <button onClick={() => changeQty(i.id, -1)}>−</button>
                      <b>{i.qty}</b>
                      <button onClick={() => changeQty(i.id, 1)}>+</button>
                    </div>
                    <span className="line-price">฿{i.price * i.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-row">
            <b>รวมทั้งหมด</b>
            <span className="total">฿{total}</span>
          </div>

          <button className="cta pay">💳 สั่งซื้อเลย</button>
          <button className="ghost">เลือกเมนูเพิ่มเติม</button>

        </Phone>
      </div>
    </main>
  );
}

/* ---------- styles ---------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Prompt:wght@400;500;600;700&display=swap');
*{box-sizing:border-box}
body{margin:0;background:#fff}
.wrap{min-height:100vh;padding:32px 16px;font-family:'Prompt',sans-serif;color:#4a1d33;background:#fff;display:flex;justify-content:center}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,300px));gap:28px 32px;justify-content:center}
@media(max-width:700px){.grid{grid-template-columns:minmax(0,300px)}}

.phone{position:relative;width:300px;height:620px;border-radius:36px;border:2px solid #f3b6cb;overflow:hidden;
 background:linear-gradient(180deg,#fff 0%,#fff3f7 60%,#fde4ec 100%);box-shadow:0 8px 24px rgba(214,58,122,.15);display:flex;flex-direction:column;padding:0}
.status{display:flex;justify-content:space-between;font-size:11px;padding:12px 24px 6px;color:#222}
.body{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;padding:0 16px 14px;scrollbar-width:none}
.body::-webkit-scrollbar{display:none}
.body.has-tab{padding-bottom:70px}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:8px 2px 10px}
.logo-sm{margin:0;font-family:'Mali',cursive;font-size:24px;color:${PINK};font-weight:700}

/* splash */
.splash{flex:1;display:flex;flex-direction:column;align-items:center;position:relative;margin:0 -16px -14px;padding:10px 16px 0;
 background:radial-gradient(circle at 50% 30%,#ffe3ec,#f9bfd2)}
.splash-cup{position:relative;margin-top:24px}
.logo{font-family:'Mali',cursive;font-size:44px;font-weight:700;color:#7a1f48;margin:14px 0 0;line-height:1;text-shadow:2px 2px 0 #fff}
.logo span{font-size:26px}
.slogan{font-family:'Mali',cursive;font-weight:600;margin:10px 0 24px;font-size:16px;color:#4a1d33}
.wave{position:absolute;left:0;right:0;bottom:0;height:90px;background:#f7a8c2;border-radius:50% 50% 0 0/40px 40px 0 0;opacity:.6;z-index:0}
.cta{position:relative;z-index:1;width:100%;border:0;border-radius:999px;padding:14px 18px;color:#fff;font:600 15px 'Prompt',sans-serif;
 background:linear-gradient(90deg,${PINK},${PINK_DARK});display:flex;justify-content:center;align-items:center;gap:14px;cursor:pointer;box-shadow:0 6px 14px rgba(214,58,122,.35)}
.cta:active{transform:scale(.98)}
.berry{position:absolute;font-size:34px;z-index:2}
.berry.b1{right:-24px;bottom:6px}
.berry.b2{left:-22px;bottom:30px;font-size:28px}
.leaf{position:absolute;font-size:26px}
.leaf.l1{right:-34px;top:20px}

/* home */
.banner{position:relative;border-radius:16px;height:110px;overflow:hidden;background:linear-gradient(110deg,#f9b9cf,#ffe0b8 55%,#fff);display:flex;align-items:center;justify-content:space-between;padding:0 10px}
.bottles{display:flex;gap:0;align-items:flex-end;margin-top:14px}
.banner-text{font-family:'Mali',cursive;color:#7a1f48;font-weight:700;font-size:15px;text-align:right;line-height:1.3}
.banner-text p{margin:0}
.dots{display:flex;gap:5px;justify-content:center;margin:8px 0 6px}
.dots i{width:6px;height:6px;border-radius:50%;background:#e7c0cf;cursor:pointer}
.dots i.on{background:${PINK}}
.sec-head{display:flex;justify-content:space-between;font-size:13px;margin:4px 0 8px}
.sec-head a{color:${PINK};font-size:11px}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:#fff;border-radius:16px;padding:8px 6px 10px;text-align:center;border:1px solid #fbd7e3;box-shadow:0 3px 8px rgba(214,58,122,.08)}
.card-img{position:relative;display:flex;justify-content:center;background:${PINK_LIGHT};border-radius:12px;padding-top:6px;height:92px;overflow:hidden}
.deco{position:absolute;left:6px;bottom:4px;font-size:16px}
.card-name{font-size:11px;margin:6px 0 4px;font-weight:500}
.price-pill{display:inline-block;background:${PINK_LIGHT};color:${PINK};font-weight:700;font-size:11px;padding:2px 12px;border-radius:999px}
.tabbar{position:absolute;left:0;right:0;bottom:0;background:#fff;display:flex;justify-content:space-around;padding:8px 6px 12px;border-top:1px solid #fbd7e3}
.tab{display:flex;flex-direction:column;align-items:center;color:#8a6a78;font-size:10px;gap:1px}
.tab.on{color:${PINK};font-weight:600}
.badge{position:absolute;top:-6px;right:-8px;background:${PINK};color:#fff;font-style:normal;font-size:9px;min-width:15px;height:15px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-family:'Prompt'}

/* detail */
.detail-hero{position:relative;display:flex;justify-content:center;align-items:center;height:170px;margin:0 20px;background:radial-gradient(circle,#ffe0ea,#fff0f5 70%);border-radius:50%}
.center{text-align:center}
.d-title{font-size:20px;margin:6px 0 4px;color:#7a1f48}
.big-price{display:inline-block;background:#f9c5d8;color:${PINK_DARK};font-weight:700;font-size:20px;padding:0 22px;border-radius:999px}
.desc{font-size:11px;margin:6px 0 6px;line-height:1.5}
.label{font-size:12px;font-weight:600;margin-bottom:6px;color:#7a1f48}
.sizes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.size{position:relative;background:#fff;border:1.5px solid #f3c9d8;border-radius:12px;padding:6px 2px;display:flex;flex-direction:column;align-items:center;font-family:'Prompt';cursor:pointer;color:#4a1d33}
.size b{font-size:16px}
.size small{font-size:9px;color:#8a6a78}
.size span{font-size:12px;font-weight:600}
.size.on{background:#fde1ec;border-color:${PINK}}
.tick{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:${PINK};color:#fff;font-style:normal;font-size:11px;display:flex;align-items:center;justify-content:center}
.qty-row{display:flex;justify-content:space-between;align-items:center;margin:10px 0 8px;font-size:12px;font-weight:600;color:#7a1f48}
.stepper{display:flex;align-items:center;gap:12px}
.stepper button{width:26px;height:26px;border-radius:50%;border:0;background:#fbd7e3;color:${PINK};font-size:16px;cursor:pointer;line-height:1}
.stepper button:last-child{background:${PINK};color:#fff}
.stepper b{min-width:14px;text-align:center}
.add{margin-top:auto}

/* cart */
.cart-list{display:flex;flex-direction:column;gap:10px;margin-top:6px;min-height:190px}
.empty{text-align:center;color:#8a6a78;font-size:12px;margin-top:60px}
.cart-item{display:flex;gap:10px;background:#fff;border:1px solid #fbd7e3;border-radius:16px;padding:8px}
.thumb{width:62px;height:76px;border-radius:12px;background:${PINK_LIGHT};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.info{flex:1;display:flex;flex-direction:column;position:relative}
.info b{font-size:12px;color:#7a1f48}
.info small{font-size:10px;color:#8a6a78;margin-bottom:2px}
.info .unit{font-size:12px;font-weight:700;color:#7a1f48}
.row{display:flex;justify-content:space-between;align-items:center;margin-top:4px}
.stepper.sm{gap:6px}
.stepper.sm button{width:20px;height:20px;font-size:12px;background:#fbd7e3;color:${PINK}}
.stepper.sm button:last-child{background:#fbd7e3;color:${PINK}}
.line-price{font-weight:700;font-size:13px;color:${PINK_DARK}}
.total-row{display:flex;justify-content:space-between;align-items:center;margin:auto 0 10px;font-size:14px}
.total{font-size:22px;font-weight:700;color:${PINK}}
.pay{margin-bottom:8px}
.ghost{width:100%;border:1.5px solid ${PINK};background:#fff;color:${PINK_DARK};border-radius:999px;padding:11px;font:500 13px 'Prompt';cursor:pointer;margin-bottom:6px}
`;