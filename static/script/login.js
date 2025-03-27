// Get DOM elements
const loginForm = document.querySelector("form");
const emailInput = document.querySelector("input[type='email']");
const passwordInput = document.getElementById("password-input-field");
const togglePassword = document.getElementById("toggle-password");
const googleSignInBtn = document.querySelector('.social-link-2 a:first-child');
const facebookSignInBtn = document.querySelector('.social-link-2 a:last-child');

// Firebase configuration (MAKE SURE THIS MATCHES YOUR FIREBASE PROJECT)
const firebaseConfig = {
    apiKey: "AIzaSyB7a_ojwVcpVCWDdHA__AFzClDE3eaynjs",
    authDomain: "recruitease-de165.firebaseapp.com",
    projectId: "recruitease-de165",
    storageBucket: "recruitease-de165.firebasestorage.app",
    messagingSenderId: "303080414917",
    appId: "1:303080414917:web:fe67e94b66ae3d21851aac",
    measurementId: "G-0G44EFZW7M"
};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Password visibility toggle (with null check)
if (togglePassword) {
    togglePassword.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
}

// Email/Password Login
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const submitButton = this.querySelector('button');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging in...';

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, 
            emailInput.value, 
            passwordInput.value
        );

        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, { lastLogin: new Date().toISOString() });
        } else {
            await setDoc(userRef, { 
                email: user.email,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                role: "user"
            });
        }

        window.location.href = "/index";
    } catch (error) {
        console.error("Login error:", error);
        displayError(error);
        
        submitButton.disabled = false;
        submitButton.textContent = "Sign in";
    }
});

// Google Sign-In
googleSignInBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        await handleSocialLogin(result.user);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        displayError(error);
    }
});

// Facebook Sign-In
facebookSignInBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new FacebookAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        await handleSocialLogin(result.user);
    } catch (error) {
        console.error("Facebook Sign-In Error:", error);
        displayError(error);
    }
});

// Handle Social Login Data Storage
async function handleSocialLogin(user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            firstName: user.displayName ? user.displayName.split(' ')[0] : '',
            lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
            email: user.email,
            createdAt: user.metadata.creationTime,
            lastLogin: new Date().toISOString(),
            role: "user"
        });
    } else {
        await updateDoc(userRef, { lastLogin: new Date().toISOString() });
    }

    window.location.href = "/index";
}

// Error Display Function
function displayError(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';

    switch (error.code) {
        case 'auth/invalid-credential':
            errorContainer.textContent = "Invalid email or password. Please try again.";
            break;
        case 'auth/user-not-found':
            errorContainer.textContent = "No account found with this email. Please sign up.";
            break;
        case 'auth/wrong-password':
            errorContainer.textContent = "Incorrect password. Please try again.";
            break;
        case 'auth/too-many-requests':
            errorContainer.textContent = "Too many failed login attempts. Please try again later or reset your password.";
            break;
        case 'auth/popup-blocked':
            errorContainer.textContent = "Pop-up blocked. Please enable pop-ups for this site.";
            break;
        case 'auth/popup-closed-by-user':
            errorContainer.textContent = "Sign-in popup was closed. Please try again.";
            break;
        default:
            errorContainer.textContent = error.message || "login successful , go to home page";
    }

    // Remove previous errors
    const existingError = document.querySelector('.alert-danger');
    if (existingError) existingError.remove();

    loginForm.insertBefore(errorContainer, loginForm.firstChild);
}
