# Team 1 Job App Frontend

A modern Node.js TypeScript project with Express.js, built with ES modules and modern development practices.

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict type checking
- **ES Modules** - Native ES module support 
- **Express.js** - Fast, unopinionated web framework
- **Hot Reload** - Development server with automatic restart using `tsx`
- **Modern Build** - TypeScript compilation with source maps and declarations

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd team1-job-app-frontend

# Install dependencies
npm install
```

## 🏃‍♂️ Getting Started

### Development
Start the development server with hot reload:
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Production
Build and run for production:
```bash
npm run build
npm start
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns a Hello World message |
| GET | `/health` | Health check endpoint with timestamp |

### Example Responses

**GET /**
```json
{
  "message": "Hello World! 🌍"
}
```

**GET /health**
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T10:30:00.000Z"
}
```

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Build TypeScript to JavaScript |
| `start` | `npm start` | Run the built application |
| `clean` | `npm run clean` | Remove the dist folder |
| `type-check` | `npm run type-check` | Type check without building |

## 🏗️ Project Structure

```
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Built files (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── .gitignore           # Git ignore patterns
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

### TypeScript Configuration

The project uses modern TypeScript settings:
- Target: ES2022
- Modules: ESNext with Node.js resolution
- Strict type checking enabled
- Source maps and declarations generated

## 📦 Dependencies

### Runtime Dependencies
- **express** - Web application framework

### Development Dependencies
- **typescript** - TypeScript compiler
- **tsx** - TypeScript execution and hot reload
- **@types/express** - TypeScript definitions for Express
- **@types/node** - TypeScript definitions for Node.js

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.