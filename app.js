
const DEFAULT_SECTION_TIME = 60;

let sections = [];

let currentSection = 0;
let currentQuestion = 0;

let timer;
let timeLeft = 0;

let results = [];

let sectionStartTime = 0;

let reasoningPhase = "statement";

let locked = false;
let currentQuestionStartTime = 0;

// Generates a single math question: 3 numbers under 100, close to each other, no ties
function generateSingleNumbersQuestion() {
    while (true) {
        // Choose a base value that ensures offset numbers stay between 3 and 96
        const base = Math.floor(Math.random() * 70) + 15; // Range: 15 to 84

        // Generate 3 unique offsets within a small range (-12 to 12)
        const offsets = [];
        while (offsets.length < 3) {
            const off = Math.floor(Math.random() * 25) - 12;
            if (!offsets.includes(off)) {
                offsets.push(off);
            }
        }

        // Apply offsets to base value
        const nums = offsets.map(o => base + o);

        // Sort ascending to find the middle (median) value
        const sorted = [...nums].sort((a, b) => a - b);
        const n1 = sorted[0];
        const n2 = sorted[1]; // Median
        const n3 = sorted[2];

        const diff1 = n2 - n1;
        const diff3 = n3 - n2;

        // Skip any calculations that produce a tie to prevent ambiguity
        if (diff1 !== diff3) {
            const answer = diff1 > diff3 ? n1 : n3;

            // Shuffle the presentation array so they are not shown in sorted order
            const displayNumbers = shuffle([...nums]);

            return {
                question: "Which number is farthest from the median?",
                numbers: displayNumbers,
                answer: String(answer)
            };
        }
    }
}

// Packages 15 questions into the section format required by the application
function generateNumericalAbilitySection() {
    const questions = [];
    for (let i = 0; i < 15; i++) {
        questions.push(generateSingleNumbersQuestion());
    }

    return {
        name: "Numerical Ability",
        info: "In this section, you will be shown three numbers. Identify which number is farthest from the middle (median) number.",
        type: "numbers",
        time: 60,
        questions: questions
    };
}

// Generates a single perceptual speed question: 4 columns, match top row (lowercase) to bottom row (uppercase)
function generateSinglePerceptualQuestion() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const topRow = [];
    const bottomRow = [];
    let matchesCount = 0;

    for (let i = 0; i < 4; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        topRow.push(char.toLowerCase());

        // Determine if this column should match
        if (Math.random() < 0.4) {
            bottomRow.push(char.toUpperCase());
            matchesCount++;
        } else {
            let otherChar;
            do {
                otherChar = chars[Math.floor(Math.random() * chars.length)];
            } while (otherChar === char);
            bottomRow.push(otherChar.toUpperCase());
        }
    }

    return {
        top: topRow,
        bottom: bottomRow,
        answer: String(matchesCount)
    };
}

// Packages perceptual speed questions into a section
function generatePerceptualSpeedSection() {
    const questions = [];
    for (let i = 0; i < 15; i++) {
        questions.push(generateSinglePerceptualQuestion());
    }

    return {
        name: "Perceptual Speed",
        info: "Count how many columns have the same letter (case-insensitive).",
        type: "perceptual",
        time: 60,
        questions: questions
    };
}

// Generates a single spatial visualization question: 4 vertical pairs in separate columns
function generateSingleSpatialQuestion() {
    const chars = "FGLPR"; // Asymmetric letters
    const rotations = [0, 90, 180, 270];
    const pairs = [];
    let matchesCount = 0;

    for (let i = 0; i < 4; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const rot1 = rotations[Math.floor(Math.random() * rotations.length)];
        const rot2 = rotations[Math.floor(Math.random() * rotations.length)];
        const isFlipped = Math.random() < 0.5;

        if (!isFlipped) matchesCount++;

        pairs.push({
            char: char,
            rot1: rot1,
            rot2: rot2,
            isFlipped: isFlipped
        });
    }

    return {
        pairs: pairs,
        answer: String(matchesCount)
    };
}

function generateSpatialSection() {
    const questions = [];
    for (let i = 0; i < 15; i++) {
        questions.push(generateSingleSpatialQuestion());
    }

    return {
        name: "Spatial Visualisation",
        info: "Identify how many pairs contain identical shapes (rotations are allowed, but mirrored images are not).",
        type: "spatial",
        time: 60,
        questions: questions
    };
}

async function loadQuestions(){
    try {
        const numSection = generateNumericalAbilitySection();
        const perSection = generatePerceptualSpeedSection();
        
        // Combine all generated sections
        sections = [numSection, perSection];

        shuffleSections();
        console.log("Successfully generated test structure:", sections);

    } catch(error) {
        console.error(error);
        alert("Could not initialize the questions.");
    }
}

async function safeStartTest(){

    if(sections.length === 0){

        await loadQuestions();
    }

    if(sections.length === 0){

        alert("questions.json is empty.");
        return;
    }

    startTest();
}

function startTest(){

    hideAllPages();

    document.getElementById("selectionPage")
        .classList.remove("hidden");
}

function startSpecificTest(type) {
    hideAllPages();
    currentSection = 0;
    results = []; // Reset results for new test

    let section;
    if (type === 'numbers') section = generateNumericalAbilitySection();
    else if (type === 'perceptual') section = generatePerceptualSpeedSection();
    else if (type === 'spatial') section = generateSpatialSection();
    
    sections = [section];
    showInfoPage();
}

function showInfoPage(){

    hideAllPages();

    const section = sections[currentSection];

    document.getElementById("infoPage")
        .classList.remove("hidden");

    document.getElementById("sectionTitle")
        .innerText = section.name;

    document.getElementById("infoText")
        .innerText = section.info;
}

function startQuestions(){

    hideAllPages();

    document.getElementById("questionPage")
        .classList.remove("hidden");

    currentQuestion = 0;

    reasoningPhase = "statement";

    sectionStartTime = performance.now();

    document.getElementById("indicators").innerHTML = "";

    startTimer();

    renderQuestion();
}

function startTimer(){

    clearInterval(timer);

    timeLeft =
        sections[currentSection].time ||
        DEFAULT_SECTION_TIME;

    updateTimer();

    timer = setInterval(()=>{

        timeLeft--;

        updateTimer();

        if(timeLeft <= 0){

            nextSection();
        }

        checkQuestionTime();

    },1000);
}

function checkQuestionTime() {
    const elapsed = (performance.now() - currentQuestionStartTime) / 1000;
    const warning = document.getElementById("timeWarning");
    const segments = warning.querySelectorAll(".segment");

    // Color logic: 0-3 green, 3-5 yellow, >5 red
    warning.classList.remove("green", "yellow", "red");
    if (elapsed >= 5) {
        warning.classList.add("red");
    } else if (elapsed >= 3) {
        warning.classList.add("yellow");
    } else {
        warning.classList.add("green");
    }

    // Progress: Fill 1 segment per second up to 5
    const animatedSegments = Math.min(5, Math.ceil(elapsed));
    segments.forEach((seg, index) => {
        if (index < animatedSegments) {
            seg.classList.add("active");
        } else {
            seg.classList.remove("active");
        }
    });

    // If over 5 seconds, ensure all are active + red (already handled by animatedSegments and color logic)
}

function updateTimer(){

    document.getElementById("timer")
        .innerText = `Time: ${timeLeft}s`;
}

function renderQuestion(){

    locked = false;

    const section = sections[currentSection];

    const q = section.questions[currentQuestion];

    const content =
        document.getElementById("content");

    content.innerHTML = "";

    currentQuestionStartTime = performance.now();
    resetTimeWarning();

    document.getElementById("progress")
        .innerText =
        `Question ${currentQuestion + 1}/${section.questions.length}`;

    // REASONING
    if(section.type === "reasoning"){

        if(reasoningPhase === "statement"){

            document.getElementById("question")
                .innerText = "";

            content.innerHTML = `
                <div class="statement">
                    ${q.statement}
                </div>

                <button class="btn" onclick="showReasoningQuestion()">
                    Continue
                </button>
            `;

            return;
        }

        document.getElementById("question")
            .innerText = q.question;

        content.innerHTML = "";

        content.appendChild(
            createOptions(q.options, q.answer)
        );

        return;
    }

    document.getElementById("question")
        .innerText = q.question || "";

    // PERCEPTUAL
    if(section.type === "perceptual"){

        const container = document.createElement("div");
        container.className = "perceptual-container";

        const topRow = document.createElement("div");
        topRow.className = "perceptual-row";
        q.top.forEach(char => {
            const span = document.createElement("span");
            span.innerText = char;
            topRow.appendChild(span);
        });

        const bottomRow = document.createElement("div");
        bottomRow.className = "perceptual-row";
        q.bottom.forEach(char => {
            const span = document.createElement("span");
            span.innerText = char;
            bottomRow.appendChild(span);
        });

        container.appendChild(topRow);
        container.appendChild(bottomRow);
        content.appendChild(container);

        content.appendChild(
            createOptions(["0", "1", "2", "3", "4"], q.answer)
        );
    }

    // NUMBERS
    else if(section.type === "numbers"){

        const nums =
            q.numbers.map(n=>String(n));

        content.appendChild(
            createOptions(nums, q.answer)
        );
    }

    // WORDS
    else if(section.type === "words"){

        content.appendChild(
            createOptions(q.words, q.answer)
        );
    }

    // SPATIAL
    else if(section.type === "spatial"){

        const grid = document.createElement("div");
        grid.className = "grid";

        q.pairs.forEach(p=>{

            const div = document.createElement("div");
            div.className = "pair";
            
            // Vertical stacking and large spacing
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.alignItems = "center";
            div.style.gap = "40px";
            div.style.padding = "45px 20px";

            const top = document.createElement("div");
            top.className = "spatial-text";
            top.innerText = p.char || p[0]; // Fallback to old format if needed
            top.style.transform = p.rot1 !== undefined ? `rotate(${p.rot1}deg)` : "";

            const bottom = document.createElement("div");
            bottom.className = "spatial-text";
            bottom.innerText = p.char || p[1];
            
            if (p.isFlipped !== undefined) {
                const mirror = p.isFlipped ? "scaleX(-1)" : "";
                bottom.style.transform = `${mirror} rotate(${p.rot2}deg)`;
            } else {
                bottom.style.transform = "";
            }

            div.appendChild(top);
            div.appendChild(bottom);
            grid.appendChild(div);
        });

        content.appendChild(grid);

        let nums = [];

        for(let i=0;i<=q.pairs.length;i++){

            nums.push(String(i));
        }

        content.appendChild(
            createOptions(nums, q.answer)
        );
    }
}

function showReasoningQuestion(){

    reasoningPhase = "question";

    renderQuestion();
}

// Builds the visual selection layout
function createOptions(options, correctAnswer){

    const wrapper = document.createElement("div");

    wrapper.className = "options";

    options.forEach(option=>{

        const div = document.createElement("div");

        div.className = "option";

        div.innerText = option;

        div.onclick = ()=>{

            submitAnswer(option, correctAnswer);
        };

        wrapper.appendChild(div);
    });

    return wrapper;
}

function submitAnswer(selected, correct){

    if(locked) return;

    locked = true;

    if(!results[currentSection]){

        results[currentSection] = {

            correct:0,

            total:
                sections[currentSection]
                .questions.length
        };
    }

    if(selected == correct){

        results[currentSection].correct++;
        addGreenDot();
    }

    reasoningPhase = "statement";

    currentQuestion++;

    if(
        currentQuestion >=
        sections[currentSection]
        .questions.length
    ){

        nextSection();
    }
    else{

        renderQuestion();
    }
}

function nextSection(){

    clearInterval(timer);

    const section =
        sections[currentSection];

    const totalTime =
        (performance.now() -
        sectionStartTime) / 1000;

    results[currentSection].avgTime =
        (
            totalTime /
            section.questions.length
        ).toFixed(2);

    currentSection++;

    if(currentSection >= sections.length){

        showResults();
    }
    else{

        showInfoPage();
    }
}

function showResults(){

    hideAllPages();

    document.getElementById("resultsPage")
        .classList.remove("hidden");

    // Show bottom banner on results page
    const footer = document.querySelector('.mozilla-footer');
    if (footer) {
        footer.classList.remove("hidden");
    }

    const resultsDiv =
        document.getElementById("results");

    resultsDiv.innerHTML = "";

    results.forEach((result,index)=>{

        const accuracy =
            Math.round(
                (result.correct /
                result.total) * 100
            );

        const div =
            document.createElement("div");

        div.className = "result-card";

        div.innerHTML = `
            <h3>${sections[index].name}</h3>

            <p>
                Score:
                <strong>
                    ${result.correct}/${result.total}
                </strong>
            </p>

            <p>
                Accuracy:
                <strong>
                    ${accuracy}%
                </strong>
            </p>

            <p>
                Avg Time / Question:
                <strong>
                    ${result.avgTime}s
                </strong>
            </p>
        `;

        resultsDiv.appendChild(div);
    });
}

function hideAllPages(){

    resetTimeWarning();

    document.getElementById("selectionPage")
        .classList.add("hidden");

    document.getElementById("home")
        .classList.add("hidden");

    document.getElementById("infoPage")
        .classList.add("hidden");

    document.getElementById("questionPage")
        .classList.add("hidden");

    document.getElementById("resultsPage")
        .classList.add("hidden");

    // Hide bottom banner by default on info & question pages
    const footer = document.querySelector('.mozilla-footer');
    if (footer) {
        footer.classList.add("hidden");
    }
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j =
            Math.floor(Math.random()*(i+1));

        [array[i],array[j]] =
        [array[j],array[i]];
    }

    return array;
}

function shuffleSections(){

    sections.forEach(section=>{

        shuffle(section.questions);
    });
}

loadQuestions();

function addGreenDot() {
    const dot = document.createElement("div");
    dot.className = "indicator-dot";
    document.getElementById("indicators").appendChild(dot);
}

function resetTimeWarning() {
    const warning = document.getElementById("timeWarning");
    if (!warning) return;
    warning.classList.remove("green", "yellow", "red");
    warning.querySelectorAll(".segment").forEach(seg => seg.classList.remove("active"));
}