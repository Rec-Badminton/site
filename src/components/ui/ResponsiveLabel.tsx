// Abbreviation on small screens, full word from md up.
const ResponsiveLabel = ({ short, full }: { short: string; full: string }) => (
  <>
    <abbr title={full} className="no-underline md:hidden">
      {short}
    </abbr>
    <span className="hidden md:inline">{full}</span>
  </>
);

export default ResponsiveLabel;
