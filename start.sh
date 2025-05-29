#!/bin/bash

# 广州地铁查询系统启动脚本

echo "Starting Guangzhou Metro Query System..."
echo "======================================"

# 设置端口
PORT=8000
URL="http://localhost:$PORT/index.html"

# 自动打开浏览器的函数
open_browser() {
    sleep 2  # 等待服务器启动
    if command -v open &> /dev/null; then
        # macOS
        open "$URL"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$URL"
    elif command -v start &> /dev/null; then
        # Windows
        start "$URL"
    fi
}

# 在后台打开浏览器
open_browser &

# 启动HTTP服务器
if command -v python3 &> /dev/null; then
    echo "Using Python 3 HTTP server..."
    echo "Server running at: $URL"
    echo "Press Ctrl+C to stop the server"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "Using Python 2 SimpleHTTPServer..."
    echo "Server running at: $URL"
    echo "Press Ctrl+C to stop the server"
    python -m SimpleHTTPServer $PORT
else
    echo "Python not found. Please install Python or use another HTTP server."
    exit 1
fi 