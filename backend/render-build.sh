#!/bin/bash
# Render build script for backend

echo "Installing dependencies..."
npm ci

echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"
