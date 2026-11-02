import { useI18n } from '@mxreakit/i18n';
import { Mail } from 'lucide-react';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import { mailTo } from '@/core/utils';

const FIELD: string =
  'block w-full border-2 border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted focus:border-brand focus:outline-none';
const LABEL: string = 'mb-2 block font-display text-xl font-bold uppercase';

const ContactPage = () => {
  const { t, tc } = useI18n();
  const { settings, photos } = useSiteContent();

  return (
    <PageLayout meta={{ key: 'contact', path: Constants.ROUTE_CONTACT }}>
      <PageHero title={t('nav.contact')} image={photos.heroes.contact}>
        {t('contact.hero')}
      </PageHero>

      <Section className="bg-sand">
        <div className="flex flex-wrap items-start gap-10">
          <form
            action={settings.links.contactForm}
            method="POST"
            className="flex min-w-0 flex-[2_1_480px] flex-col gap-6 bg-white p-6 md:p-10"
          >
            <h2 className="section-title">{t('contact.form.title')}</h2>
            <div>
              <label htmlFor="name" className={LABEL}>
                {t('contact.form.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="email" className={LABEL}>
                {t('contact.form.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="message" className={LABEL}>
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className={`${FIELD} resize-y`}
              />
            </div>
            <button type="submit" className="btn btn-primary self-start">
              {t('contact.form.send')}
            </button>
          </form>

          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
            <div className="bg-ink p-7 text-white">
              <h2 className="display-title mb-3 text-4xl">{t('contact.member.title')}</h2>
              <p className="mb-5 text-[#e2ded8]">
                {tc('contact.member.text', { 0: <strong className="text-white" /> })}
              </p>
              <a
                href={settings.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white p-3"
                title={t('contact.member.link')}
              >
                {settings.qrCodes.whatsapp && (
                  <img
                    src={settings.qrCodes.whatsapp}
                    alt={t('contact.member.qrAlt')}
                    className="mx-auto w-full max-w-56"
                  />
                )}
              </a>
            </div>
            <a
              href={mailTo(settings.email)}
              className="flex items-center gap-3 bg-white p-6 font-bold hover:text-brand"
            >
              <Mail className="shrink-0 text-brand" aria-hidden="true" />
              {settings.email}
            </a>
          </div>
        </div>
        <p className="mt-10 text-center font-display text-2xl font-bold uppercase">
          {t('contact.outro')}
        </p>
      </Section>
    </PageLayout>
  );
};

export default ContactPage;
