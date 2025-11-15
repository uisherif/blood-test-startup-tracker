#!/bin/bash

echo "🩸 Blood Test Startup Tracker - Setup Script"
echo "=============================================="
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. You have version $NODE_VERSION."
    exit 1
fi

echo "✅ Node.js version check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build shared package
echo "🔨 Building shared package..."
cd packages/shared
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build shared package"
    exit 1
fi

cd ../..
echo "✅ Shared package built"
echo ""

# Install API dependencies
echo "📦 Installing API dependencies..."
cd packages/api
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install API dependencies"
    exit 1
fi

cd ../..
echo "✅ API dependencies installed"
echo ""

# Install Web dependencies
echo "📦 Installing web dependencies..."
cd packages/web
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install web dependencies"
    exit 1
fi

cd ../..
echo "✅ Web dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f packages/api/.env ]; then
    echo "📝 Creating .env file..."
    cp packages/api/.env.example packages/api/.env
    echo "✅ .env file created (edit it to add API keys later)"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - API server on http://localhost:3001"
echo "  - Web dashboard on http://localhost:3000"
echo ""
echo "Check out docs/DEVELOPMENT.md for more information."
