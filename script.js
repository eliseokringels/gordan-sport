const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

function renderApp() {
    const list = document.getElementById('workout-list');
    list.innerHTML = "";
    const today = new Date().toLocaleDateString('de-DE', { weekday: 'long' });

    days.forEach(dayName => {
        const id = dayName.toLowerCase();
        const card = document.createElement('div');
        const isToday = dayName === today;
        
        const isCollapsed = localStorage.getItem(`collapsed-${id}`) === null ? !isToday : localStorage.getItem(`collapsed-${id}`) === "true";
        const savedFokus = localStorage.getItem(`fokus-${id}`) || "Fokus festlegen...";
        
        // Übungen aus LocalStorage laden
        let exercises = JSON.parse(localStorage.getItem(`exercises-${id}`)) || [];

        card.className = `card ${isToday ? 'card-active' : ''}`;
        card.style.borderLeftColor = isToday ? "#10b981" : "#444";

        let exercisesHTML = exercises.map((ex, idx) => `
            <li class="exercise-item">
                <input type="checkbox" ${ex.done ? 'checked' : ''} onchange="toggleDone('${id}', ${idx})">
                <input type="text" class="edit-input ${ex.done ? 'done' : ''}" value="${ex.name}" onchange="editEx('${id}', ${idx}, this.value)">
                <input type="number" class="weight-input" value="${ex.weight || ''}" placeholder="KG" onchange="editWeight('${id}', ${idx}, this.value)">
                <button onclick="removeEx('${id}', ${idx})" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="tag-header" onclick="toggleDay('${id}')">
                <div>
                    <h3 class="tag-name">${dayName}</h3>
                    <input class="fokus-input" value="${savedFokus}" onclick="event.stopPropagation()" onchange="saveFokus('${id}', this.value)">
                </div>
                <span>${isCollapsed ? '▼' : '▲'}</span>
            </div>
            <div id="content-${id}" class="card-content" style="display: ${isCollapsed ? 'none' : 'block'};">
                <ul class="exercise-list">${exercisesHTML}</ul>
                <button class="btn-add" onclick="addEx('${id}')">+ Übung hinzufügen</button>
            </div>`;
        list.appendChild(card);
    });
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('de-DE');
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
    const isHidden = localStorage.getItem(`collapsed-${id}`) === "true";
    localStorage.setItem(`collapsed-${id}`, !isHidden);
    renderApp();
}

window.onload = renderApp;