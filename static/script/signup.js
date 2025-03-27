// Get DOM elements
const passwordInput = document.getElementById("password-input-field");
const strengthText = document.getElementById("password-strength-text");
const strengthBar = document.getElementById("strength-bar");
const togglePassword = document.getElementById("toggle-password");
const signupForm = document.querySelector("form");

// Password visibility toggle
togglePassword.addEventListener("click", function() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

// Password strength meter
passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    const result = zxcvbn(password);
    const strength = result.score;

    // Update strength bar and text
    strengthBar.style.width = `${(strength + 1) * 20}%`;
    const strengthLevels = ["Very Weak", "Weak", "Okay", "Good", "Strong"];
    strengthText.textContent = strengthLevels[strength];
    
    const colors = ["#ff4d4d", "#ff944d", "#ffd24d", "#d2ff4d", "#4dff88"];
    strengthBar.style.backgroundColor = colors[strength];
    
    // Add suggestions for weak passwords
    if (strength < 2 && password.length > 0) {
        const suggestion = document.createElement("div");
        suggestion.className = "password-suggestion";
        suggestion.textContent = result.feedback.suggestions.join(" ");
        
        // Remove any existing suggestions
        const existingSuggestion = document.querySelector(".password-suggestion");
        if (existingSuggestion) {
            existingSuggestion.remove();
        }
        
        if (suggestion.textContent.trim() !== "") {
            document.getElementById("password-strength-meter").appendChild(suggestion);
        }
    } else {
        const existingSuggestion = document.querySelector(".password-suggestion");
        if (existingSuggestion) {
            existingSuggestion.remove();
        }
    }
});

// Form validation and Firebase signup
signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.querySelector("input[name='first_name']");
    const lastName = document.querySelector("input[name='last_name']");
    const email = document.querySelector("input[name='email']");
    const password = document.getElementById("password-input-field");

    clearErrors();

    let isValid = true;

    if (firstName.value.trim() === "") {
        showError(firstName, "First name is required");
        isValid = false;
    }

    if (lastName.value.trim() === "") {
        showError(lastName, "Last name is required");
        isValid = false;
    }

    if (email.value.trim() === "") {
        showError(email, "Email is required");
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, "Please enter a valid email address");
        isValid = false;
    }

    if (password.value.trim() === "") {
        showError(password, "Password is required");
        isValid = false;
    } else {
        const result = zxcvbn(password.value);
        if (result.score < 2) {
            showError(password, "Password is too weak. Please choose a stronger password.");
            isValid = false;
        }
    }

    if (isValid) {
        try {
            // Show loading indicator
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
            
            // Get Firebase Auth from the global scope
            const auth = window.firebaseAuth;
            const db = window.firebaseDb;
            
            // Import Firebase functions dynamically
            const { createUserWithEmailAndPassword, updateProfile } = await import(
                "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js"
            );
            const { doc, setDoc } = await import(
                "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"
            );
            
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                email.value, 
                password.value
            );
            
            const user = userCredential.user;
            
            // Update user profile with first and last name
            await updateProfile(user, {
                displayName: `${firstName.value} ${lastName.value}`
            });
            
            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: "user" // Default role
            });
            await user.sendEmailVerification();
            // Show success message
            showSuccessMessage("Account created successfully! Redirecting to dashboard...");
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = "/index";
            }, 2000);
            
        } catch (error) {
            console.error("Registration error:", error);
            
            // Handle authentication errors
            let errorMessage = "Please wait.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please use a different email or try logging in.";
                showError(email, errorMessage);
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please choose a stronger password.";
                showError(password, errorMessage);
            } else {
                // Show general error message
                const errorElement = document.createElement("div");
                errorElement.className = "general-error";
                errorElement.textContent = errorMessage;
                signupForm.prepend(errorElement);
            }
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
});

// Helper functions
function showError(inputElement, message) {
    inputElement.classList.add("error");
    
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message show-message";
    errorMessage.innerText = message;
    
    
    const existingError = inputElement.parentNode.querySelector(".error-message");
    if (!existingError) {
        inputElement.parentNode.appendChild(errorMessage);
    }
}

function clearErrors() {
    const inputs = document.querySelectorAll(".input-field");
    inputs.forEach(input => input.classList.remove("error"));
    
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(message => message.remove());
    
    const generalError = document.querySelector(".general-error");
    if (generalError) {
        generalError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = message;
    
    // Remove any existing messages
    const existingSuccess = document.querySelector(".success-message");
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    signupForm.prepend(successMessage);
}

// Social sign in handlers
document.querySelectorAll(".social-link-2 a").forEach(link => {
    link.addEventListener("click", async function(e) {
        e.preventDefault();
        const isGoogle = this.querySelector("img").src.includes("google");
        
        try {
            // Import Firebase Auth providers
            const { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } = await import(
                "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js"
            );
            
            const auth = window.firebaseAuth;
            let provider;
            
            if (isGoogle) {
                provider = new GoogleAuthProvider();
            } else {
                provider = new FacebookAuthProvider();
            }
            
            const result = await signInWithPopup(auth, provider);
            // After successful authentication
            showSuccessMessage(`Signed in with ${isGoogle ? 'Google' : 'Facebook'}! Redirecting...`);
            
            setTimeout(() => {
                window.location.href = "/index";
            }, 1500);
            
        } catch (error) {
            console.error("Social sign-in error:", error);
            alert(`${isGoogle ? 'Google' : 'Facebook'} sign-in failed: ${error.message}`);
        }
    });
});