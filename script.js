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
    let showcaseTimers = [];

    const showcaseData = {
      phones: {
        kicker: "Explore models",
        title: "Flagship smartphones",
        description: "Three single-piece phone models float in one by one like a product launch reveal, then the comparison details appear on the right.",
        cards: [
          {
            kind: "phone-back",
            brand: "iPhone",
            colors: ["#d9d4cf", "#a8a09a"],
            left: "12%",
            top: "18%",
            rotate: "-18deg",
            z: "1",
            width: "220px",
            shadowTop: "302px"
          },
          {
            kind: "phone-front",
            brand: "Samsung",
            colors: ["#2b3037", "#111519"],
            left: "34%",
            top: "10%",
            rotate: "-4deg",
            z: "2",
            width: "226px",
            shadowTop: "314px"
          },
          {
            kind: "phone-back",
            brand: "Vivo",
            colors: ["#59d1cb", "#1c7e85"],
            left: "57%",
            top: "21%",
            rotate: "12deg",
            z: "3",
            width: "214px",
            shadowTop: "296px"
          }
        ],
        details: [
          ["iPhone hero", "Titanium-look back, triple camera island, and a cleaner premium finish for your headline model."],
          ["Samsung spotlight", "Edge-to-edge front display, bold contrast screen, and flagship spec positioning in the center."],
          ["Vivo feature drop", "Color-pop hardware style for camera-first buyers who want a younger, more stylish phone option."]
        ]
      },
      accessories: {
        kicker: "Shop gear",
        title: "Audio and power gear",
        description: "The same reveal pattern now uses floating product objects instead of photos, so the accessory section feels like a premium product shelf.",
        cards: [
          {
            kind: "pods",
            brand: "Pods",
            left: "14%",
            top: "19%",
            rotate: "-16deg",
            z: "1",
            width: "210px",
            ratio: "0.82",
            shadowTop: "238px"
          },
          {
            kind: "charger",
            brand: "Flash",
            left: "37%",
            top: "11%",
            rotate: "-3deg",
            z: "2",
            width: "210px",
            ratio: "0.82",
            shadowTop: "238px"
          },
          {
            kind: "watch",
            brand: "Watch",
            left: "60%",
            top: "22%",
            rotate: "13deg",
            z: "3",
            width: "210px",
            ratio: "0.82",
            shadowTop: "238px"
          }
        ],
        details: [
          ["Earbuds reveal", "A floating buds case and stems make the audio section feel more like a product ad than a catalog block."],
          ["Power brick detail", "Fast-charging hardware gets its own center-stage object, which helps simple add-ons feel more premium."],
          ["Smart watch finish", "The watch face adds another tech silhouette so the accessory side feels fuller and more styled."]
        ]
      },
      repairs: {
        kicker: "Book repair",
        title: "Quick-fix service lab",
        description: "The repair popup now tells a cleaner service story with object-style models: damaged phone, repair tools, then the restored result.",
        cards: [
          {
            kind: "phone-front-cracked",
            brand: "Broken",
            colors: ["#24292f", "#12161a"],
            left: "12%",
            top: "20%",
            rotate: "-18deg",
            z: "1",
            width: "214px",
            shadowTop: "296px"
          },
          {
            kind: "repair-kit",
            brand: "Lab",
            left: "35%",
            top: "12%",
            rotate: "-2deg",
            z: "2",
            width: "214px",
            ratio: "0.82",
            shadowTop: "240px"
          },
          {
            kind: "phone-back",
            brand: "Fixed",
            colors: ["#a6c6ff", "#647aa8"],
            left: "58%",
            top: "22%",
            rotate: "12deg",
            z: "3",
            width: "214px",
            shadowTop: "296px"
          }
        ],
        details: [
          ["Problem first", "The cracked-screen model opens the sequence so people instantly understand the repair journey."],
          ["Bench stage", "A dedicated tool slab in the center makes the service process look deliberate and professional."],
          ["Restored result", "The final device lands as the polished outcome, which makes your repair CTA feel more trustworthy."]
        ]
      }
    };

    yearNode.textContent = new Date().getFullYear();

    menuToggle.addEventListener("click", function () {
      const isOpen = mobilePanel.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "Close" : "Menu";
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "Menu";
      });
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
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

    function clearShowcaseTimers() {
      showcaseTimers.forEach(function (timer) {
        window.clearTimeout(timer);
      });
      showcaseTimers = [];
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

      if (item.kind === "phone-back" || item.kind === "phone-front" || item.kind === "phone-front-cracked") {
        const phone = document.createElement("div");
        phone.className = "phone-shell";
        phone.style.setProperty("--device-a", item.colors ? item.colors[0] : "#d9d4cf");
        phone.style.setProperty("--device-b", item.colors ? item.colors[1] : "#8f8780");

        const surface = document.createElement("div");
        surface.className = "phone-surface " + (item.kind === "phone-back" ? "back" : "front");

        if (item.kind === "phone-back") {
          const camera = document.createElement("div");
          camera.className = "camera-island";

          const lensOne = document.createElement("div");
          lensOne.className = "lens";
          const lensTwo = document.createElement("div");
          lensTwo.className = "lens";
          const lensThree = document.createElement("div");
          lensThree.className = "lens";
          const sensor = document.createElement("div");
          sensor.className = "sensor-dot";

          camera.appendChild(lensOne);
          camera.appendChild(lensTwo);
          camera.appendChild(lensThree);
          camera.appendChild(sensor);
          surface.appendChild(camera);

          const badge = document.createElement("div");
          badge.className = "brand-badge";
          badge.textContent = item.brand;
          surface.appendChild(badge);

          const mini = document.createElement("div");
          mini.className = "brand-mark-mini";
          surface.appendChild(mini);
        } else {
          const notch = document.createElement("div");
          notch.className = "screen-notch";
          const orbOne = document.createElement("div");
          orbOne.className = "screen-orb";
          const orbTwo = document.createElement("div");
          orbTwo.className = "screen-orb-two";
          const lines = document.createElement("div");
          lines.className = "screen-lines";
          lines.innerHTML = "<span></span><span></span><span></span>";

          surface.appendChild(notch);
          surface.appendChild(orbOne);
          surface.appendChild(orbTwo);
          surface.appendChild(lines);

          if (item.kind === "phone-front-cracked") {
            const crack = document.createElement("div");
            crack.style.position = "absolute";
            crack.style.inset = "0";
            crack.style.background = "linear-gradient(140deg, transparent 0 18%, rgba(255,255,255,0.56) 18.5%, transparent 19%), linear-gradient(28deg, transparent 0 62%, rgba(255,255,255,0.42) 62.4%, transparent 63%), linear-gradient(88deg, transparent 0 40%, rgba(255,255,255,0.34) 40.3%, transparent 41%), linear-gradient(118deg, transparent 0 72%, rgba(255,255,255,0.28) 72.3%, transparent 73%)";
            surface.appendChild(crack);
          }
        }

        const sheen = document.createElement("div");
        sheen.className = "phone-sheen";
        surface.appendChild(sheen);
        phone.appendChild(surface);
        shell.appendChild(phone);
      }

      if (item.kind === "pods") {
        const pods = document.createElement("div");
        pods.className = "pods-shell";
        pods.innerHTML = "<div class=\"pod pod-left\"></div><div class=\"pod pod-right\"></div><div class=\"charge-case\"></div>";
        shell.appendChild(pods);
      }

      if (item.kind === "charger") {
        const charger = document.createElement("div");
        charger.className = "charger-shell";
        charger.innerHTML = "<div class=\"charger-block\"></div><div class=\"charger-glow\"></div>";
        shell.appendChild(charger);
      }

      if (item.kind === "watch") {
        const watch = document.createElement("div");
        watch.className = "watch-shell";
        watch.innerHTML = "<div class=\"watch-face\"><div class=\"watch-display\"><div class=\"watch-time\">10:09</div></div></div>";
        shell.appendChild(watch);
      }

      if (item.kind === "repair-kit") {
        const repair = document.createElement("div");
        repair.className = "repair-slab";
        repair.innerHTML = "<div class=\"repair-grid\"><div class=\"repair-chip tools\"></div><div class=\"repair-chip\"><div class=\"repair-note\">Precision tools and clean assembly</div></div></div>";
        shell.appendChild(repair);
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

      showcaseOverlay.classList.add("open");
      showcaseOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      data.cards.forEach(function (item, index) {
        const built = buildShowcaseCard(item);
        showcaseStage.appendChild(built.shadow);
        showcaseStage.appendChild(built.card);

        const timer = window.setTimeout(function () {
          built.card.classList.add("visible");
          built.shadow.classList.add("visible");
          built.card.style.transform = "translate3d(0, 0, 0) rotate(" + item.rotate + ") scale(1)";
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
      if (event.key === "Escape" && showcaseOverlay.classList.contains("open")) {
        closeShowcase();
      }
    });

