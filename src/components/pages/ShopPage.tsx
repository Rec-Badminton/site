import { useI18n } from '@mxreakit/i18n';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import ShopCatalog from '@/components/sections/ShopCatalog';
import ProductCard from '@/components/sections/ProductCard';
import LardeSportsPartnership from '@/components/sections/LardeSportsPartnership';
import OutboundLink from '@/components/ui/OutboundLink';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Product } from '@/core/content/types';

const STEPS: string[] = ['shop.step1', 'shop.step2', 'shop.step3'];

const ShopPage = () => {
  const { t, tc } = useI18n();
  const { shop, photos } = useSiteContent();

  return (
    <PageLayout meta={{ key: 'shop', path: Constants.ROUTE_SHOP }}>
      <PageHero title={t('nav.shop')} image={photos.heroes.shop}>
        {t('shop.hero')}
      </PageHero>

      <section aria-label={t('shop.steps')} className="border-b border-line">
        <ol className="container-site grid gap-6 py-8 md:grid-cols-3">
          {STEPS.map((step: string, index: number) => (
            <li key={step} className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center bg-brand font-display text-2xl font-extrabold text-white">
                {index + 1}
              </span>
              <span className="font-semibold">{t(step)}</span>
            </li>
          ))}
        </ol>
      </section>

      <Section className="bg-sand">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">{t('shop.club.title')}</h2>
          <OutboundLink href={shop.club.url} className="btn btn-primary whitespace-nowrap">
            {t('shop.club.open')}
          </OutboundLink>
        </div>
        <ShopCatalog shop={shop.club} />
      </Section>

      <Section>
        <div className="flex flex-wrap gap-10">
          <div className="min-w-0 flex-[1_1_320px]">
            <h2 className="section-title mb-5">{t('shop.stringing.title')}</h2>
            <p className="mb-4 text-lg">{tc('shop.stringing.text', { 0: <strong /> })}</p>
            <p className="mb-8 text-muted">{t('shop.stringing.help')}</p>
            <OutboundLink href={shop.stringing.url} className="btn btn-primary">
              {t('shop.stringing.cta')}
            </OutboundLink>
          </div>
          <div className="grid min-w-0 flex-[2_1_520px] grid-cols-2 gap-3 bg-sand p-3 sm:gap-5 sm:p-5">
            {shop.stringing.products.map((product: Product) => (
              <ProductCard key={product.id} product={product} shopUrl={shop.stringing.url} />
            ))}
          </div>
        </div>
      </Section>

      <LardeSportsPartnership />
    </PageLayout>
  );
};

export default ShopPage;
