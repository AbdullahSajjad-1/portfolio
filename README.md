# Abdullah Sajjad — Software Engineer & Builder Portfolio

A high-performance, immersive developer portfolio engineered with **Next.js**, **React Three Fiber (Three.js)**, and **GSAP**. This application features an interactive 3D laptop canvas, custom scroll-hijacking animations, and an optimized, fully responsive UI designed for maximum speed and engagement.

---

## 🚀 Key Features

*   **Interactive 3D Workspace:** A fully customized 3D laptop model rendered via React Three Fiber. The device dynamically follows cursor coordinates, tilts, floats, and decomposes (X-ray mesh outline) upon expansion.
*   **Zero-Lag Texture Preloading:** Implements WebGL hardware texture preloading to prevent standard HTML image flickering or fallback color flashes when transitioning between projects.
*   **Global GSAP Scroll Engine:** A custom-engineered scroll-hijacking system driven by GSAP's Observer API, providing smooth, section-by-section transitions and supporting horizontal swipe navigation for university/hackathon cards.
*   **Synchronized Navigation Engine:** A state-driven Navbar that maps 6 physical sections to 5 logical navigation items seamlessly, with immediate dispatch triggers to eliminate animation delays.
*   **Fully Accessible & Responsive:** Structured around modern semantic HTML, tailored viewport constraints to eliminate text overflow, and responsive styling.

---

## 🛠️ Tech Stack

*   **Core:** [Next.js (App Router)](https://nextjs.org/) & [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
*   **3D Elements:** [Three.js](https://threejs.org/), `@react-three/fiber`, and `@react-three/drei`
*   **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) & `gsap/Observer`
*   **Hosting & Deployment:** [Vercel](https://vercel.com/) (configured with clean URL resolutions via `vercel.json`)

---

## 📂 Project Structure

```text
├── public/                 # Static assets (cached WebGL images & video files)
├── src/
│   ├── app/                # Next.js App Router entry points & metadata
│   ├── components/
│   │   ├── canvas/         # R3F Canvas components (FloatingDevice, TexturedScreen)
│   │   ├── layout/         # ScrollEngine wrapper & global animation controllers
│   │   ├── sections/       # Section-specific components (Hero, About, Projects, Experience, Contact)
│   │   └── ui/             # Custom cursor trackers & navbar indicators
│   └── styles/             # Global CSS variables & layout definitions
└── vercel.json             # Deployment optimizations
```

---

## 💻 Getting Started

### Prerequisites

*   Node.js (v18.x or higher)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AbdullahSajjad-1/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the local development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the project.

### Build and Production Deployment

To create an optimized production build of the project:

```bash
npm run build
npm run start
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
