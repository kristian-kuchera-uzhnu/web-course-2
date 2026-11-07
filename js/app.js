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

// ===== Функції обробки =====

// ===== Виведення на сторінку =====

console.log("app.js підключено"); // тимчасово, приберемо наприкінці