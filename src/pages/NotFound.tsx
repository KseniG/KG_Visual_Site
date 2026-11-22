export default function NotFound() {
  return (
    <main className="grid min-h-screen place-content-center gap-6 bg-background px-4 text-center text-foreground">
      <h1 className="text-4xl font-semibold">Страница не найдена</h1>
      <a href={import.meta.env.BASE_URL} className="text-primary underline underline-offset-4">На главную</a>
    </main>
  );
}
