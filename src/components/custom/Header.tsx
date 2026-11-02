import { useRef, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/custom/LanguageSwitcher';
import { useCollapse } from '@/hooks/use-collapse';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import { featuredSlotPath } from '@/core/schedule';
import { cn, isExternalUrl } from '@/core/utils';
import logo from '@/assets/images/logo-rec.png';

interface NavItem {
  to: string;
  labelKey: string;
}

const LEFT_LINKS: NavItem[] = [
  { to: Constants.ROUTE_HOME, labelKey: 'nav.home' },
  { to: Constants.ROUTE_SCHEDULE, labelKey: 'nav.sessions' },
  { to: Constants.ROUTE_REGISTRATION, labelKey: 'nav.registration' }
];

const RIGHT_LINKS: NavItem[] = [
  { to: Constants.ROUTE_COMPETITION, labelKey: 'nav.competition' },
  { to: Constants.ROUTE_SHOP, labelKey: 'nav.shop' },
  { to: Constants.ROUTE_CONTACT, labelKey: 'nav.contact' }
];

const linkClassName = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'font-display text-xl font-bold tracking-wider uppercase transition-colors hover:text-brand',
    isActive ? 'text-brand' : 'text-ink'
  );

const BANNER_LINK_CLASS: string = 'hover:underline';

// an absolute URL leaves the site, anything else is a site path
const BannerLink = ({ href, children }: { href: string; children: ReactNode }) =>
  isExternalUrl(href) ? (
    <a href={href} target="_blank" rel="noreferrer" className={BANNER_LINK_CLASS}>
      {children}
    </a>
  ) : (
    <Link to={href} className={BANNER_LINK_CLASS}>
      {children}
    </Link>
  );

const Banner = () => {
  const { localize } = useLanguage();
  const { banner, schedule } = useSiteContent();
  if (!banner.enabled) return null;

  return (
    <div className="bg-brand text-[15px] text-white">
      <div className="container-site py-1.5 sm:text-center">
        <BannerLink href={banner.link || featuredSlotPath(schedule.slots)}>
          <span className="mr-3 bg-white px-2 font-display font-extrabold tracking-wider text-brand uppercase">
            {localize(banner.label)}
          </span>
          <span className="italic">{localize(banner.message)}</span>
        </BannerLink>
      </div>
    </div>
  );
};

const Header = () => {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const { state, style, toggle, close } = useCollapse(panelRef);
  const isOpen: boolean = state === 'shown' || state === 'showing';

  const renderDesktopLink = (item: NavItem) => (
    <NavLink
      key={item.to}
      to={item.to}
      end
      className={(status: { isActive: boolean }) =>
        cn(
          linkClassName(status),
          'border-b-3 px-1.5 pt-7 pb-6',
          status.isActive ? 'border-ink' : 'border-transparent'
        )
      }
    >
      {t(item.labelKey)}
    </NavLink>
  );

  return (
    <>
      <Banner />
      <header className="sticky top-0 z-40 bg-white shadow-[inset_0_-3px_0_var(--color-brand)]">
        <nav
          aria-label={t('nav.main')}
          className="container-site hidden min-h-21 items-center lg:flex"
        >
          <div className="flex flex-1 justify-around">{LEFT_LINKS.map(renderDesktopLink)}</div>
          <Link
            to={Constants.ROUTE_HOME}
            aria-label={t('nav.homeLink')}
            className="relative block h-21 w-42 shrink-0"
          >
            <span className="absolute inset-x-3 top-18 h-18 rounded-b-full bg-brand" />
            <img
              src={logo}
              alt=""
              className="absolute top-1.5 left-4.5 size-33 rounded-full bg-white shadow-[0_6px_18px_rgba(20,24,22,0.25)]"
            />
          </Link>
          <div className="flex flex-1 justify-around">{RIGHT_LINKS.map(renderDesktopLink)}</div>
        </nav>

        <div className="container-site flex min-h-18 items-center justify-between lg:hidden">
          <Link to={Constants.ROUTE_HOME} onClick={close} className="flex items-center gap-3">
            <img src={logo} alt="" className="size-12 rounded-full" />
            <span className="font-display text-2xl font-extrabold tracking-wide">
              REC BADMINTON
            </span>
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={t(isOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            className="flex size-12 items-center justify-center text-ink"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div
          id="mobile-menu"
          ref={panelRef}
          style={style}
          className={cn('border-t border-line bg-white lg:hidden', state === 'hidden' && 'hidden')}
        >
          <nav aria-label={t('nav.mobile')} className="container-site flex flex-col py-3">
            {[...LEFT_LINKS, ...RIGHT_LINKS].map((item: NavItem) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={close}
                className={(status: { isActive: boolean }) => cn(linkClassName(status), 'py-3')}
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
            <LanguageSwitcher tone="light" className="mt-3 border-t border-line pt-5 pb-2" />
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
