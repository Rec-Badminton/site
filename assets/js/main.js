const cookieConsentAndPwa = () => {
    console.log(window.location.href);
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js');
    }
	const cc = initCookieConsent();
	cc.run({
		current_lang : 'fr',
		page_scripts: true,
		force_consent: true,
        hide_from_bots: true,
        onFirstAction: function(user_preferences, cookie){
            if (user_preferences.rejected_categories.length > 0) {
                clearCookies();
                redirectFFbad();
            }
        },
		languages: {
        'fr': {
            consent_modal: {
                title: 'Nous utilisons des cookies ! ',
                description: 'Hey you, ce site utilise des cookies essentiels à son bon fonctionnement. L\'utilisation de ces cookies sera effectif uniquement après votre consentement. <button type="button" data-cc="c-settings" class="cc-link">Je veux en savoir plus</button>',
                primary_btn: {
                    text: 'J\'accepte',
                    role: 'accept_all'              // 'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text: 'Je refuse',
                    role: 'accept_necessary'        // 'settings' or 'accept_necessary'
                }
            },
            settings_modal: {
                title: 'Rec Badminton',
                save_settings_btn: 'Sauvegarder',
                accept_all_btn: 'J\'accepte',
                reject_all_btn: 'Je refuse',
                close_btn_label: 'Fermer',
                cookie_table_headers: [
                    {col1: 'Nom'},
                    {col2: 'Domaine'},
                    {col3: 'Expiration'},
                    {col4: 'Description'}
                ],
                blocks: [
                    {
                        title: 'Usages des cookies 📢',
                        description: 'Nous ne collectons pas de données directement. Néanmoins, des applications tierces décrites ci-dessous le réalise.'
                    }, {
                        title: 'Curator.io',
                        description: 'Ces cookies sont utilisés par une application tiers pour afficher les flux Facebook et instagram: Curator.io',
                        toggle: {
                            value: 'social',     // there are no default categories => you specify them
                            enabled: true,
                            readonly: false
                        }
                    }, {
                        title: 'FFbad',
                        description: 'Ces cookies sont utilisés par la fédération de badminton (FFBAD) pour l\'inscription',
                        toggle: {
                            value: 'ffbad',     // there are no default categories => you specify them
                            enabled: true,
                            readonly: false
                        }
                    },  {
                        title: 'HelloAsso',
                        description: 'Ces cookies sont utilisés par HelloAsso pour la boutique',
                        toggle: {
                            value: 'helloasso',     // there are no default categories => you specify them
                            enabled: true,
                            readonly: false
                        }
                    }, {
                        title: 'Plus d\'information',
                        description: 'Pour plus d \'informations à propos de la collecte de vos données <a class="cc-link" href="mailto:recbad35@gmail.com">contactez nous (recbad35@gmail.com)</a>.',
                    }
                ]
            }
        }
    }
	});
}

window.onload = cookieConsentAndPwa;

// Rebuild the home carousel so each slide holds as many photos as fit the
// viewport (server-side markup renders one photo per slide as a no-JS fallback).
function buildResponsiveCarousel() {
    const root = document.getElementById("carouselRec");
    if (!root || !window.bootstrap) return;
    const inner = root.querySelector(".carousel-inner");
    const indicators = root.querySelector(".carousel-indicators");
    if (!root._photos) {
        root._photos = Array.from(inner.querySelectorAll("img")).map((img) => {
            const w = Number(img.getAttribute("width"));
            const h = Number(img.getAttribute("height"));
            return {
                src: img.getAttribute("src"),
                alt: img.getAttribute("alt"),
                w,
                h,
                // Read from the width/height attributes so the layout can be
                // built before the images have loaded (avoids a flash).
                ratio:
                    w && h
                        ? w / h
                        : img.naturalWidth && img.naturalHeight
                          ? img.naturalWidth / img.naturalHeight
                          : 1,
            };
        });
    }
    const photos = root._photos;
    if (!photos.length) return;

    // Pack photos into a slide until their aspect ratios fill the row width.
    // At each boundary, keep or drop the last photo depending on which brings
    // the row closer to filling the full width, to minimise both the leftover
    // white space and the cropping once the row is stretched to full height.
    const width = inner.clientWidth || root.clientWidth || window.innerWidth;
    const height = root.clientHeight || 500;
    const gap = 3;
    const targetAspect = Math.max(1, width / height);
    const slides = [];
    let i = 0;
    while (i < photos.length) {
        const group = [];
        let sum = 0;
        while (i < photos.length && sum < targetAspect) {
            group.push(photos[i]);
            sum += photos[i].ratio;
            i += 1;
        }
        if (group.length > 1) {
            const last = group[group.length - 1].ratio;
            if (Math.abs(sum - last - targetAspect) < Math.abs(sum - targetAspect)) {
                group.pop();
                i -= 1;
            }
        }
        slides.push(group);
    }

    const signature = slides.map((s) => s.length).join(",");
    if (root.dataset.signature === signature) return;
    root.dataset.signature = signature;

    window.bootstrap.Carousel.getInstance(root)?.dispose();
    inner.innerHTML = "";
    if (indicators) indicators.innerHTML = "";

    slides.forEach((group, index) => {
        const sumRatios = group.reduce((acc, photo) => acc + photo.ratio, 0);
        // Stretching the row to fill the full box scales every cell by this
        // factor; the resulting crop stays small when the packed ratios are
        // close to the box ratio. Fill when the crop is modest, otherwise
        // center at full height (small side margin) to avoid cutting subjects.
        const scale = targetAspect / sumRatios;
        const cropFraction = scale >= 1 ? 1 - 1 / scale : 1 - scale;
        const fill = cropFraction <= 0.15;

        const item = document.createElement("div");
        item.className = "carousel-item" + (index === 0 ? " active" : "");
        const row = document.createElement("div");
        row.className = "carousel-row";
        row.style.height = `${height}px`;
        if (!fill) row.style.justifyContent = "center";
        group.forEach((photo) => {
            const img = document.createElement("img");
            img.className = "carousel-img";
            img.src = photo.src;
            img.alt = photo.alt;
            if (photo.w && photo.h) {
                img.width = photo.w;
                img.height = photo.h;
            }
            if (fill) {
                img.style.flexGrow = String(photo.ratio);
            } else {
                img.style.flex = "0 0 auto";
                img.style.width = `${height * photo.ratio}px`;
            }
            row.appendChild(img);
        });
        item.appendChild(row);
        inner.appendChild(item);
        if (indicators) {
            const li = document.createElement("li");
            li.setAttribute("data-bs-target", "#carouselRec");
            li.setAttribute("data-bs-slide-to", String(index));
            if (index === 0) li.className = "active";
            indicators.appendChild(li);
        }
    });
    window.bootstrap.Carousel.getOrCreateInstance(root);
    inner.style.opacity = "1";
}

// Build as soon as the DOM is parsed (main.js is deferred, Bootstrap is already
// loaded, and photo ratios come from the markup) so the final layout shows
// without flashing the single fallback image first.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildResponsiveCarousel);
} else {
    buildResponsiveCarousel();
}
// Safety net: never leave the carousel hidden if the build failed.
window.addEventListener("load", () => {
    buildResponsiveCarousel();
    const inner = document.querySelector("#carouselRec .carousel-inner");
    if (inner) inner.style.opacity = "1";
});
let carouselResizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(carouselResizeTimer);
    carouselResizeTimer = setTimeout(buildResponsiveCarousel, 200);
});
