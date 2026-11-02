import type { ComponentType, ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import {
  Camera,
  Clock,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  ShoppingBag,
  SmilePlus,
  Truck
} from 'lucide-react';
import OutboundLink from '@/components/ui/OutboundLink';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { StoreDiscount } from '@/core/content/types';
import { directionsUrl } from '@/core/venues';
import { cn, displayHost, mailTo, telTo } from '@/core/utils';

interface Step {
  Icon: ComponentType<{ className?: string }>;
  key: string;
  warning?: boolean;
}

const STEPS: Step[] = [
  { Icon: Globe, key: 'step1' },
  { Icon: ShoppingBag, key: 'step2' },
  { Icon: Camera, key: 'step3' },
  { Icon: Send, key: 'step4' },
  { Icon: CreditCard, key: 'step5', warning: true },
  { Icon: Truck, key: 'step6' },
  { Icon: SmilePlus, key: 'step7' }
];

const PERKS: string[] = ['perk1', 'perk2', 'perk3'];

const ContactLine = ({
  Icon,
  children
}: {
  Icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) => (
  <li className="flex items-start gap-3">
    <Icon className="mt-0.5 size-5 shrink-0 text-brand-light" aria-hidden="true" />
    <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
  </li>
);

const LardeSportsPartnership = () => {
  const { t } = useI18n();
  const { localize } = useLanguage();
  const { store } = useSiteContent().partners;
  const stepText = (step: Step): ReactNode =>
    step.key === 'step1' ? (
      <a href={store.website} target="_blank" rel="noreferrer" className="link text-brand-light">
        {displayHost(store.website)}
      </a>
    ) : (
      t(`lardesports.${step.key}.text`)
    );

  return (
    <section aria-labelledby="lardesports-title" className="bg-ink text-white">
      <div className="container-site section-pad flex flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 id="lardesports-title" className="section-title mb-4">
              {t('lardesports.title')}
            </h2>
            <p className="text-lg text-[#e2ded8]">{t('lardesports.intro')}</p>
          </div>
          <a
            href={store.website}
            target="_blank"
            rel="noreferrer"
            className="flex h-24 items-center bg-white px-8 transition-transform hover:-translate-y-0.5"
          >
            {store.logo && <img src={store.logo} alt="LardeSports" className="max-h-16 w-auto" />}
          </a>
        </div>

        <div className="grid gap-1 md:grid-cols-3">
          {store.discounts.map((discount: StoreDiscount, index: number) => (
            <div key={index} className="bg-ink-soft p-7">
              <span className="font-display text-6xl leading-none font-extrabold text-brand-light uppercase">
                {localize(discount.value)}
              </span>
              <p className="mt-3 font-display text-2xl font-bold uppercase">
                {localize(discount.title)}
              </p>
              <p className="mt-1 text-[15px] text-[#d6d2cb]">{localize(discount.text)}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="eyebrow mb-6 text-2xl text-brand-light">{t('lardesports.order')}</h3>
          <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {STEPS.map((step: Step, index: number) => (
              <li
                key={step.key}
                className={cn('flex flex-col gap-3 p-5', step.warning ? 'bg-brand' : 'bg-ink-soft')}
              >
                <div className="flex items-center justify-between">
                  <step.Icon className="size-7" aria-hidden="true" />
                  <span
                    className={cn(
                      'font-display text-3xl font-extrabold',
                      step.warning ? 'text-white/70' : 'text-ink-line'
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
                <p className="font-display text-xl leading-tight font-bold uppercase">
                  {t(`lardesports.${step.key}`)}
                </p>
                <p className={cn('text-sm', step.warning ? 'text-white' : 'text-[#d6d2cb]')}>
                  {stepText(step)}
                </p>
              </li>
            ))}
          </ol>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-display text-lg font-bold tracking-wide uppercase">
            {PERKS.map((perk: string) => (
              <li key={perk} className="flex items-center gap-2">
                <span className="size-2 bg-brand" aria-hidden="true" />
                {t(`lardesports.${perk}`)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted-light">{t('lardesports.exclusions')}</p>
        </div>

        <div className="grid gap-1 md:grid-cols-[1fr_auto]">
          <div className="bg-ink-soft p-7">
            <h3 className="eyebrow mb-4 text-2xl text-brand-light">{t('lardesports.store')}</h3>
            <ul className="grid gap-3 text-[#e2ded8] sm:grid-cols-2">
              <ContactLine Icon={MapPin}>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline"
                >
                  {store.address}
                </a>
              </ContactLine>
              <ContactLine Icon={Clock}>{t('lardesports.hours')}</ContactLine>
              <ContactLine Icon={Phone}>
                <a href={telTo(store.phone)} className="hover:text-white hover:underline">
                  {store.phone}
                </a>
              </ContactLine>
              <ContactLine Icon={Mail}>
                <a href={mailTo(store.email)} className="hover:text-white hover:underline">
                  {store.email}
                </a>
              </ContactLine>
            </ul>
            <p className="mt-5 border-t border-ink-line pt-4 text-sm text-muted-light">
              {t('lardesports.otherStores')}
            </p>
          </div>
          <OutboundLink
            href={directionsUrl(`Larde Sports, ${store.address}`)}
            className="btn btn-primary h-full min-h-20"
          >
            {t('common.directions')}
          </OutboundLink>
        </div>
      </div>
    </section>
  );
};

export default LardeSportsPartnership;
