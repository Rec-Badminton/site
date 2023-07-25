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
