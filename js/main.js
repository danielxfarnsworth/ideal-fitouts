/* =================================================================
   IDEAL FITOUTS — Main JavaScript
   Navbar toggle, mobile menu, contact form handler
   ================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("open");
      // Swap icon
      const openIcon = hamburger.querySelector(".icon-menu");
      const closeIcon = hamburger.querySelector(".icon-close");
      if (openIcon && closeIcon) {
        openIcon.style.display = isOpen ? "none" : "block";
        closeIcon.style.display = isOpen ? "block" : "none";
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        const openIcon = hamburger.querySelector(".icon-menu");
        const closeIcon = hamburger.querySelector(".icon-close");
        if (openIcon && closeIcon) {
          openIcon.style.display = "block";
          closeIcon.style.display = "none";
        }
      });
    });
  }

  // --- Contact Form Handler ---
  const contactForm = document.getElementById("contact-form");
  const formContainer = document.getElementById("form-container");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate email
      const emailField = contactForm.querySelector('[name="email"]');
      if (!emailField || !emailField.value || !/^.+@.+\.[a-zA-Z]{2,63}$/.test(emailField.value)) {
        showFormError("Please enter a valid email address.");
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
      }
      hideFormError();

      // Gather form data
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      try {
        // --- FORM SUBMISSION ---
        // Option 1: Web3Forms (free, no backend needed)
        // Set your access key at: https://web3forms.com
        const WEB3FORMS_KEY = contactForm.dataset.apiKey || "";

        if (WEB3FORMS_KEY) {
          // Send to Web3Forms
          data["access_key"] = WEB3FORMS_KEY;
          data["subject"] = "New Website Enquiry from " + (data["first-name"] || "") + " " + (data["last-name"] || "");
          data["from_name"] = "Ideal Fitouts Website";

          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          if (!result.success) {
            throw new Error(result.message || "Submission failed");
          }
        } else {
          // Option 2: No API key configured — log and show success (dev mode)
          console.log("=== CONTACT FORM SUBMISSION ===");
          console.log(data);
          console.log("Configure data-api-key on the form to enable Web3Forms delivery.");
          console.log("Or replace this with your own endpoint.");
          // Simulate network delay for realistic UX
          await new Promise(function (r) { setTimeout(r, 800); });
        }

        // Show success
        if (formContainer) formContainer.style.display = "none";
        if (formSuccess) formSuccess.style.display = "block";
      } catch (err) {
        console.error("Form submission error:", err);
        showFormError("Something went wrong. Please call us directly at 021 024 83801.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<svg class="icon" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Submit Enquiry';
        }
      }
    });
  }

  function showFormError(msg) {
    if (formError) {
      formError.textContent = msg;
      formError.parentElement.style.display = "flex";
    }
  }

  function hideFormError() {
    if (formError) {
      formError.parentElement.style.display = "none";
    }
  }
});
