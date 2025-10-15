#!/bin/bash

# UEMP Operations Hub V2 - Development Server
PROJECT_DIR="/Users/ruhh/Library/Mobile Documents/com~apple~CloudDocs/Rucarpeta/Programming/HTML Programs/UEMP Operations Hub V2"

echo "🚀 Starting UEMP Operations Hub V2 Development Server..."
echo "📁 Directory: $PROJECT_DIR"
echo ""

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use. Please close the existing server or choose a different port."
    echo "💡 You can run: lsof -ti:8000 | xargs kill -9"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "$PROJECT_DIR/index.html" ]; then
    echo "❌ Error: index.html not found in $PROJECT_DIR"
    echo "💡 Make sure you're running this from the project root."
    exit 1
fi

echo "🌐 Server will be available at: http://localhost:8000"
echo "📱 Opening in your default browser..."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Change to the correct directory
cd "$PROJECT_DIR"

# Start the server in background and open browser
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Open in default browser
if command -v open >/dev/null 2>&1; then
    open http://localhost:8000
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://localhost:8000
elif command -v start >/dev/null 2>&1; then
    start http://localhost:8000
fi

# Wait for server to finish
wait $SERVER_PID
