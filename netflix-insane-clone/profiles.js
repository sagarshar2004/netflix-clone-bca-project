const PROFILES_KEY = "selectedProfile";

// simple demo profiles
const demoProfiles = [
  { id: "p1", name: "Owner", color: "#e50914", letter: "O" },
  { id: "p2", name: "Guest", color: "#1db954", letter: "G" },
  { id: "p3", name: "Kids",  color: "#3b82f6", letter: "K" },
  { id: "p4", name: "User",  color: "#f59e0b", letter: "U" },
];

const wrap = document.getElementById("profiles");
const manageBtn = document.getElementById("manageBtn");

function renderProfiles(){
  wrap.innerHTML = "";

  demoProfiles.forEach(p => {
    const card = document.createElement("div");
    card.className = "profile";

    card.innerHTML = `
      <div class="avatar" style="background:${p.color}22; border-color:${p.color}55;">
        <span style="color:${p.color};">${p.letter}</span>
      </div>
      <p class="name">${p.name}</p>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(p));
      window.location.href = "browse.html"; // ✅ yaha browse page open
    });

    wrap.appendChild(card);
  });
}

renderProfiles();

manageBtn.addEventListener("click", () => {
  alert("Demo: Manage Profiles feature later ✅");
});
