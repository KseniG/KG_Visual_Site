const nav = [
  { href: "#about", label: "Обо мне" },
  { href: "#cases", label: "Кейсы" },
  { href: "#process", label: "Подход" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-14">
        <a href="#top" className="group flex items-center gap-3" aria-label="К началу страницы">
          <img src={import.meta.env.BASE_URL + "img/kg-logo.svg"} alt="" width={40} height={40} />
          <span className="hidden font-heading text-sm font-bold uppercase tracking-[0.24em] sm:block">Ksenia Guseva / Visual designer</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Главное меню">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-all duration-300 hover:border-border hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contacts" className="rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
          Связаться
        </a>
      </div>
    </header>
  );
}
