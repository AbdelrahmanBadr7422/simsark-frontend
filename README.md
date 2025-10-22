# Simsark Web Application

A full-stack web application built using **Angular** (frontend) and **Express.js** (backend).  
This project provides a modular and scalable structure for building modern web applications with clean UI, secure authentication, and fast API interactions.

---

## Tech Stack

### **Frontend**
- [Angular 20+](https://angular.io/)
- [Vite](https://vitejs.dev/) (for fast development builds)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS / SCSS] (for responsive styling)
- [RxJS](https://rxjs.dev/) (reactive state management)

### **Backend**
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- RESTful API architecture
- JWT Authentication (if implemented)
- Middleware for request validation & authorization

---

##  Project Structure

```plaintext
simsark-frontend/
├── .angular/                 # Angular cache
│   └── cache/
│       └── 20.3.6/
│           └── simsark-frontend/
│               └── vite/
│                   ├── deps/
│                   └── deps_ssr/
├── .vscode/                  # VS Code settings
├── public/                   # Public static files
└── src/
    ├── app/
    │   ├── components/
    │   │   ├── auth/         # Authentication-related components
    │   │   │   ├── forget-pass/
    │   │   │   ├── login/
    │   │   │   ├── offers-list/
    │   │   │   ├── portfolio/
    │   │   │   ├── profile/
    │   │   │   ├── register/
    │   │   │   ├── reset-pass/
    │   │   │   ├── user/
    │   │   │   └── user-offers/
    │   │   └── shared/       # Reusable shared UI components
    │   │       ├── explore/
    │   │       ├── footer/
    │   │       ├── header/
    │   │       ├── navbar/
    │   │       └── payment/
    │   ├── guards/           # Route guards for access control
    │   ├── interceptors/     # HTTP interceptors (auth, error handling)
    │   ├── models/           # TypeScript interfaces & models
    │   ├── pages/            # Application main pages
    │   │   ├── about/
    │   │   ├── contact/
    │   │   ├── explore/
    │   │   ├── home/
    │   │   ├── new-post/
    │   │   ├── offer-details/
    │   │   ├── page-not-found/
    │   │   └── post-details/
    │   ├── services/         # Data and API interaction services
    │   └── validators/       # Custom form validators
    ├── assets/               # Images, icons, and static content
    │   ├── Landing/
    │   └── placeholders/
    └── environments/         # Environment configurations

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
