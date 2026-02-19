/* SilverE HordanG Janson5 - Zen Edition
   Features: LocalStorage, Fokus-Modus, Naruto Chakra-Glow & Ninja-Symbols
*/

const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

// Symbole für die Wochentage
const daySymbols = {
    "montag": "❟❛❟",
    "dienstag": "⚛",
    "mittwoch": "✇",
    "donnerstag": "✪",
    "freitag": "𖣘",
    "samstag": "𖣐",
    "sonntag": "𖦹"
};

// Dekorative Ninja-Elemente (Mahjong Steine)
const decoIcons = ["🀢", "🀣", "🀦", "🀤"];

let isFokusModus = localStorage.getItem('fokus-modus-active') === "true";

function renderApp() {
    const list = document.getElementById('workout-list');
    if (!list) return;
    
    list.innerHTML = "";
    const now = new Date();
    const todayName = now.toLocaleDateString('de-DE', { weekday: 'long' });
    document.getElementById('current-date').innerText = now.toLocaleDateString('de-DE');

    const btn = document.getElementById('fokus-toggle');
    if (btn) {
        btn.innerText = isFokusModus ? "Fokus-Modus: AN" : "Fokus-Modus: AUS";
        btn.style.borderColor = isFokusModus ? "#bc002d" : "#666";
        btn.style.color = isFokusModus ? "#bc002d" : "#666";
    }

    days.forEach((dayName, index) => {
        const isToday = dayName === todayName;
        const id = dayName.toLowerCase();

        if (isFokusModus && !isToday) return; 

        const isCollapsed = localStorage.getItem(`collapsed-${id}`) === null ? !isToday : localStorage.getItem(`collapsed-${id}`) === "true";
        const savedFokus = localStorage.getItem(`fokus-${id}`) || "Fokus festlegen...";
        let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`)) || [];

        // Ein zufälliges Deko-Icon für jede Karte
        const deco = decoIcons[index % decoIcons.length];

        const card = document.createElement('div');
        card.className = `card tag-${id} ${isToday ? 'card-active' : ''}`;

        let exercisesHTML = exercises.map((ex, idx) => `
            <li class="exercise-item">
                <input type="checkbox" ${ex.done ? 'checked' : ''} onchange="toggleDone('${id}', ${idx})">
                <input type="text" class="edit-input ${ex.done ? 'done' : ''}" value="${ex.name}" onchange="editEx('${id}', ${idx}, this.value)">
                <input type="number" class="weight-input" value="${ex.weight || ''}" placeholder="KG" onchange="editWeight('${id}', ${idx}, this.value)">
                <button class="btn-remove" onclick="removeEx('${id}', ${idx})">✕</button>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="tag-header" onclick="toggleDay('${id}')">
                <div style="flex: 1;">
                    <h3 class="tag-name">
                        ${deco} ${dayName} <span class="ninja-symbol">${daySymbols[id]}</span>
                    </h3>
                    <input class="fokus-input" value="${savedFokus}" onclick="event.stopPropagation()" onchange="saveFokus('${id}', this.value)">
                </div>
                <span class="chevron">${isCollapsed && !isFokusModus ? '▼' : '▲'}</span>
            </div>
            <div id="content-${id}" class="card-content" style="display: ${isCollapsed && !isFokusModus ? 'none' : 'block'};">
                <ul class="exercise-list">${exercisesHTML}</ul>
                <button class="btn-add" onclick="addEx('${id}')">+ Übung hinzufügen</button>
            </div>`;
        
        list.appendChild(card);
    });
}

/* --- FUNKTIONEN --- */

function toggleFokusModus() {
    isFokusModus = !isFokusModus;
    localStorage.setItem('fokus-modus-active', isFokusModus);
    renderApp();
}

function saveFokus(id, val) { localStorage.setItem(`fokus-${id}`, val); }

function addEx(id) {
    let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`)) || [];
    exercises.push({ name: "Neue Übung", weight: "", done: false });
    localStorage.setItem(`exercises-${id}`, JSON.stringify(exercises));
    renderApp();
}

function editEx(id, idx, val) {
    let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`));
    exercises[idx].name = val;
    localStorage.setItem(`exercises-${id}`, JSON.stringify(exercises));
}

function editWeight(id, idx, val) {
    let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`));
    exercises[idx].weight = val;
    localStorage.setItem(`exercises-${id}`, JSON.stringify(exercises));
}

function toggleDone(id, idx) {
    let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`));
    exercises[idx].done = !exercises[idx].done;
    localStorage.setItem(`exercises-${id}`, JSON.stringify(exercises));
    renderApp();
}

function removeEx(id, idx) {
    let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`));
    exercises.splice(idx, 1);
    localStorage.setItem(`exercises-${id}`, JSON.stringify(exercises));
    renderApp();
}

function toggleDay(id) {
    if (isFokusModus) return;
    const isHidden = localStorage.getItem(`collapsed-${id}`) === "true";
    localStorage.setItem(`collapsed-${id}`, !isHidden);
    renderApp();
}

window.onload = renderApp;
