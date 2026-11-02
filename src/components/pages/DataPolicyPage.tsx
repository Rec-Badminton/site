import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import { Table, Td, Th, Tr } from '@/components/ui/Table';
import { Constants } from '@/core/constants';
import { useSiteContent } from '@/hooks/use-site-content';
import { showCookieSettings } from '@/core/cookie-consent';
import { mailTo } from '@/core/utils';

interface ThirdParty {
  service: string;
  usage: string;
  data: string;
  when: string;
}

// Translation keys per third-party row.
const THIRD_PARTIES: ThirdParty[] = [
  {
    service: 'Google Agenda',
    usage: 'policy.services.calendar.usage',
    data: 'policy.services.calendar.data',
    when: 'policy.services.calendar.when'
  },
  {
    service: 'Formspree',
    usage: 'policy.services.form.usage',
    data: 'policy.services.form.data',
    when: 'policy.services.form.when'
  },
  {
    service: 'Curator.io',
    usage: 'policy.services.news.usage',
    data: 'policy.services.ipOnly',
    when: 'policy.services.onLoad'
  },
  {
    service: 'OpenStreetMap',
    usage: 'policy.services.map.usage',
    data: 'policy.services.ipOnly',
    when: 'policy.services.map.when'
  },
  {
    service: 'Google Fonts',
    usage: 'policy.services.fonts.usage',
    data: 'policy.services.ipOnly',
    when: 'policy.services.onLoad'
  }
];

const SUMMARY: string[] = ['policy.summary.1', 'policy.summary.2', 'policy.summary.3'];

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="display-title text-4xl">{title}</h2>
    <div className="flex flex-col gap-3 text-lg leading-relaxed text-ink [&_a]:link">
      {children}
    </div>
  </section>
);

const external = (href: string) => <a href={href} target="_blank" rel="noreferrer" />;

const DataPolicyPage = () => {
  const { t, tc } = useI18n();
  const { settings, photos } = useSiteContent();
  const mail = <a href={mailTo(settings.email)} />;

  return (
    <PageLayout meta={{ key: 'policy', path: Constants.ROUTE_DATA_POLICY }}>
      <PageHero title={t('footer.dataPolicy')} image={photos.heroes.policy}>
        {t('policy.hero')}
      </PageHero>

      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
          <p className="text-muted">{t('policy.updated', t('policy.updatedDate'))}</p>

          <Block title={t('policy.summary.title')}>
            <ul className="flex list-disc flex-col gap-1 pl-6">
              {SUMMARY.map((key: string) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </Block>

          <Block title={t('policy.owner.title')}>
            <p>{tc('policy.owner.text', { 0: mail }, settings.email)}</p>
          </Block>

          <Block title={t('policy.data.title')}>
            <p>{tc('policy.data.form', { 0: <strong /> })}</p>
            <p>
              {tc('policy.data.thirdParty', {
                0: <strong />,
                1: external(settings.links.membership),
                2: external('https://www.helloasso.com/')
              })}
            </p>
          </Block>

          <Block title={t('policy.cookies.title')}>
            <p>
              {tc('policy.cookies.essential', {
                0: <code className="bg-sand px-1.5 py-0.5 text-base" />
              })}
            </p>
            <p>{t('policy.cookies.calendar')}</p>
            <div>
              <button type="button" onClick={showCookieSettings} className="btn btn-primary">
                {t('policy.cookies.manage')}
              </button>
            </div>
          </Block>

          <Block title={t('policy.services.title')}>
            <p>{t('policy.services.text')}</p>
            <Table
              caption={t('policy.services.caption')}
              head={
                <>
                  <Th>{t('policy.services.service')}</Th>
                  <Th>{t('policy.services.usage')}</Th>
                  <Th>{t('policy.services.data')}</Th>
                  <Th>{t('policy.services.when')}</Th>
                </>
              }
            >
              {THIRD_PARTIES.map((party: ThirdParty) => (
                <Tr key={party.service}>
                  <Td className="font-bold whitespace-nowrap">{party.service}</Td>
                  <Td>{t(party.usage)}</Td>
                  <Td>{t(party.data)}</Td>
                  <Td>{t(party.when)}</Td>
                </Tr>
              ))}
            </Table>
            <p>{t('policy.services.links')}</p>
          </Block>

          <Block title={t('policy.rights.title')}>
            <p>
              {tc(
                'policy.rights.text',
                { 0: mail, 1: external('https://www.cnil.fr/fr/plaintes') },
                settings.email
              )}
            </p>
          </Block>

          <Link to={Constants.ROUTE_CONTACT} className="btn btn-dark self-start">
            {t('policy.contact')}
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
};

export default DataPolicyPage;
