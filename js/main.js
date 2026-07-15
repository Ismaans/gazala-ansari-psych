(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    var mobileScrollLockQuery = window.matchMedia("(max-width: 768px)");
    var siteHeader = document.querySelector(".site-header");

    function isMobileScrollLockViewport() {
      return mobileScrollLockQuery.matches;
    }

    function isHamburgerVisible() {
      return window.getComputedStyle(navToggle).display !== "none";
    }

    function setBodyScrollLocked(locked) {
      if (locked && isMobileScrollLockViewport()) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    function setNavOpen(open) {
      mainNav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      setBodyScrollLocked(open);

      // When closing the whole menu, also collapse nested dropdowns
      if (!open) {
        mainNav.querySelectorAll(".nav-dropdown.is-open").forEach(function (dropdown) {
          dropdown.classList.remove("is-open");
          var toggle = dropdown.querySelector(".nav-dropdown__toggle");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
      }
    }

    function closeNav() {
      setNavOpen(false);
    }

    navToggle.addEventListener("click", function () {
      setNavOpen(!mainNav.classList.contains("is-open"));
    });

    // Collapsible dropdowns on mobile (Services + Resources)
    var mobileDropdownToggles = [];
    mainNav.querySelectorAll(".nav-dropdown .nav-dropdown__toggle").forEach(function (toggle) {
      var dropdown = toggle.closest(".nav-dropdown");
      mobileDropdownToggles.push(toggle);

      toggle.addEventListener("click", function (e) {
        // Only intercept when hamburger is visible
        if (!isHamburgerVisible()) return;
        e.preventDefault();
        var open = dropdown.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open);
      });
    });

    // Close whole nav on regular link click, but not on dropdown toggles
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileDropdownToggles.indexOf(link) !== -1) return;
        closeNav();
      });
    });

    // Tap outside the header/menu closes it and unlocks scroll
    document.addEventListener("click", function (e) {
      if (!mainNav.classList.contains("is-open")) return;
      if (!isHamburgerVisible()) return;
      if (siteHeader && siteHeader.contains(e.target)) return;
      closeNav();
    });

    // Browser back / history navigation should never leave body locked
    window.addEventListener("popstate", closeNav);

    // Leaving the mobile lock viewport (or leaving hamburger mode) must unlock
    function unlockIfNeeded() {
      if (!isMobileScrollLockViewport() || !isHamburgerVisible()) {
        document.body.style.overflow = "";
        if (!isHamburgerVisible()) {
          mainNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      } else if (mainNav.classList.contains("is-open")) {
        setBodyScrollLocked(true);
      }
    }

    if (mobileScrollLockQuery.addEventListener) {
      mobileScrollLockQuery.addEventListener("change", unlockIfNeeded);
    } else if (mobileScrollLockQuery.addListener) {
      mobileScrollLockQuery.addListener(unlockIfNeeded);
    }
    window.addEventListener("resize", unlockIfNeeded);
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
