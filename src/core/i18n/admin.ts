// French copy of the back office, which is not translated.
export const admin: Record<string, string> = {
  'admin.title': 'Back office',
  'admin.loading': 'Chargement…',
  'admin.close': 'Fermer',
  'admin.nav': 'Sections du back office',
  'admin.signOut': 'Se déconnecter',
  'admin.language.fr': 'français',
  'admin.language.en': 'anglais',

  'admin.login.title': 'Connexion',
  'admin.login.description':
    'Connecte-toi avec un compte Google autorisé pour modifier le contenu du site.',
  'admin.login.google': 'Se connecter avec Google',
  'admin.forbidden.title': 'Accès refusé',
  'admin.forbidden.description':
    "Le compte %s n'a pas accès au back office. Demande à un administrateur de l'ajouter.",

  'admin.overview.label': 'Accueil',
  'admin.overview.title': 'Bienvenue',
  'admin.overview.text':
    "Choisis une section pour modifier le contenu du site. Les modifications sont visibles par les visiteurs dès qu'elles sont enregistrées.",

  // Sections
  'admin.sections.settings.label': 'Infos générales',
  'admin.sections.settings.description':
    "Adresse mail, saison, livret d'accueil, liens externes, QR codes et flux d'actualités.",
  'admin.sections.banner.label': 'Bandeau',
  'admin.sections.banner.description': 'Message affiché en haut de toutes les pages.',
  'admin.sections.schedule.label': 'Créneaux',
  'admin.sections.schedule.description':
    'Créneaux de la semaine et types de séance, repris sur l’accueil, la page Créneaux et le PDF.',
  'admin.sections.venues.label': 'Salles',
  'admin.sections.venues.description': 'Gymnases affichés sur la carte de la page Créneaux.',
  'admin.sections.memberships.label': 'Adhésions',
  'admin.sections.memberships.description':
    'Formules d’adhésion (plumes) : tarifs, publics et couleurs.',
  'admin.sections.shop.label': 'Boutique',
  'admin.sections.shop.description':
    'Articles de la boutique du club et du cordage, copie des boutiques HelloAsso.',
  'admin.sections.competition.label': 'Compétition',
  'admin.sections.competition.description':
    'Bilan de la saison passée. Les prochaines rencontres, classements et calendriers des équipes viennent d’ICBad (section Synchronisation).',
  'admin.sections.photos.label': 'Photos',
  'admin.sections.photos.description':
    "Bandeau photo de l'accueil, photo des tournois et images d'en-tête des pages.",
  'admin.sections.partners.label': 'Partenaires',
  'admin.sections.partners.description':
    'Logos du pied de page et partenariat LardeSports de la page Boutique.',
  'admin.sections.pages.label': 'Pages',
  'admin.sections.pages.description':
    "Encart des inscriptions closes, règles de la séance d'essai, contenu de la cotisation, réductions et niveaux.",
  'admin.sections.texts.label': 'Textes',
  'admin.sections.texts.description':
    'Tous les autres textes du site, en français et en anglais. Un champ vide garde le texte d’origine, affiché en grisé.',

  'admin.sections.backup.label': 'Sauvegarde',
  'admin.sections.backup.description':
    'Reviens à une version précédente du site, télécharge tout son contenu avec ses fichiers, ou restaure-le depuis une sauvegarde.',

  'admin.sections.sync.label': 'Synchronisation',
  'admin.sections.sync.description':
    'Données reprises chaque matin d’autres sites, comme les interclubs depuis ICBad. Lance une mise à jour sans attendre le lendemain.',

  'admin.sections.files.label': 'Fichiers',
  'admin.sections.files.description':
    'Images et PDF stockés sur Firebase Storage. Un fichier non utilisé n’est plus référencé par aucun contenu enregistré ni par l’historique des versions : il peut être supprimé.',

  // Sync
  'admin.sync.interclubs.title': 'Interclubs',
  'admin.sync.interclubs.text':
    'Classements, calendriers et prochaines rencontres des équipes, lus sur ICBad (la FFBaD n’a pas d’API).',
  'admin.sync.interclubs.summary': '%s équipes',
  'admin.sync.shop.title': 'Boutique',
  'admin.sync.shop.badge': 'En construction',
  'admin.sync.shop.text':
    'Les articles seront repris automatiquement de HelloAsso grâce à son API officielle, dès que le club aura ses accès. D’ici là, le catalogue se modifie à la main dans la section Boutique.',
  'admin.sync.updated': 'Mis à jour le %s',
  'admin.sync.never': 'Jamais synchronisé',
  'admin.sync.failedAt':
    'Échec de la mise à jour du %s, les données précédentes restent affichées :',
  'admin.sync.refresh': 'Mettre à jour maintenant',
  'admin.sync.running': 'Mise à jour…',
  'admin.sync.done': 'Données mises à jour',
  'admin.sync.failed': 'La mise à jour a échoué : le détail est affiché sur la carte.',

  // Files
  'admin.files.summary': '%s fichiers',
  'admin.files.unusedCount': '%s non utilisés',
  'admin.files.onlyUnused': 'Non utilisés uniquement',
  'admin.files.deleteUnused': 'Supprimer les fichiers non utilisés',
  'admin.files.used': 'utilisé',
  'admin.files.unused': 'non utilisé',
  'admin.files.none': 'Aucun fichier.',
  'admin.files.confirmTitle': 'Supprimer définitivement ?',
  'admin.files.confirmText':
    'Ces fichiers ne sont utilisés par aucun contenu. Leur suppression est définitive.',
  'admin.files.deleted': 'Fichiers supprimés',

  // Revisions
  'admin.revisions.title': 'Historique des versions',
  'admin.revisions.text':
    'Chaque enregistrement sauvegarde automatiquement tout le site. Les %s dernières versions sont gardées : repars de l’une d’elles en un clic.',
  'admin.revisions.checkpoint': 'Créer un point de sauvegarde',
  'admin.revisions.none':
    'Aucune version pour l’instant : la première sera créée au prochain enregistrement.',
  'admin.revisions.current': 'Version en ligne',
  'admin.revisions.section': 'Modification : %s',
  'admin.revisions.restore': 'Retour à la version du %s',
  'admin.revisions.import': 'Import d’une sauvegarde',
  'admin.revisions.manual': 'Point de sauvegarde',
  'admin.revisions.more': 'Afficher plus (%s)',
  'admin.revisions.restoreAction': 'Restaurer',
  'admin.revisions.confirmTitle': 'Revenir à cette version ?',
  'admin.revisions.confirm':
    'Tout le contenu du site reprend son état de cette version. La version actuelle reste dans l’historique : tu pourras y revenir.',
  'admin.revisions.restored': 'Version restaurée',
  'admin.revisions.missing': 'Cette version est introuvable : elle a peut-être été supprimée.',
  'admin.revisions.recordFailed':
    'Enregistré, mais la version n’a pas pu être ajoutée à l’historique (vérifie les règles Firestore).',

  // Backup
  'admin.backup.exportTitle': 'Exporter',
  'admin.backup.exportText':
    'Télécharge une sauvegarde complète en .zip : tout le contenu enregistré, avec ses images et ses PDF.',
  'admin.backup.export': 'Télécharger la sauvegarde',
  'admin.backup.exporting': 'Préparation…',
  'admin.backup.downloadFailed':
    "Les fichiers n'ont pas pu être téléchargés depuis Storage (vérifie la configuration CORS du bucket).",
  'admin.backup.restoreTitle': 'Restaurer',
  'admin.backup.restoreText':
    "Choisis une sauvegarde .zip : celle téléchargée ici, ou le dossier backup/ du projet une fois compressé. Les sections qu'elle contient remplacent le contenu actuel ; un fichier déjà présent sur Storage n'est pas renvoyé.",
  'admin.backup.pickZip': 'Choisir un .zip',
  'admin.backup.restoring': 'Restauration…',
  'admin.backup.confirmTitle': 'Remplacer le contenu ?',
  'admin.backup.confirm':
    'Le contenu actuel du site sera remplacé par celui de la sauvegarde, section par section.',
  'admin.backup.restoreAction': 'Restaurer',
  'admin.backup.restored': 'Contenu restauré',
  'admin.backup.noContent': 'Cette sauvegarde ne contient pas de fichier content.json.',
  'admin.backup.invalid':
    'Sauvegarde illisible : content.json est invalide ou un fichier référencé manque.',
  'admin.backup.formatTitle': "Format d'une sauvegarde",
  'admin.backup.formatText':
    'Un .zip avec content.json : un objet par section (settings, banner, schedule…), au format des documents Firestore content/<section>.',
  'admin.backup.formatRefs':
    'Dans content.json, une image ou un PDF n’est pas une adresse web mais un renvoi vers un fichier de la sauvegarde : « backup:images/shop/maillot.webp » désigne le fichier images/shop/maillot.webp du zip. À la restauration, ce fichier est envoyé sur Storage et le renvoi est remplacé par son adresse.',

  // Forms
  'admin.form.save': 'Enregistrer',
  'admin.form.saving': 'Enregistrement…',
  'admin.form.reset': 'Annuler les modifications',
  'admin.form.unsaved': 'Modifications non enregistrées',
  'admin.form.saved': 'Tout est enregistré',
  'admin.form.discard': 'Des modifications ne sont pas enregistrées. Les abandonner ?',
  'admin.confirm.cancel': 'Annuler',
  'admin.confirm.discardTitle': 'Quitter sans enregistrer ?',
  'admin.confirm.discard': 'Abandonner',
  'admin.form.loadError': "Le contenu n'a pas pu être chargé.",
  'admin.form.retry': 'Réessayer',
  'admin.toasts.saved': 'Modifications enregistrées',
  'admin.list.add': 'Ajouter',
  'admin.list.item': 'Élément %s',
  'admin.list.moveUp': 'Monter',
  'admin.list.moveDown': 'Descendre',
  'admin.list.remove': 'Supprimer',
  'admin.list.actions': 'Actions',
  'admin.select.missing': '— Élément supprimé, à choisir —',
  'admin.image.choose': 'Choisir une image',
  'admin.file.choose': 'Choisir un PDF',
  'admin.file.current': 'Voir le fichier actuel',
  'admin.status.open': 'Places disponibles',

  // Texts
  'admin.texts.search': 'Rechercher un texte',
  'admin.texts.onlyChanged': 'Textes modifiés uniquement',
  'admin.texts.restore': 'Texte d’origine',
  'admin.texts.markup':
    'Garde tels quels les repères <0>…</0>, <1>…</1> (mise en forme ou lien autour des mots) et %s (valeur insérée par le site, comme une date ou une adresse).',
  'admin.texts.group.nav': 'Navigation',
  'admin.texts.group.language': 'Langue',
  'admin.texts.group.footer': 'Pied de page',
  'admin.texts.group.meta': 'Référencement (titres et descriptions des pages)',
  'admin.texts.group.common': 'Textes communs',
  'admin.texts.group.home': 'Accueil',
  'admin.texts.group.schedule': 'Planning des créneaux',
  'admin.texts.group.teams': 'Équipes',
  'admin.texts.group.join': 'Rejoindre le club',
  'admin.texts.group.news': 'Actualités',
  'admin.texts.group.sessions': 'Page Créneaux',
  'admin.texts.group.cookies': 'Cookies',
  'admin.texts.group.consent': 'Contenus intégrés',
  'admin.texts.group.registration': 'Page Inscription',
  'admin.texts.group.competition': 'Page Compétition',
  'admin.texts.group.shop': 'Page Boutique',
  'admin.texts.group.lardesports': 'Partenariat LardeSports',
  'admin.texts.group.contact': 'Page Contact',
  'admin.texts.group.policy': 'Politique de données',
  'admin.texts.group.map': 'Carte des salles',
  'admin.texts.group.pdf': 'PDF des créneaux',
  'admin.texts.group.notFound': 'Page introuvable',
  'admin.texts.group.day': 'Jours',
  'admin.texts.group.unavailable': 'Site indisponible',

  // Fields
  'admin.field.email': 'Adresse mail',
  'admin.field.season': 'Saison',
  'admin.field.booklet': "Livret d'accueil (PDF)",
  'admin.field.links': 'Liens',
  'admin.field.instagram': 'Instagram',
  'admin.field.facebook': 'Facebook',
  'admin.field.whatsapp': 'Groupe WhatsApp',
  'admin.field.membership': 'Inscription en ligne',
  'admin.field.myFfbad': 'Espace licencié (MyFFBaD)',
  'admin.field.waitingList': "Liste d'attente",
  'admin.field.trialForm': "Formulaire de séance d'essai",
  'admin.field.badnet': 'Tournois (BadNet)',
  'admin.field.interclubs': 'Interclubs en direct',
  'admin.field.contactForm': 'Formulaire de contact',
  'admin.field.calendar': 'Calendrier de la saison',
  'admin.field.qrCodes': 'QR codes',
  'admin.field.qrTrial': "Séance d'essai",
  'admin.field.qrWhatsapp': 'Groupe WhatsApp',
  'admin.field.curatorFeeds': "Flux d'actualités (Curator)",
  'admin.field.bannerEnabled': 'Afficher le bandeau',
  'admin.field.bannerLabel': 'Étiquette',
  'admin.field.message': 'Message',
  'admin.field.link': 'Lien',
  'admin.field.memberships': 'Formules',
  'admin.field.name': 'Nom',
  'admin.field.membershipDescription': 'Public (page Créneaux)',
  'admin.field.priceNote': 'Précision sous le tarif',
  'admin.field.price': 'Prix (€)',
  'admin.field.youth': 'Ouverte aux jeunes',
  'admin.field.color': 'Couleur de la plume',
  'admin.field.tint': "Fond de l'étiquette",
  'admin.field.ink': "Texte de l'étiquette",
  'admin.field.slots': 'Créneaux',
  'admin.field.day': 'Jour',
  'admin.field.activity': 'Type de séance',
  'admin.field.start': 'Début',
  'admin.field.end': 'Fin',
  'admin.field.venue': 'Salle',
  'admin.field.place': 'Nom affiché du lieu',
  'admin.field.coach': 'Entraîneur',
  'admin.field.status': 'Places',
  'admin.field.audience': 'Formules concernées',
  'admin.field.isNew': 'Nouveau',
  'admin.field.activities': 'Types de séance',
  'admin.field.venues': 'Salles',
  'admin.field.area': 'Adresse ou quartier',
  'admin.field.lat': 'Latitude',
  'admin.field.lng': 'Longitude',
  'admin.field.clubShop': 'Boutique du club',
  'admin.field.stringingShop': 'Boutique du cordage',
  'admin.field.helloAsso': 'Page HelloAsso',
  'admin.field.products': 'Articles',
  'admin.field.category': 'Catégorie',
  'admin.field.categories': 'Catégories',
  'admin.field.image': 'Image',
  'admin.field.badge': 'Pastille',
  'admin.field.details': 'Description',
  'admin.field.partners': 'Partenaires',
  'admin.field.website': 'Site web',
  'admin.field.logo': 'Logo',
  'admin.field.store': 'Magasin partenaire (LardeSports)',
  'admin.field.mapUrl': 'Lien Google Maps',
  'admin.field.address': 'Adresse',
  'admin.field.phone': 'Téléphone',
  'admin.field.discounts': 'Remises',
  'admin.field.discountValue': 'Valeur',
  'admin.field.title': 'Titre',
  'admin.field.text': 'Texte',
  'admin.field.carousel': "Bandeau photo de l'accueil",
  'admin.field.photo': 'Photo',
  'admin.field.alt': 'Description de la photo',
  'admin.field.tournamentPhoto': 'Photo des tournois (page Compétition)',
  'admin.field.heroes': "Images d'en-tête des pages",
  'admin.field.previousSeason': 'Saison du bilan',
  'admin.field.seasonResults': 'Bilan de la saison passée',
  'admin.field.groupRank': 'Rang poule',
  'admin.field.playoffRank': 'Rang barrages',

  'admin.field.registrationNotice': 'Encart de la page Inscription',
  'admin.field.noticeEnabled': "Afficher l'encart",
  'admin.field.trialRules': "Règles de la séance d'essai",
  'admin.field.included': 'La cotisation comprend',
  'admin.field.levels': 'Niveaux (page Créneaux)',

  // Help
  'admin.help.richText': 'Entoure des mots de <0> et </0> pour les mettre en gras.',
  'admin.help.registrationNotice':
    "<0>…</0> met en gras, <1>…</1> devient le lien vers la liste d'attente.",
  'admin.help.season': 'Par exemple 2026-2027, repris dans le PDF des créneaux.',
  'admin.help.booklet':
    'Le PDF téléchargé depuis l’accueil, la page Inscription et le pied de page.',
  'admin.help.contactForm': 'Adresse Formspree qui reçoit les messages de la page Contact.',
  'admin.help.calendar': 'Lien « Intégrer » de Google Agenda, affiché sur la page Créneaux.',
  'admin.help.curatorFeeds':
    "Identifiants des flux Curator.io qui alimentent les actualités de l'accueil.",
  'admin.help.bannerLink':
    'Vide : premier créneau marqué Nouveau. Sinon un chemin du site (/boutique) ou une adresse complète (https://…).',
  'admin.help.memberships':
    'L’ordre est celui des pages Créneaux et Inscription. Les créneaux font référence à ces formules.',
  'admin.help.youth': 'Les créneaux ouverts à cette formule sont annoncés « tous publics ».',
  'admin.help.chipColors': 'Étiquette de la formule sur les créneaux et dans le PDF.',
  'admin.help.slots':
    'Triés automatiquement par jour et heure sur le site. Enregistre les salles et formules avant de les choisir ici.',
  'admin.help.venue': 'Les créneaux de la salle sont regroupés sur la carte.',
  'admin.help.place': 'Vide : le nom de la salle. Utile pour préciser le gymnase ou le terrain.',
  'admin.help.coach': 'Vide : jeu libre.',
  'admin.help.audience': 'Formules donnant accès à ce créneau.',
  'admin.help.isNew': 'Affiche la pastille Nouveau ; le bandeau mène au premier créneau nouveau.',
  'admin.help.activities': 'Intitulés proposés pour les créneaux.',
  'admin.help.venues': 'L’ordre est celui de la liste des salles.',
  'admin.help.coordinates':
    'Sur Google Maps, clic droit sur la salle puis clic sur les coordonnées pour les copier (latitude, longitude).',
  'admin.help.categories': 'Filtres de la boutique du club, dans cet ordre.',
  'admin.help.badge': 'Vide : pas de pastille.',
  'admin.help.details': 'Une puce par ligne. Sur téléphone, seule la première est affichée.',
  'admin.help.partners': 'Logos du pied de page, dans cet ordre.',
  'admin.help.store': 'Partenariat présenté en bas de la page Boutique.',
  'admin.help.alt': 'Lue par les lecteurs d’écran à la place de la photo.',
  'admin.help.carousel': 'Défile en boucle sous la section « Envie de nous rejoindre ? ».',
  'admin.help.heroes': 'Photo assombrie derrière le titre de chaque page.',
  'admin.help.previousSeason': 'Par exemple 2025/2026.',
  'admin.help.seasonResults': 'Rang barrages : 0 si l’équipe ne les a pas joués.',

  'admin.errors.server': 'Le serveur ne répond pas, réessaie dans un instant.',
  'admin.errors.permissionDenied': "Ton compte n'a pas les droits pour cette action.",
  'admin.errors.signIn': 'La connexion a échoué, réessaie.',
  'admin.errors.unexpected': 'Une erreur inattendue est survenue.'
};
