type Props = { capabilities: string[] };

export function CapabilitiesList({ capabilities }: Props) {
  return (
    <ul className="grid gap-2 md:grid-cols-2 max-w-[72ch]">
      {capabilities.map((c) => (
        <li
          key={c}
          className="bg-bone border border-mesa/15 rounded px-4 py-3 text-ink text-sm"
        >
          {c}
        </li>
      ))}
    </ul>
  );
}
