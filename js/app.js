// ===== Дані =====
// Цей масив буде заповнено після завантаження data.json.
let recipes = [];

// Перевіряє HTTP-статус, бо fetch вважає 404 успішно отриманою відповіддю і не відхиляє Promise.
async function loadData() {
    const response = await fetch("data.json");
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Файл даних порожній або має неправильну структуру");
    }

    return data;
}

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
// Оновлює демо після завантаження рецептів; виклик буде в init().
function renderDemo() {
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

function renderCards(list) {
    const container = document.getElementById("cards");
    if (!container) return;
    container.replaceChildren();

    for (const item of list) {
        const card = document.createElement("article");
        card.className = "card";
        card.dataset.id = item.id;

        const badge = document.createElement("span");
        const quickRecipe = item.minutes <= 40;
        badge.className = quickRecipe ? "card__badge" : "card__badge card__badge--out";
        badge.textContent = quickRecipe ? "Швидко" : "Потрібен час";

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


const cardsContainer = document.getElementById("cards");
const detailsDialog = document.getElementById("details");
if (cardsContainer && detailsDialog) {
    // Один слухач на батьківському контейнері отримує спливаючі кліки і від карток після перемальовування.
    cardsContainer.addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (!card) return;

        const recipe = recipes.find((item) => item.id === Number(card.dataset.id));
        if (!recipe) return;

        document.getElementById("d-title").textContent = recipe.title;
        document.getElementById("d-line1").textContent = `Категорія: ${recipe.category}`;
        document.getElementById("d-line2").textContent = `Приготування: ${recipe.minutes} хв · ${recipe.calories} ккал`;
        document.getElementById("d-line3").textContent = `Код: ${recipe.details.code} · Складність: ${recipe.details.difficulty}`;
        detailsDialog.showModal();
    });

    document.getElementById("d-close").addEventListener("click", () => detailsDialog.close());
}

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

const loader = document.querySelector(".loader");
if (loader) loader.hidden = false;

// Показує людині причину помилки завантаження та підказує, що зробити.
function showLoadError(error) {
    const box = document.getElementById("load-error");
    if (!box) return;
    box.hidden = false;
    box.textContent = `Не вдалося завантажити каталог. Перевір з’єднання й онови сторінку. Технічні подробиці: ${error.message}`;
}

// Завантажує рецепти для каталогу й запускає наявний пошук після отримання даних.
async function init() {
    if (!document.getElementById("cards")) return;

    try {
        recipes = await loadData();
        applyFilters();
    } catch (error) {
        showLoadError(error);
    } finally {
        // finally ховає спінер і після успішного запиту, і після будь-якої помилки.
        if (loader) loader.hidden = true;
    }
}

init();
