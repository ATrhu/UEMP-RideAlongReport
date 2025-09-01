#!/bin/bash

# UEMP Operations Hub V2 - Development Server
echo "🚀 Starting UEMP Operations Hub V2 Development Server..."
echo "📁 Opening: /Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2"
echo ""
echo "🌐 Server will be available at: http://localhost:8000"
echo "📱 Access the application in your web browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Change to the correct directory and start the server
cd "/Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2" && python3 -m http.server 8000
