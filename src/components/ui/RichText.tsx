import { cloneElement, Fragment, type ReactElement } from 'react';

interface RichTextProps {
  text: string;
  // element wrapping the words of each <n>…</n> mark, by n
  components: Record<number, ReactElement>;
}

const MARK: RegExp = /^<(\d)>(.*?)<\/\1>$/;

// Back office copy with the dictionaries' markup: "<0>bold</0> rest"; unknown marks show plain.
const RichText = ({ text, components }: RichTextProps) => (
  <>
    {text.split(/(<\d>.*?<\/\d>)/g).map((part: string, index: number) => {
      const match: RegExpExecArray | null = MARK.exec(part);
      const component: ReactElement | undefined = match ? components[Number(match[1])] : undefined;
      return (
        <Fragment key={index}>
          {component ? cloneElement(component, {}, match?.[2]) : (match?.[2] ?? part)}
        </Fragment>
      );
    })}
  </>
);

export default RichText;
