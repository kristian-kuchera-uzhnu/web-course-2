// ===== Дані =====
// Дані варіанта LR8; у LR10 записи буде винесено до зовнішнього JSON.
// const забороняє лише перепризначити саму змінну recipes, а вміст масиву можна змінювати, тому push далі працюватиме.
const recipes = [
    {
        id: 1,
        title: "Український борщ з пампушками",
        minutes: 120,
        calories: 180,
        category: "перші страви",
        img: "images/borscht-card.jpg",
        details: { code: "RCP-0142", difficulty: "середня" },
        tags: ["борщ", "традиційна", "м’ясна"]
    },
    {
        id: 2,
        title: "Сирники зі сметаною",
        minutes: 20,
        calories: 210,
        category: "сніданки",
        img: "images/syrnyky-card.jpg",
        details: { code: "RCP-0143", difficulty: "легка" },
        tags: ["сир", "швидко"]
    },
    {
        id: 3,
        title: "Домашня паста карбонара",
        minutes: 30,
        calories: 450,
        category: "основні страви",
        img: "images/pasta-card.jpg",
        details: { code: "RCP-0144", difficulty: "середня" },
        tags: ["паста", "італійська", "бекон", "яйце"]
    },
    {
        id: 4,
        title: "Медовик",
        minutes: 90,
        calories: 320,
        category: "випічка та десерти",
        img: "images/cake-card.jpg",
        details: { code: "RCP-0145", difficulty: "складна" },
        tags: ["торт", "мед", "святкова"]
    },
    {
        id: 5,
        title: "Зелений борщ зі щавлем",
        minutes: 60,
        calories: 140,
        category: "перші страви",
        img: "images/green-borscht-card.jpg",
        details: { code: "RCP-0146", difficulty: "легка" },
        tags: ["щавель", "весняна"]
    },
    {
        id: 6,
        title: "Салат «Олів’є»",
        minutes: 40,
        calories: 250,
        category: "салати та закуски",
        img: "images/salad-card.jpg",
        details: { code: "RCP-0148", difficulty: "легка" },
        tags: ["салат", "святкова", "класика", "овочі", "ковбаса"]
    },
    {
        id: 7,
        title: "Вареники з картоплею та смаженою цибулею",
        minutes: 90,
        calories: 260,
        category: "основні страви",
        img: "images/vareniky-card.jpg",
        details: { code: "RCP-0147", difficulty: "середня" },
        tags: ["вареники", "картопля", "цибуля"]
    },
    {
        id: 8,
        title: "Яблучний пиріг з корицею",
        minutes: 70,
        calories: 290,
        category: "випічка та десерти",
        img: "images/pie-card.jpg",
        details: { code: "RCP-0149", difficulty: "середня" },
        tags: ["яблуко", "пиріг", "кориця"]
    },
    {
        id: 9,
        title: "Налисники з сиром і ягідним соусом",
        minutes: 35,
        calories: 260,
        category: "сніданки",
        img: "images/crepes-card.jpg",
        details: { code: "RCP-0150", difficulty: "легка" },
        tags: ["сир", "млинці", "ягоди"]
    }
];

// ===== Допоміжні функції =====
// Записує текст у елемент з вказаним id. Масив рядків склеює переносами.
const show = (id, value) => {
    const box = document.getElementById(id);
    if (box === null) {
        console.error("Немає елемента з id:", id);
        return;
    }
    box.textContent = Array.isArray(value) ? value.join("\n") : value;
};
// ===== Функції обробки =====
// Приймає масив рецептів, повертає масив рядків «1. Назва — категорія, ккал (код)».
const numberedList = (items) => {
    const lines = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        lines.push(`${i + 1}. ${item.title} — ${item.category}, ${item.calories} ккал (${item.details.code})`);
    }
    return lines;
};

// Приймає рецепт, повертає назву групи за категорією (switch із групуванням case).
function categoryOf(recipe) {
    switch (recipe.category) {
        case "перші страви":
        case "основні страви":
            return "Гарячі страви";
        case "випічка та десерти":
        case "сніданки":
            return "Випічка та сніданки";
        default:
            return "Холодні страви й закуски";
    }
}

// Приймає масив і категорію, повертає рецепти з точно такою категорією.
const filterByCategory = (items, value) => items.filter((r) => r.category === value);

// Приймає масив і ліміт, повертає рецепти, які готуються не довше ніж maxMinutes хвилин.
const filterByMinutesUpTo = (items, maxMinutes) => items.filter((r) => r.minutes <= maxMinutes);

// Приймає масив рецептів, повертає рядок зі списком назв або «нічого не знайдено».
const namesOf = (items) =>
    items.length > 0 ? items.map((r) => `  • ${r.title}`).join("\n") : "  нічого не знайдено";

// Приймає масив, повертає НОВИЙ масив, відсортований за часом приготування (за зростанням).
const sortByMinutes = (items) => [...items].sort((a, b) => a.minutes - b.minutes);

// Приймає масив, повертає НОВИЙ масив, відсортований за назвою в українській абетці.
const sortByTitle = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

// Приймає масив рецептів, повертає масив рядків «назва (N хв)».
const withMinutes = (items) => items.map((r) => `${r.title} (${r.minutes} хв)`);

// Приймає масив рецептів, повертає об’єкт зі статистикою за часом приготування.
const statsForRecipes = (items) => {
    // 0 — початкове значення суми. Без нього першим «накопичувачем» став би
    // сам об’єкт-рецепт, і додавання дало б рядок «[object Object]20…»
    // замість числа (а на порожньому масиві було б ще й TypeError).
    const total = items.reduce((sum, r) => sum + r.minutes, 0);
    const longest = items.reduce((best, r) => (r.minutes > best.minutes ? r : best), items[0]);
    return {
        count: items.length,
        total: total,
        average: (total / items.length).toFixed(1),
        max: longest,
        categories: new Set(items.map((r) => r.category)).size
    };
};
// ===== Виведення на сторінку =====
if (document.getElementById("demo")) {
show("out-count", `Рецептів у каталозі: ${recipes.length}`);
show("out-numbered", numberedList(recipes));

show("out-categories", recipes.map((r) => `${r.title} → ${categoryOf(r)}`));

const firstCourses = filterByCategory(recipes, "перші страви");
const quick = filterByMinutesUpTo(recipes, 40);
const none = filterByCategory(recipes, "морозиво");

show("out-filter", [
    `Категорія «перші страви»: знайдено ${firstCourses.length}`,
    namesOf(firstCourses),
    `Готуються до 40 хвилин: знайдено ${quick.length}`,
    namesOf(quick),
    `Категорія «морозиво»: знайдено ${none.length}`,
    namesOf(none)
]);

show("out-sorted", [
    "За часом приготування:",
    ...withMinutes(sortByMinutes(recipes)),
    "",
    "За назвою (українська абетка):",
    ...withMinutes(sortByTitle(recipes)),
    "",
    "Вихідний порядок (оригінал не змінено):",
    ...withMinutes(recipes)
]);

const stats = statsForRecipes(recipes);
show("out-stats", [
    `Рецептів: ${stats.count}`,
    `Загальний час: ${stats.total} хв`,
    `Середній час: ${stats.average} хв`,
    `Найдовший рецепт: ${stats.max.title} — ${stats.max.minutes} хв`,
    `Різних категорій: ${stats.categories}`
]);
}

console.log("app.js підключено"); // тимчасово, приберемо наприкінці

function renderCards(list) {
    const container = document.getElementById("cards");
    if (!container) return;
    container.replaceChildren();

    for (const item of list) {
        const card = document.createElement("article");
        card.className = "card";
        card.dataset.id = item.id;

        const badge = document.createElement("span");
        badge.className = "card__badge";
        badge.textContent = item.category;

        const image = document.createElement("img");
        image.className = "card__img";
        image.src = item.img;
        image.alt = item.title;
        image.loading = "lazy";

        const body = document.createElement("div");
        body.className = "card__body";
        const title = document.createElement("h3");
        title.className = "card__title";
        title.textContent = item.title;
        const meta = document.createElement("p");
        meta.className = "card__meta";
        meta.textContent = `${item.category} · ${item.minutes} хв · ${item.calories} ккал`;
        const id = document.createElement("p");
        id.className = "card__id";
        id.textContent = `Ідентифікатор: ${item.details.code}`;
        body.append(title, meta, id);

        const actions = document.createElement("div");
        actions.className = "card__actions";
        const action = document.createElement("button");
        action.type = "button";
        action.className = "card__action";
        action.textContent = "Детальніше";
        actions.append(action);

        card.append(badge, image, body, actions);
        container.append(card);
    }
}

function applyFilters() {
    const query = document.getElementById("q").value.trim().toLowerCase();
    const category = document.getElementById("filter").value;
    let result = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query) || recipe.category.toLowerCase().includes(query)
    );
    if (category !== "all") result = filterByCategory(result, category);

    renderCards(result);
    document.getElementById("empty").hidden = result.length > 0;
}

const searchInput = document.getElementById("q");
const categoryFilter = document.getElementById("filter");
if (searchInput && categoryFilter) {
    // input спрацьовує під час кожного введення, тому результати оновлюються одразу.
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
}

renderCards(recipes);

let toastTimerId;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    // clearTimeout скасовує попереднє приховування, якщо нове повідомлення з’явилося раніше.
    clearTimeout(toastTimerId);
    toastTimerId = setTimeout(() => {
        toast.hidden = true;
    }, 2500);
}

const registrationForm = document.querySelector("form");
if (registrationForm) {
    const fields = [...registrationForm.querySelectorAll(
        'input:not([type="radio"]):not([name="extras"]):not([type="submit"]):not([type="reset"]), select, textarea'
    )];
    const receipt = document.createElement("section");
    receipt.id = "receipt";
    receipt.setAttribute("aria-live", "polite");
    registrationForm.after(receipt);

    // Клієнтська перевірка допомагає користувачу, але її можна обійти; дані по-справжньому перевіряє сервер.
    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        receipt.replaceChildren();

        const dateInput = registrationForm.elements.visitDate;
        const dateParts = new Date();
        const today = `${dateParts.getFullYear()}-${String(dateParts.getMonth() + 1).padStart(2, "0")}-${String(dateParts.getDate()).padStart(2, "0")}`;
        dateInput.setCustomValidity(
            dateInput.value && dateInput.value < today ? "Оберіть дату не раніше сьогоднішньої." : ""
        );

        let valid = true;
        for (const field of fields) {
            const ok = field.checkValidity();
            field.classList.toggle("invalid", !ok);
            document.getElementById(`err-${field.id}`).textContent = ok ? "" : field.validationMessage;
            valid = valid && ok;
        }
        if (!valid) {
            showToast("Перевірте поля з повідомленнями про помилки");
            return;
        }

        const selectedLevel = registrationForm.querySelector('input[name="level"]:checked');
        const extras = [...registrationForm.querySelectorAll('input[name="extras"]:checked')]
            .map((input) => input.value)
            .join(", ") || "немає";
        const lines = [
            `ПІБ: ${registrationForm.elements.fullname.value}`,
            `Email: ${registrationForm.elements.email.value}`,
            `Телефон: ${registrationForm.elements.phone.value || "не вказано"}`,
            `Дата: ${registrationForm.elements.visitDate.value || "не вказана"}`,
            `Тема: ${registrationForm.elements.topic.selectedOptions[0].textContent}`,
            `Учасників: ${Number(registrationForm.elements.participants.value)}`,
            `Код бронювання: ${registrationForm.elements.bookingCode.value}`,
            `Рівень: ${selectedLevel ? selectedLevel.value : "не обрано"}`,
            `Додаткові побажання: ${extras}`,
            `Згода на обробку даних: ${registrationForm.elements.consent.checked ? "так" : "ні"}`,
            `Коментар: ${registrationForm.elements.comment.value}`
        ];

        receipt.replaceChildren();
        const heading = document.createElement("h2");
        heading.textContent = "Квитанція запису";
        const list = document.createElement("ul");
        for (const line of lines) {
            const item = document.createElement("li");
            item.textContent = line;
            list.append(item);
        }
        receipt.append(heading, list);
        registrationForm.reset();
        showToast("Реєстрацію успішно надіслано");
    });
}

const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
if (burger && menu) {
    function setMenu(open) {
        menu.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", String(open));
    }

    burger.addEventListener("click", () => {
        setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#menu") && !event.target.closest("#burger")) {
            setMenu(false);
        }
    });
}

function isDark() {
    const root = document.documentElement;
    if (root.classList.contains("dark-theme")) return true;
    if (root.classList.contains("light-theme")) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark) {
    const root = document.documentElement;
    root.classList.toggle("dark-theme", dark);
    root.classList.toggle("light-theme", !dark);

    const button = document.getElementById("theme");
    if (!button) return;
    button.setAttribute("aria-pressed", String(dark));
    button.textContent = dark ? "☀️ Світла тема" : "🌙 Темна тема";
}

const themeButton = document.getElementById("theme");
if (themeButton) {
    applyTheme(isDark());
    themeButton.addEventListener("click", () => applyTheme(!isDark()));
}
