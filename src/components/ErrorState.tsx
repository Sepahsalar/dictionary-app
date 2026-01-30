type Props = {
  title: string;
  description?: string;
};

export function ErrorState({ title, description }: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-rose-900/40 bg-rose-950/30 p-4">
      <p className="font-medium text-rose-100">{title}</p>
      {description ? <p className="mt-1 text-rose-200/80">{description}</p> : null}
    </div>
  );
}
