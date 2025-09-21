# VKART2 Monorepo Setup

## Structure
```
vkart2/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── package.json       # Root workspace configuration
├── .gitignore         # Unified gitignore
└── commit-and-push.sh # Easy commit script
```

## Commands

### Installation
```bash
npm run install:all    # Install all dependencies
```

### Development
```bash
npm run dev            # Run both frontend and backend
npm run dev:frontend   # Run only frontend
npm run dev:backend    # Run only backend
```

### Production
```bash
npm run build          # Build frontend
npm start              # Start backend
```

### Git Operations
```bash
./commit-and-push.sh   # Interactive commit and push
# OR manually:
git add .
git commit -m "your message"
git push
```

## Benefits
- ✅ Single repository for both frontend and backend
- ✅ Unified commits and version control
- ✅ Shared dependencies and scripts
- ✅ Easy deployment and CI/CD setup