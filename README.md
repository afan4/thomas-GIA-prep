# Thomas GIA Practice Test

A lightweight browser-based practice platform for the Thomas GIA aptitude assessment.

Built using:
- HTML
- CSS
- Vanilla JavaScript
- JSON question bank

---

## Features

- 5 Thomas GIA style sections
    - Reasoning
    - Perceptual Speed
    - Number Speed & Accuracy
    - Word Meaning
    - Spatial Visualisation

- Realistic test flow
- Section timers
- Accuracy tracking
- Average response time analytics
- Responsive UI
- Unlimited question support via JSON
- Shuffle support
- Mobile friendly

---

## Project Structure

```txt
project/
│
├── index.html
├── style.css
├── app.js
└── questions.json
```

---

## Running Locally

Use a local server.

### VS Code
Install:
- Live Server Extension

Then:
- Right click `index.html`
- Open with Live Server

---

## Question Format

Questions are loaded from:

```txt
questions.json
```

Example:

```json
{
    "name":"Reasoning",
    "type":"reasoning",
    "time":60,
    "questions":[]
}
```

---

## Supported Types

### Reasoning

```json
{
    "statement":"James is shorter than Paul.",
    "question":"Who is taller?",
    "options":["James","Paul"],
    "answer":"Paul"
}
```

### Perceptual Speed

```json
{
    "pairs":[
        ["A","a"],
        ["Q","q"]
    ],
    "answer":"2"
}
```

### Number Speed & Accuracy

```json
{
    "numbers":[4,11,7],
    "answer":"11"
}
```

### Word Meaning

```json
{
    "words":["hot","warm","chair"],
    "answer":"chair"
}
```

### Spatial Visualisation

```json
{
    "pairs":[
        ["R","R"],
        ["F","ꟻ"]
    ],
    "answer":"1"
}
```

---

## Notes

- This is an educational practice tool.
- Not affiliated with Thomas International.
- Designed for aptitude speed training.

---

## Author

**K KAD**