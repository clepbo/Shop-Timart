/** Renders a heading with its trailing highlighted words in the Camel accent. */
export function Highlight({ text, highlight, className = "accent text-camel" }: { text: string; highlight?: string; className?: string }) {
  const h = highlight?.trim();
  if (!h || !text.endsWith(h)) return <>{text}</>;
  const head = text.slice(0, text.length - h.length);
  return (
    <>
      {head}
      <span className={className}>{h}</span>
    </>
  );
}
