const menuToggle = document.getElementById("menuToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    const yearNode = document.getElementById("year");
    const revealNodes = document.querySelectorAll(".reveal");
    const tiltCards = document.querySelectorAll("[data-tilt]");
    const showcaseCards = document.querySelectorAll("[data-showcase]");
    const showcaseOverlay = document.getElementById("showcaseOverlay");
    const showcaseStage = document.getElementById("showcaseStage");
    const showcaseKicker = document.getElementById("showcaseKicker");
    const showcaseTitle = document.getElementById("showcaseTitle");
    const showcaseDescription = document.getElementById("showcaseDescription");
    const showcaseDetails = document.getElementById("showcaseDetails");
    const showcaseClose = document.getElementById("showcaseClose");
    const showcasePanel = document.querySelector(".showcase-panel");
    const coarsePointerQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    let activeShowcaseKey = null;
    let showcaseTimers = [];
    let closeShowcaseTimer = null;

    function setMobileMenuState(isOpen) {
      mobilePanel.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "Close" : "Menu";
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    const showcaseData = {
      landing: {
        kicker: "Starter package",
        title: "Landing page",
        description: "A focused one-page website for launches, services, or personal brands. The preview shows how the hero, CTA, proof, and mobile view can work together.",
        cards: [
          {
            kind: "browser-landing",
            left: "9%",
            top: "18%",
            rotate: "-14deg",
            z: "1",
            width: "220px",
            ratio: "0.78",
            shadowTop: "242px"
          },
          {
            kind: "browser-landing",
            accent: "teal",
            left: "34%",
            top: "9%",
            rotate: "-2deg",
            z: "2",
            width: "250px",
            ratio: "0.8",
            shadowTop: "266px"
          },
          {
            kind: "mobile-preview",
            left: "66%",
            top: "22%",
            rotate: "12deg",
            z: "3",
            width: "150px",
            ratio: "0.5",
            shadowTop: "244px",
            shadowWidth: "150px"
          }
        ],
        details: [
          ["Best for", "Product launches, service ads, creator portfolios, and single-offer pages that need a strong CTA."],
          ["What clients get", "Hero section, benefits, testimonials, pricing or offer block, contact CTA, and mobile-friendly layout."],
          ["Order flow", "Client sends the copy and references, then you deliver a polished one-page site ready to launch."]
        ]
      },
      business: {
        kicker: "Growth package",
        title: "Business website",
        description: "A multi-section website for agencies, consultants, local businesses, or startups that need trust, service pages, and direct inquiries.",
        cards: [
          {
            kind: "browser-business",
            left: "8%",
            top: "20%",
            rotate: "-12deg",
            z: "1",
            width: "220px",
            ratio: "0.76",
            shadowTop: "236px"
          },
          {
            kind: "browser-dashboard",
            left: "35%",
            top: "8%",
            rotate: "-1deg",
            z: "2",
            width: "260px",
            ratio: "0.82",
            shadowTop: "278px"
          },
          {
            kind: "browser-business",
            accent: "rose",
            left: "64%",
            top: "22%",
            rotate: "13deg",
            z: "3",
            width: "190px",
            ratio: "0.72",
            shadowTop: "208px"
          }
        ],
        details: [
          ["Best for", "Studios, agencies, consultants, coaches, doctors, restaurants, and local companies who need a real web presence."],
          ["What clients get", "Home page, services, about section, testimonials, FAQ, contact area, and structured navigation."],
          ["Order flow", "Perfect for clients who want something stronger than a single landing page but not a large app build."]
        ]
      },
      store: {
        kicker: "Sales package",
        title: "Store or order site",
        description: "A conversion-first website for selling products, taking custom orders, or showcasing menus and offers with direct contact buttons.",
        cards: [
          {
            kind: "browser-store",
            left: "10%",
            top: "18%",
            rotate: "-14deg",
            z: "1",
            width: "220px",
            ratio: "0.78",
            shadowTop: "242px"
          },
          {
            kind: "browser-store",
            accent: "teal",
            left: "35%",
            top: "10%",
            rotate: "-2deg",
            z: "2",
            width: "252px",
            ratio: "0.82",
            shadowTop: "274px"
          },
          {
            kind: "browser-checkout",
            left: "67%",
            top: "22%",
            rotate: "12deg",
            z: "3",
            width: "168px",
            ratio: "0.68",
            shadowTop: "210px",
            shadowWidth: "160px"
          }
        ],
        details: [
          ["Best for", "Small shops, food brands, custom sellers, apparel pages, and businesses that want order-taking online."],
          ["What clients get", "Product sections, featured offers, order CTA, WhatsApp or inquiry flow, and a layout built for conversion."],
          ["Order flow", "Clients can use this type of site to collect leads, orders, or simple checkout requests without overcomplicating it."]
        ]
      }
    };

    yearNode.textContent = new Date().getFullYear();

    menuToggle.addEventListener("click", function () {
      setMobileMenuState(!mobilePanel.classList.contains("open"));
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenuState(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980 && mobilePanel.classList.contains("open")) {
        setMobileMenuState(false);
      }

      if (activeShowcaseKey && showcaseOverlay.classList.contains("open")) {
        openShowcase(activeShowcaseKey);
      }
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });

    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || coarsePointerQuery.matches) {
          return;
        }

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 12;
        const rotateX = ((y / rect.height) - 0.5) * -12;

        card.style.transform = "perspective(1200px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });

    document.addEventListener("click", function (event) {
      if (!mobilePanel.classList.contains("open")) {
        return;
      }

      if (mobilePanel.contains(event.target) || menuToggle.contains(event.target)) {
        return;
      }

      setMobileMenuState(false);
    });

    function clearShowcaseTimers() {
      showcaseTimers.forEach(function (timer) {
        window.clearTimeout(timer);
      });
      showcaseTimers = [];

      if (closeShowcaseTimer) {
        window.clearTimeout(closeShowcaseTimer);
        closeShowcaseTimer = null;
      }
    }

    function getResponsiveShowcaseItem(item, index) {
      const viewportWidth = window.innerWidth;
      const itemConfig = Object.assign({}, item);

      if (viewportWidth <= 640) {
        const mobileLayouts = [
          { left: "6%", top: "19%", width: "112px", rotate: "-10deg", shadowTop: "158px", shadowWidth: "104px" },
          { left: "35%", top: "8%", width: "132px", rotate: "-2deg", shadowTop: "178px", shadowWidth: "122px" },
          { left: "70%", top: "21%", width: "88px", rotate: "9deg", shadowTop: "144px", shadowWidth: "88px" }
        ];
        return Object.assign(itemConfig, mobileLayouts[index] || {});
      }

      if (viewportWidth <= 980) {
        const tabletLayouts = [
          { left: "8%", top: "18%", width: "164px", rotate: "-12deg", shadowTop: "198px", shadowWidth: "154px" },
          { left: "36%", top: "8%", width: "194px", rotate: "-2deg", shadowTop: "220px", shadowWidth: "180px" },
          { left: "70%", top: "21%", width: "118px", rotate: "10deg", shadowTop: "188px", shadowWidth: "116px" }
        ];
        return Object.assign(itemConfig, tabletLayouts[index] || {});
      }

      const desktopLayouts = [
        { width: "206px", shadowWidth: "198px" },
        { width: "234px", shadowWidth: "214px" },
        { width: "142px", shadowWidth: "142px" }
      ];

      return Object.assign(itemConfig, desktopLayouts[index] || {});
    }

    function buildShowcaseCard(item) {
      const card = document.createElement("div");
      card.className = "showcase-card";
      card.style.left = item.left;
      card.style.top = item.top;
      card.style.zIndex = item.z;
      card.style.setProperty("--model-width", item.width || "250px");
      card.style.setProperty("--model-ratio", item.ratio || "0.72");
      card.style.setProperty("--card-rotate", item.rotate);
      card.style.transform = "translate3d(0, 48px, 0) rotate(" + item.rotate + ") scale(0.88)";

      const shell = document.createElement("div");
      shell.className = "model-shell";

      if (item.kind === "browser-landing" || item.kind === "browser-business" || item.kind === "browser-store" || item.kind === "browser-dashboard" || item.kind === "browser-checkout") {
        const browser = document.createElement("div");
        browser.className = "browser-model " + item.kind + (item.accent ? " accent-" + item.accent : "");

        const topbar = document.createElement("div");
        topbar.className = "browser-topbar";
        topbar.innerHTML = "<span></span><span></span><span></span><div class=\"browser-url\"></div>";
        browser.appendChild(topbar);

        const body = document.createElement("div");
        body.className = "browser-body";

        if (item.kind === "browser-landing") {
          body.innerHTML = "<div class=\"mock-hero\"></div><div class=\"mock-text long\"></div><div class=\"mock-text\"></div><div class=\"mock-cta-row\"><span></span><span></span></div><div class=\"mock-grid three\"><div></div><div></div><div></div></div>";
        }

        if (item.kind === "browser-business") {
          body.innerHTML = "<div class=\"mock-split\"><div class=\"mock-copy\"><div class=\"mock-text long\"></div><div class=\"mock-text\"></div><div class=\"mock-text short\"></div></div><div class=\"mock-visual\"></div></div><div class=\"mock-grid two\"><div></div><div></div></div><div class=\"mock-stat-row\"><span></span><span></span><span></span></div>";
        }

        if (item.kind === "browser-dashboard") {
          body.innerHTML = "<div class=\"mock-dashboard\"><div class=\"mock-sidebar\"></div><div class=\"mock-content\"><div class=\"mock-chart\"></div><div class=\"mock-grid two\"><div></div><div></div></div><div class=\"mock-text long\"></div></div></div>";
        }

        if (item.kind === "browser-store") {
          body.innerHTML = "<div class=\"mock-banner\"></div><div class=\"mock-grid store\"><div></div><div></div><div></div><div></div></div><div class=\"mock-cta-row\"><span></span><span></span></div>";
        }

        if (item.kind === "browser-checkout") {
          body.innerHTML = "<div class=\"mock-text\"></div><div class=\"mock-cart\"><div class=\"mock-cart-item\"></div><div class=\"mock-cart-item\"></div><div class=\"mock-cart-item small\"></div></div><div class=\"mock-button large\"></div>";
        }

        browser.appendChild(body);
        shell.appendChild(browser);
      }

      if (item.kind === "mobile-preview") {
        const mobile = document.createElement("div");
        mobile.className = "browser-mobile-preview";
        mobile.innerHTML = "<div class=\"mobile-preview-screen\"><div class=\"mobile-preview-notch\"></div><div class=\"mock-hero small\"></div><div class=\"mock-text\"></div><div class=\"mock-text short\"></div><div class=\"mock-button\"></div><div class=\"mock-grid one\"><div></div></div></div>";
        shell.appendChild(mobile);
      }

      card.appendChild(shell);

      const shadow = document.createElement("div");
      shadow.className = "showcase-shadow";
      shadow.style.width = item.shadowWidth || "220px";
      shadow.style.left = "calc(" + item.left + " + 6px)";
      shadow.style.top = "calc(" + item.top + " + " + (item.shadowTop || "310px") + ")";

      return { card: card, shadow: shadow };
    }

    function openShowcase(key) {
      const data = showcaseData[key];

      if (!data) {
        return;
      }

      clearShowcaseTimers();
      showcaseStage.innerHTML = "";
      showcaseDetails.innerHTML = "";

      showcaseKicker.textContent = data.kicker;
      showcaseTitle.textContent = data.title;
      showcaseDescription.textContent = data.description;
      activeShowcaseKey = key;
      showcasePanel.scrollTop = 0;
      showcaseOverlay.scrollTop = 0;

      showcaseOverlay.classList.add("open");
      showcaseOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      data.cards.forEach(function (item, index) {
        const responsiveItem = getResponsiveShowcaseItem(item, index);
        const built = buildShowcaseCard(responsiveItem);
        showcaseStage.appendChild(built.shadow);
        showcaseStage.appendChild(built.card);

        const timer = window.setTimeout(function () {
          built.card.classList.add("visible");
          built.shadow.classList.add("visible");
          built.card.style.transform = "translate3d(0, 0, 0) rotate(" + responsiveItem.rotate + ") scale(1)";
          built.card.classList.add("animate");
        }, 180 + (index * 240));

        showcaseTimers.push(timer);
      });

      data.details.forEach(function (detail, index) {
        const pop = document.createElement("div");
        pop.className = "detail-pop";
        pop.innerHTML = "<strong>" + detail[0] + "</strong><span>" + detail[1] + "</span>";
        showcaseDetails.appendChild(pop);

        const timer = window.setTimeout(function () {
          pop.classList.add("visible");
        }, 920 + (index * 170));

        showcaseTimers.push(timer);
      });
    }

    function closeShowcase() {
      clearShowcaseTimers();
      showcaseOverlay.classList.remove("open");
      showcaseOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      activeShowcaseKey = null;

      closeShowcaseTimer = window.setTimeout(function () {
        showcaseStage.innerHTML = "";
        showcaseDetails.innerHTML = "";
        showcasePanel.scrollTop = 0;
        showcaseOverlay.scrollTop = 0;
        closeShowcaseTimer = null;
      }, 260);
    }

    showcaseCards.forEach(function (card) {
      card.addEventListener("click", function () {
        openShowcase(card.getAttribute("data-showcase"));
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openShowcase(card.getAttribute("data-showcase"));
        }
      });
    });

    showcaseClose.addEventListener("click", closeShowcase);
    showcaseOverlay.querySelector("[data-close-showcase]").addEventListener("click", closeShowcase);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobilePanel.classList.contains("open")) {
        setMobileMenuState(false);
      }

      if (event.key === "Escape" && showcaseOverlay.classList.contains("open")) {
        closeShowcase();
      }
    });

