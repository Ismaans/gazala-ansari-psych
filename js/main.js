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

  // The "Services" toggle is a real link: it always navigates to services.html
  // on click (both mobile and desktop). Desktop reveals the submenu on hover;
  // mobile shows "Services" as a plain link with no submenu.

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
    const PRACTICE_EMAIL = "drgansari@ansarillc.hush.com";

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const reason = (data.get("reason") || "").toString().trim();
      const method = (data.get("contact-method") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const subject = name
        ? "Website contact from " + name
        : "Website contact";

      const bodyLines = [
        "Name: " + name,
        "Email: " + email,
      ];
      if (phone) bodyLines.push("Phone: " + phone);
      if (reason) bodyLines.push("Reason for inquiry: " + reason);
      if (method) bodyLines.push("Preferred contact method: " + method);
      bodyLines.push("", "Message:", message);

      const mailtoUrl =
        "mailto:" +
        PRACTICE_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailtoUrl;

      const status = document.getElementById("form-status");
      if (status) {
        status.innerHTML =
          'Your email client should open with the message ready to send. ' +
          'If it does not, please email <a href="mailto:' +
          PRACTICE_EMAIL +
          '">' +
          PRACTICE_EMAIL +
          "</a> directly.";
        status.hidden = false;
      }
    });
  }
})();
