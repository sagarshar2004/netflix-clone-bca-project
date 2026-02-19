/* ========================= 
   NETFLIX CLONE - browse.js (FINAL FIXED)
========================= */

/* =========================
   HERO SLIDER (6 trailers)
========================= */
const slides = [
  { id:"st",   title:"Stranger Things", desc:"Watch Season 4 Now",          video:"videos/stranger.mp4",  youtube:"https://www.youtube.com/watch?v=b9EkMc79ZSU", poster:"posters/stranger.jpg" },
  { id:"mh",   title:"Money Heist",     desc:"The Professor's Master Plan", video:"videos/money.mp4",     youtube:"https://www.youtube.com/watch?v=_InqQJRqGW4", poster:"posters/moneyheist.jpg" },
  { id:"wed",  title:"Wednesday",       desc:"Dark Comedy Series",          video:"videos/wednesday.mp4", youtube:"https://www.youtube.com/watch?v=Di310WS8zLk", poster:"posters/wednesday.jpg" },
  { id:"sq",   title:"Squid Game",      desc:"Deadly Survival Game",        video:"videos/squid.mp4",     youtube:"https://www.youtube.com/watch?v=oqxAJKy0ii4", poster:"posters/squidgame.jpg" },
  { id:"wit",  title:"The Witcher",     desc:"Monster Hunter Saga",         video:"videos/witcher.mp4",   youtube:"https://www.youtube.com/watch?v=ndl1W4ltcmg", poster:"posters/witcher.jpg" },
  { id:"dark", title:"Dark",            desc:"Time Travel Mystery",         video:"videos/dark.mp4",      youtube:"https://www.youtube.com/watch?v=rrwycJ08PSA", poster:"posters/dark.jpg" }
];

let index = 0;

const videoEl  = document.getElementById("bgVideo");
const sourceEl = document.getElementById("bgSource"); // (optional)
const titleEl  = document.getElementById("heroTitle");
const descEl   = document.getElementById("heroDesc");

if (videoEl) videoEl.style.transition = "opacity 0.4s ease";

/* =========================
   AUTO SLIDE
========================= */
let slideInterval = null;

function startAutoSlide(){
  stopAutoSlide();
  slideInterval = setInterval(() => nextSlide(), 6000);
}
function stopAutoSlide(){
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = null;
}

/* =========================
   SHOW SLIDE (FADE)
========================= */
function setVideoSrc(src){
  if (!videoEl) return;

  // safer: update <source> if present
  if (sourceEl){
    sourceEl.src = src;
    videoEl.load();
  } else {
    videoEl.src = src;
    videoEl.load();
  }

  const p = videoEl.play();
  if (p) p.catch(()=>{});
}

function showSlide(i){
  if (!videoEl) return;
  const s = slides[i];

  videoEl.style.opacity = 0;

  setTimeout(() => {
    setVideoSrc(s.video);

    if (titleEl) titleEl.textContent = s.title;
    if (descEl)  descEl.textContent  = s.desc;

    videoEl.style.opacity = 1;
  }, 250);
}

function nextSlide(){
  index = (index + 1) % slides.length;
  showSlide(index);
}
function prevSlide(){
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

/* =========================
   MY LIST (single storage)
========================= */
const MYLIST_KEY = "myListItems";

function getMyList(){
  return JSON.parse(localStorage.getItem(MYLIST_KEY) || "[]");
}
function setMyList(items){
  localStorage.setItem(MYLIST_KEY, JSON.stringify(items));
}
function isInMyList(id){
  return getMyList().some(x => x.id === id);
}
function addToMyList(item){
  const list = getMyList();
  if(!list.some(x => x.id === item.id)){
    list.push(item);
    setMyList(list);
    alert(item.title + " added to My List ✅");
  } else {
    alert(item.title + " already in My List ✅");
  }
}
function removeFromMyList(id){
  setMyList(getMyList().filter(x => x.id !== id));
}

/* =========================
   CONTINUE WATCHING
========================= */
const CW_KEY = "continueWatching";

function getCW(){
  return JSON.parse(localStorage.getItem(CW_KEY) || "[]");
}
function setCW(items){
  localStorage.setItem(CW_KEY, JSON.stringify(items));
}

// add/update on top (max 12)
function addToCW(item){
  const list = getCW().filter(x => x.id !== item.id);

  const old = getCW().find(x => x.id === item.id);
  const progress = old?.progress ?? (Math.floor(Math.random() * 80) + 10);

  list.unshift({
    ...item,
    lastWatched: Date.now(),
    progress
  });

  setCW(list.slice(0, 12));
}

function renderCW(){
  const section = document.getElementById("continueSection");
  const row = document.getElementById("continueRow");
  if(!section || !row) return;

  const list = getCW();
  row.innerHTML = "";

  if(list.length === 0){
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  list.forEach(item => {
    const p = document.createElement("div");
    p.className = "poster";

    const prog = (typeof item.progress === "number") ? item.progress : 20;

    p.innerHTML = `
      <img src="${item.poster}" alt="${item.title}">
      <div class="progressBar">
        <div class="progressFill" style="width:${prog}%"></div>
      </div>
      <button class="addBtn">▶ Resume</button>
    `;

    const open = () => {
      if(window.__draggingRow) return;
      window.open(item.youtube, "_blank");
      addToCW(item);
      renderCW();
    };

    p.addEventListener("click", open);
    p.querySelector(".addBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      open();
    });

    row.appendChild(p);
  });
}

/* =========================
   CATEGORIES (6 × 10)
========================= */
const CATEGORIES = [
  {
    name:"Trending Now",
    items:[
      {id:"st",    title:"Stranger Things", category:"Trending Now", poster:"posters/stranger.jpg",     youtube:"https://www.youtube.com/watch?v=b9EkMc79ZSU", desc:"Mystery • Sci-Fi • Horror vibes"},
      {id:"mh",    title:"Money Heist",     category:"Trending Now", poster:"posters/moneyheist.jpg",   youtube:"https://www.youtube.com/watch?v=_InqQJRqGW4", desc:"Heist • Thriller • Spanish"},
      {id:"wed",   title:"Wednesday",       category:"Trending Now", poster:"posters/wednesday.jpg",   youtube:"https://www.youtube.com/watch?v=Di310WS8zLk", desc:"Dark comedy • Mystery"},
      {id:"sq",    title:"Squid Game",      category:"Trending Now", poster:"posters/squidgame.jpg",   youtube:"https://www.youtube.com/watch?v=oqxAJKy0ii4", desc:"Survival • Thriller"},
      {id:"wit",   title:"The Witcher",     category:"Trending Now", poster:"posters/witcher.jpg",     youtube:"https://www.youtube.com/watch?v=ndl1W4ltcmg", desc:"Fantasy • Action"},
      {id:"dark",  title:"Dark",            category:"Trending Now", poster:"posters/dark.jpg",        youtube:"https://www.youtube.com/watch?v=rrwycJ08PSA", desc:"Time travel • Mystery"},
      {id:"nar",   title:"Narcos",          category:"Trending Now", poster:"posters/narcos.jpg",      youtube:"https://www.youtube.com/watch?v=xl8zdCY-abw", desc:"Crime • Drama"},
      {id:"luc",   title:"Lucifer",         category:"Trending Now", poster:"posters/lucifer.jpg",     youtube:"https://www.youtube.com/watch?v=X4bF_quwNtw", desc:"Fantasy • Crime"},
      {id:"bb",    title:"Breaking Bad",    category:"Trending Now", poster:"posters/breakingbad.jpg", youtube:"https://www.youtube.com/watch?v=HhesaQXLuRY", desc:"Crime • Drama"},
      {id:"pk",    title:"Peaky Blinders",  category:"Trending Now", poster:"posters/peaky.jpg",       youtube:"https://www.youtube.com/watch?v=oVzVdvGIC7U", desc:"Gangster • Drama"},
    ]
  },

  {
    name:"Action",
    items:[
      {id:"jw",    title:"John Wick",          category:"Action", poster:"posters/johnwick.jpg",     youtube:"https://www.youtube.com/watch?v=2AUmvWm5ZDQ", desc:"Gun-fu • Revenge"},
      {id:"ext",   title:"Extraction",         category:"Action", poster:"posters/extraction.jpg",   youtube:"https://www.youtube.com/watch?v=L6P3nI6VnlY", desc:"Rescue mission"},
      {id:"6u",    title:"6 Underground",      category:"Action", poster:"posters/6underground.jpg", youtube:"https://www.youtube.com/watch?v=YLE85olJjp8", desc:"High-octane action"},
      {id:"mad",   title:"Mad Max",            category:"Action", poster:"posters/madmax.jpg",       youtube:"https://www.youtube.com/watch?v=hEJnMQG9ev8", desc:"Apocalypse chase"},
      {id:"mi",    title:"Mission Impossible", category:"Action", poster:"posters/mi.jpg",           youtube:"https://www.youtube.com/watch?v=XiHiW4N7-bo", desc:"Spy action"},
      {id:"fast",  title:"Fast & Furious",     category:"Action", poster:"posters/fast.jpg",         youtube:"https://www.youtube.com/watch?v=uisBaTkQAEs", desc:"Cars • Action"},
      {id:"bond",  title:"James Bond",         category:"Action", poster:"posters/bond.jpg",         youtube:"https://www.youtube.com/watch?v=BIhNsAtPbPI", desc:"Spy thriller"},
      {id:"rrr",   title:"RRR",                category:"Action", poster:"posters/rrr.jpg",          youtube:"https://www.youtube.com/watch?v=GY4BgdUSpbE", desc:"Indian epic action"},
      {id:"kgf",   title:"KGF",                category:"Action", poster:"posters/kgf.jpg",          youtube:"https://www.youtube.com/watch?v=qXgF-iJ_ezE", desc:"Mass action"},
      {id:"dhoom", title:"Dhoom",              category:"Action", poster:"posters/dhoom.jpg",        youtube:"https://www.youtube.com/watch?v=0n3u0tA5c1o", desc:"Chase • Heist"},
    ]
  },

  {
    name:"Sci-Fi",
    items:[
      {id:"int",     title:"Interstellar",      category:"Sci-Fi", poster:"posters/interstellar.jpg", youtube:"https://www.youtube.com/watch?v=zSWdZVtXT7E", desc:"Space • Time"},
      {id:"inc",     title:"Inception",         category:"Sci-Fi", poster:"posters/inception.jpg",    youtube:"https://www.youtube.com/watch?v=YoHD9XEInc0", desc:"Dream heist"},
      {id:"mat",     title:"The Matrix",        category:"Sci-Fi", poster:"posters/matrix.jpg",       youtube:"https://www.youtube.com/watch?v=vKQi3bBA1y8", desc:"Simulation"},
      {id:"ava",     title:"Avatar",            category:"Sci-Fi", poster:"posters/avatar.jpg",       youtube:"https://www.youtube.com/watch?v=5PSNL1qE6VY", desc:"Pandora"},
      {id:"blade",   title:"Blade Runner 2049", category:"Sci-Fi", poster:"posters/bladerunner.jpg",  youtube:"https://www.youtube.com/watch?v=gCcx85zbxz4", desc:"Neo noir sci-fi"},
      {id:"ten",     title:"Tenet",             category:"Sci-Fi", poster:"posters/tenet.jpg",        youtube:"https://www.youtube.com/watch?v=LdOM0x0XDMo", desc:"Time inversion"},
      {id:"dune",    title:"Dune",              category:"Sci-Fi", poster:"posters/dune.jpg",         youtube:"https://www.youtube.com/watch?v=n9xhJrPXop4", desc:"Desert planet"},
      {id:"arrival", title:"Arrival",           category:"Sci-Fi", poster:"posters/arrival.jpg",      youtube:"https://www.youtube.com/watch?v=tFMo3UJ4B4g", desc:"Aliens • Language"},
      {id:"gravity", title:"Gravity",           category:"Sci-Fi", poster:"posters/gravity.jpg",      youtube:"https://www.youtube.com/watch?v=OiTiKOy59o4", desc:"Space survival"},
      {id:"edge",    title:"Edge of Tomorrow",  category:"Sci-Fi", poster:"posters/edge.jpg",         youtube:"https://www.youtube.com/watch?v=vw61gCe2oqI", desc:"Time loop"},
    ]
  },

  {
    name:"Drama",
    items:[
      {id:"bb2",      title:"Breaking Bad",   category:"Drama", poster:"posters/breakingbad.jpg", youtube:"https://www.youtube.com/watch?v=HhesaQXLuRY", desc:"Crime drama"},
      {id:"pk2",      title:"Peaky Blinders", category:"Drama", poster:"posters/peaky.jpg",       youtube:"https://www.youtube.com/watch?v=oVzVdvGIC7U", desc:"Gangster drama"},
      {id:"crown",    title:"The Crown",      category:"Drama", poster:"posters/crown.jpg",       youtube:"https://www.youtube.com/watch?v=JWtnJjn6ng0", desc:"Royal drama"},
      {id:"ozark",    title:"Ozark",          category:"Drama", poster:"posters/ozark.jpg",       youtube:"https://www.youtube.com/watch?v=5hAXVqrljbs", desc:"Crime thriller"},
      {id:"house",    title:"House of Cards", category:"Drama", poster:"posters/houseofcards.jpg",youtube:"https://www.youtube.com/watch?v=8QnMmpfKWvo", desc:"Politics drama"},
      {id:"suits",    title:"Suits",          category:"Drama", poster:"posters/suits.jpg",       youtube:"https://www.youtube.com/watch?v=85z53bAebsI", desc:"Legal drama"},
      {id:"you",      title:"You",            category:"Drama", poster:"posters/you.jpg",         youtube:"https://www.youtube.com/watch?v=srx7fSBwvF4", desc:"Psychological"},
      {id:"13rw",     title:"13 Reasons Why", category:"Drama", poster:"posters/13rw.jpg",        youtube:"https://www.youtube.com/watch?v=QkT-HIMSrRk", desc:"Teen drama"},
      {id:"elite",    title:"Elite",          category:"Drama", poster:"posters/elite.jpg",       youtube:"https://www.youtube.com/watch?v=QNwhAdrdwp0", desc:"Mystery drama"},
      {id:"vincenzo", title:"Vincenzo",       category:"Drama", poster:"posters/vincenzo.jpg",    youtube:"https://www.youtube.com/watch?v=_J8tYxYB_YU", desc:"K-drama"},
    ]
  },

  {
    name:"Top Picks For You",
    items:[
      {id:"nar2",   title:"Narcos",          category:"Top Picks For You", poster:"posters/narcos.jpg",      youtube:"https://www.youtube.com/watch?v=xl8zdCY-abw", desc:"Crime"},
      {id:"luc2",   title:"Lucifer",         category:"Top Picks For You", poster:"posters/lucifer.jpg",     youtube:"https://www.youtube.com/watch?v=X4bF_quwNtw", desc:"Fantasy"},
      {id:"mind2",  title:"Mindhunter",      category:"Top Picks For You", poster:"posters/mindhunter.jpg",  youtube:"https://www.youtube.com/watch?v=DHJO6VR6TYY", desc:"Serial killers"},
      {id:"money2", title:"Money Heist",     category:"Top Picks For You", poster:"posters/moneyheist.jpg",  youtube:"https://www.youtube.com/watch?v=_InqQJRqGW4", desc:"Heist"},
      {id:"wed2",   title:"Wednesday",       category:"Top Picks For You", poster:"posters/wednesday.jpg",   youtube:"https://www.youtube.com/watch?v=Di310WS8zLk", desc:"Mystery"},
      {id:"witch2", title:"The Witcher",     category:"Top Picks For You", poster:"posters/witcher.jpg",     youtube:"https://www.youtube.com/watch?v=ndl1W4ltcmg", desc:"Fantasy"},
      {id:"dark2",  title:"Dark",            category:"Top Picks For You", poster:"posters/dark.jpg",        youtube:"https://www.youtube.com/watch?v=rrwycJ08PSA", desc:"Time travel"},
      {id:"squid2", title:"Squid Game",      category:"Top Picks For You", poster:"posters/squidgame.jpg",   youtube:"https://www.youtube.com/watch?v=oqxAJKy0ii4", desc:"Thriller"},
      {id:"str2",   title:"Stranger Things", category:"Top Picks For You", poster:"posters/stranger.jpg",    youtube:"https://www.youtube.com/watch?v=b9EkMc79ZSU", desc:"Sci-fi"},
      {id:"bb3",    title:"Breaking Bad",    category:"Top Picks For You", poster:"posters/breakingbad.jpg", youtube:"https://www.youtube.com/watch?v=HhesaQXLuRY", desc:"Drama"},
    ]
  }
];

/* =========================
   POPUP MODAL
========================= */
const modal = document.getElementById("detailsModal");
const closeModalBtn = document.getElementById("closeModal");
const modalPoster = document.getElementById("modalPoster");
const modalTitle  = document.getElementById("modalTitle");
const modalMeta   = document.getElementById("modalMeta");
const modalDesc   = document.getElementById("modalDesc");
const modalPlay   = document.getElementById("modalPlay");
const modalAdd    = document.getElementById("modalAdd");

let currentModalItem = null;

function openModal(item){
  if(!modal){
    window.open(item.youtube, "_blank");
    addToCW(item);
    renderCW();
    return;
  }

  currentModalItem = item;

  if (modalPoster) modalPoster.src = item.poster;
  if (modalTitle)  modalTitle.textContent = item.title;
  if (modalMeta)   modalMeta.textContent  = `${item.category || "Category"} • 2026 • 16+`;
  if (modalDesc)   modalDesc.textContent  = item.desc || "Netflix clone demo item.";

  if (modalAdd) modalAdd.textContent = isInMyList(item.id) ? "✓ In My List" : "+ My List";

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal(){
  if(!modal) return;
  modal.style.display = "none";
  currentModalItem = null;
  document.body.style.overflow = "";
}

if(closeModalBtn) closeModalBtn.onclick = closeModal;

if(modal){
  modal.addEventListener("click", (e) => {
    if(e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});

if(modalPlay){
  modalPlay.onclick = () => {
    if(!currentModalItem) return;
    window.open(currentModalItem.youtube, "_blank");
    addToCW(currentModalItem);
    renderCW();
  };
}

if(modalAdd){
  modalAdd.onclick = () => {
    if(!currentModalItem) return;

    const exists = isInMyList(currentModalItem.id);

    if(exists){
      removeFromMyList(currentModalItem.id);
      modalAdd.textContent = "+ My List";
      alert("Removed from My List ❌");
    } else {
      addToMyList(currentModalItem);
      modalAdd.textContent = "✓ In My List";
    }
  };
}

/* =========================
   RENDER CATEGORIES
========================= */
function renderCategories(){
  const wrap = document.getElementById("categories");
  if(!wrap) return;

  wrap.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const sec = document.createElement("div");
    sec.className = "cat";

    const h2 = document.createElement("h2");
    h2.textContent = cat.name;

    const row = document.createElement("div");
    row.className = "cat-row";

    cat.items.forEach(item => {
      const p = document.createElement("div");
      p.className = "poster";
      p.innerHTML = `
        <img src="${item.poster}" alt="${item.title}">
        <button class="addBtn">+ My List</button>
      `;

      p.addEventListener("click", () => {
        if (window.__draggingRow) return;
        openModal(item);
      });

      p.querySelector(".addBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToMyList(item);
      });

      row.appendChild(p);
    });

    sec.appendChild(h2);
    sec.appendChild(row);
    wrap.appendChild(sec);
  });
}

/* =========================
   DRAG TO SCROLL
========================= */
function enableDragScroll(){
  window.__draggingRow = false;

  document.querySelectorAll(".cat-row, #continueRow").forEach((row) => {
    if(!row) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    row.addEventListener("mousedown", (e) => {
      isDown = true;
      window.__draggingRow = false;
      startX = e.pageX;
      scrollLeft = row.scrollLeft;
      row.style.cursor = "grabbing";
    });

    row.addEventListener("mouseup", () => {
      isDown = false;
      row.style.cursor = "grab";
      setTimeout(() => window.__draggingRow = false, 50);
    });

    row.addEventListener("mouseleave", () => {
      isDown = false;
      row.style.cursor = "grab";
      setTimeout(() => window.__draggingRow = false, 50);
    });

    row.addEventListener("mousemove", (e) => {
      if(!isDown) return;
      e.preventDefault();

      const dx = e.pageX - startX;
      if (Math.abs(dx) > 6) window.__draggingRow = true;

      row.scrollLeft = scrollLeft - dx * 1.3;
    });

    row.style.cursor = "grab";
  });
}

/* =========================
   SEARCH (FIXED: categories hide + no results + CW support)
========================= */
function enableSearch(){
  const searchInput = document.getElementById("search");
  if(!searchInput) return;

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();

    let totalMatches = 0;

    // remove old no results
    const oldNo = document.getElementById("noResults");
    if(oldNo) oldNo.remove();

    // 1) Continue Watching filter
    const cwSection = document.getElementById("continueSection");
    if(cwSection){
      const cwPosters = cwSection.querySelectorAll(".poster");
      let cwMatches = 0;

      cwPosters.forEach(p => {
        const t = (p.querySelector("img")?.alt || "").toLowerCase();
        const ok = q === "" || t.includes(q);
        p.style.display = ok ? "block" : "none";
        if(ok) cwMatches++;
      });

      cwSection.style.display = (getCW().length === 0) ? "none" : (cwMatches > 0 ? "block" : "none");
      totalMatches += cwMatches;
    }

    // 2) All categories filter (hide whole category if empty)
    document.querySelectorAll("#categories .cat").forEach(cat => {
      const posters = cat.querySelectorAll(".poster");
      let catMatches = 0;

      posters.forEach(p => {
        const t = (p.querySelector("img")?.alt || "").toLowerCase();
        const ok = q === "" || t.includes(q);
        p.style.display = ok ? "block" : "none";
        if(ok) catMatches++;
      });

      cat.style.display = catMatches > 0 ? "block" : "none";
      totalMatches += catMatches;
    });

    // 3) No results message
    if(q !== "" && totalMatches === 0){
      const noRes = document.createElement("div");
      noRes.id = "noResults";
      noRes.style.padding = "50px";
      noRes.style.textAlign = "center";
      noRes.style.color = "#aaa";
      noRes.style.fontSize = "20px";
      noRes.innerHTML = "No results found 😢";

      document.getElementById("categories").prepend(noRes);
    }
  });
}

/* =========================
   INIT
========================= */
window.addEventListener("load", () => {
  showSlide(index);
  startAutoSlide();

  renderCategories();
  renderCW();

  enableDragScroll();
  enableSearch();

  const rightArrow = document.getElementById("rightArrow");
  const leftArrow  = document.getElementById("leftArrow");
  const playBtn    = document.getElementById("playBtn");
  const hero       = document.querySelector(".hero");
  const heroListBtn = document.querySelector(".list");

  if(rightArrow) rightArrow.onclick = nextSlide;
  if(leftArrow)  leftArrow.onclick  = prevSlide;

  if(playBtn){
    playBtn.onclick = () => {
      const s = slides[index];
      window.open(s.youtube, "_blank");

      addToCW({
        id: s.id,
        title: s.title,
        category: "Hero",
        poster: s.poster,
        youtube: s.youtube,
        desc: s.desc
      });
      renderCW();
    };
  }

  if(hero){
    hero.addEventListener("mouseenter", stopAutoSlide);
    hero.addEventListener("mouseleave", startAutoSlide);
  }

  if(heroListBtn){
    heroListBtn.addEventListener("click", () => {
      const s = slides[index];
      addToMyList({
        id: s.id,
        title: s.title,
        category: "Hero",
        poster: s.poster,
        youtube: s.youtube,
        desc: s.desc
      });
    });
  }
});
