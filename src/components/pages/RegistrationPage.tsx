import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { Check, ExternalLink, TriangleAlert } from 'lucide-react';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import OutboundLink from '@/components/ui/OutboundLink';
import DownloadLink from '@/components/ui/DownloadLink';
import ArrowLabel from '@/components/ui/ArrowLabel';
import FeatherIcon from '@/components/ui/FeatherIcon';
import RichText from '@/components/ui/RichText';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Membership, RichItem } from '@/core/content/types';
import { formatPrice, withSearchParam } from '@/core/utils';

const STRONG: Record<number, ReactElement> = { 0: <strong /> };

// Price list items, rendered with their bold parts.
const CheckList = ({ items }: { items: RichItem[] }) => {
  const { localize } = useLanguage();
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item: RichItem, index: number) => (
        <li key={index} className="flex gap-3">
          <Check
            className="mt-1 shrink-0 text-brand"
            size={20}
            strokeWidth={3}
            aria-hidden="true"
          />
          <span>
            <RichText text={localize(item.text)} components={STRONG} />
          </span>
        </li>
      ))}
    </ul>
  );
};

const MembershipCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col bg-white">
    <h3 className="display-title bg-ink px-7 py-4 text-3xl text-white">{title}</h3>
    <div className="flex grow flex-col gap-4 p-7">{children}</div>
  </div>
);

const RegistrationPage = () => {
  const { t, tc } = useI18n();
  const { locale, localize } = useLanguage();
  const { settings, memberships, photos, pages } = useSiteContent();
  const externalLink = (href: string, className: string) => (
    <a href={href} target="_blank" rel="noreferrer" className={className} />
  );

  return (
    <PageLayout meta={{ key: 'registration', path: Constants.ROUTE_REGISTRATION }}>
      <PageHero title={t('nav.registration')} image={photos.heroes.registration}>
        {t('registration.hero')}
      </PageHero>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-8 bg-sand p-8 md:p-10">
          <div className="flex-[1_1_480px]">
            <h2 className="section-title mb-3">{t('registration.booklet.title')}</h2>
            <p className="text-lg text-muted">{t('registration.booklet.text')}</p>
          </div>
          <DownloadLink href={settings.booklet} className="btn btn-primary">
            {t('registration.booklet.cta')}
          </DownloadLink>
        </div>

        {pages.registrationNotice.enabled && (
          <div className="mt-6 flex gap-4 bg-warning-tint p-6 text-warning">
            <TriangleAlert className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              <RichText
                text={localize(pages.registrationNotice.text)}
                components={{
                  0: <strong />,
                  1: externalLink(
                    withSearchParam(settings.links.waitingList, 'usp', 'dialog'),
                    'font-bold underline'
                  )
                }}
              />
            </p>
          </div>
        )}
      </Section>

      <Section className="bg-sand">
        <div className="flex flex-wrap items-center gap-12">
          <div className="min-w-0 flex-[2_1_520px]">
            <h2 className="section-title mb-4">{t('registration.trial.title')}</h2>
            <p className="mb-6 text-lg">{tc('registration.trial.intro', STRONG)}</p>
            <ol className="flex flex-col gap-4">
              {pages.trialRules.map((rule: RichItem, index: number) => (
                <li key={index} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center bg-brand font-display text-2xl font-extrabold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <RichText text={localize(rule.text)} components={STRONG} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-line pt-6">
              {tc('registration.trial.dates', {
                0: <strong />,
                1: <Link to={Constants.ROUTE_SCHEDULE} className="link" />
              })}
            </p>
            <p className="mt-3">{tc('registration.trial.opening', STRONG)}</p>
          </div>
          <a
            href={settings.links.trialForm}
            target="_blank"
            rel="noreferrer"
            className="flex flex-[1_1_260px] flex-col items-center gap-3 bg-white p-6 text-center hover:text-brand"
          >
            {settings.qrCodes.trial && (
              <img
                src={settings.qrCodes.trial}
                alt={t('registration.trial.qrAlt')}
                className="w-full max-w-64"
              />
            )}
            <span className="inline-flex items-center gap-2 font-display text-xl font-bold uppercase">
              {t('registration.trial.qr')}
              <ExternalLink className="size-[0.9em] shrink-0" aria-hidden="true" />
            </span>
          </a>
        </div>
      </Section>

      <Section>
        <h2 className="section-title mb-8">{t('registration.membership.title')}</h2>
        <div className="grid gap-5 bg-sand p-5 md:grid-cols-2">
          <MembershipCard title={t('registration.membership.new')}>
            <p>{t('registration.membership.newOnline')}</p>
            <p className="text-muted">{t('registration.membership.health')}</p>
            <p className="text-muted">{t('registration.membership.newHelp')}</p>
            <OutboundLink
              href={settings.links.membership}
              className="btn btn-primary mt-auto self-start"
            >
              {t('registration.membership.newCta')}
            </OutboundLink>
          </MembershipCard>
          <MembershipCard title={t('registration.membership.renewal')}>
            <p>{tc('registration.membership.former', STRONG)}</p>
            <p>{tc('registration.membership.transfer', STRONG)}</p>
            <p className="text-muted">{t('registration.membership.health')}</p>
            <div className="mt-auto flex flex-wrap gap-3">
              <OutboundLink href={settings.links.myFfbad} className="btn btn-dark">
                {t('registration.membership.space')}
              </OutboundLink>
              <OutboundLink href={settings.links.membership} className="btn btn-outline-dark">
                {t('registration.membership.online')}
              </OutboundLink>
            </div>
          </MembershipCard>
        </div>
      </Section>

      <Section id="tarifs" className="bg-ink text-white">
        <h2 className="section-title mb-8">{t('registration.prices.title')}</h2>
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-5">
          {memberships.items.map((membership: Membership) => (
            <li key={membership.id} className="flex flex-col gap-3 bg-ink-soft p-6">
              <FeatherIcon color={membership.color} className="size-12 self-start" />
              <span className="font-display text-2xl leading-tight font-extrabold uppercase">
                {localize(membership.label)}
              </span>
              <span className="font-display text-6xl leading-none font-extrabold text-brand-light">
                {formatPrice(membership.price, locale)}
              </span>
              <span className="text-[15px] text-[#d6d2cb]">{localize(membership.priceNote)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="eyebrow mb-4 text-2xl text-brand-light">
              {t('registration.prices.included')}
            </h3>
            <CheckList items={pages.included} />
          </div>
          <div>
            <h3 className="eyebrow mb-4 text-2xl text-brand-light">
              {t('registration.prices.discounts')}
            </h3>
            <CheckList items={pages.discounts} />
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-ink-line pt-8 text-[#d6d2cb]">
          <p>
            {tc('registration.prices.slots', {
              0: <strong className="text-white" />,
              1: <strong className="text-white" />
            })}
          </p>
          <p>{t('registration.prices.levels')}</p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to={Constants.ROUTE_SCHEDULE}
            className="group bg-sand p-8 transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowLabel className="display-title text-4xl">
              {t('registration.links.sessions')}
            </ArrowLabel>
            <p className="mt-2 text-muted group-hover:text-white">
              {t('registration.links.sessionsText')}
            </p>
          </Link>
          <Link
            to={Constants.ROUTE_SHOP}
            className="group bg-sand p-8 transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowLabel className="display-title text-4xl">
              {t('registration.links.shop')}
            </ArrowLabel>
            <p className="mt-2 text-muted group-hover:text-white">
              {t('registration.links.shopText')}
            </p>
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
};

export default RegistrationPage;
