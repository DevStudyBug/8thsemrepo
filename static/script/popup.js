document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup"),
        thankYouPopup = document.getElementById("thankYouPopup"),
        thankYouMessage = document.getElementById("thankYouMessage"),
        isLoggedIn = localStorage.getItem("isLoggedIn"),
        hasSeenPopup = localStorage.getItem("popupShown");

    if (isLoggedIn !== "true" && hasSeenPopup !== "true") {
        popup.style.display = "flex";
        localStorage.setItem("popupShown", "true");
    }

    document.querySelectorAll(".close-btn").forEach(btn =>
        btn.addEventListener("click", () => (popup.style.display = "none"))
    );

    document.getElementById("emailForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("popup-email")?.value;
        if (!email) return alert("Please enter a valid email.");
        localStorage.setItem("userEmail", email);
        if (thankYouPopup && thankYouMessage) {
            thankYouMessage.textContent = `Welcome to RecruitEase! We've sent updates to ${email}`;
            thankYouPopup.style.display = "flex";
        }
        popup.style.display = "none";
    });

    document.getElementById("closeThankYou")?.addEventListener("click", () =>
        (thankYouPopup.style.display = "none")
    );

    document.getElementById("loginButton")?.addEventListener("click", () => {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
    });
});
