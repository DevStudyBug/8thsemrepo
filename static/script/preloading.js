document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById("preloader");

    // Check if the user is visiting for the first time or refreshed
    if (!sessionStorage.getItem("visited")) {
        preloader.style.display = "flex"; // Show preloader
        document.body.classList.remove("loaded"); // Keep content hidden

        setTimeout(() => {
            preloader.style.display = "none"; // Hide preloader after loading
            document.body.classList.add("loaded");
            sessionStorage.setItem("visited", "true"); // Mark as visited
        }, 2000); // Adjust time as needed
    } else {
        preloader.style.display = "none"; // Hide preloader immediately
        document.body.classList.add("loaded");
    }
});
