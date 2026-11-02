import { useI18n } from '@mxreakit/i18n';
import ResponsiveLabel from '@/components/ui/ResponsiveLabel';

const VenueLabel = ({ home }: { home: boolean }) => {
  const { t } = useI18n();
  return (
    <ResponsiveLabel
      short={t(home ? 'common.homeShort' : 'common.awayShort')}
      full={t(home ? 'common.home' : 'common.away')}
    />
  );
};

export default VenueLabel;
