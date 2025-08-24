# Use full Node.js image with Debian repositories
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install Nmap and other useful tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    nmap \
    curl \
    iputils-ping \
    net-tools \
    dnsutils \
    vim \
    git \
    python3 \
    python3-pip \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Sublist3r via pip
RUN pip3 install sublist3r

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally for auto-reload
RUN npm install -g nodemon

# Copy the rest of the backend application
COPY . .

# Expose backend port
EXPOSE 5000

# Start server with nodemon
CMD ["nodemon", "--legacy-watch", "server.js"]
