# 💬 Morpheus Chatbot

> **Emotionally intelligent conversational AI companion featuring real-time sentiment analysis and autonomous user memory powered by Next.js and Google Genkit.**

![Framework](https://img.shields.io/badge/Framework-Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![AI Engine](https://img.shields.io/badge/AI-Google%20Genkit%20%2B%20Gemini%201.5-4285F4?logo=google&logoColor=white)
![Sentiment Analysis](https://img.shields.io/badge/NLP-Real--Time%20Sentiment%20Analysis-FF6F00)
![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📖 Overview

**Morpheus Chatbot** is an emotionally intelligent conversational web application built on Next.js 15, Google Genkit, and Google Gemini 1.5. Moving beyond rigid transactional chatbots, Morpheus is engineered as an empathetic, affectionate, and emotionally adaptive companion capable of matching the user's conversational energy and understanding contextual nuances.

The platform couples a personality-driven generative chat flow with an autonomous sentiment analysis engine (`gemini-1.5-flash-latest`). It features intelligent tool calling to dynamically extract and remember user preferences, names, and personal context, storing session histories within Firebase Firestore.

---

## ✨ Key Features

- **Empathetic Companion Persona (`ai-chat-simulation.ts`)**: Implements "Morpheus", an emotionally adaptive persona powered by Google Gemini. Carefully configured with open conversational safety thresholds (`BLOCK_NONE` for companionship flexibility) to ensure warmth, spontaneous dialogue, and authentic companionship without robotic boilerplate responses.
- **Real-Time Sentiment Classification (`sentiment-analysis.ts`)**: Dedicated Genkit flow utilizing `gemini-1.5-flash-latest` that parses incoming user inputs in real time, assigning a sentiment classification (`positive`, `negative`, or `neutral`) alongside a calibrated confidence score ($0.0 - 1.0$).
- **Autonomous Tool Execution (`updateUserDetailsTool`)**: Equips the language model with function calling capabilities to autonomously recognize, extract, and record user profile attributes (such as the user's name or stated preferences) during natural dialogue.
- **Contextual Memory & History Retention**: Evaluates historical conversation threads alongside incoming messages to maintain coherent long-term interactions and remember past conversational references.
- **Cloud Firestore Message Persistence**: Synchronizes chat events with Google Cloud Firestore, preserving user sessions across device reboots and browser refreshes.
- **Modern Responsive Chat Interface**: Clean, distraction-free messaging UI built with Tailwind CSS, animated status indicators, and Radix UI dialog primitives.

---

## 🛠️ Tech Stack & Dependencies

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend Framework** | Next.js 15.3.3 | App Router, React Server Actions, React 18.3.1 |
| **Generative AI** | Google Genkit 1.14 | `@genkit-ai/googleai`, `@genkit-ai/next`, `genkit` |
| **Model** | Google Gemini 1.5 Flash | High-speed, multimodal LLM runtime |
| **Database** | Firebase Firestore 11.9.1 | Cloud document database for chat sessions |
| **UI Primitives** | Radix UI | Accessible Popovers, Dialogs, and ScrollAreas |
| **Styling** | Tailwind CSS 3.4 | Modern utility-first responsive design tokens |

---

## 📁 Project Structure

```plaintext
chatbot/
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   ├── ai-chat-simulation.ts     # Morpheus companion persona & generation flow
│   │   │   └── sentiment-analysis.ts     # Real-time sentiment classification flow
│   │   ├── tools/
│   │   │   └── update-user-details.ts    # AI tool for user memory extraction
│   │   ├── dev.ts                        # Genkit development server bootstrap
│   │   └── genkit.ts                     # Genkit initialization & Gemini credentials
│   ├── app/
│   │   ├── layout.tsx                    # Root HTML layout and providers
│   │   ├── page.tsx                      # Main chat page rendering ChatInterface
│   │   └── globals.css                   # Global styling and Tailwind directives
│   ├── components/
│   │   ├── chat-interface.tsx            # Main chat container, input box & bubbles
│   │   └── ui/                           # Radix UI design primitives
│   └── lib/                              # Firebase configuration and shared helpers
├── next.config.ts                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind design configuration
└── tsconfig.json                         # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `20.x` or later
- **npm** or **yarn**
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)
- **Firebase Project**: A Firebase web app with Cloud Firestore configured

### 1. Clone & Install

```bash
git clone https://github.com/AryansDevStudios/chatbot.git
cd chatbot
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Google GenAI API Key for Genkit
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Launch Development Servers

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

To start the **Genkit Developer Console** to inspect prompts, test sentiment analysis, and debug conversation traces:

```bash
npm run genkit:dev
```

Open [http://localhost:4000](http://localhost:4000).

---

## 🤝 Contributing

Contributions and feedback are always welcome!
1. Fork the Repository
2. Create your Feature Branch (`git checkout -b feature/NewCompanionFeature`)
3. Commit your Changes (`git commit -m 'Add voice message transcription'`)
4. Push to the Branch (`git push origin feature/NewCompanionFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
