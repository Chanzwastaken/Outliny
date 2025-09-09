# Outliny ✨  
**Your Personal AI Flow Builder**  
[🚀 Live Demo](https://outliny.netlify.app/)

<img width="1015" height="485" alt="image" src="https://github.com/user-attachments/assets/8ad6a412-d23b-4d28-8987-24d2f9a7b087" />


---

## 🧠 About The Project

**Outliny** is an intelligent web application powered by **Google’s Gemini AI**, designed to turn your ideas into actionable step-by-step plans.

Whether you're:
- Launching a business 🚀  
- Organizing an event 📅  
- Planning a personal project 🛠️  

Outliny serves as your **AI strategist**, breaking down your goals into clear **phases** and **tasks**, with optional durations and tools required.

---

## ⭐ Key Features

- **🧠 AI-Powered Planning** – Instantly generate structured plans from any goal.
- **🧩 Structured Output** – Plans are split into logical **Phases** and **Tasks**.
- **✍️ Fully Editable Flows** – Edit, add, or remove any steps directly on the page.
- **✅ Progress Tracking** – Check off completed tasks and see visual progress.
- **⏱️ Details on Demand** – Get time estimates and necessary tools for each task.
- **📱 Responsive UI** – Clean, dynamic interface with animated background.
- **🔐 Secure API Handling** – Google Gemini API key hidden via Netlify serverless functions.

---

## 🛠️ Tech Stack

| Layer         | Technologies                                  |
|---------------|-----------------------------------------------|
| **Frontend**  | HTML5, Tailwind CSS                           |
| **JavaScript**| Vanilla JS                                    |
| **AI**        | Google Gemini API (`gemini-2.0-flash`)        |
| **Deployment**| Netlify (static hosting + serverless backend) |
| **Security**  | Netlify Functions to securely call the API    |

---

## 🚀 How to Use

1. Visit 👉 [https://mellow-daifuku-fe6e3d.netlify.app](https://mellow-daifuku-fe6e3d.netlify.app)
2. Enter a goal (e.g., `Start a YouTube channel`, `Plan a wedding`, `Build an app`)
3. Click **“Plan It”**
4. View, edit, and interact with your personalized step-by-step plan
5. Check off tasks as you progress!

---

## 🔧 Getting Started (For Developers)

Want to run Outliny locally or deploy your own version? Follow these steps:

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/outliny.git
cd outliny
````

### 2. Get Your API Key

* Sign up at [Google AI Studio](https://makersuite.google.com/)
* Create a project and generate your **GEMINI\_API\_KEY**

### 3. Deploy to Netlify

* Push the code to your GitHub
* Connect your repo to [Netlify](https://netlify.com)
* In Site Settings → Environment Variables:

  * Add `GEMINI_API_KEY`

### 4. (Optional) Customize

* Modify the prompts
* Add new UI themes
* Improve task types or output structure

🛠 For a full deployment guide, [click here](#) *(link to Gist or internal file)*

---

## 🤖 Credits

This project was crafted with the assistance of AI and a passion for productivity.
Feel free to fork, improve, and make it your own! 🙌

---

## 📄 License

MIT License. Use it freely and responsibly.

```

