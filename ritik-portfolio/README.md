# 🚀 Ritik Kumar — Portfolio

Personal developer portfolio built with **React + Vite + Tailwind CSS**.

## 🔧 Tech Stack
- ⚡ **Vite** + **React 18**
- 🎨 **Tailwind CSS**
- 📧 **EmailJS** for contact form
- 🎞️ **react-fast-marquee** for skill scroll
- 🧩 **react-icons** + **lucide-react**

## 📁 Structure

```
ritik-portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx          ← Typewriter + code card
│   │   ├── About.jsx         ← Bio + education + training
│   │   ├── Skills.jsx        ← Dual marquee + category grid
│   │   ├── Projects.jsx      ← AI project cards
│   │   ├── Certifications.jsx
│   │   ├── Achievements.jsx
│   │   ├── Resume.jsx        ← Inline preview + download
│   │   ├── Contact.jsx       ← EmailJS form
│   │   └── Footer.jsx
│   ├── data/
│   │   └── data.js           ← All CV data
│   ├── hooks/
│   │   └── useScrollReveal.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             ← Animations, marquee, noise texture
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local from example
cp .env.example .env.local
# Fill in your EmailJS credentials

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build
```

## 📧 EmailJS Setup

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Create a free account + email service
3. Create a template with variables: `from_name`, `email`, `message`
4. Copy your Service ID, Template ID, and Public Key into `.env.local`

## 🌐 Deployment

Works on **Vercel**, **Netlify**, or any static host:

```bash
npm run build
# Deploy the /dist folder
```

---

Made with ❤️ by Ritik Kumar
