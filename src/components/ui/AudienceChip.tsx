import { useLanguage } from '@/hooks/use-language';
import type { Membership } from '@/core/content/types';

interface AudienceChipProps {
  membership: Membership;
}

const AudienceChip = ({ membership }: AudienceChipProps) => {
  const { localize } = useLanguage();
  return (
    <span
      className="px-2.5 py-1 text-sm font-bold"
      style={{ backgroundColor: membership.tint, color: membership.ink }}
    >
      {localize(membership.label)}
    </span>
  );
};

export default AudienceChip;
