import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { Mail } from 'lucide-react';
import LanguageSwitcher from '@/components/custom/LanguageSwitcher';
import DownloadLink from '@/components/ui/DownloadLink';
import OutboundLink from '@/components/ui/OutboundLink';
import SchedulePdfButton from '@/components/sections/SchedulePdfButton';
import { FacebookIcon, InstagramIcon, WhatsappIcon } from '@/components/ui/SocialIcons';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Partner, Settings } from '@/core/content/types';
import { cn, mailTo } from '@/core/utils';
import logoNegative from '@/assets/images/logo-rec-negative.png';

interface FooterLink {
  labelKey: string;
  to?: string;
  href?: string;
  download?: boolean;
  schedulePdf?: boolean;
}

interface SocialLink {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const socialLinks = (settings: Settings): SocialLink[] => [
  { href: settings.links.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: settings.links.facebook, label: 'Facebook', Icon: FacebookIcon },
  { href: settings.links.whatsapp, label: 'footer.whatsappLabel', Icon: WhatsappIcon }
];

const columns = (settings: Settings): { titleKey: string; links: FooterLink[] }[] => [
  {
    titleKey: 'footer.club',
    links: [
      { labelKey: 'nav.home', to: Constants.ROUTE_HOME },
      { labelKey: 'nav.sessions', to: Constants.ROUTE_SCHEDULE },
      { labelKey: 'nav.registration', to: Constants.ROUTE_REGISTRATION },
      { labelKey: 'nav.competition', to: Constants.ROUTE_COMPETITION },
      { labelKey: 'nav.shop', to: Constants.ROUTE_SHOP },
      { labelKey: 'nav.contact', to: Constants.ROUTE_CONTACT }
    ]
  },
  {
    titleKey: 'footer.practical',
    links: [
      { labelKey: 'footer.booklet', href: settings.booklet, download: true },
      { labelKey: 'schedule.export', schedulePdf: true },
      { labelKey: 'footer.prices', to: `${Constants.ROUTE_REGISTRATION}#tarifs` },
      { labelKey: 'footer.waitlist', href: settings.links.waitingList },
      { labelKey: 'footer.interclubs', href: settings.links.interclubs },
      { labelKey: 'footer.tournaments', href: settings.links.badnet }
    ]
  }
];

const LINK_CLASS: string =
  'inline-flex items-center gap-2 text-[#d6d2cb] transition-colors hover:text-white';

const FooterNavLink = ({ link }: { link: FooterLink }) => {
  const { t } = useI18n();
  if (link.to) {
    return (
      <Link to={link.to} className={LINK_CLASS}>
        {t(link.labelKey)}
      </Link>
    );
  }
  if (link.schedulePdf) {
    return <SchedulePdfButton className={cn(LINK_CLASS, 'text-left uppercase')} />;
  }
  if (!link.href) return null;
  if (link.download) {
    return (
      <DownloadLink href={link.href} className={LINK_CLASS}>
        {t(link.labelKey)}
      </DownloadLink>
    );
  }
  return (
    <OutboundLink href={link.href} className={LINK_CLASS}>
      {t(link.labelKey)}
    </OutboundLink>
  );
};

const ColumnTitle = ({ children }: { children: string }) => (
  <h2 className="eyebrow mb-4 text-xl text-brand-light">{children}</h2>
);

const Footer = () => {
  const { t } = useI18n();
  const { settings, partners } = useSiteContent();
  return (
    <footer className="border-t-6 border-brand bg-ink-deep text-white">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-5">
          <Link to={Constants.ROUTE_HOME} className="flex items-center gap-4">
            <img src={logoNegative} alt="" className="size-20" />
            <span className="display-title text-4xl">REC Badminton</span>
          </Link>
          <p className="max-w-xs text-[#d6d2cb]">{t('footer.tagline')}</p>
          <ul className="flex gap-2">
            {socialLinks(settings).map(({ href, label, Icon }: SocialLink) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t(label)}
                  className="flex size-12 items-center justify-center bg-ink-soft transition-colors hover:bg-brand"
                >
                  <Icon className="size-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns(settings).map(({ titleKey, links }) => (
          <nav key={titleKey} aria-label={t(titleKey)}>
            <ColumnTitle>{t(titleKey)}</ColumnTitle>
            <ul className="flex flex-col gap-2.5 font-display text-lg font-semibold tracking-wide uppercase">
              {links.map((link: FooterLink) => (
                <li key={link.labelKey}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <ColumnTitle>{t('footer.write')}</ColumnTitle>
          <a
            href={mailTo(settings.email)}
            className="mb-4 flex items-center gap-3 font-semibold hover:text-brand-light"
          >
            <Mail className="size-5 shrink-0 text-brand-light" aria-hidden="true" />
            {settings.email}
          </a>
          <p className="mb-5 text-[15px] text-[#d6d2cb]">{t('footer.whatsapp')}</p>
          <Link to={Constants.ROUTE_CONTACT} className="btn btn-primary">
            {t('footer.contactUs')}
          </Link>
        </div>
      </div>

      <div className="container-site">
        <div className="flex flex-col gap-5 border-t border-ink-soft py-8 lg:flex-row lg:items-center lg:gap-8">
          <h2 className="eyebrow shrink-0 text-base leading-tight text-muted-light lg:w-36">
            {t('footer.partners')}
          </h2>
          <ul className="grid grow grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
            {partners.items.map((partner: Partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col bg-white transition-transform hover:-translate-y-1"
                >
                  <span className="flex h-14 items-center justify-center px-3 py-2">
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt=""
                        loading="lazy"
                        className="max-h-full max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
                      />
                    )}
                  </span>
                  <span className="flex grow items-center justify-center border-t border-line px-1.5 py-1 text-center font-display text-xs leading-tight font-bold tracking-wide text-ink uppercase transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    {partner.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 text-sm text-[#a9a49c]">
        <span>{t('footer.copyright', String(Constants.COPYRIGHT_YEAR))}</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link to={Constants.ROUTE_DATA_POLICY} className="hover:text-white hover:underline">
            {t('footer.dataPolicy')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
