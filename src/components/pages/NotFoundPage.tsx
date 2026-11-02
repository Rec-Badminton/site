import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import PageLayout from '@/components/custom/PageLayout';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';

const NotFoundPage = () => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { photos } = useSiteContent();

  return (
    <PageLayout meta={{ key: 'notFound', path: pathname }}>
      <section className="relative bg-ink text-white">
        {photos.heroes.notFound && (
          <img
            src={photos.heroes.notFound}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover opacity-25"
          />
        )}
        <div className="container-site relative flex min-h-[60vh] flex-col items-start justify-center gap-6 py-20">
          <p className="badge bg-brand text-lg text-white">404</p>
          <h1 className="display-title text-7xl md:text-9xl">{t('notFound.code')}</h1>
          <p className="display-title text-3xl text-brand-light md:text-4xl">
            {t('notFound.title')}
          </p>
          <p className="max-w-xl text-lg text-[#ece9e4] md:text-xl">{t('notFound.text')}</p>
          <div className="flex flex-wrap gap-3.5">
            <Link to={Constants.ROUTE_HOME} className="btn btn-primary">
              {t('notFound.home')}
            </Link>
            <Link to={Constants.ROUTE_SCHEDULE} className="btn btn-outline-light">
              {t('notFound.sessions')}
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFoundPage;
