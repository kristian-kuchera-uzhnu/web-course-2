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
// ===== Виведення на сторінку =====
show("out-count", `Рецептів у каталозі: ${recipes.length}`);
show("out-numbered", numberedList(recipes));
console.log("app.js підключено"); // тимчасово, приберемо наприкінці