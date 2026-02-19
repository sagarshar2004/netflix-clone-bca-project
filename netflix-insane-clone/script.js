// Scroll glow effect
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
        navbar.style.background = "black";
    } else {
        navbar.style.background = "rgba(0,0,0,0.5)";
    }
});
