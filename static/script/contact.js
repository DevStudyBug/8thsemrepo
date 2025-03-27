const contactForm = document.getElementById("contact-form");
const firstname = document.getElementById("fname");
const lastname = document.getElementById("lname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{10}$/;

contactForm?.addEventListener("submit", (e)=> {
    e.preventDefault();
    let isValid = true;

    if (firstname.value.trim() === "") {
        setError(firstname, "First name is required!");
        isValid = false;
    } else if (/[^a-zA-Z]/.test(firstname.value.trim())) {
        setError(firstname, "Only letters are allowed in first name!");
        isValid = false;
    }
    
    if (lastname.value.trim() === "") {
        setError(lastname, "Last name is required!");
        isValid = false;
    } else if (/[^a-zA-Z]/.test(lastname.value.trim())) {
        setError(lastname, "Only letters are allowed in last name!");
        isValid = false;
    }
    
    if (email.value.trim() === "") {
        setError(email, "Email is required!");
        isValid = false;
    }
    else if (!emailRegex.test(email.value.trim())){
        setError(email, "Invalid email format!");
        isValid = false;
    }
    if (phone.value.trim() === "") {
        setError(phone, "Phone number is required!");
        isValid = false;
    }
    else if (!phoneRegex.test(phone.value.trim())){
        setError(phone, "Contact number must have exactly 10 digits");
        isValid = false;
    }
    if (message.value.trim() === "") {
        setError(message, "Message is required!");
        isValid = false;
    }

    if (isValid) {
        // Email functionality using mailto:
        const fullName = `${firstname.value.trim()} ${lastname.value.trim()}`;
        const subject = `Contact Form Submission from ${fullName}`;
        const emailBody = `Name: ${fullName}
Email: ${email.value.trim()}
Phone: ${phone.value.trim()}

Message:
${message.value.trim()}`;
        
        // Create the mailto link
        const mailtoLink = `mailto:anshikadubey8591@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Reset the form
        contactForm.reset();
        
        // Open the default email client
        window.location.href = mailtoLink;
    }
});

// Newsletter section scripts
const newsletterForm = document.getElementById("news-letter");
const newsletterEmail = document.getElementById("newsletter-email");

newsletterForm?.addEventListener("submit", (e)=> {
    e.preventDefault();

    if (newsletterEmail.value.trim() === "") {
        setError(newsletterEmail, "Email is required!");
    }
    else if (!emailRegex.test(newsletterEmail.value.trim())) {
        setError(newsletterEmail, "Invalid email format!");
    }
});

function setError(field, errorMessage) {
    const error = field.parentElement.querySelector("small");
    error.textContent = errorMessage;
}