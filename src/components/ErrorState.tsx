type Props = {
  title: string;
  description?: string;
};

export function ErrorState({ title, description }: Props) {
  return (
    <div
      className="mt-6 rounded-2xl border p-4
                 border-rose-200 bg-rose-50
                 dark:border-rose-900/40 dark:bg-rose-950/30"
    >
      <p className="font-medium text-rose-900 dark:text-rose-100">{title}</p>
      {description ? (
        <p className="mt-1 text-rose-700 dark:text-rose-200/80">{description}</p>
      ) : null}
    </div>
  );
}
