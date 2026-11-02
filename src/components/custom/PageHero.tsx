import type { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  image: string;
  children?: ReactNode;
}

// Dark photo band opening every inner page; fixed height so all pages line up.
const PageHero = ({ title, image, children }: PageHeroProps) => (
  <section className="relative h-80 bg-ink text-center text-white lg:h-[26rem]">
    {image && (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-35"
      />
    )}
    <div className="container-site relative flex h-full flex-col items-center justify-center lg:pt-14">
      <h1 className="display-title text-6xl md:text-8xl">{title}</h1>
      {children && (
        <div className="mt-5 line-clamp-2 max-w-2xl text-lg text-[#ece9e4] md:text-xl">
          {children}
        </div>
      )}
    </div>
  </section>
);

export default PageHero;
