import { useI18n } from '@mxreakit/i18n';
import OutboundLink from '@/components/ui/OutboundLink';
import { useLanguage } from '@/hooks/use-language';
import type { Product } from '@/core/content/types';
import { cn, formatPrice } from '@/core/utils';

interface ProductCardProps {
  product: Product;
  shopUrl: string;
}

// Two per row on phones: there the image takes the width, the badge moves under
// the name and the description shrinks to its first line, so cards stay short.
const ProductCard = ({ product, shopUrl }: ProductCardProps) => {
  const { t } = useI18n();
  const { locale, localize } = useLanguage();
  const name: string = localize(product.name);
  const badge: string = localize(product.badge);
  const details: string[] = localize(product.details)
    .split('\n')
    .filter((line: string) => line.trim());
  return (
    <article className="group flex flex-col bg-white">
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image && (
          <img
            src={product.image}
            alt={name}
            loading="lazy"
            className="size-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-6"
          />
        )}
        {badge && (
          <span className="badge absolute top-0 left-0 hidden bg-brand text-[15px] text-white sm:block">
            {badge}
          </span>
        )}
      </div>
      <div className="grid grow grid-cols-1 grid-rows-[auto_auto_auto_1fr_auto] gap-y-1 border-t border-line p-3 [grid-template-areas:'name'_'price'_'badge'_'details'_'order'] sm:grid-cols-[minmax(0,1fr)_auto] sm:grid-rows-[auto_1fr_auto] sm:gap-x-4 sm:gap-y-3 sm:p-5 sm:[grid-template-areas:'name_price'_'details_details'_'order_order']">
        <h3 className="font-display text-base leading-tight font-extrabold [grid-area:name] sm:text-2xl">
          {name}
        </h3>
        <span className="font-display text-xl leading-none font-extrabold text-brand [grid-area:price] sm:text-3xl">
          {formatPrice(product.price, locale)}
        </span>
        {badge && (
          <span className="font-display text-xs font-bold tracking-wide text-brand uppercase [grid-area:badge] sm:hidden">
            {badge}
          </span>
        )}
        <ul className="flex flex-col gap-1 text-[13px] leading-snug text-muted [grid-area:details] sm:text-[15px]">
          {details.map((detail: string, index: number) => (
            <li
              key={detail}
              className={cn(
                index === 0 ? 'line-clamp-2 sm:line-clamp-none' : 'hidden sm:list-item'
              )}
            >
              {detail}
            </li>
          ))}
        </ul>
        <OutboundLink
          href={shopUrl}
          className="btn btn-dark mt-2 min-h-9 w-full px-2 py-1.5 text-sm [grid-area:order] sm:mt-0 sm:min-h-12 sm:px-3 sm:py-2 sm:text-xl"
        >
          {t('shop.order')}
        </OutboundLink>
      </div>
    </article>
  );
};

export default ProductCard;
