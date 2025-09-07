# RecMan - Task Management Application

A modern, responsive Kanban-style task management application built with React, TypeScript, and Vite. Features drag-and-drop functionality, local storage persistence, and a clean, intuitive interface.

## Features

- 📋 **Kanban Board**: Organize tasks in customizable columns
- 🖱️ **Drag & Drop**: Move tasks between columns with smooth animations
- 💾 **Local Storage**: All data persists automatically in your browser
- ✏️ **Inline Editing**: Double-click to edit task and column names
- 🔍 **Search & Filter**: Find tasks quickly with search and filter options
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Live Demo

🚀 **[View Live Demo](https://your-demo-url.com)** - See the application in action!

*Note: Replace `https://your-demo-url.com` with your actual deployment URL*

## Prerequisites

Before running this application locally, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Yarik-osg/RecMan.git
cd RecMan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code quality issues

## Technology Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **@atlaskit/pragmatic-drag-and-drop** - Smooth drag and drop functionality
- **ESLint** - Code linting and quality assurance

## Project Structure

```
RecMan/                 # Root repository directory
├── src/
│   ├── components/          # React components
│   │   ├── Column.tsx      # Column component
│   │   ├── TaskItem.tsx    # Individual task component
│   │   └── Toolbar.tsx     # Toolbar with search and filters
│   ├── App.tsx             # Main application component
│   ├── types.ts            # TypeScript type definitions
│   ├── storage.ts          # Local storage utilities
│   ├── utils.ts            # Helper functions
│   └── styles.css          # Application styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Usage

1. **Create Columns**: Click the "+" button to add new columns
2. **Add Tasks**: Click "Add Task" in any column to create new tasks
3. **Drag & Drop**: Drag tasks between columns to reorganize them
4. **Edit Names**: Double-click on task or column names to edit them
5. **Search**: Use the search bar to find specific tasks
6. **Filter**: Use the filter buttons to show all, completed, or active tasks
7. **Delete**: Select tasks and use the delete button to remove them

## Data Persistence

All your data is automatically saved to your browser's local storage. This means:
- Your tasks and columns persist between browser sessions
- No account or login required
- Data is stored locally on your device

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/Yarik-osg/RecMan/issues) page
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue if applicable
