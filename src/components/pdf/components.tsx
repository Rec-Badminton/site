import type { ReactNode } from 'react';
import { Image, Link, Page, Path, Svg, Text, View, type Styles } from '@react-pdf/renderer';
import { base, colors, DISPLAY, MARGIN } from '@/components/pdf/theme';

type Style = Styles[string];

export type Tone = 'light' | 'sand' | 'dark' | 'deep';

const TONES: Record<
  Tone,
  { backgroundColor: string; color: string; muted: string; accent: string }
> = {
  light: {
    backgroundColor: colors.white,
    color: colors.ink,
    muted: colors.muted,
    accent: colors.brand
  },
  sand: {
    backgroundColor: colors.sand,
    color: colors.ink,
    muted: colors.muted,
    accent: colors.brand
  },
  dark: {
    backgroundColor: colors.ink,
    color: colors.white,
    muted: colors.mutedLight,
    accent: colors.brandLight
  },
  deep: {
    backgroundColor: colors.inkDeep,
    color: colors.white,
    muted: colors.mutedLight,
    accent: colors.brandLight
  }
};

// Fonts have ascent 1em / descent 0.2em and caps 0.7em high: with lineHeight 1
// the caps sit 0.3em below the top, so extra bottom padding centers them.
const CAP_OFFSET: number = 0.3;

interface LabelProps {
  children: ReactNode;
  size: number;
  color?: string;
  background?: string;
  paddingX?: number;
  paddingY?: number;
  font?: 'display' | 'sans';
  style?: Style;
  textStyle?: Style;
}

// Text centered in a filled box, used for every badge, tag and number block.
export const Label = ({
  children,
  size,
  color = colors.white,
  background,
  paddingX = size * 0.45,
  paddingY = size * 0.25,
  font = 'display',
  style,
  textStyle
}: LabelProps) => (
  <View
    style={[
      {
        backgroundColor: background,
        paddingHorizontal: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY + size * CAP_OFFSET,
        alignItems: 'center',
        justifyContent: 'center'
      },
      style
    ]}
  >
    <Text
      style={[
        font === 'display' ? base.eyebrow : { fontWeight: 700 },
        { fontSize: size, lineHeight: 1, color, letterSpacing: font === 'display' ? 0.5 : 0 },
        textStyle
      ]}
    >
      {children}
    </Text>
  </View>
);

// lucide "external-link" icon
export const LinkIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    {['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'].map(
      (d: string) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )
    )}
  </Svg>
);

interface LinkButtonProps {
  href: string;
  children: string;
  size?: number;
  background?: string;
  color?: string;
  style?: Style;
}

// Clickable block with the external icon, mirroring the site's outbound buttons.
export const LinkButton = ({
  href,
  children,
  size = 11,
  background = colors.ink,
  color = colors.white,
  style
}: LinkButtonProps) => (
  <Link src={href} style={[{ textDecoration: 'none', alignSelf: 'flex-start' }, style]}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: size * 0.5,
        backgroundColor: background,
        paddingLeft: size * 0.9,
        paddingRight: size * 0.8
      }}
    >
      <Label size={size} color={color} paddingX={0} paddingY={size * 0.55}>
        {children}
      </Label>
      <LinkIcon size={size} color={color} />
    </View>
  </Link>
);

// Number box: 28pt square with the caps centered.
const NUMBER_SIZE: number = 28;
const NUMBER_FONT: number = 13;
const NUMBER_PADDING: number = (NUMBER_SIZE - NUMBER_FONT * 0.7) / 2 - NUMBER_FONT * CAP_OFFSET;

export const PageFooter = ({ text, tone = 'light' }: { text: string; tone?: Tone }) => (
  <>
    <Text
      fixed
      style={{
        position: 'absolute',
        left: MARGIN,
        bottom: 26 + 10,
        fontSize: 8,
        lineHeight: 1,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: TONES[tone].muted
      }}
    >
      {text}
    </Text>
    <Text
      fixed
      render={({ pageNumber }) => String(pageNumber)}
      style={{
        position: 'absolute',
        right: MARGIN,
        bottom: 26,
        width: NUMBER_SIZE,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: NUMBER_FONT,
        paddingTop: NUMBER_PADDING,
        paddingBottom: NUMBER_SIZE - NUMBER_FONT - NUMBER_PADDING,
        textAlign: 'center',
        color: colors.white,
        backgroundColor: colors.brand
      }}
    />
  </>
);

interface CoverPageProps {
  photo: string;
  logo: string;
  eyebrow: string;
  title: string;
  accent: string;
  season: string;
  site: string;
  handle: string;
}

export const CoverPage = ({
  photo,
  logo,
  eyebrow,
  title,
  accent,
  season,
  site,
  handle
}: CoverPageProps) => (
  <Page size="A4" style={[base.page, { backgroundColor: colors.ink, color: colors.white }]}>
    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      <Image
        src={photo}
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
      />
    </View>
    <View style={{ flex: 1, padding: MARGIN, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Image
          src={logo}
          style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.white }}
        />
        <Text style={[base.eyebrow, { fontSize: 20 }]}>REC Badminton</Text>
      </View>
      <View>
        <Text style={[base.eyebrow, { fontSize: 20, color: colors.brandLight, marginBottom: 14 }]}>
          {eyebrow}
        </Text>
        <Text style={[base.displayTitle, { fontSize: 112, lineHeight: 0.9 }]}>{title}</Text>
        <Text
          style={[base.displayTitle, { fontSize: 112, lineHeight: 0.9, color: colors.brandLight }]}
        >
          {accent}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
          <Label size={17} background={colors.brand}>
            {season}
          </Label>
        </View>
      </View>
    </View>
    <View
      style={{
        backgroundColor: colors.brand,
        paddingHorizontal: MARGIN,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <Label size={14} paddingX={0} paddingY={12}>
        {site}
      </Label>
      <Label size={14} paddingX={0} paddingY={12}>
        {handle}
      </Label>
    </View>
  </Page>
);

interface ContentPageProps {
  eyebrow: string;
  title: string;
  footer: string;
  tone?: Tone;
  anchor?: string;
  children: ReactNode;
}

export const ContentPage = ({
  eyebrow,
  title,
  footer,
  tone = 'light',
  anchor,
  children
}: ContentPageProps) => {
  const theme = TONES[tone];
  return (
    <Page
      size="A4"
      style={[
        base.page,
        {
          padding: MARGIN,
          paddingBottom: 80,
          backgroundColor: theme.backgroundColor,
          color: theme.color
        }
      ]}
    >
      <View style={base.body}>
        <View
          id={anchor}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}
        >
          <View style={{ width: 26, height: 4, backgroundColor: colors.brand }} />
          <Text style={[base.eyebrow, { fontSize: 13, lineHeight: 1, color: theme.accent }]}>
            {eyebrow}
          </Text>
        </View>
        <Text style={[base.displayTitle, { fontSize: 60, marginBottom: 22 }]}>{title}</Text>
        {children}
      </View>
      <PageFooter text={footer} tone={tone} />
    </Page>
  );
};
