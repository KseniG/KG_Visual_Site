export type CaseImage = { src: string; alt: string; aspect?: string; type?: "video"; fit?: "full-height" };
export type CaseItem = {
  title: string;
  role: string[];
  shortDescription: string;
  description: string;
  deliverables: string[];
  tools: string[];
  images: CaseImage[];
  href?: string;
  layout?: "single" | "pair" | "stack" | "full-height";
};
export type PortfolioSection = { id: string; number: string; title: string; direction: string; cases: CaseItem[] };
const image = (alt: string, aspect = "4 / 3", src = import.meta.env.BASE_URL + "img/zaglushka.svg"): CaseImage => ({ src, alt, aspect });
const project = (title: string, shortDescription: string, description: string, deliverables: string[], tools: string[] = [], role: string[] = ["Графический дизайнер"], aspect = "4 / 3", src = import.meta.env.BASE_URL + "img/zaglushka.svg"): CaseItem => ({ title, role, shortDescription, description, deliverables, tools, images: [image(title, aspect, src)] });

export const brandingCases: CaseItem[] = [
  project("Айдентика медиапродакшена", "Редизайн логотипа медиапродакшена: переход от простого текстового написания к самостоятельному графическому образу.", "На основе шрифта разработан новый знак: геометрия букв переработана, чтобы придать логотипу характер и подчеркнуть современность компании.", ["Обновлённый логотип"], ["CorelDRAW"], ["Графический дизайнер"], "4 / 3",import.meta.env.BASE_URL + "img/cinestat-logo.webp"),
  { ...project("Сайт медиапродакшена", "Расширение и обновление сайта медиапродакшена в соответствии с фирменным стилем.", "Разработан макет четырёх новых разделов и навигации в Figma, затем сайт собран в Tilda и опубликован.", ["Обновлённый сайт"], ["Figma", "Tilda"], ["Веб-дизайнер"], "9 / 8", import.meta.env.BASE_URL + "img/sait.webp"), href: "https://cinestatic.ru" },
  project("Презентация медиа-сопровождения SPIEF’26", "Презентация услуг медиапродакшена для участников ПМЭФ в корпоративном стиле форума.", "Структурирована информация об услугах и разработан дизайн презентации в соответствии с визуальным стилем форума.", ["Презентация услуг"], ["Figma"], ["Графический дизайнер"], "5 / 4", import.meta.env.BASE_URL + "img/prez-spief-g.webp"),
  project("Портфолио руководителя", "Презентация проектов медиапродакшена, передающая профессионализм и современный характер компании.", "Разработаны две концепции и найдено их сочетание: чёткая композиция, разделительные линии и контрастная чёрно-белая графика со световыми акцентами.", ["Презентация проектов"], ["Figma", "AI"], ["Графический дизайнер"],"5 / 4", import.meta.env.BASE_URL + "img/portf-black.webp"),
  project("Личная айдентика", "Собственная айдентика, отражающая мой подход: сочетание творчества, технологий и постоянного развития.", "Сформулирована концепция и найдено её графическое выражение в минималистичном линейном стиле.", ["Логотип", "Личная айдентика"], ["Figma"], ["Графический дизайнер"], "16 / 9", import.meta.env.BASE_URL + "img/my-logo-itg.webp")
];
export const merchCases: CaseItem[] = [
  project("Серия подарочных блокнотов", "Подарочный мерч для студенческого совета института информационных технологий.", "Предложен и утверждён обновлённый дизайн обложек. Подготовлен чертёж и выполнена лазерная резка серии из восьми блокнотов.", ["Дизайн обложки","Мокап блокнота", "Чертёж для лазерной резки", "8 готовых обложек"], ["CorelDRAW", "Лазерный станок"], ["Графический дизайнер", "Оператор лазерного станка"], "16 / 9", import.meta.env.BASE_URL + "img/seedream-609490.webp" ),
  project("Упаковка продукта Lindaily", "Концепция упаковки, вдохновлённая визуальным стилем и айдентикой Lindaily.", "Создано графическое оформление с эффектом движения и смещения текста, затем выполнена 3D-визуализация упаковки.", ["Графика упаковки", "3D-мокап"], ["Figma", "Blender"], ["Графический дизайнер"],"9 / 16", import.meta.env.BASE_URL + "img/craft.webp"),
  project("Шоппер с кириллической вязью", "Учебный проект о движении и культурной идентичности — графика для шоппера, который хотелось бы носить самой.", "Создана концепция на основе кириллической вязи. Надпись вручную нарисована каллиграфическим пером, оцифрована и подготовлена для макетов.", ["Авторская графика", "Мокап шоппера"], ["Каллиграфическое перо", "Krita", "Photoshop"], ["Графический дизайнер", "AI креатор"],"1136 / 1385", import.meta.env.BASE_URL + "img/shoper.webp"),
];
export const graphicsCases: CaseItem[] = [
  project("Орнамент Костромы", "Плакат для выставки «Пространство традиций» о культурном и орнаментальном коде Костромы.", "Изучены исторические материалы региона, выбраны характерные элементы орнамента и переосмыслены в современной графике.", ["Полиграфический макет", "Печатный плакат формата А3", "Презентация на выставке в течение месяца"], ["Figma"], ["Графический дизайнер"], "210 / 297", import.meta.env.BASE_URL + "img/ornament-kostromy.webp"),
  project("Афиша набора в танцевальную студию", "Афиша для привлечения первокурсников в танцевальный коллектив студенческого дворца культуры РГПУ.", "Разработан яркий визуальный стиль на основе референсов студии. Созданы публикация для соцсетей и две печатные афиши.", ["Публикация для соцсетей", "1,2 тыс. просмотров","2 печатные афиши", "+10 человек на просмотре"], ["Figma"],  ["Графический дизайнер"], "210 / 297", import.meta.env.BASE_URL + "img/afisha-nabor-itg.webp"),
  { ...project("Афиши семейного фестиваля", "Афиша семейного фестиваля для публикации в сообществе ВКонтакте.", "Создана дружелюбная графика на основе активностей фестиваля. Визуальный стиль использовали и при подготовке следующего фестиваля.", ["Публикации афиш в группе соц.сети · 2025 год и 2026 год", "суммарно 1,6 тыс. просмотров"], ["Figma"], ["Графический дизайнер"]), layout: "pair", images: [image("Афиша 2025", "2 / 3", import.meta.env.BASE_URL + "img/fest-vmeste.webp"), image("Афиша 2026", "2 / 3", import.meta.env.BASE_URL + "img/fest-vmeste-26.webp")] },
  { ...project("Пространство слов", "Серия из двух типографических плакатов, созданных из заданного набора слов с ограниченной палитрой.", "Для композиций, вдохновлённых референсами, найдены шрифтовые решения, объединяющие чёрный, белый и красный цвета.", ["Цифровой формат", "2 типографических плаката"], ["Figma"], ["Графический дизайнер"]), layout: "pair", images: [image("Первый типографический плакат", "2 / 3", import.meta.env.BASE_URL + "img/gorod.webp"), image("Второй типографический плакат", "2 / 3", import.meta.env.BASE_URL + "img/shar.webp")] },
];
export const motionCases: CaseItem[] = [
  project("Осетия. Оформление мероприятия", "Анимационное оформление площадки фестиваля ко Дню народного единства, посвящённого культуре Осетии.", "Организована работа, выбраны цвета и панорамы. Орнаменты анимированы в дуэте примерно поровну. Мной подобрано цветовое решение, сделана итоговая сборка и организован показ на площадке.", ["Заставка с орнаментами · 12 с", "500+ просмотров", "4 часа показа"], ["Figma", "After Effects"], ["Арт-директор", "Моушн-дизайнер"], "16 / 9"),
  project("3D-композиция для финтеха", "Учебный проект — создание короткой анимации на тему финтеха.", "Созданы 3D-модели и композиция, затем с помощью AI-инструментов разработаны текстуры, рендер и анимация.", ["3D-рендер", "Анимационный цикл · 4 с"], ["Cinema 4D", "AI (Gemini, Kling)"], ["3D-художник", "AI-креатор"], "16 / 9"),
];
export const mappingCases: CaseItem[] = [
  project("Великий Устюг", "Визуальная работа в команде Experiment 619 для 3D-меппинга на фасаде Гвардейского корпуса, посвящённая искусству и промыслам Великого Устюга.", "Предложена, выбрана командой и утверждена концепция работы. С помощью AI-инструментов созданы визуальные образы, анимированы три итоговых эпизода и пять элементов.", ["3 анимированные сцены · 24 с", "5 анимаций для 4х сцен · 39 с","Видео в портфолио · 12 с"], ["Gemini", "Kling", "Seedance", "Resolume Arena"], ["AI-креатор"], "16 / 9"),

  project("Новогодний шар", "Мультимедийное оформление рождественского вечера с анимированным новогодним шаром.", "Разработана концепция праздничной анимации. Созданы 3D- и 2D-сцены с оживающим шаром и атмосферой ожидания чуда. Фоновое сопровождение продолжалось до конца мероприятия.", ["4 сцены · 120 с","Показ на открытии", "Фоновое сопровождение", "Цикл 1 сцены в портфолио · 13 с"], ["Blender", "Illustrator", "After Effects", "Resolume Arena"], ["Арт-директор", "Моушн-дизайнер"], "1 / 1"),
];

motionCases[0].images = [{ src: import.meta.env.BASE_URL + "video/ossetia.mp4", alt: motionCases[0].title, aspect: "16 / 9", type: "video" }];
motionCases[1].images = [{ src: import.meta.env.BASE_URL + "video/fintech.mp4", alt: motionCases[1].title, aspect: "1638 / 2048", type: "video", fit: "full-height" }];
mappingCases[1].images = [{ src: import.meta.env.BASE_URL + "video/new-year.mp4", alt: mappingCases[1].title, aspect: "1920 / 2560", type: "video", fit: "full-height" }];
mappingCases[0].images = [{ src: import.meta.env.BASE_URL + "video/ustyug.mp4", alt: mappingCases[0].title, aspect: "1908 / 1140", type: "video" }];
graphicsCases[0].images[0].fit = "full-height";
merchCases[0].images[0].fit = "full-height";
merchCases[1].images[0].fit = "full-height";
graphicsCases[1].images[0].fit = "full-height";

export const portfolioSections: PortfolioSection[] = [
  { id: "branding", number: "01", title: "Брендинг и цифровой дизайн", direction: "Брендинг и цифровой дизайн", cases: brandingCases },
  { id: "merch", number: "02", title: "Мерч", direction: "Мерч", cases: merchCases },
  { id: "graphics", number: "03", title: "Графика", direction: "Графика", cases: graphicsCases },
  { id: "motion", number: "04", title: "Моушн", direction: "Моушн", cases: motionCases },
  { id: "mapping-new-year", number: "05", title: "3D-меппинг", direction: "3D-меппинг", cases: mappingCases },
];
export const filmPhotos = [
  {
    src: import.meta.env.BASE_URL + "img/my-logo-itg.webp",
    alt: "Личная айдентика",
    caption: "Брендинг",
  },
  {
    src: import.meta.env.BASE_URL + "img/prez-portf-3-2.webp",
    alt: "Портфолио медиапродакшена",
    caption: "Цифровой дизайн",
  },
  {
    src: import.meta.env.BASE_URL + "img/cinestat-logo.webp",
    alt: "Айдентика медиапродакшена",
    caption: "Айдентика",
  },
  {
    src: import.meta.env.BASE_URL + "img/sait.webp",
    alt: "Сайт медиапродакшена",
    caption: "Веб-дизайн",
  },
  {
    src: import.meta.env.BASE_URL + "img/shoper.webp",
    alt: "Шоппер с кириллической вязью",
    caption: "Мерч",
  },
  {
    src: import.meta.env.BASE_URL + "img/craft.webp",
    alt: "3D-визуализация упаковки",
    caption: "3D",
  },
];
