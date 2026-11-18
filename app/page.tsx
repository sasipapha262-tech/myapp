
"use client";

import { useEffect, useMemo, useState } from "react";

type Page = "home" | "detail" | "cart" | "favorite" | "profile";
type Size = "S" | "M" | "L";

type Drink = {
  id: number;
  name: string;
  eng: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

type CartItem = {
  id: string;
  drink: Drink;
  size: Size;
  qty: number;
};

const drinks: Drink[] = [
  {
    id: 1,
    name: "สตรอว์เบอร์รีปั่น",
    eng: "Strawberry Smoothie",
    price: 45,
    category: "ผลไม้",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700",
    description: "สตรอว์เบอร์รีสด ปั่นเนื้อเนียน หวานอมเปรี้ยว สดชื่นทุกแก้ว"
  },
  {
    id: 2,
    name: "มะม่วงปั่น",
    eng: "Mango Smoothie",
    price: 55,
    category: "ผลไม้",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=700",
    description: "มะม่วงหอมหวาน ปั่นสดใหม่ทุกวัน"
  },
  {
    id: 3,
    name: "ส้มปั่น",
    eng: "Orange Smoothie",
    price: 45,
    category: "ผลไม้",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700",
    description: "ส้มสด รสชาติเปรี้ยวหวาน สดชื่น"
  },
  {
    id: 4,
    name: "โกโก้ปั่น",
    eng: "Chocolate Smoothie",
    price: 50,
    category: "โกโก้",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700",
    description: "โกโก้เข้มข้น หอมมัน กลมกล่อม"
  },
  {
    id: 5,
    name: "ชาเขียวปั่น",
    eng: "Green Tea",
    price: 50,
    category: "ชา",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=700",
    description: "ชาเขียวหอมละมุน ผสมนมสด"
  },
  {
    id: 6,
    name: "นมสดปั่น",
    eng: "Fresh Milk",
    price: 40,
    category: "นมสด",
    image: "https://images.unsplash.com/photo-1568909344668-6f14a07b56ea?w=700",
    description: "นมสดหอมมัน รสชาติละมุน"
  }
];

const categories = ["ทั้งหมด", "ผลไม้", "นมสด", "ชา", "โกโก้"];
const sizes: Size[] = ["S", "M", "L"];
const extra: Record<Size, number> = { S: 0, M: 5, L: 10 };
const money = (n: number) => `฿${n.toLocaleString("th-TH")}`;

export default function Page() {
  const [page, setPage] = useState<Page>("home");
  const [category, setCategory] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Drink>(drinks[0]);
  const [size, setSize] = useState<Size>("M");
  const [qty, setQty] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [checkout, setCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [toast, setToast] = useState("");

  // โหลดข้อมูลที่เคยบันทึก
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("punfin-cart");
      const savedFav = localStorage.getItem("punfin-favorites");

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFav) setFavorites(JSON.parse(savedFav));
    } catch {
      localStorage.removeItem("punfin-cart");
      localStorage.removeItem("punfin-favorites");
    }
    setLoaded(true);
  }, []);

  // บันทึกข้อมูลลงเครื่อง
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("punfin-cart", JSON.stringify(cart));
    localStorage.setItem("punfin-favorites", JSON.stringify(favorites));
  }, [cart, favorites, loaded]);

  const shown = useMemo(() => {
    return drinks.filter((d) => {
      const matchCategory =
        category === "ทั้งหมด" || d.category === category;
      const matchSearch =
        `${d.name} ${d.eng}`.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const total = cart.reduce(
    (sum, item) =>
      sum + (item.drink.price + extra[item.size]) * item.qty,
    0
  );

  function notify(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2500);
  }

  function openDrink(drink: Drink) {
    setSelected(drink);
    setSize("M");
    setQty(1);
    setPage("detail");
  }

  function toggleFavorite(id: number) {
    setFavorites((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : [...old, id]
    );
    notify(
      favorites.includes(id)
        ? "นำออกจากเมนูโปรดแล้ว"
        : "เพิ่มเมนูโปรดแล้ว ❤️"
    );
  }

  function addCart() {
    const id = `${selected.id}-${size}`;

    setCart((old) => {
      const found = old.find((item) => item.id === id);

      if (found) {
        return old.map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [
        ...old,
        { id, drink: selected, size, qty }
      ];
    });

    setPage("cart");
    notify("เพิ่มสินค้าในตะกร้าแล้ว 🛒");
  }

  function updateQty(id: string, amount: number) {
    setCart((old) =>
      old
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function placeOrder() {
    if (!customer.trim()) {
      notify("กรุณากรอกชื่อผู้สั่งซื้อ");
      return;
    }

    if (!/^0[0-9]{9}$/.test(phone)) {
      notify("กรุณากรอกเบอร์โทรศัพท์ 10 หลัก");
      return;
    }

    if (cart.length === 0) return;

    setCart([]);
    setCheckout(false);
    setSuccess(true);
  }

  return (
    <main className="min-h-screen bg-[#fff0f5] p-3 text-[#593246] sm:p-8">

      <div className="mx-auto max-w-[450px] overflow-hidden rounded-[32px] bg-white shadow-2xl">

        {/* HEADER */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-pink-100 bg-white px-5 py-4">
          <button onClick={() => setPage("home")}
            className="text-2xl text-pink-600">
            ☰
          </button>

          <button onClick={() => setPage("home")}
            className="text-2xl font-black text-pink-600">
            ปั่นฟินๆ 🥤
          </button>

          <button onClick={() => setPage("cart")}
            className="relative text-2xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-pink-600 px-2 text-xs text-white">
                {cartCount}
              </span>
            )}
          </button>
        </header>

        {/* HOME */}
        {page === "home" && (
          <section className="min-h-[680px] p-4">

            <div className="relative flex h-52 overflow-hidden rounded-[28px] bg-gradient-to-br from-pink-200 via-rose-100 to-orange-100 p-5">
              <div className="relative z-10 flex w-3/5 flex-col justify-center">
                <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-pink-600">
                  FRESH EVERY DAY
                </span>
                <h2 className="mt-3 text-3xl font-black leading-tight text-pink-900">
                  สดชื่นได้ทุกวัน
                </h2>
                <p className="mt-2 text-sm text-pink-800">
                  ปั่นสดใหม่ ใส่ใจทุกแก้ว ♡
                </p>
              </div>
              <img
                src={drinks[0].image}
                alt="สตรอว์เบอร์รีปั่น"
                className="absolute right-0 h-full w-2/5 object-cover"
              />
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-black">ค้นหาเมนู 🔍</h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาเครื่องดื่มที่ชอบ..."
                className="mt-3 w-full rounded-full border border-pink-100 bg-pink-50 px-5 py-3 text-sm outline-none focus:border-pink-500"
              />
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                    category === c
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                      : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mb-3 mt-5 flex justify-between">
              <h2 className="text-lg font-black">เมนูแนะนำ 🥤</h2>
              <span className="text-xs text-pink-400">
                {shown.length} เมนู
              </span>
            </div>

            {shown.length === 0 ? (
              <div className="rounded-2xl bg-pink-50 p-8 text-center">
                ไม่พบเมนูที่ค้นหา
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {shown.map((d) => (
                  <article key={d.id}
                    className="overflow-hidden rounded-[22px] border border-pink-100 bg-[#fff8fa] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                    <button onClick={() => openDrink(d)}
                      className="w-full text-left">
                      <img src={d.image} alt={d.name}
                        className="h-32 w-full object-cover" />
                      <div className="p-3">
                        <h3 className="font-black">{d.name}</h3>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {d.eng}
                        </p>
                        <p className="mt-2 font-black text-pink-600">
                          {money(d.price)}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center justify-between px-3 pb-3">
                      <button
                        onClick={() => toggleFavorite(d.id)}
                        className="text-xl">
                        {favorites.includes(d.id) ? "❤️" : "♡"}
                      </button>
                      <button
                        onClick={() => openDrink(d)}
                        className="rounded-full bg-pink-600 px-3 py-2 text-xs font-bold text-white hover:bg-pink-700">
                        เลือกเมนู +
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* DETAIL */}
        {page === "detail" && (
          <section className="min-h-[680px] p-5">
            <button onClick={() => setPage("home")}
              className="mb-4 font-bold text-pink-600">
              ← กลับหน้าหลัก
            </button>

            <img src={selected.image} alt={selected.name}
              className="h-64 w-full rounded-[28px] object-cover" />

            <div className="mt-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{selected.name}</h2>
                <p className="text-sm text-gray-400">{selected.eng}</p>
              </div>
              <button onClick={() => toggleFavorite(selected.id)}
                className="text-3xl">
                {favorites.includes(selected.id) ? "❤️" : "♡"}
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {selected.description}
            </p>

            <h3 className="mb-3 mt-6 font-black">เลือกขนาดแก้ว</h3>

            <div className="grid grid-cols-3 gap-3">
              {sizes.map((s) => (
                <button key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-2xl border p-4 transition ${
                    size === s
                      ? "border-pink-500 bg-pink-100 text-pink-700"
                      : "border-pink-100 hover:bg-pink-50"
                  }`}>
                  <b className="text-lg">{s}</b>
                  <p className="mt-1 text-xs">
                    {money(selected.price + extra[s])}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <b>จำนวนแก้ว</b>
              <div className="flex items-center gap-5 rounded-full bg-pink-50 px-5 py-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <b>{qty}</b>
                <button onClick={() => setQty(qty + 1)}
                  className="text-pink-600">＋</button>
              </div>
            </div>

            <button onClick={addCart}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-pink-500 to-pink-700 p-4 font-black text-white shadow-lg shadow-pink-200 hover:scale-[1.02]">
              🛒 เพิ่มลงตะกร้า · {money((selected.price + extra[size]) * qty)}
            </button>
          </section>
        )}

        {/* CART */}
        {page === "cart" && (
          <section className="min-h-[680px] p-5">
            <h2 className="mb-5 text-xl font-black">🛒 ตะกร้าสินค้า</h2>

            {cart.length === 0 ? (
              <div className="rounded-[28px] bg-pink-50 p-10 text-center">
                <div className="text-6xl">🛍️</div>
                <h3 className="mt-4 font-black">ยังไม่มีสินค้า</h3>
                <p className="mt-2 text-sm text-gray-400">
                  เลือกเครื่องดื่มที่ชอบกันเลย
                </p>
                <button onClick={() => setPage("home")}
                  className="mt-5 rounded-full bg-pink-600 px-6 py-3 font-bold text-white">
                  เลือกเมนู
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <article key={item.id}
                    className="mb-4 flex gap-3 rounded-2xl bg-pink-50 p-3">
                    <img src={item.drink.image}
                      alt={item.drink.name}
                      className="h-24 w-24 rounded-xl object-cover" />

                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <b className="text-sm">{item.drink.name}</b>
                        <button
                          onClick={() => setCart(old => old.filter(x => x.id !== item.id))}
                          className="text-xs text-red-400">
                          ลบ
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        ขนาด {item.size}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full bg-white px-3 py-1">
                          <button onClick={() => updateQty(item.id, -1)}>−</button>
                          <b>{item.qty}</b>
                          <button onClick={() => updateQty(item.id, 1)}>＋</button>
                        </div>
                        <b className="text-sm text-pink-600">
                          {money((item.drink.price + extra[item.size]) * item.qty)}
                        </b>
                      </div>
                    </div>
                  </article>
                ))}

                <div className="rounded-2xl bg-[#fff4f7] p-5">
                  <div className="flex justify-between text-sm">
                    <span>จำนวนสินค้า</span>
                    <b>{cartCount} แก้ว</b>
                  </div>
                  <div className="mt-4 flex justify-between border-t border-pink-200 pt-4">
                    <b>ยอดรวมทั้งหมด</b>
                    <b className="text-2xl text-pink-600">{money(total)}</b>
                  </div>
                </div>

                <button onClick={() => setCheckout(true)}
                  className="mt-5 w-full rounded-full bg-pink-600 p-4 font-black text-white shadow-lg shadow-pink-200">
                  ยืนยันคำสั่งซื้อ →
                </button>

                <button onClick={() => setPage("home")}
                  className="mt-3 w-full rounded-full border border-pink-300 p-3 font-bold text-pink-600">
                  เลือกเมนูเพิ่มเติม
                </button>
              </>
            )}
          </section>
        )}

        {/* FAVORITES */}
        {page === "favorite" && (
          <section className="min-h-[680px] p-5">
            <h2 className="mb-5 text-xl font-black">❤️ เมนูโปรด</h2>

            {favorites.length === 0 ? (
              <div className="rounded-2xl bg-pink-50 p-10 text-center">
                <div className="text-5xl">♡</div>
                <p className="mt-4 font-bold">ยังไม่มีเมนูโปรด</p>
                <p className="mt-2 text-sm text-gray-400">
                  กดหัวใจที่เมนูเพื่อบันทึกได้เลย
                </p>
                <button onClick={() => setPage("home")}
                  className="mt-5 rounded-full bg-pink-600 px-5 py-3 text-white">
                  เลือกเมนู
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {drinks.filter(d => favorites.includes(d.id)).map(d => (
                  <article key={d.id} className="overflow-hidden rounded-2xl bg-pink-50">
                    <button onClick={() => openDrink(d)} className="w-full text-left">
                      <img src={d.image} alt={d.name}
                        className="h-32 w-full object-cover" />
                      <p className="p-3 font-bold">{d.name}</p>
                    </button>
                    <button onClick={() => toggleFavorite(d.id)}
                      className="px-3 pb-3 text-sm text-pink-600">
                      ❤️ นำออกจากรายการ
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <section className="min-h-[680px] p-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-pink-100 text-5xl">
              👤
            </div>
            <h2 className="mt-4 text-2xl font-black">สมาชิกปั่นฟินๆ</h2>
            <p className="mt-2 text-sm text-gray-400">
              ขอบคุณที่เลือกความสดชื่นจากเรา ♡
            </p>

            <div className="mt-8 rounded-3xl bg-pink-50 p-5 text-left">
              <div className="flex justify-between">
                <span>❤️ เมนูโปรด</span>
                <b>{favorites.length} รายการ</b>
              </div>
              <div className="mt-4 flex justify-between">
                <span>🛒 สินค้าในตะกร้า</span>
                <b>{cartCount} แก้ว</b>
              </div>
            </div>

            <button onClick={() => setPage("favorite")}
              className="mt-5 w-full rounded-full border border-pink-500 p-3 font-bold text-pink-600">
              ดูเมนูโปรด
            </button>
          </section>
        )}

        {/* BOTTOM NAV */}
        <nav className="sticky bottom-0 z-20 grid grid-cols-4 border-t border-pink-100 bg-white py-3">
          {[
            { id: "home", icon: "⌂", label: "หน้าหลัก" },
            { id: "favorite", icon: "♡", label: "เมนูโปรด" },
            { id: "cart", icon: "🛒", label: "ตะกร้า" },
            { id: "profile", icon: "♙", label: "โปรไฟล์" }
          ].map((tab) => (
            <button key={tab.id}
              onClick={() => setPage(tab.id as Page)}
              className={`flex flex-col items-center gap-1 text-xs ${
                page === tab.id
                  ? "font-black text-pink-600"
                  : "text-gray-400"
              }`}>
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
              {tab.id === "cart" && cartCount > 0 && (
                <span className="text-[10px]">({cartCount})</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* CHECKOUT MODAL */}
      {checkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">ยืนยันคำสั่งซื้อ</h2>
              <button onClick={() => setCheckout(false)}
                className="text-xl">✕</button>
            </div>

            <label className="mt-5 block text-sm font-bold">ชื่อผู้สั่งซื้อ</label>
            <input value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="กรอกชื่อของคุณ"
              className="mt-2 w-full rounded-xl border border-pink-200 p-3 outline-none focus:border-pink-500" />

            <label className="mt-4 block text-sm font-bold">เบอร์โทรศัพท์</label>
            <input value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              inputMode="numeric"
              placeholder="เบอร์โทรศัพท์ 10 หลัก"
              className="mt-2 w-full rounded-xl border border-pink-200 p-3 outline-none focus:border-pink-500" />

            <div className="mt-5 flex justify-between border-t border-pink-100 pt-4">
              <b>ยอดชำระ</b>
              <b className="text-xl text-pink-600">{money(total)}</b>
            </div>

            <button onClick={placeOrder}
              className="mt-5 w-full rounded-full bg-pink-600 p-4 font-bold text-white hover:bg-pink-700">
              ยืนยันสั่งซื้อ
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-4 text-2xl font-black text-pink-600">
              สั่งซื้อสำเร็จ!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              ขอบคุณที่อุดหนุนร้านปั่นฟินๆ
            </p>
            <button onClick={() => {
              setSuccess(false);
              setCustomer("");
              setPhone("");
              setPage("home");
            }}
              className="mt-6 w-full rounded-full bg-pink-600 p-3 font-bold text-white">
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status"
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#593246] px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
          <button onClick={() => setToast("")} className="ml-3 text-pink-200">
            ✕
          </button>
        </div>
      )}
    </main>
  );
}
