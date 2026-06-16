/* =================================================================
   Zahnarztpraxis [PRAXISNAME] – JavaScript (Mehrseiten-Website)
   - Mobile-Navigation
   - Header-Schatten + Scroll-Fortschrittsbalken
   - Verbesserte Scroll-Animationen (IntersectionObserver)
   - Cursor-Glow auf Cards
   - Terminanfrage über Formspree (AJAX)
   ================================================================= */

(function () {
	"use strict";

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const supportsHover = window.matchMedia("(hover: hover)").matches;

	/* ---- Aktuelles Jahr im Footer ---- */
	document.querySelectorAll("[data-year]").forEach(function (el) {
		el.textContent = new Date().getFullYear();
	});

	/* ---- Mobile-Navigation ---- */
	const navToggle = document.getElementById("nav-toggle");
	const mainNav = document.getElementById("main-nav");
	if (navToggle && mainNav) {
		navToggle.addEventListener("click", function () {
			const isOpen = mainNav.classList.toggle("open");
			navToggle.setAttribute("aria-expanded", String(isOpen));
			navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
		});
		mainNav.querySelectorAll("a").forEach(function (link) {
			link.addEventListener("click", function () {
				mainNav.classList.remove("open");
				navToggle.setAttribute("aria-expanded", "false");
			});
		});
	}

	/* ---- Header-Schatten + Scroll-Fortschritt ---- */
	const header = document.querySelector(".site-header");
	const progress = document.querySelector(".scroll-progress");
	function onScroll() {
		const y = window.scrollY;
		if (header) header.classList.toggle("scrolled", y > 8);
		if (progress) {
			const h = document.documentElement;
			const max = h.scrollHeight - h.clientHeight;
			const ratio = max > 0 ? y / max : 0;
			progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
		}
	}
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });

	/* ---- Verbesserte Scroll-Animationen ----
	   Elemente mit [data-animate] oder [data-stagger] werden beim
	   Hereinscrollen aktiviert. */
	const animated = document.querySelectorAll("[data-animate], [data-stagger]");
	if (!reduceMotion && "IntersectionObserver" in window && animated.length) {
		const observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("in");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
		);
		animated.forEach(function (el) { observer.observe(el); });
	} else {
		animated.forEach(function (el) { el.classList.add("in"); });
	}

	/* ---- Cursor-Glow auf Cards ---- */
	if (supportsHover && !reduceMotion) {
		document.querySelectorAll(".card").forEach(function (card) {
			card.addEventListener("pointermove", function (e) {
				const rect = card.getBoundingClientRect();
				card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
				card.style.setProperty("--my", (e.clientY - rect.top) + "px");
			});
		});
	}

	/* ---- Terminanfrage über Formspree (AJAX) ----
	   Das Formular sendet an die in der action-URL hinterlegte
	   Formspree-Endpoint-Adresse. Trage deine Form-ID im HTML ein:
	   <form action="https://formspree.io/f/DEINE_ID"> */
	const form = document.getElementById("appointment-form");
	const status = document.getElementById("form-status");
	if (form) {
		const submitBtn = form.querySelector("button[type='submit']");
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			if (!form.checkValidity()) { form.reportValidity(); return; }

			const action = form.getAttribute("action") || "";
			if (action.indexOf("DEINE_FORMSPREE_ID") !== -1 || action.trim() === "") {
				setStatus("Hinweis: Bitte zuerst die Formspree-Adresse im Formular eintragen (action-Attribut).", "error");
				return;
			}

			setStatus("Anfrage wird gesendet …", "");
			if (submitBtn) submitBtn.setAttribute("aria-busy", "true");

			fetch(action, {
				method: "POST",
				body: new FormData(form),
				headers: { Accept: "application/json" },
			})
				.then(function (response) {
					if (response.ok) {
						form.reset();
						setStatus("Vielen Dank! Ihre Terminanfrage wurde gesendet. Wir melden uns zeitnah.", "success");
					} else {
						return response.json().then(function (data) {
							const msg = data && data.errors ? data.errors.map(function (e) { return e.message; }).join(", ") : "";
							setStatus("Es gab ein Problem beim Senden. " + msg, "error");
						});
					}
				})
				.catch(function () {
					setStatus("Netzwerkfehler – bitte später erneut versuchen oder rufen Sie uns an.", "error");
				})
				.finally(function () {
					if (submitBtn) submitBtn.removeAttribute("aria-busy");
				});
		});
	}

	function setStatus(text, type) {
		if (!status) return;
		status.textContent = text;
		status.className = "form-status" + (type ? " " + type : "");
	}
})();


/* =====================================================================
   GOOEY-TEXT-MORPHING  (Vanilla-JS-Portierung)
   ---------------------------------------------------------------------
   Ersetzt die React-Komponente gooey-text-morphing.tsx. Sucht alle
   Elemente mit [data-gooey] (JSON-Array von Wörtern) und animiert den
   weichen "gooey"-Wechsel zwischen den Wörtern.

   Verwendung im HTML:
   <span class="gooey-text" data-gooey='["Wort A","Wort B"]'
          data-morph-time="1" data-cooldown-time="1.4"></span>
   ===================================================================== */
(function initGooeyText() {
	function setup(el) {
		let texts;
		try {
			texts = JSON.parse(el.getAttribute("data-gooey"));
		} catch (e) {
			return;
		}
		if (!Array.isArray(texts) || texts.length === 0) return;

		const morphTime = parseFloat(el.getAttribute("data-morph-time")) || 1;
		const cooldownTime =
			parseFloat(el.getAttribute("data-cooldown-time")) || 0.25;

		// Zwei überlagerte Wörter erzeugen
		const word1 = document.createElement("span");
		const word2 = document.createElement("span");
		word1.className = "gooey-word";
		word2.className = "gooey-word";
		el.textContent = "";
		el.appendChild(word1);
		el.appendChild(word2);
		el.setAttribute("data-ready", "true");

		// Reduzierte Bewegung respektieren: nur erstes Wort, kein Morph
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduceMotion) {
			word1.textContent = texts[0];
			word1.style.opacity = "100%";
			word2.style.display = "none";
			return;
		}

		let textIndex = texts.length - 1;
		let time = new Date();
		let morph = 0;
		let cooldown = cooldownTime;

		word1.textContent = texts[textIndex % texts.length];
		word2.textContent = texts[(textIndex + 1) % texts.length];

		function setMorph(fraction) {
			word2.style.filter = "blur(" + Math.min(8 / fraction - 8, 100) + "px)";
			word2.style.opacity = Math.pow(fraction, 0.4) * 100 + "%";
			const inv = 1 - fraction;
			word1.style.filter = "blur(" + Math.min(8 / inv - 8, 100) + "px)";
			word1.style.opacity = Math.pow(inv, 0.4) * 100 + "%";
		}

		function doCooldown() {
			morph = 0;
			word2.style.filter = "";
			word2.style.opacity = "100%";
			word1.style.filter = "";
			word1.style.opacity = "0%";
		}

		function doMorph() {
			morph -= cooldown;
			cooldown = 0;
			let fraction = morph / morphTime;
			if (fraction > 1) {
				cooldown = cooldownTime;
				fraction = 1;
			}
			setMorph(fraction);
		}

		function animate() {
			requestAnimationFrame(animate);
			const newTime = new Date();
			const shouldIncrementIndex = cooldown > 0;
			const dt = (newTime.getTime() - time.getTime()) / 1000;
			time = newTime;
			cooldown -= dt;
			if (cooldown <= 0) {
				if (shouldIncrementIndex) {
					textIndex = (textIndex + 1) % texts.length;
					word1.textContent = texts[textIndex % texts.length];
					word2.textContent = texts[(textIndex + 1) % texts.length];
				}
				doMorph();
			} else {
				doCooldown();
			}
		}
		animate();
	}

	function init() {
		document.querySelectorAll("[data-gooey]").forEach(setup);
	}
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
