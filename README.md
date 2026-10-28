[README.md](https://github.com/user-attachments/files/34074247/README.md)
# 🛡️ HUMAN FIREWALL — Can You Outsmart a Hacker?

> **"Think Before You Click."**

An interactive, browser-based cybersecurity awareness game that teaches you how to recognize phishing emails, fake login pages, and social-engineering attacks. Built as a complete front-end project using only HTML5, CSS3, and JavaScript — no backend, no external APIs, works fully offline.

---

## 📁 Project Structure

```
human-firewall/
├── index.html      ← Main HTML: navigation, all section layouts, modals
├── style.css       ← Complete styling: dark theme, neon accents, responsive layout
├── script.js       ← All game logic, scoring, localStorage, animations
└── README.md       ← This file
```

---

## 🚀 How to Run

### Option 1 — Open directly in a browser (simplest)
1. Download or clone this project folder.
2. Open the `human-firewall/` folder.
3. Double-click `index.html`.
4. The game opens in your default browser.

### Option 2 — Open with Visual Studio Code + Live Server
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Open the `human-firewall/` folder in VS Code (`File → Open Folder`).
4. Right-click `index.html` → **Open with Live Server**.
5. The game opens at `http://127.0.0.1:5500/`.

> **No internet required after the files are saved.** The game works fully offline.

---

## 🎮 How to Play

| Step | Action |
|------|--------|
| 1 | Open the **Dashboard** — see your score, level, and badges |
| 2 | Click **Start Training** or select **Train** in the navigation |
| 3 | Choose a challenge category |
| 4 | Select **Learn Mode** (no timer) or **Timed Challenge** (30 s/question) |
| 5 | Read each scenario carefully and choose the safest response |
| 6 | Earn **+100 points** per correct answer |
| 7 | Read the explanation after each answer — this is where the real learning happens |
| 8 | Complete all challenges to unlock badges and reach the top level |

### Keyboard Shortcuts
- **1 / A** — Select option A (or Page A for login challenges)
- **2 / B** — Select option B
- **3 / C** — Select option C
- **Escape** — Close the reset-confirmation dialog

---

## 📊 Features

### Dashboard
- Live score, level, completed challenges, and badge count
- Overall progress bar with percentage
- Animated cybersecurity background (matrix-style canvas)
- Daily cybersecurity tip with refresh button

### Challenge Categories

| Category | Challenges | Description |
|----------|-----------|-------------|
| 🎣 Phishing Email Detector | 10 | Identify fake emails from realistic scenarios |
| 🔒 Fake Login Detector | 5 | Spot the fraudulent login page in a side-by-side comparison |
| 👥 Social Engineering | 10 | Choose the safest action in realistic attack scenarios |

### Scoring & Levels
| Level | Minimum Score |
|-------|--------------|
| 1 — Cyber Rookie | 0 |
| 2 — Scam Spotter | 300 |
| 3 — Phishing Detective | 700 |
| 4 — Security Guardian | 1,200 |
| 5 — Human Firewall Elite | 2,000 |

### Badges
| Badge | How to Earn |
|-------|------------|
| 🎯 First Mission | Complete your first challenge |
| 🎣 Phishing Hunter | Complete all 10 phishing challenges |
| 🚫 Scam Buster | Complete all 10 social engineering challenges |
| 🔒 Privacy Protector | Complete all 5 fake login challenges |
| 🛡️ Cyber Guardian | Complete all three categories |
| ⭐ Human Firewall Elite | Reach 2,000 points (Level 5) |

### Leaderboard
- Local only — stored on your device via `localStorage`
- Enter a display nickname and submit your score
- Includes sample fictional players for reference
- **Note:** Scores are NOT shared across devices or other players

### Final Results Screen
After each category quiz:
- Total questions, correct/incorrect count, accuracy %
- Points earned in the session
- Newly unlocked badges
- Performance message and recommended next category
- Option to review all answers with explanations

---

## 🧪 Testing Checklist

Run through these tests after opening `index.html`:

### Dashboard Tests
- [ ] Page loads with no console errors (`F12 → Console`)
- [ ] Score, level, and badge count show `0 / ...` on first load
- [ ] "New Tip" button changes the tip text
- [ ] "Start Training" button navigates to the Train section
- [ ] Progress bar shows 0% on fresh start

### Phishing Email Tests
- [ ] Click **Train → Phishing Email Detector → Learn Mode**
- [ ] 10 questions appear one at a time
- [ ] Selecting correct answer shows ✅ and +100 pts flash
- [ ] Selecting wrong answer shows ❌, no points awarded
- [ ] Explanation and lesson display after every answer
- [ ] "Next Question" button advances to the next question
- [ ] After question 10, clicking "See Results →" shows the results screen

### Fake Login Tests
- [ ] Click **Fake Login Detector**
- [ ] Two login page mockups appear side by side
- [ ] Clicking a page selects it and shows correct/incorrect border highlight
- [ ] Correct page turns green; incorrect selection turns red
- [ ] Explanation clearly describes the suspicious signs

### Social Engineering Tests
- [ ] Click **Social Engineering**
- [ ] Each scenario has a title and three option buttons
- [ ] Correct answer awards +100 pts
- [ ] Explanation explains why the safest option is correct

### Timed Mode Tests
- [ ] Select **Timed Challenge** mode, then start a category
- [ ] Timer counts down from 30 seconds
- [ ] Timer turns red and blinks when ≤ 10 seconds
- [ ] If timer reaches 0, question is auto-marked incorrect
- [ ] Learn mode has no timer visible

### Scoring & Badge Tests
- [ ] Answer 3 correct → score = 300, level becomes "Scam Spotter"
- [ ] Answer same question again → no duplicate points awarded
- [ ] Completing all phishing questions unlocks "Phishing Hunter" badge
- [ ] Badge appears as earned (glowing green) on the dashboard

### localStorage Tests
- [ ] Answer some questions, close the browser tab, reopen → progress persists
- [ ] Click the reset button (⟳ in the top-right) → confirm → score resets to 0

### Leaderboard Tests
- [ ] Navigate to Leaderboard
- [ ] Enter a nickname and click "Submit Score"
- [ ] Your entry appears in the sorted table
- [ ] Submit again with a lower score → entry is not downgraded
- [ ] Fictional sample players are always present

### Sound Tests
- [ ] Click any answer → hear a short sound effect
- [ ] Click the sound icon in the navbar → sound icon changes to muted
- [ ] Muted state persists after page refresh

### Accessibility Tests
- [ ] Tab through all buttons — each shows a green focus ring
- [ ] All images/icons have `aria-hidden="true"` or meaningful `aria-label`
- [ ] Screen reader should announce question text and feedback

---

## 🔒 Security & Privacy Notes

- ✅ No real credentials, OTPs, PINs, or banking data are ever requested or collected.
- ✅ All email addresses, domain names, and brand names are entirely fictional.
- ✅ All fictional domains use the `.invalid` TLD (RFC 2606 reserved — cannot resolve).
- ✅ No external API calls, analytics, tracking scripts, or third-party resources.
- ✅ All data stays on the user's own device (`localStorage` only).
- ✅ User-generated content (nickname) is HTML-escaped before rendering.
- ✅ No `eval()`, no external script sources, no `innerHTML` with user data.

---

## 🛠️ Built With

- **HTML5** — Semantic markup, accessible ARIA roles and labels
- **CSS3** — Custom properties, Grid, Flexbox, animations, responsive design
- **JavaScript ES6+** — Classes, arrow functions, template literals, localStorage API, Web Audio API
- **Canvas API** — Animated matrix background
- **Web Audio API** — Synthesized sound effects (no audio files required)

---

## 👨‍💻 Developer

> [Student name — to be filled in]
> [College / Institution — to be filled in]
> [Course: BCA / B.Tech / etc. — to be filled in]
> [Batch/Year — to be filled in]

---

## 📜 License

This project is submitted as a college academic project. The scenarios and content are original educational material created for cybersecurity awareness. Feel free to adapt for non-commercial educational use with attribution.

---

*Made with dedication as a college BCA project. Stay safe online — Think Before You Click!* 🛡️
