// --- DOM Element References ---
const goalInput = document.getElementById('goalInput');
const generateBtn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const flowOutput = document.getElementById('flowOutput');
const aboutModal = document.getElementById('aboutModal');
const openAboutBtn = document.getElementById('openAboutBtn');
const closeAboutBtn = document.getElementById('closeAboutBtn');

// --- Event Listeners ---
generateBtn.addEventListener('click', generateFlow);
goalInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        generateFlow();
    }
});

// --- About Modal Logic ---
openAboutBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
    aboutModal.querySelector('div').classList.add('animate-fade-in-up');
});
const closeModal = () => {
    aboutModal.classList.add('hidden');
    aboutModal.querySelector('div').classList.remove('animate-fade-in-up');
};
closeAboutBtn.addEventListener('click', closeModal);
aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        closeModal();
    }
});


// --- Core AI Flow Generation Logic ---
async function generateFlow() {
    const userGoal = goalInput.value.trim();
    if (!userGoal) {
        showError("Please enter a goal.");
        return;
    }

    flowOutput.innerHTML = '';
    errorMessage.classList.add('hidden');
    loader.classList.remove('hidden');
    generateBtn.disabled = true;
    generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

    try {
        const prompt = `Generate a detailed, step-by-step plan for the following goal: "${userGoal}". Structure the plan with a main title, and break it down into logical phases. Each phase must have a title and a list of specific, actionable tasks. For each task, provide the task name. Optionally, you can also include a suggested duration (e.g., "1-2 days") and a list of tools or resources needed for that task.`;

        const schema = {
            type: "OBJECT",
            properties: {
                "title": { "type": "STRING", "description": "The main title of the overall plan." },
                "phases": {
                    "type": "ARRAY",
                    "description": "An array of the major phases or stages of the plan.",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "phase_title": { "type": "STRING", "description": "The title of this specific phase." },
                            "tasks": {
                                "type": "ARRAY",
                                "description": "A list of actionable tasks within this phase.",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "task_name": { "type": "STRING", "description": "The name of the specific task." },
                                        "duration": { "type": "STRING", "description": "Optional: Estimated time to complete the task (e.g., '2 hours', '1-2 days')." },
                                        "tools": { "type": "STRING", "description": "Optional: Comma-separated list of tools or resources needed." }
                                    },
                                    "required": ["task_name"]
                                }
                            }
                        },
                        "required": ["phase_title", "tasks"]
                    }
                }
            },
            required: ["title", "phases"]
        };

        const apiUrl = '/.netlify/functions/generate-flow';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt, schema: schema })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(jsonText);
            displayFlow(parsedJson);
        } else {
            console.error("Unexpected API response structure:", result);
            throw new Error("Failed to generate a valid flow from the API response.");
        }

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || "An unexpected error occurred. Check the console for details.");
    } finally {
        loader.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// --- UI Rendering and Manipulation ---
function displayFlow(data) {
    flowOutput.innerHTML = '';

    const titleElement = document.createElement('h2');
    titleElement.className = 'text-3xl font-bold text-center text-white mb-4';
    titleElement.setAttribute('contenteditable', 'true');
    titleElement.textContent = data.title || "Your Generated Plan";
    flowOutput.appendChild(titleElement);

    const progressContainer = document.createElement('div');
    progressContainer.className = 'max-w-4xl mx-auto mb-8';
    progressContainer.innerHTML = `
        <div class="progress-bar-container">
            <div id="progressBar" class="progress-bar">0%</div>
        </div>
    `;
    flowOutput.appendChild(progressContainer);

    const phasesContainer = document.createElement('div');
    phasesContainer.id = 'phases-container';
    phasesContainer.className = 'space-y-6';
    flowOutput.appendChild(phasesContainer);

    if (data.phases && data.phases.length > 0) {
        data.phases.forEach(phase => {
            phasesContainer.appendChild(createPhaseElement(phase));
        });
    }

    const addPhaseBtn = document.createElement('button');
    addPhaseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg> <span>Add Phase</span>`;
    addPhaseBtn.className = 'mt-6 flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg bg-white/20 hover:bg-white/30 transition';
    addPhaseBtn.onclick = () => {
        phasesContainer.appendChild(createPhaseElement({ phase_title: 'New Phase', tasks: [] }));
        updateProgress();
    };
    flowOutput.appendChild(addPhaseBtn);

    updateProgress();
}

function createPhaseElement(phaseData) {
    const phaseCard = document.createElement('div');
    phaseCard.className = 'phase-card bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200';

    const tasksHtml = phaseData.tasks.map(createTaskElement).join('');

    phaseCard.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-2xl font-bold text-gray-800" contenteditable="true">${phaseData.phase_title}</h3>
            <button class="delete-btn p-1 text-gray-400 hover:text-red-500" onclick="if(confirm('Are you sure you want to delete this phase?')) { this.closest('.phase-card').remove(); updateProgress(); }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
        <div class="tasks-list space-y-3">${tasksHtml}</div>
        <button class="mt-4 flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Add Task</span>
        </button>
    `;

    phaseCard.querySelector('.tasks-list').addEventListener('change', updateProgress);
    phaseCard.querySelector('.mt-4.flex').addEventListener('click', (e) => {
        const tasksList = e.currentTarget.previousElementSibling;
        const taskEl = document.createElement('div');
        taskEl.innerHTML = createTaskElement({ task_name: 'New Task' });
        tasksList.appendChild(taskEl.firstChild);
        updateProgress();
    });

    return phaseCard;
}

function createTaskElement(taskData) {
    const durationText = taskData.duration ? `<span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">${taskData.duration}</span>` : '';
    const toolsText = taskData.tools ? `<div class="text-xs text-gray-500 mt-1 ml-7 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.7 2.8a1 1 0 0 1 .3 1.4l-7.4 12.1a1 1 0 0 1-1.7-.2l-3.5-7.4a1 1 0 0 1 1.4-1.4l11-4.5z"/><path d="m21.4 21.4-5.2-5.2"/></svg><span>${taskData.tools}</span></div>` : '';

    return `
        <div class="task-item border-l-4 border-transparent hover:border-indigo-200 py-1">
            <div class="flex items-center justify-between">
                <div class="flex items-center flex-grow">
                     <input type="checkbox" class="task-checkbox hidden">
                     <div class="w-5 h-5 border-2 border-gray-300 rounded-md mr-3 flex-shrink-0 cursor-pointer check-box"></div>
                     <span class="text-gray-800 flex-grow" contenteditable="true">${taskData.task_name}</span>
                     ${durationText}
                </div>
                <button class="delete-btn p-1 text-gray-400 hover:text-red-500 ml-2" onclick="if(confirm('Are you sure you want to delete this task?')) { this.closest('.task-item').remove(); updateProgress(); }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
            ${toolsText}
        </div>
    `;
}

// Event delegation for checkboxes
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('check-box')) {
        const taskItem = e.target.closest('.task-item');
        taskItem.classList.toggle('opacity-50');
        taskItem.querySelector('span[contenteditable]').classList.toggle('line-through');
        e.target.classList.toggle('bg-indigo-500');
        e.target.classList.toggle('border-indigo-500');
        updateProgress();
    }
});

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function updateProgress() {
    const allTasks = document.querySelectorAll('.task-item');
    if (allTasks.length === 0) {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        return;
    };

    const completedTasks = document.querySelectorAll('.task-item.opacity-50');
    const progress = (completedTasks.length / allTasks.length) * 100;

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}
