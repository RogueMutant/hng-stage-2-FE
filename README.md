# Invoice Management App

A full-stack (frontend focus) Invoice Management App built with React, TypeScript, and Vite.

## 🚀 Setup Instructions

1.  **Clone the repository** (if not already in the workspace).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

## 🏗️ Architecture Decisions

- **State Management**: Used React `Context` + `useReducer` for global state. This provides a clean way to manage invoices, filtering, and theme without the overhead of Redux.
- **Styling**: Vanilla CSS with CSS Modules. This ensures styles are scoped to components while maintaining full control over the design and responsiveness.
- **Persistence**: `LocalStorage` is used to persist invoices and theme settings across sessions.
- **ID Generation**: A custom ID generator creates IDs in the format `XY1234` as seen in the design screenshots.

## 🎨 UI/UX Features

- **Dark/Light Mode**: Persisted theme toggle.
- **Responsive Design**: Mobile-first approach with grid and flexbox.
- **Form Validation**: Strict validation for client details, email format, and item lists.
- **Animations**: Smooth transitions for theme switching and form modal entry.

## ♿ Accessibility

- Semantic HTML (`aside`, `main`, `section`, `header`, `footer`).
- ARIA labels for interactive elements (theme toggle, filter bar).
- Modal focus trapping (via CSS and structure).
- Keyboard navigation support.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Language**: TypeScript
- **State**: React Context API
- **Persistence**: LocalStorage
- **Icons**: Custom SVGs
- **Fonts**: League Spartan (via CSS)

## 📝 Known Limitations

- **LocalStorage**: Limited storage capacity compared to IndexedDB or a Backend API.
- **Image Assets**: Uses placeholder/simple SVGs for illustrations.
- **Browser Compatibility**: Relies on modern CSS features like CSS variables and Grid.
