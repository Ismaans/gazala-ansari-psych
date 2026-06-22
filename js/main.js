(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    const toggle = dropdown.querySelector(".nav-dropdown__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      // Desktop: let the link navigate to services.html (hover handles the menu).
      if (!window.matchMedia("(max-width: 1024px)").matches) {
        return;
      }
      // Mobile: prevent navigation and toggle the dropdown instead.
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown.is-open").forEach(function (dropdown) {
      dropdown.classList.remove("is-open");
      const toggle = dropdown.querySelector(".nav-dropdown__toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".faq-item").forEach(function (item) {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq-item__answer");
    if (!summary || !answer) return;

    let inner = answer.querySelector(".faq-item__answer-inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "faq-item__answer-inner";
      while (answer.firstChild) {
        inner.appendChild(answer.firstChild);
      }
      answer.appendChild(inner);
    }

    // Keep details open so content stays measurable; visibility controlled by height
    item.open = true;
    summary.setAttribute("aria-expanded", "false");
    answer.style.height = "0px";

    let isOpen = false;
    let isAnimating = false;

    function measureHeight() {
      return inner.offsetHeight;
    }

    function finishAnimation() {
      isAnimating = false;
    }

    function waitForTransition(callback) {
      let done = false;
      const timeout = window.setTimeout(function () {
        if (done) return;
        done = true;
        answer.removeEventListener("transitionend", onEnd);
        callback();
      }, 500);

      function onEnd(e) {
        if (e.propertyName !== "height" || done) return;
        done = true;
        window.clearTimeout(timeout);
        answer.removeEventListener("transitionend", onEnd);
        callback();
      }

      answer.addEventListener("transitionend", onEnd);
    }

    function openItem() {
      if (isOpen || isAnimating) return;
      isAnimating = true;
      isOpen = true;
      item.classList.add("is-open");
      summary.setAttribute("aria-expanded", "true");

      const target = measureHeight();
      answer.style.height = "0px";
      answer.offsetHeight;
      answer.style.height = target + "px";

      waitForTransition(finishAnimation);
    }

    function closeItem() {
      if (!isOpen || isAnimating) return;
      isAnimating = true;

      answer.style.height = answer.scrollHeight + "px";
      answer.offsetHeight;
      answer.style.height = "0px";

      item.classList.remove("is-open");
      summary.setAttribute("aria-expanded", "false");

      waitForTransition(function () {
        isOpen = false;
        finishAnimation();
      });
    }

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen) {
        closeItem();
      } else {
        openItem();
      }
    });

    window.addEventListener("resize", function () {
      if (isOpen && !isAnimating) {
        answer.style.height = measureHeight() + "px";
      }
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const status = document.getElementById("form-status");
      if (status) {
        status.textContent =
          "Thank you for your message. My office will respond as soon as possible.";
        status.hidden = false;
        contactForm.reset();
      }
    });
  }
})();
