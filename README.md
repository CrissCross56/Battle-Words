# Battle-Words

A realtime multiplayer word game for the CityTech TTP Capstone. Players race to guess words from a shared list.

## Tech Stack

- **Frontend:** Ionic React
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL + Prisma
- **Realtime:** Socket.io
- **External API:** Dictionary API

## Setup

### Prerequisites

- Node.js 22+
- Yarn 4
- PostgreSQL 14+

### Installation

1. Clone the repo:
   ```bash
   git clone git@github.com:CrissCross56/Battle-Words.git
   cd Battle-Words
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. Run database migrations:
   ```bash
   yarn prisma migrate dev
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

## Team

- Hao-Bin — Backend Lead
- Grant — Frontend Lead
- Julio — Project Manager + QA + Frontend Support

## License

TBD
