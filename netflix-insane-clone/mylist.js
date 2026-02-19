/* =========================
   MY LIST PAGE (mylist.js)
   Uses same storage key as browse.js: "myListItems"
========================= */

const KEY = "myListItems";

const grid = document.getElementById("myGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("mySearch");
const clearAllBtn = document.getElementById("clearAll");
const refreshBtn = document.getElementById("refreshBtn");

function getList(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function setList(items){
  localStorage.setItem(KEY, JSON.stringify(items));
}

function removeItem(id){
  const list = getList().filter(x => x.id !== id);
  setList(list);
  render();
}

function render(){
  const list = getList();
  const q = (searchInput?.value || "").toLowerCase().trim();

  grid.innerHTML = "";

  // filter by search
  const filtered = q
    ? list.filter(item => (item.title || "").toLowerCase().includes(q))
    : list;

  if(filtered.length === 0){
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card2";

    const poster = item.poster || "https://picsum.photos/600/360?fallback";
    const title  = item.title  || "Untitled";
    const meta   = item.category || "My List";
    const youtube = item.youtube || "";

    card.innerHTML = `
      <img src="${poster}" alt="${title}">
      <div class="card2-body">
        <p class="card2-title">${title}</p>
        <p class="card2-meta">${meta}</p>

        <div class="card2-actions">
          <button class="btn btn-play">▶ Play</button>
          <button class="btn btn-remove">Remove</button>
        </div>
      </div>
    `;

    // Play button
    card.querySelector(".btn-play").addEventListener("click", (e) => {
      e.stopPropagation();
      if(youtube) window.open(youtube, "_blank");
    });

    // Remove button
    card.querySelector(".btn-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      removeItem(item.id);
    });

    // Card click -> also play
    card.addEventListener("click", () => {
      if(youtube) window.open(youtube, "_blank");
    });

    grid.appendChild(card);
  });
}

/* EVENTS */
if(searchInput){
  searchInput.addEventListener("input", render);
}

if(clearAllBtn){
  clearAllBtn.addEventListener("click", () => {
    setList([]);
    render();
  });
}

if(refreshBtn){
  refreshBtn.addEventListener("click", render);
}

/* INIT */
render();
