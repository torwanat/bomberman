# Bomberman

A web-based implementation of the classic Bomberman game using TypeScript and WebSocket for real-time multiplayer gameplay.

> **Note**: This project is currently in active development. Core gameplay features are in progress.

## Current Features

- **Real-time Multiplayer**: Connect multiple players via WebSocket server
- **TypeScript**: Fully typed codebase for better development experience
- **Sprite-based Graphics**: Smooth animations using sprite sheets
- **Dynamic Board System**: Server-managed game state with client-side rendering
- **Player & Enemy AI**: Navigate balloons (enemies) with AI pathfinding
- **Responsive Canvas Rendering**: 60 FPS game loop for fluid gameplay

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- PHP server (for backend WebSocket server)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bomberman
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

This compiles TypeScript files using Webpack and outputs `scripts/index-bundle.js`.

### Running the Game

1. **Start the PHP WebSocket Server**:
   
   The backend server is configured to run on `torvan-bomberman.ct8.pl:1984`. To run locally, modify the connection URL in [scripts/index.ts](scripts/index.ts):
   
   ```typescript
   const connection: Connect = new Connect("ws://localhost:1984/sockets/server.php");
   ```
   
   Then start your PHP server:
   ```bash
   php -S localhost:1984
   ```

2. **Open the Game**:
   
   Open `index.html` in your web browser or serve it with a local HTTP server:
   ```bash
   npx http-server
   ```

3. **Play**:
   
   - Use arrow keys to move your player
   - Press spacebar to place bombs
   - Avoid balloons and explosions
   - Defeat all enemies to win

## Project Structure

```
bomberman/
├── scripts/
│   ├── index.ts           # Main game entry point
│   ├── board.ts           # Game board and state management
│   ├── canvas.ts          # Canvas rendering engine
│   ├── player.ts          # Player entity
│   ├── balloon.ts         # Enemy entity
│   ├── animate.ts         # Animation system
│   └── connect.ts         # WebSocket connection handler
├── backend/
│   ├── server.php         # WebSocket server
│   ├── board.php          # Server-side game board logic
│   └── balloon.php        # Server-side balloon logic
├── res/
│   ├── data.json          # Sprite animation frames and dimensions
│   └── spritesheet.png    # Game sprites
├── style/
│   └── index.css          # Game styles
├── index.html             # Entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── webpack.config.js      # Webpack bundling configuration
```

## Development

### Building

To build the TypeScript code:
```bash
npm run build
```

The output is generated as a single bundled file: `scripts/index-bundle.js`

### TypeScript

- Configuration: [tsconfig.json](tsconfig.json)
- Target: ES2016
- Module System: CommonJS
- Bundler: Webpack with ts-loader

### Game Architecture

- **Client Side**: 
  - Canvas-based rendering at 60 FPS
  - Keyboard input handling
  - WebSocket communication with server
  - Local animation and sprite management

- **Server Side**:
  - WebSocket server managing game state
  - Player and balloon position updates
  - Collision detection
  - Game tick synchronization

## Known Issues

- Game state synchronization needs improvement
- Collision detection requires refinement
- Network latency compensation needed
