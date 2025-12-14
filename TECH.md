# 🛠️ Technology Stack

This document describes all the technologies, libraries, and tools used in the AqroVix İdarəetmə Sistemi (Smart Farm Management System).

## 📦 Core Technologies

### Frontend Framework
- **React 19.1.1** - Modern UI library for building user interfaces
  - Functional components with hooks
  - JSX for component structure
  - Component-based architecture

### Build Tool
- **Vite 7.2.4** - Next-generation frontend build tool
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Modern ES modules support

### Language
- **JavaScript (ES6+)** - Modern JavaScript features
  - Arrow functions
  - Destructuring
  - Async/await
  - Template literals

## 🎨 Styling & UI

### CSS Framework
- **Tailwind CSS 4.1.15** - Utility-first CSS framework
  - Rapid UI development
  - Responsive design utilities
  - Dark mode support (via class-based approach)
  - Custom theme configuration

### CSS Processing
- **@tailwindcss/vite 4.1.15** - Vite plugin for Tailwind CSS
  - Seamless integration with Vite
  - Optimized CSS generation

### Icons
- **Lucide React 0.546.0** - Beautiful, consistent icon library
  - React components for icons
  - Tree-shakeable
  - Customizable size and color

- **React Icons 5.5.0** - Popular icons library
  - Multiple icon sets
  - Easy to use React components

## 📊 Data Visualization

### Charts
- **ApexCharts 5.3.6** - Modern charting library
  - Interactive charts
  - Multiple chart types (bar, donut, line, etc.)
  - Responsive design
  - Customizable themes

- **React-ApexCharts 1.8.0** - React wrapper for ApexCharts
  - React component integration
  - Props-based configuration
  - Easy state management

## 🔄 State Management

### Redux
- **Redux Toolkit 2.9.1** - Official Redux toolset
  - Simplified Redux logic
  - Built-in best practices
  - Less boilerplate code
  - Immer for immutable updates

- **React-Redux 9.2.0** - Official React bindings for Redux
  - `useSelector` hook for accessing state
  - `useDispatch` hook for dispatching actions
  - Provider component for store access

## 🧭 Routing

### React Router
- **React Router 7.9.4** - Declarative routing for React
  - `createBrowserRouter` for route configuration
  - `createRoutesFromElements` for JSX-style routes
  - `Outlet` for nested routes
  - `NavLink` for navigation with active states
  - `useNavigate` and `useParams` hooks

## 🔔 Notifications

### Toast Notifications
- **React-Toastify 11.0.5** - Toast notification library
  - Beautiful, customizable toasts
  - Multiple positions
  - Auto-close functionality
  - Theme support (light/dark)
  - Drag to dismiss

## 📝 Code Quality

### Linting
- **ESLint 9.39.1** - JavaScript linter
  - Code quality checks
  - Best practices enforcement
  - Customizable rules

### ESLint Plugins
- **@eslint/js 9.39.1** - Modern ESLint configuration
- **eslint-plugin-react-hooks 7.0.1** - React Hooks linting rules
- **eslint-plugin-react-refresh 0.4.24** - Fast Refresh support

### Type Definitions
- **@types/react 19.2.5** - TypeScript definitions for React
- **@types/react-dom 19.2.3** - TypeScript definitions for React DOM

## 🏗️ Development Tools

### Vite Plugins
- **@vitejs/plugin-react 5.1.1** - React plugin for Vite
  - Fast Refresh
  - JSX transformation
  - React component support

### Globals
- **globals 16.5.0** - Global variables for ESLint

## 📚 Architecture Patterns

### Component Architecture
- **Functional Components** - Modern React approach
- **Custom Hooks** - Reusable logic extraction
- **Component Composition** - Building complex UIs from simple components

### State Management Pattern
- **Redux Toolkit Slices** - Organized state management
- **Centralized Store** - Single source of truth
- **Selector Pattern** - Efficient state access

### Routing Pattern
- **Nested Routes** - Hierarchical route structure
- **Layout Components** - Shared layouts for route groups
- **Route Parameters** - Dynamic routing

### Data Flow
- **Unidirectional Data Flow** - Predictable state updates
- **Event-Driven Updates** - Actions trigger state changes
- **Derived State** - Computed values from base state

## 🎯 Key Libraries Usage

### Redux Toolkit
```javascript
// Store configuration
configureStore({
  reducer: {
    theme: themeReducer
  }
})

// Slice creation
createSlice({
  name: 'theme',
  initialState: { mode: 'dark' },
  reducers: {
    toggleTheme: (state) => { ... }
  }
})
```

### React Router
```javascript
// Route configuration
createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>
  )
)
```

### ApexCharts
```javascript
<Chart
  options={chartOptions}
  series={chartSeries}
  type="bar"
  height={300}
/>
```

### React-Toastify
```javascript
<ToastContainer
  position="top-right"
  theme="dark"
  autoClose={3000}
/>
```

## 🔧 Development Scripts

```json
{
  "dev": "vite",              // Start development server
  "build": "vite build",       // Build for production
  "preview": "vite preview",   // Preview production build
  "lint": "eslint ."          // Run linter
}
```

## 📦 Package Management

- **npm** - Node Package Manager
  - Dependency management
  - Script execution
  - Version control

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- CSS Grid and Flexbox support

## 🚀 Performance Optimizations

- **Code Splitting** - Automatic via Vite
- **Tree Shaking** - Unused code elimination
- **Lazy Loading** - Route-based code splitting
- **Optimized Builds** - Production optimizations via Vite

## 📱 Responsive Design

- **Mobile-First Approach** - Tailwind CSS responsive utilities
- **Breakpoints**: sm, md, lg, xl
- **Flexible Grid System** - CSS Grid and Flexbox
- **Touch-Friendly UI** - Appropriate sizing and spacing

## 🎨 Design System

- **Color Palette**: Slate (grays), Green/Emerald (primary), Blue, Orange, Red
- **Typography**: System fonts with Tailwind utilities
- **Spacing**: Consistent spacing scale (Tailwind default)
- **Shadows**: Layered shadow system for depth
- **Borders**: Subtle borders for separation
- **Animations**: Smooth transitions (300ms duration)

## 🔐 Security Considerations

- **No Backend** - Currently mock data only
- **Client-Side Only** - All logic runs in browser
- **No Authentication** - Ready for future implementation
- **XSS Protection** - React's built-in XSS protection

## 📈 Future Considerations

Potential additions:
- Backend API integration
- Real authentication system
- Database integration
- Real-time updates (WebSockets)
- PWA capabilities
- Offline support
- Mobile app (React Native)

---

**Last Updated**: 2024
**Maintained By**: Development Team

