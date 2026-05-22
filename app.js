// // app.js

// const DEFAULT_SECTION_TIME = 60;

// let sections = [];

// let currentSection = 0;
// let currentQuestion = 0;

// let timer;
// let timeLeft = 0;

// let results = [];

// let sectionStartTime = 0;

// let reasoningPhase = "statement";

// let locked = false;

// async function loadQuestions(){

//     try{

//         const response = await fetch("questions2.json");

//         sections = await response.json();

//         shuffleSections();

//         console.log(sections);

//     }catch(error){

//         console.error(error);

//         alert("Could not load questions.json");
//     }
// }

// async function safeStartTest(){

//     if(sections.length === 0){

//         await loadQuestions();
//     }

//     if(sections.length === 0){

//         alert("questions.json is empty.");
//         return;
//     }

//     startTest();
// }

// function startTest(){

//     hideAllPages();

//     document.getElementById("home")
//         .classList.remove("hidden");

//     document.getElementById("home")
//         .classList.add("hidden");

//     showInfoPage();
// }

// function showInfoPage(){

//     hideAllPages();

//     const section = sections[currentSection];

//     document.getElementById("infoPage")
//         .classList.remove("hidden");

//     document.getElementById("sectionTitle")
//         .innerText = section.name;

//     document.getElementById("infoText")
//         .innerText = section.info;
// }

// function startQuestions(){

//     hideAllPages();

//     document.getElementById("questionPage")
//         .classList.remove("hidden");

//     currentQuestion = 0;

//     reasoningPhase = "statement";

//     sectionStartTime = performance.now();

//     startTimer();

//     renderQuestion();
// }

// function startTimer(){

//     clearInterval(timer);

//     timeLeft =
//         sections[currentSection].time ||
//         DEFAULT_SECTION_TIME;

//     updateTimer();

//     timer = setInterval(()=>{

//         timeLeft--;

//         updateTimer();

//         if(timeLeft <= 0){

//             nextSection();
//         }

//     },1000);
// }

// function updateTimer(){

//     document.getElementById("timer")
//         .innerText = `Time: ${timeLeft}s`;
// }

// function renderQuestion(){

//     locked = false;

//     const section = sections[currentSection];

//     const q = section.questions[currentQuestion];

//     const content =
//         document.getElementById("content");

//     content.innerHTML = "";

//     document.getElementById("progress")
//         .innerText =
//         `Question ${currentQuestion + 1}/${section.questions.length}`;

//     // REASONING
//     if(section.type === "reasoning"){

//         if(reasoningPhase === "statement"){

//             document.getElementById("question")
//                 .innerText = "";

//             content.innerHTML = `
//                 <div class="statement">
//                     ${q.statement}
//                 </div>

//                 <button class="btn" onclick="showReasoningQuestion()">
//                     Continue
//                 </button>
//             `;

//             return;
//         }

//         document.getElementById("question")
//             .innerText = q.question;

//         content.innerHTML = "";

//         content.appendChild(
//             createOptions(q.options, q.answer)
//         );

//         return;
//     }

//     document.getElementById("question")
//         .innerText = q.question || "";

//     // PERCEPTUAL
//     if(section.type === "perceptual"){

//         const grid = document.createElement("div");

//         grid.className = "grid";

//         q.pairs.forEach(pair=>{

//             const div = document.createElement("div");

//             div.className = "pair";

//             div.innerHTML =
//                 `${pair[0]} &nbsp;&nbsp; ${pair[1]}`;

//             grid.appendChild(div);
//         });

//         content.appendChild(grid);

//         let nums = [];

//         for(let i=0;i<=q.pairs.length;i++){

//             nums.push(String(i));
//         }

//         content.appendChild(
//             createOptions(nums, q.answer)
//         );
//     }

//     // NUMBERS
//     else if(section.type === "numbers"){

//         const nums =
//             q.numbers.map(n=>String(n));

//         content.appendChild(
//             createOptions(nums, q.answer)
//         );
//     }

//     // WORDS
//     else if(section.type === "words"){

//         content.appendChild(
//             createOptions(q.words, q.answer)
//         );
//     }

//     // SPATIAL
//     else if(section.type === "spatial"){

//         const grid = document.createElement("div");

//         grid.className = "grid";

//         q.pairs.forEach(pair=>{

//             const div = document.createElement("div");

//             div.className = "pair";

//             div.innerHTML =
//                 `${pair[0]}<br><br>${pair[1]}`;

//             grid.appendChild(div);
//         });

//         content.appendChild(grid);

//         let nums = [];

//         for(let i=0;i<=q.pairs.length;i++){

//             nums.push(String(i));
//         }

//         content.appendChild(
//             createOptions(nums, q.answer)
//         );
//     }
// }

// function showReasoningQuestion(){

//     reasoningPhase = "question";

//     renderQuestion();
// }

// function createOptions(options, correctAnswer){

//     const wrapper = document.createElement("div");

//     wrapper.className = "options";

//     options.forEach(option=>{

//         const div = document.createElement("div");

//         div.className = "option";

//         div.innerText = option;

//         div.onclick = ()=>{

//             submitAnswer(option, correctAnswer);
//         };

//         wrapper.appendChild(div);
//     });

//     return wrapper;
// }

// function submitAnswer(selected, correct){

//     if(locked) return;

//     locked = true;

//     if(!results[currentSection]){

//         results[currentSection] = {

//             correct:0,

//             total:
//                 sections[currentSection]
//                 .questions.length
//         };
//     }

//     if(selected == correct){

//         results[currentSection].correct++;
//     }

//     reasoningPhase = "statement";

//     currentQuestion++;

//     if(
//         currentQuestion >=
//         sections[currentSection]
//         .questions.length
//     ){

//         nextSection();
//     }
//     else{

//         renderQuestion();
//     }
// }

// function nextSection(){

//     clearInterval(timer);

//     const section =
//         sections[currentSection];

//     const totalTime =
//         (performance.now() -
//         sectionStartTime) / 1000;

//     results[currentSection].avgTime =
//         (
//             totalTime /
//             section.questions.length
//         ).toFixed(2);

//     currentSection++;

//     if(currentSection >= sections.length){

//         showResults();
//     }
//     else{

//         showInfoPage();
//     }
// }

// function showResults(){

//     hideAllPages();

//     document.getElementById("resultsPage")
//         .classList.remove("hidden");

//     // Show bottom banner on results page
//     const footer = document.querySelector('.mozilla-footer');
//     if (footer) {
//         footer.classList.remove("hidden");
//     }

//     const resultsDiv =
//         document.getElementById("results");

//     resultsDiv.innerHTML = "";

//     results.forEach((result,index)=>{

//         const accuracy =
//             Math.round(
//                 (result.correct /
//                 result.total) * 100
//             );

//         const div =
//             document.createElement("div");

//         div.className = "result-card";

//         div.innerHTML = `
//             <h3>${sections[index].name}</h3>

//             <p>
//                 Score:
//                 <strong>
//                     ${result.correct}/${result.total}
//                 </strong>
//             </p>

//             <p>
//                 Accuracy:
//                 <strong>
//                     ${accuracy}%
//                 </strong>
//             </p>

//             <p>
//                 Avg Time / Question:
//                 <strong>
//                     ${result.avgTime}s
//                 </strong>
//             </p>
//         `;

//         resultsDiv.appendChild(div);
//     });
// }

// function hideAllPages(){

//     document.getElementById("home")
//         .classList.add("hidden");

//     document.getElementById("infoPage")
//         .classList.add("hidden");

//     document.getElementById("questionPage")
//         .classList.add("hidden");

//     document.getElementById("resultsPage")
//         .classList.add("hidden");

//     // Hide bottom banner by default on info & question pages
//     const footer = document.querySelector('.mozilla-footer');
//     if (footer) {
//         footer.classList.add("hidden");
//     }
// }

// function shuffle(array){

//     for(let i=array.length-1;i>0;i--){

//         const j =
//             Math.floor(Math.random()*(i+1));

//         [array[i],array[j]] =
//         [array[j],array[i]];
//     }

//     return array;
// }

// function shuffleSections(){

//     sections.forEach(section=>{

//         shuffle(section.questions);
//     });
// }

// loadQuestions();


// app.js

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

async function loadQuestions(){
    try {
        // Generates questions programmatically instead of fetching questions2.json
        const numSection = generateNumericalAbilitySection();
        sections = [numSection];

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

    document.getElementById("home")
        .classList.remove("hidden");

    document.getElementById("home")
        .classList.add("hidden");

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

        const grid = document.createElement("div");

        grid.className = "grid";

        q.pairs.forEach(pair=>{

            const div = document.createElement("div");

            div.className = "pair";

            div.innerHTML =
                `${pair[0]} &nbsp;&nbsp; ${pair[1]}`;

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

        q.pairs.forEach(pair=>{

            const div = document.createElement("div");

            div.className = "pair";

            div.innerHTML =
                `${pair[0]}<br><br>${pair[1]}`;

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