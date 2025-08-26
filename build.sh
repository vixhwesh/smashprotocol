#!/bin/bash

# Build script for Smash Protocol
echo "Starting build process..."

# Clear any existing node_modules and package-lock
echo "Clearing existing dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies with force resolution
echo "Installing dependencies..."
npm install --legacy-peer-deps --force

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "Dependency installation failed"
    exit 1
fi

# Install ajv explicitly if needed
echo "Ensuring ajv is properly installed..."
npm install ajv@^8.12.0 --save

# Build the app
echo "Building the app..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi

echo "Build completed successfully!"
