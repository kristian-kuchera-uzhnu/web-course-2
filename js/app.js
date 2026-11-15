// ===== Дані =====
// const забороняє лише перепризначити саму змінну recipes, а вміст масиву можна змінювати, тому push далі працюватиме.
const recipes = [
    {
        id: 1,
        title: "Український борщ з пампушками",
        minutes: 120,
        calories: 180,
        category: "перші страви",
        details: { code: "RCP-0142", difficulty: "середня" },
        tags: ["борщ", "традиційна", "м’ясна"]
    },
    {
        id: 2,
        title: "Сирники зі сметаною",
        minutes: 20,
        calories: 210,
        category: "сніданки",
        details: { code: "RCP-0143", difficulty: "легка" },
        tags: ["сир", "швидко"]
    },
    {
        id: 3,
        title: "Домашня паста карбонара",
        minutes: 30,
        calories: 450,
        category: "основні страви",
        details: { code: "RCP-0144", difficulty: "середня" },
        tags: ["паста", "італійська", "бекон", "яйце"]
    },
    {
        id: 4,
        title: "Медовик",
        minutes: 90,
        calories: 320,
        category: "випічка та десерти",
        details: { code: "RCP-0145", difficulty: "складна" },
        tags: ["торт", "мед", "святкова"]
    },
    {
        id: 5,
        title: "Зелений борщ зі щавлем",
        minutes: 60,
        calories: 140,
        category: "перші страви",
        details: { code: "RCP-0146", difficulty: "легка" },
        tags: ["щавель", "весняна"]
    },
    {
        id: 6,
        title: "Салат «Олів’є»",
        minutes: 40,
        calories: 250,
        category: "салати та закуски",
        details: { code: "RCP-0148", difficulty: "легка" },
        tags: ["салат", "святкова", "класика", "овочі", "ковбаса"]
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