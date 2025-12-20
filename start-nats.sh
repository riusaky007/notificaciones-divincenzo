#!/bin/bash

# Script to download and run NATS server
# This script downloads NATS server if not present and runs it

NATS_VERSION="v2.10.22"
NATS_DIR="./.nats-server"

# Detect OS and architecture first
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
    ARCH="arm64"
fi

if [ "$OS" = "darwin" ]; then
    OS_NAME="darwin"
elif [ "$OS" = "linux" ]; then
    OS_NAME="linux"
else
    echo "❌ Unsupported OS: $OS"
    exit 1
fi

# The binary is extracted to a subdirectory
NATS_EXTRACTED_DIR="$NATS_DIR/nats-server-${NATS_VERSION}-${OS_NAME}-${ARCH}"
NATS_BINARY="$NATS_EXTRACTED_DIR/nats-server"

# Create directory if it doesn't exist
mkdir -p "$NATS_DIR"

# Check if binary exists
if [ ! -f "$NATS_BINARY" ]; then
    echo "📥 Downloading NATS server..."
    
    DOWNLOAD_URL="https://github.com/nats-io/nats-server/releases/download/${NATS_VERSION}/nats-server-${NATS_VERSION}-${OS_NAME}-${ARCH}.zip"
    
    echo "Downloading from: $DOWNLOAD_URL"
    
    # Download and extract
    curl -L -o "$NATS_DIR/nats-server.zip" "$DOWNLOAD_URL" || {
        echo "❌ Failed to download NATS server"
        echo "Please download manually from: https://github.com/nats-io/nats-server/releases"
        exit 1
    }
    
    unzip -o "$NATS_DIR/nats-server.zip" -d "$NATS_DIR" || {
        echo "❌ Failed to extract NATS server"
        exit 1
    }
    
    chmod +x "$NATS_BINARY"
    rm "$NATS_DIR/nats-server.zip"
    
    echo "✅ NATS server downloaded successfully"
fi

echo "🚀 Starting NATS server..."
"$NATS_BINARY"
