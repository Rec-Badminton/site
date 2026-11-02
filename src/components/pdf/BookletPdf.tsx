import type { ReactNode } from 'react';
import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ContentPage, CoverPage, Label, LinkButton, LinkIcon } from '@/components/pdf/components';
import { base, colors, DISPLAY, MARGIN } from '@/components/pdf/theme';
import { Constants } from '@/core/constants';
import type { SettingsLinks, SiteContent } from '@/core/content/types';
import { mailTo } from '@/core/utils';
import { placeUrl, venuesWithSlots, type VenueWithSlots } from '@/core/venues';
import logo from '@/assets/images/logo-rec.png';
import coverPhoto from '../../../backup/images/photos/match-men-doubles-thumbs-up.jpg';
import clubPhoto from '../../../backup/images/photos/match-men-doubles-net.jpg';
import eventsPhoto from '@/assets/images/booklet/events.jpg';
import whatsappQrCode from '../../../backup/images/qr-whatsapp.png';
import lardeSportsLogo from '../../../backup/images/partners/larde-sports.png';
import antoineTouzan from '@/assets/images/booklet/antoine-touzan.jpg';
import maenaRenault from '@/assets/images/booklet/maena-renault.jpg';
import maximePattier from '@/assets/images/booklet/maxime-pattier.jpg';
import jadeLize from '@/assets/images/booklet/jade-lize.jpg';
import romainBarbe from '@/assets/images/booklet/romain-barbe.jpg';
import pierreRodriguez from '@/assets/images/booklet/pierre-rodriguez.jpg';
import loris from '@/assets/images/booklet/loris.jpg';
import carla from '@/assets/images/booklet/carla.jpg';
import leo from '@/assets/images/booklet/leo.jpg';
import tuong from '@/assets/images/booklet/tuong.jpg';
import backup from '../../../backup/content.json';

interface Person {
  name: string;
  role: string;
  photo: string;
}

const BOARD: Person[] = [
  { name: 'Antoine Touzan', role: 'Président', photo: antoineTouzan },
  { name: 'Maena Renault', role: 'Trésorière', photo: maenaRenault },
  { name: 'Maxime Pattier', role: 'Secrétaire', photo: maximePattier },
  { name: 'Jade Lizé', role: 'Vice-présidente', photo: jadeLize },
  { name: 'Romain Barbé', role: 'Vice-trésorier', photo: romainBarbe },
  { name: 'Pierre Rodriguez', role: 'Vice-secrétaire', photo: pierreRodriguez }
];

const COACHES: Person[] = [
  { name: 'Loris', role: 'Mardi à la Harpe\nJeudi à Montbarrot', photo: loris },
  { name: 'Carla', role: 'Mardi à la Harpe\nJeudi à Vern', photo: carla },
  { name: 'Tuong', role: 'Lundi à la Harpe', photo: tuong },
  { name: 'Léo', role: 'Mercredi à la Binquenais', photo: leo }
];

const COMMISSIONS: { role: string; name: string }[] = [
  { role: 'Interclubs', name: 'Pierre' },
  { role: 'Entraîneurs', name: 'Lou-Anne' },
  { role: 'Matériel', name: 'Corentin' },
  { role: 'Communication', name: 'Lola' },
  { role: 'Évènements', name: 'Théa' },
  { role: 'Salles', name: 'Enora' },
  { role: 'Site web', name: 'Thibaut' },
  { role: 'Sponsoring', name: 'Romain' },
  { role: 'Projet & développement', name: 'Colin' },
  { role: 'Tournoi', name: 'Antoine' }
];

const STATS: { value: string; label: string; detail?: string }[] = [
  { value: '287', label: 'adhérents', detail: '186 hommes, 107 femmes' },
  { value: '75 %', label: 'de séniors', detail: 'de 18 à 39 ans' },
  { value: '20 %', label: "d'étudiants" },
  { value: '11', label: 'équipes interclubs' },
  { value: '14', label: 'créneaux' },
  { value: '9', label: 'gymnases' }
];

const TEAMS: string[] = ['N3', 'PN', 'R2', 'PR', 'D1', 'D2', 'D3', 'D4', 'D5', 'D2H', 'D3H'];

// keep in sync with the page order below
const CONTENTS: { page: number; title: string; anchor: string }[] = [
  { page: 3, title: 'Le club et sa structure', anchor: 'club' },
  { page: 7, title: "S'inscrire au REC", anchor: 'inscription' },
  { page: 10, title: 'Les évènements du club', anchor: 'evenements' },
  { page: 12, title: 'Notre partenaire Larde Sports', anchor: 'partenaire' },
  { page: 13, title: 'La boutique et le cordage', anchor: 'boutique' },
  { page: 14, title: 'Les interclubs', anchor: 'interclubs' }
];

const LARDE_SPORTS_ADDRESS: string =
  'Larde Sports, 4 rue des Potiers, 35230 Noyal-Châtillon-sur-Seiche';
// printed once a season from the content backup, then uploaded from the back office
const CONTENT: SiteContent = backup as unknown as SiteContent;
const SEASON: string = CONTENT.settings.season;
const EMAIL: string = CONTENT.settings.email;
const LINKS: SettingsLinks = CONTENT.settings.links;
const SITE: string = Constants.SITE_URL.replace('https://', '');
const FOOTER: string = `REC Badminton · Livret d'accueil ${SEASON}`;

const s = StyleSheet.create({
  lead: { fontSize: 13.5, marginBottom: 18 },
  paragraph: { fontSize: 11.5, marginBottom: 12 },
  subtitle: { ...base.displayTitle, fontSize: 30, marginTop: 28, marginBottom: 12 },
  tileValue: { fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, lineHeight: 1 },
  tileLabel: { ...base.eyebrow, fontSize: 14, lineHeight: 1.1, marginTop: 6 },
  portraitName: {
    ...base.eyebrow,
    fontSize: 16,
    color: colors.brand,
    marginTop: 10,
    textAlign: 'center'
  },
  portraitRole: { fontSize: 10.5, color: colors.muted, textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }
});

const Strong = ({ children }: { children: ReactNode }) => (
  <Text style={base.strong}>{children}</Text>
);

const Bullet = ({ children }: { children: ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8, fontSize: 11.5 }}>
    <View style={{ width: 7, height: 7, marginTop: 5.5, backgroundColor: colors.brand }} />
    <Text style={{ flex: 1 }}>{children}</Text>
  </View>
);

const Portrait = ({ person, size }: { person: Person; size: number }) => (
  <View style={{ width: size }}>
    <Image src={person.photo} style={{ width: size, height: size, objectFit: 'cover' }} />
    <Text style={s.portraitName}>{person.name}</Text>
    <Text style={s.portraitRole}>{person.role}</Text>
  </View>
);

const Callout = ({ title, children }: { title: string; children?: ReactNode }) => (
  <View
    style={{
      backgroundColor: colors.brand,
      color: colors.white,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginTop: 10
    }}
  >
    <Label size={19} paddingX={0} paddingY={2} style={{ alignItems: 'flex-start' }}>
      {title}
    </Label>
    {children && <Text style={{ fontSize: 11, marginTop: 4 }}>{children}</Text>}
  </View>
);

const Contents = () => (
  <ContentPage eyebrow="Au programme" title="Sommaire" footer={FOOTER} tone="deep">
    <View style={{ gap: 10, marginTop: 20 }}>
      {CONTENTS.map(({ page, title, anchor }) => (
        <Link
          key={anchor}
          src={`#${anchor}`}
          style={{ textDecoration: 'none', color: colors.white }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inkSoft }}
          >
            <Label
              size={26}
              background={colors.brand}
              paddingX={0}
              paddingY={16}
              style={{ width: 64 }}
            >
              {page}
            </Label>
            <Label size={24} paddingX={22} paddingY={16}>
              {title}
            </Label>
          </View>
        </Link>
      ))}
    </View>
  </ContentPage>
);

const Venues = () => {
  const venues: VenueWithSlots[] = venuesWithSlots(
    CONTENT.venues.items,
    CONTENT.schedule.slots
  ).filter((venue: VenueWithSlots) => venue.slots.length > 0);
  return (
    <ContentPage eyebrow="S'inscrire au REC" title="Les gymnases" footer={FOOTER}>
      <Text style={s.lead}>
        Nos créneaux se répartissent sur {venues.length} salles à Rennes et alentours. Horaires
        détaillés sur la page « Créneaux » du site.
      </Text>
      <View style={s.row}>
        {venues.map((venue: VenueWithSlots, index: number) => (
          <View
            key={venue.id}
            style={{ width: 245, height: 126, backgroundColor: colors.sand, padding: 14, gap: 4 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Label size={14} background={colors.ink} paddingX={0} style={{ width: 28 }}>
                {index + 1}
              </Label>
              <Text
                style={{
                  flex: 1,
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 16,
                  lineHeight: 1.1
                }}
              >
                {venue.name}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: colors.muted }}>{venue.area}</Text>
            <LinkButton
              href={placeUrl(`${venue.lat},${venue.lng}`)}
              size={10}
              style={{ marginTop: 'auto' }}
            >
              Voir sur Google Maps
            </LinkButton>
          </View>
        ))}
      </View>
    </ContentPage>
  );
};

// Welcome booklet; rebuild the public PDF with `npm run pdf:booklet`.
const BookletPdf = () => (
  <Document title={`Rec Badminton - Livret d'accueil ${SEASON}`} author={Constants.COMPANY_NAME}>
    <CoverPage
      photo={coverPhoto}
      logo={logo}
      eyebrow="Livret d'accueil"
      title="Bienvenue"
      accent="au REC"
      season={`Saison ${SEASON}`}
      site={SITE}
      handle="@recbadminton"
    />

    <Contents />

    <ContentPage
      eyebrow="Le club et sa structure"
      title="Le REC, c'est qui ?"
      footer={FOOTER}
      anchor="club"
    >
      <Text style={s.lead}>
        Le Rennes Étudiants Club Badminton a été créé en 1986, pour une première affiliation en
        1995. Le REC en quelques chiffres* :
      </Text>
      <View style={s.row}>
        {STATS.map((stat, index: number) => {
          const dark: boolean = index % 2 === 1;
          return (
            <View
              key={stat.label}
              style={{
                width: 160.4,
                height: 118,
                padding: 14,
                backgroundColor: index === 0 ? colors.brand : dark ? colors.ink : colors.sand,
                color: index === 0 || dark ? colors.white : colors.ink
              }}
            >
              <Text style={s.tileValue}>{stat.value}</Text>
              <Text style={s.tileLabel}>{stat.label}</Text>
              {stat.detail && (
                <Text style={{ fontSize: 9.5, opacity: 0.85, marginTop: 2 }}>{stat.detail}</Text>
              )}
            </View>
          );
        })}
      </View>
      <Text style={{ fontSize: 9, color: colors.muted, marginTop: 8 }}>*Saison 2025-2026</Text>
      <Image
        src={clubPhoto}
        style={{ width: '100%', height: 190, objectFit: 'cover', marginTop: 18 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <Text style={{ fontSize: 11.5 }}>Suis-nous sur les réseaux :</Text>
        <LinkButton href={LINKS.instagram}>@recbadminton</LinkButton>
      </View>
    </ContentPage>

    <ContentPage
      eyebrow="Le club et sa structure"
      title="Le mot du président"
      footer={FOOTER}
      tone="sand"
    >
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <Text
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 0.8,
            color: colors.brand
          }}
        >
          “
        </Text>
        <View style={{ flex: 1, fontSize: 11.5, lineHeight: 1.55 }}>
          <Text style={{ marginBottom: 12 }}>
            À l'origine étudiant, c'est aujourd'hui un club ouvert à tous ! Que tu sois jeune ou
            moins jeune, étudiant ou actif, joueur loisir ou compétiteur acharné, le club sera
            heureux de t'accueillir ! Le REC Badminton propose des créneaux de jeu libre ou
            d'entraînement de tout niveau tout au long de la semaine.
          </Text>
          <Text style={{ marginBottom: 12 }}>
            Le REC, c'est avant tout <Strong>un club convivial</Strong> ! Nous proposons tout au
            long de l'année des activités pour favoriser le partage entre les licenciés de tout
            niveau : tournois internes, galette des rois, accueil de rencontres, sorties, et bien
            d'autres surprises… Tu l'auras compris, bonne humeur, rencontres, sueur et courbatures
            seront au rendez-vous.
          </Text>
          <Text style={{ marginBottom: 12 }}>
            Le REC, c'est aussi <Strong>un club sportif et compétitif</Strong> ! Nous venons tout
            récemment d'accéder au niveau national avec notre première équipe d'interclubs. C'est un
            nouveau défi que l'on a hâte de partager tous ensemble !
          </Text>
          <Text style={{ marginBottom: 12 }}>
            Et enfin, le REC c'est <Strong>une association</Strong> qui doit son fonctionnement à
            l'investissement de ses bénévoles. Qu'importent tes compétences ou tes envies, il y a
            forcément une petite place quelque part pour toi. C'est en donnant chacun un peu de
            notre temps qu'avec nos presque 300 adhérents, nous avons pu faire grandir ce beau
            projet. Et je compte sur toi pour voir les choses encore plus grandes !
          </Text>
          <Text style={{ marginBottom: 20 }}>
            En espérant que tu y as trouvé ton compte et te recroiser sur les terrains, je te
            souhaite une agréable saison de badminton !
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 34, height: 3, backgroundColor: colors.brand }} />
            <Text style={[base.eyebrow, { fontSize: 15, lineHeight: 1 }]}>
              Antoine Touzan, président
            </Text>
          </View>
        </View>
      </View>
    </ContentPage>

    <ContentPage eyebrow="Le club et sa structure" title="Le bureau" footer={FOOTER}>
      <Text style={[s.lead, { color: colors.muted }]}>Saison {SEASON}</Text>
      {[BOARD.slice(0, 3), BOARD.slice(3)].map((row: Person[]) => (
        <View
          key={row[0]?.name}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}
        >
          {row.map((person: Person) => (
            <Portrait key={person.name} person={person} size={150} />
          ))}
        </View>
      ))}
    </ContentPage>

    <ContentPage eyebrow="Le club et sa structure" title="Les commissions" footer={FOOTER}>
      <Text style={s.lead}>
        Un <Text style={{ color: colors.brand, fontWeight: 700 }}>responsable</Text> pour chaque
        composante clé du club, et des bénévoles pour soutenir les actions pendant l'année.
      </Text>
      <View style={s.row}>
        {COMMISSIONS.map(({ role, name }, index: number) => {
          const dark: boolean = [0, 3, 4, 7, 8].includes(index);
          return (
            <View
              key={role}
              style={{
                width: 245,
                height: 82,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: dark ? colors.ink : colors.sand,
                color: dark ? colors.white : colors.ink
              }}
            >
              <View style={{ width: 5, height: 40, backgroundColor: colors.brand }} />
              <View>
                <Text style={{ ...base.eyebrow, fontSize: 18, lineHeight: 1.1 }}>{role}</Text>
                <Text
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    marginTop: 2,
                    color: dark ? colors.brandLight : colors.brand
                  }}
                >
                  {name}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ContentPage>

    <ContentPage
      eyebrow="S'inscrire au REC"
      title="Les inscriptions"
      footer={FOOTER}
      anchor="inscription"
    >
      <Text style={s.paragraph}>
        Merci de lire attentivement la page « Inscription » de notre site. Ensuite, tout se passe en
        ligne sur la plateforme sécurisée de la FFBaD :
      </Text>
      <LinkButton href={LINKS.membership} size={16} style={{ marginBottom: 24 }}>
        {LINKS.membership.replace('https://', '')}
      </LinkButton>
      <Bullet>
        <Strong>Moyens de paiement :</Strong> carte bancaire, chèques vacances.
      </Bullet>
      <Bullet>
        <Strong>Aides :</Strong> dispositifs Pass'Sport et Sortir!, réduction pour les étudiants.
      </Bullet>
      <Bullet>
        <Strong>Tarifs et créneaux :</Strong> tous les détails sur les pages « Inscription » et
        « Créneaux » du site.
      </Bullet>
      <Callout title="Attention : nos créneaux se remplissent très vite !">
        Inscris-toi dès l'ouverture pour garder ta place.
      </Callout>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 28 }}>
        <LinkButton href={`${Constants.SITE_URL}${Constants.ROUTE_REGISTRATION}`}>
          Page inscription
        </LinkButton>
        <LinkButton href={`${Constants.SITE_URL}${Constants.ROUTE_SCHEDULE}`}>
          Page créneaux
        </LinkButton>
      </View>
    </ContentPage>

    <Venues />

    <ContentPage eyebrow="S'inscrire au REC" title="Les entraîneurs" footer={FOOTER} tone="sand">
      {[COACHES.slice(0, 2), COACHES.slice(2)].map((row: Person[]) => (
        <View
          key={row[0]?.name}
          style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}
        >
          {row.map((coach: Person) => (
            <Portrait key={coach.name} person={coach} size={170} />
          ))}
        </View>
      ))}
      <Text style={[s.paragraph, { color: colors.muted, marginTop: 6 }]}>
        Les entraînements adultes sont répartis par niveau : débutants et intermédiaires le lundi,
        compétiteurs confirmés le mardi et le jeudi. Les jeunes s'entraînent le mercredi.
      </Text>
    </ContentPage>

    <ContentPage
      eyebrow="La vie du club"
      title="Les évènements"
      footer={FOOTER}
      anchor="evenements"
    >
      <Text style={s.lead}>
        Nous proposons différents types d'évènements pour créer une cohésion de club et tisser de
        nouvelles amitiés : tournoi interne de Noël, laser games, soirée galette des rois, pot
        d'interclubs…
      </Text>
      <Image src={eventsPhoto} style={{ width: '100%', height: 374, objectFit: 'cover' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18 }}>
        <Text style={{ fontSize: 11.5 }}>Suis nos aventures sur Instagram :</Text>
        <LinkButton href={LINKS.instagram}>@recbadminton</LinkButton>
      </View>
    </ContentPage>

    <ContentPage
      eyebrow="La vie du club"
      title="La communauté WhatsApp"
      footer={FOOTER}
      tone="dark"
    >
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Link src={LINKS.whatsapp}>
          <View style={{ backgroundColor: colors.white, padding: 14 }}>
            <Image src={whatsappQrCode} style={{ width: 230, height: 230 }} />
          </View>
        </Link>
        <LinkButton
          href={LINKS.whatsapp}
          size={13}
          background={colors.brand}
          style={{ alignSelf: 'center', marginTop: 16 }}
        >
          Rejoindre la communauté
        </LinkButton>
      </View>
      <View style={{ marginTop: 30, fontSize: 12, color: colors.softWhite }}>
        <Text style={{ marginBottom: 12, color: colors.white, fontSize: 13.5 }}>
          Scanne ce QR code avec l'appareil photo ou WhatsApp pour rejoindre la communauté du REC.
        </Text>
        <Text style={{ marginBottom: 12 }}>
          Pense à bien indiquer{' '}
          <Text style={{ color: colors.white, fontWeight: 700 }}>
            ton prénom dans les paramètres
          </Text>{' '}
          de WhatsApp : on te reconnaît plus facilement et les discussions sont plus simples.
        </Text>
        <Text>
          Une question pour le bureau ? Pose-la dans le canal{' '}
          <Text style={{ color: colors.white, fontWeight: 700 }}>« Contact Bureau »</Text>.
        </Text>
      </View>
    </ContentPage>

    <ContentPage eyebrow="Partenaire" title="Larde Sports" footer={FOOTER} anchor="partenaire">
      <Image src={lardeSportsLogo} style={{ position: 'absolute', right: 0, top: 6, width: 140 }} />
      <Text style={s.lead}>
        Notre partenaire Larde Sports, spécialiste des sports de raquette, offre ces avantages aux
        licenciés du REC :
      </Text>
      <View style={s.row}>
        {[
          { value: '−30 %', label: 'RSL et Forza*', color: colors.brand },
          { value: '−20 %', label: 'Autres marques*', color: colors.ink },
          { value: '15-17 €', label: 'Cordage raquette', color: colors.inkSoft }
        ].map(({ value, label, color }) => (
          <View
            key={label}
            style={{
              width: 160.4,
              height: 104,
              padding: 14,
              backgroundColor: color,
              color: colors.white
            }}
          >
            <Text style={s.tileValue}>{value}</Text>
            <Text style={s.tileLabel}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 9.5, color: colors.muted, marginTop: 8, marginBottom: 24 }}>
        *Sur les prix publics conseillés, hors volants et balles, matériel club et court, articles
        en promotion, soldes ou déstockage. Le cordage se commande sur la boutique du site.
      </Text>
      <Text style={s.subtitle}>Où en profiter ?</Text>
      <Bullet>
        En magasin à Rennes (Noyal-Châtillon-sur-Seiche), Nantes-Vertou ou Vannes-Séné
      </Bullet>
      <Bullet>Par téléphone ou par mail, avec paiement par carte et livraison possibles</Bullet>
      <Bullet>Sur les stands Larde Sports en Bretagne, Loire-Atlantique et Vendée</Bullet>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
        <LinkButton href={placeUrl(LARDE_SPORTS_ADDRESS)}>
          Magasin de Rennes sur Google Maps
        </LinkButton>
        <LinkButton href="https://www.lardesports.com/">lardesports.com</LinkButton>
      </View>
    </ContentPage>

    <ContentPage
      eyebrow="Boutique"
      title="La boutique"
      footer={FOOTER}
      tone="sand"
      anchor="boutique"
    >
      <Text style={s.paragraph}>
        Le club propose des <Strong>volants à tarifs préférentiels</Strong> sur la boutique du site,
        via la plateforme HelloAsso. Cette boutique est réservée aux licenciés du REC Badminton.
        Pour récupérer tes volants, envoie un message à la personne référente : ses coordonnées sont
        indiquées à la fin de ton achat.
      </Text>
      <Text style={s.paragraph}>
        Le club propose aussi des <Strong>textiles en précommande</Strong>, pour éviter les surplus
        de stock. Une séance d'essayage est généralement organisée à la rentrée.
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 18,
          backgroundColor: colors.brand,
          color: colors.white,
          paddingHorizontal: 18,
          paddingVertical: 14
        }}
      >
        <Label size={44} paddingX={0} paddingY={0}>
          25 €
        </Label>
        <Text style={{ flex: 1, fontSize: 12 }}>
          Le prix du maillot du club, grâce à la participation du REC à son financement.
        </Text>
      </View>
      <LinkButton href={`${Constants.SITE_URL}${Constants.ROUTE_SHOP}`} style={{ marginTop: 16 }}>
        Boutique du site
      </LinkButton>

      <Text style={s.subtitle}>Le cordage</Text>
      <Text style={s.paragraph}>
        Aymeric De Tombeur, licencié au REC, travaille aussi chez Larde Sports. Il récupère ta
        raquette lors d'un créneau où il est présent, la fait recorder au magasin et te la rend sur
        un prochain créneau.
      </Text>
      <Text style={s.paragraph}>
        Le règlement se fait sur la page « Boutique » du site, par carte via HelloAsso.{' '}
        <Text style={{ fontStyle: 'italic', color: colors.muted }}>
          Tu peux décocher la contribution financière à HelloAsso à la fin du paiement.
        </Text>{' '}
        Aymeric est aussi disponible pour te conseiller :
      </Text>
      <LinkButton href="mailto:aymeric@avenuedusport.com">aymeric@avenuedusport.com</LinkButton>
    </ContentPage>

    <ContentPage
      eyebrow="Compétition"
      title="Les interclubs"
      footer={FOOTER}
      tone="dark"
      anchor="interclubs"
    >
      <Text style={[s.lead, { color: colors.softWhite }]}>
        Pour la saison {SEASON}, le REC aligne 11 équipes :
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 26 }}>
        {TEAMS.map((team: string, index: number) => (
          <Label
            key={team}
            size={18}
            background={index === 0 ? colors.brand : colors.inkSoft}
            paddingX={8}
          >
            {team}
          </Label>
        ))}
      </View>
      <View style={{ fontSize: 12, color: colors.softWhite }}>
        <Text style={{ marginBottom: 12 }}>
          Tu souhaites rejoindre une équipe ?{' '}
          <Text style={{ color: colors.white, fontWeight: 700 }}>Envoie-nous un mail</Text> avec ton
          classement, tes tableaux préférés et ce que tu recherches en intégrant une équipe.
        </Text>
        <Text style={{ marginBottom: 12 }}>
          Les demandes sont nombreuses : nous privilégions les joueurs licenciés au REC depuis au
          moins un an, et le nombre de joueurs mutés par rencontre est limité.
        </Text>
        <Text style={{ color: colors.mutedLight, fontStyle: 'italic', marginBottom: 24 }}>
          En cours de saison, les équipes sont sûrement déjà constituées : retente ta chance l'année
          prochaine !
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <LinkButton href={mailTo(EMAIL)} background={colors.brand}>
          {EMAIL}
        </LinkButton>
        <LinkButton href={LINKS.interclubs} background={colors.inkSoft}>
          Résultats en direct
        </LinkButton>
      </View>
    </ContentPage>

    <Page
      size="A4"
      style={[
        base.page,
        {
          backgroundColor: colors.brand,
          color: colors.white,
          padding: MARGIN,
          justifyContent: 'space-between'
        }
      ]}
    >
      <Image
        src={logo}
        style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.white }}
      />
      <View>
        <Text style={[base.displayTitle, { fontSize: 92 }]}>À bientôt</Text>
        <Text style={[base.displayTitle, { fontSize: 92, color: colors.ink }]}>
          sur les terrains !
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        {[
          { label: 'Site', value: SITE, href: Constants.SITE_URL },
          { label: 'Mail', value: EMAIL, href: mailTo(EMAIL) },
          { label: 'Réseaux', value: '@recbadminton', href: LINKS.instagram }
        ].map(({ label, value, href }) => (
          <Link key={label} src={href} style={{ textDecoration: 'none', color: colors.white }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Label size={13} background={colors.ink} style={{ width: 80 }}>
                {label}
              </Label>
              <Label size={19} paddingX={0}>
                {value}
              </Label>
              <LinkIcon size={15} color={colors.white} />
            </View>
          </Link>
        ))}
      </View>
    </Page>
  </Document>
);

export default BookletPdf;
