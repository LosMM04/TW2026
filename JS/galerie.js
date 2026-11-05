// Array cu imaginile din folderul ../MEDIA
const images = [
    "../MEDIA/g1.jpeg", // Exemplu de imagine
    "../MEDIA/g2.jpeg",
    "../MEDIA/g3.jpeg"
];

// Obtinem elementul principal din DOM
const mainImage = document.getElementById("carousel-image");

// Verificam daca elementul exista
if (!mainImage) throw new Error("Elementul principal nu a fost gasit");

let currentIndex = 0;

// Functie care schimba imaginea mare
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    mainImage.src = images[currentIndex];
    
    // Step 12: Animatie folosind TypeScript/JavaScript
    mainImage.style.transform = "scale(1.03)";
    setTimeout(() => {
        mainImage.style.transform = "scale(1)";
    }, 250);
}

// Slider automat la 3 secunde
setInterval(showNextImage, 3000);

// Animatie la interactiune cu mouse-ul
mainImage.addEventListener("mouseenter", () => {
    mainImage.style.transform = "scale(1.05)";
});

mainImage.addEventListener("mouseleave", () => {
    mainImage.style.transform = "scale(1)";
});

