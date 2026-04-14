const analyzeBtn = document.getElementById('analyzeBtn');

// Inputs
const foodInput = document.getElementById('foodInput');
const moodInput = document.getElementById('moodInput');
const contextInput = document.getElementById('contextInput');
const stepsInput = document.getElementById('stepsInput');
const hrInput = document.getElementById('hrInput');
const activityInput = document.getElementById('activityInput');
const recoveryInput = document.getElementById('recoveryInput');

// Slider Label Updates
stepsInput.addEventListener('input', (e) => document.getElementById('stepsVal').innerText = e.target.value);
hrInput.addEventListener('input', (e) => document.getElementById('hrVal').innerText = e.target.value + ' bpm');

// States
const defaultState = document.getElementById('defaultState');
const loadingState = document.getElementById('loadingState');
const resultsState = document.getElementById('resultsState');
const loadingSubtext = document.getElementById('loadingSubtext');

// Results DOM Map
const domMap = {
    summary: document.getElementById('aiSummary'),
    bActivity: document.getElementById('outActivity'),
    bHR: document.getElementById('outHR'),
    bRecovery: document.getElementById('outRecovery'),
    bStatus: document.getElementById('outStatus'),
    sCondition: document.getElementById('outCondition'),
    sReason: document.getElementById('outReason'),
    sImpact1: document.getElementById('outImpact1'),
    sImpact2: document.getElementById('outImpact2'),
    iAction1: document.getElementById('outAction1'),
    iBenefit1: document.getElementById('outBenefit1'),
    iAction2: document.getElementById('outAction2'),
    iBenefit2: document.getElementById('outBenefit2')
};

const loadingSteps = [
    { text: "Reading biological telemetry endpoints...", time: 500 },
    { text: "Cross-referencing food composition...", time: 1500 },
    { text: "Detecting alignment mismatch...", time: 2500 },
    { text: "Quantifying prescribed interventions...", time: 3500 }
];

analyzeBtn.addEventListener('click', () => {
    if (!foodInput.value.trim()) {
        foodInput.placeholder = "SYSTEM ERROR: Input required...";
        setTimeout(() => foodInput.placeholder = "Enter Food... (e.g. Pasta with meatballs)", 2000);
        return;
    }

    defaultState.classList.add('hidden');
    resultsState.classList.add('hidden');
    loadingState.classList.remove('hidden');

    analyzeBtn.innerHTML = `<span class="btn-text">SYNCING METRICS...</span><i class="fa-solid fa-spinner fa-spin"></i>`;
    analyzeBtn.style.boxShadow = "var(--glow-purple)";
    
    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
            loadingSubtext.innerText = loadingSteps[currentStep].text;
            currentStep++;
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        
        // Strict JSON simulation call
        const aiResponse = generateStrictJSON({
            food: foodInput.value.trim(),
            mood: moodInput.value,
            context: contextInput.value,
            steps: parseInt(stepsInput.value),
            hr: parseInt(hrInput.value),
            activity: activityInput.value,
            recovery: recoveryInput.value
        });
        
        bindJSONToDOM(aiResponse);
        
        loadingState.classList.add('hidden');
        resultsState.classList.remove('hidden');
        analyzeBtn.innerHTML = `<span class="btn-text">RECALCULATE SYNC</span><i class="fa-solid fa-rotate-right"></i>`;
    }, 4500);
});

// The Strict Multi-Agent Logic matching newly requested Body-State JSON schema
function generateStrictJSON(data) {
    const isHeavyFood = data.food.toLowerCase().includes('burger') || data.food.toLowerCase().includes('pizza') || data.food.toLowerCase().includes('pasta');
    const isSedentary = data.steps < 5000 || data.activity === 'sedentary';
    const isStressedHr = data.hr > 90 || data.mood === 'stressed';
    const isFatigued = data.recovery === 'fatigued';

    // Baseline JSON Structure - Mismatch Route
    if (isHeavyFood && (isSedentary || isFatigued)) {
        return {
            bodyState: {
                activity: `${data.steps} steps (${data.activity})`,
                heartRate: `${data.hr} bpm`,
                recovery: data.recovery.toUpperCase(),
                status: isFatigued ? "Low Kinetic Output / High Fatigue" : "Sedentary Accumulation"
            },
            syncAnalysis: {
                condition: "Misaligned",
                reason: `Caloric load of [${data.food}] significantly exceeds current kinetic demand.`,
                impact: [
                    "Fatigue amplification within 60 minutes due to massive digestion overhead.",
                    "Unutilized caloric surplus will be stored due to lack of metabolic sink."
                ]
            },
            intervention: {
                actions: [
                    "Execute a 15-minute brisk walk post-consumption.",
                    "Increase water intake by 500ml over the next hour."
                ],
                benefit: [
                    "Drastically blunts the insulin spike and aids gastric mobility.",
                    "Improves digestion efficiency and mitigates post-meal brain fog."
                ]
            },
            summary: "You are attempting to fuel up like a sports car while parked in a garage. Move immediately after eating to offset the excess load."
        };
    } 
    // Baseline JSON Structure - Optimal Route
    else {
        return {
            bodyState: {
                activity: `${data.steps} steps (${data.activity})`,
                heartRate: `${data.hr} bpm`,
                recovery: data.recovery.toUpperCase(),
                status: "Metabolically active and primed for intake."
            },
            syncAnalysis: {
                condition: "Optimal Synchrony",
                reason: `Your physical output justifies the cellular demands of [${data.food}].`,
                impact: [
                    "Provides rapid glycogen replenishment for muscles.",
                    "Stabilizes heart rate variability and enhances recovery."
                ]
            },
            intervention: {
                actions: [
                    "Consume slowly to allow vagus nerve activation.",
                    "Ensure you include sufficient dietary protein to repair muscle."
                ],
                benefit: [
                    "Maximizes nutrient extraction in the gut.",
                    "Directly capitalizes on the current 'peaking' recovery window."
                ]
            },
            summary: "Excellent alignment! Your active biomechanics demand this fuel. Proceed with the meal and enjoy the metabolic benefits."
        };
    }
}

function bindJSONToDOM(json) {
    domMap.summary.innerText = json.summary;

    domMap.bActivity.innerText = json.bodyState.activity;
    domMap.bHR.innerText = json.bodyState.heartRate;
    domMap.bRecovery.innerText = json.bodyState.recovery;
    domMap.bStatus.innerText = json.bodyState.status;

    domMap.sCondition.innerText = json.syncAnalysis.condition;
    domMap.sCondition.style.color = json.syncAnalysis.condition === "Misaligned" ? "var(--red)" : "var(--green)";
    domMap.sReason.innerText = json.syncAnalysis.reason;
    domMap.sImpact1.innerText = json.syncAnalysis.impact[0];
    domMap.sImpact2.innerText = json.syncAnalysis.impact[1];

    domMap.iAction1.innerText = json.intervention.actions[0];
    domMap.iBenefit1.innerText = json.intervention.benefit[0];
    domMap.iAction2.innerText = json.intervention.actions[1];
    domMap.iBenefit2.innerText = json.intervention.benefit[1];
}
