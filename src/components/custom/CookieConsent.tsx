import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { CalendarDays, Cookie, ShieldCheck, X, type LucideIcon } from 'lucide-react';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import {
  consentChoices,
  hasDecided,
  hideCookieSettings,
  isCookieSettingsOpen,
  saveConsent,
  showCookieSettings,
  subscribeConsent,
  type ConsentChoices
} from '@/core/cookie-consent';
import { cn, mailTo } from '@/core/utils';

// crawlers and audits get the page without the banner over it
const IS_BOT: boolean = /bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent);

const ALL: ConsentChoices = { embeds: true };
const NONE: ConsentChoices = { embeds: false };

const policyLink = <Link to={Constants.ROUTE_DATA_POLICY} />;

const Switch = ({
  checked,
  labelledBy,
  onChange
}: {
  checked: boolean;
  labelledBy: string;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    onClick={() => onChange(!checked)}
    className={cn(
      'relative h-7 w-12 shrink-0 transition-colors',
      checked ? 'bg-brand' : 'bg-[#c9c4bc] hover:bg-[#b5afa6]'
    )}
  >
    <span
      className={cn(
        'absolute top-1 left-1 size-5 bg-white transition-transform',
        checked && 'translate-x-5'
      )}
    />
  </button>
);

const CategoryRow = ({
  icon: Icon,
  titleId,
  title,
  text,
  control
}: {
  icon: LucideIcon;
  titleId: string;
  title: string;
  text: string;
  control: ReactNode;
}) => (
  <div className="flex items-start gap-4 bg-sand p-4">
    <span className="flex size-10 shrink-0 items-center justify-center bg-white text-brand">
      <Icon className="size-5" aria-hidden="true" />
    </span>
    <div className="min-w-0 grow">
      <div className="flex min-h-10 items-center justify-between gap-3">
        <h3 id={titleId} className="font-display text-xl leading-tight font-extrabold uppercase">
          {title}
        </h3>
        {control}
      </div>
      <p className="mt-1 text-[15px] leading-snug text-muted">{text}</p>
    </div>
  </div>
);

const SettingsDialog = ({ open }: { open: boolean }) => {
  const { t, tc } = useI18n();
  const { email } = useSiteContent().settings;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<ConsentChoices>(consentChoices);
  const titleId: string = useId();
  const essentialId: string = useId();
  const embedsId: string = useId();

  useEffect(() => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setDraft(consentChoices());
      dialog.showModal?.();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={hideCookieSettings}
      // a click that lands on the dialog itself is a click on the backdrop
      onClick={(event) => event.target === dialogRef.current && hideCookieSettings()}
      className="m-auto max-h-[min(90dvh,48rem)] overflow-y-auto w-[min(100%-1.5rem,36rem)] bg-white p-0 text-ink backdrop:bg-ink-deep/70 open:motion-safe:animate-dialog-in"
    >
      <div className="h-1.5 bg-brand" />
      <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-7">
        <h2 id={titleId} className="display-title text-4xl">
          {t('cookies.settings.title')}
        </h2>
        <button
          type="button"
          onClick={hideCookieSettings}
          aria-label={t('cookies.close')}
          className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center transition-colors hover:bg-sand"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-6 py-5 sm:px-8">
        <p className="mb-1 text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a:hover]:text-brand">
          {tc('cookies.settings.text', { 0: policyLink })}
        </p>
        <CategoryRow
          icon={ShieldCheck}
          titleId={essentialId}
          title={t('cookies.essential.title')}
          text={t('cookies.essential.text')}
          control={
            <span className="badge bg-white whitespace-nowrap text-muted">
              {t('cookies.alwaysOn')}
            </span>
          }
        />
        <CategoryRow
          icon={CalendarDays}
          titleId={embedsId}
          title={t('cookies.embeds.title')}
          text={t('cookies.embeds.text')}
          control={
            <Switch
              checked={draft.embeds}
              labelledBy={embedsId}
              onChange={(embeds: boolean) => setDraft({ ...draft, embeds })}
            />
          }
        />
        <p className="mt-1 text-sm text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a:hover]:text-brand">
          {tc('cookies.question', { 0: <a href={mailTo(email)} /> }, email)}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-line bg-sand px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={() => saveConsent(NONE)}
          className="btn btn-outline-dark min-h-11 px-5 text-lg"
        >
          {t('cookies.rejectAll')}
        </button>
        <button
          type="button"
          onClick={() => saveConsent(ALL)}
          className="btn btn-dark min-h-11 px-5 text-lg"
        >
          {t('cookies.acceptAll')}
        </button>
        <button
          type="button"
          onClick={() => saveConsent(draft)}
          className="btn btn-primary min-h-11 px-5 text-lg"
        >
          {t('cookies.save')}
        </button>
      </div>
    </dialog>
  );
};

const Banner = () => {
  const { t, tc } = useI18n();
  const titleId: string = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-50 bg-ink text-white shadow-[0_20px_50px_rgba(20,24,22,0.45)] motion-safe:animate-slide-up sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[26rem]"
    >
      <div className="h-1.5 bg-brand" />
      <div className="p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center bg-brand">
            <Cookie className="size-6" aria-hidden="true" />
          </span>
          <h2 id={titleId} className="display-title text-[28px] leading-none">
            {t('cookies.title')}
          </h2>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-[#d6d2cb] [&_a]:font-semibold [&_a]:text-white [&_a]:underline [&_a:hover]:text-brand-light">
          {tc('cookies.text', { 0: policyLink })}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => saveConsent(NONE)}
            className="btn btn-outline-light min-h-11 px-4 text-lg"
          >
            {t('cookies.reject')}
          </button>
          <button
            type="button"
            onClick={() => saveConsent(ALL)}
            className="btn btn-primary min-h-11 px-4 text-lg"
          >
            {t('cookies.accept')}
          </button>
        </div>
        <button
          type="button"
          onClick={showCookieSettings}
          className="mt-3 w-full py-1 text-center text-sm font-semibold text-muted-light underline hover:text-white"
        >
          {t('cookies.customize')}
        </button>
      </div>
    </section>
  );
};

// First-visit banner and the preferences dialog, also opened from the data policy page.
const CookieConsent = () => {
  const decided: boolean = useSyncExternalStore(subscribeConsent, hasDecided);
  const settingsOpen: boolean = useSyncExternalStore(subscribeConsent, isCookieSettingsOpen);

  return (
    <>
      {!decided && !settingsOpen && !IS_BOT && <Banner />}
      <SettingsDialog open={settingsOpen} />
    </>
  );
};

export default CookieConsent;
