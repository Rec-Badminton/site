import { useEffect, useState } from 'react';

type TailwindBreakpoints = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
};

const getBreakpoints = (): TailwindBreakpoints => {
  const width = window.innerWidth;
  return {
    isXs: width < 640,
    isSm: width >= 640,
    isMd: width >= 768,
    isLg: width >= 1024,
    isXl: width >= 1280,
    is2xl: width >= 1536
  };
};

const useBreakpoint = (): TailwindBreakpoints => {
  const [breakpoints, setBreakpoints] = useState<TailwindBreakpoints>(getBreakpoints);

  useEffect(() => {
    const handleResize = () => setBreakpoints(getBreakpoints());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoints;
};

export { useBreakpoint };
