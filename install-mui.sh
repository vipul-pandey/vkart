#!/bin/bash

echo "Installing Material-UI dependencies..."
cd frontend

# Remove Bootstrap dependencies
npm uninstall bootstrap react-bootstrap react-router-bootstrap

# Install Material-UI dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material swiper

echo "Dependencies updated successfully!"
echo "Please run 'npm start' to start the development server."