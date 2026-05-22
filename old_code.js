// // Old codes. Ignore this file. all comments

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