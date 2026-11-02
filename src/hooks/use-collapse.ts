import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject
} from 'react';
import { flushSync } from 'react-dom';

type CollapseState = 'hidden' | 'showing' | 'shown' | 'hiding';

interface Collapse {
  state: CollapseState;
  style: CSSProperties;
  toggle: () => void;
  close: () => void;
}

const TRANSITION_MS: number = 350;

// Replicates Bootstrap's collapse: animate height between 0 and scrollHeight.
const useCollapse = <T extends HTMLElement>(ref: RefObject<T | null>): Collapse => {
  const [state, setState] = useState<CollapseState>('hidden');
  const [height, setHeight] = useState<number>(0);
  const timer = useRef<number>(0);

  const animate = useCallback(
    (to: 'shown' | 'hidden', start: number, getEnd: () => number) => {
      window.clearTimeout(timer.current);
      flushSync(() => {
        setState(to === 'shown' ? 'showing' : 'hiding');
        setHeight(start);
      });
      // force a reflow so the start height is committed before transitioning
      void ref.current?.offsetHeight;
      setHeight(getEnd());
      timer.current = window.setTimeout(() => setState(to), TRANSITION_MS);
    },
    [ref]
  );

  const toggle = useCallback(() => {
    if (state === 'hidden' || state === 'hiding') {
      animate('shown', 0, () => ref.current?.scrollHeight ?? 0);
    } else {
      animate('hidden', ref.current?.getBoundingClientRect().height ?? 0, () => 0);
    }
  }, [animate, ref, state]);

  const cancel = useCallback(() => window.clearTimeout(timer.current), []);

  // collapse instantly, like the fresh page load that followed a click on the original site
  const close = useCallback(() => {
    cancel();
    setState('hidden');
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  const animating: boolean = state === 'showing' || state === 'hiding';
  const style: CSSProperties = animating
    ? { height, overflow: 'hidden', transition: `height ${TRANSITION_MS}ms ease` }
    : {};

  return { state, style, toggle, close };
};

export { useCollapse };
