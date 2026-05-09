# 🗺️ Bangalore Pincode Explorer

> Explore Bangalore's 80+ pincodes with interactive maps, area names, locality details, and approximate boundary overlays — instantly.

![Bangalore Pincode Explorer](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deployable-black?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Features

- **Pincode Lookup** — Enter any Bangalore pincode (560xxx) and instantly get area details
- **Interactive Map** — Leaflet.js map with CartoDB tiles showing the pincode location
- **Boundary Overlay** — Approximate area boundary polygon drawn on the map
- **Locality Details** — List of neighbourhoods within the pincode area
- **Zone Information** — North / South / East / West / Central classification
- **Autocomplete Suggestions** — Live suggestions as you type (by pincode or area name)
- **Quick Pills** — One-click access to popular areas like Koramangala, Whitefield, etc.
- **80+ Pincodes** — Comprehensive coverage of Bangalore Urban district
- **Search History** — Optional MongoDB-backed recent searches log
- **Fallback API** — Falls back to India Post API for pincodes not in local dataset
- **Fully Responsive** — Works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Leaflet.js, React-Leaflet |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (optional) |
| Maps | Leaflet.js + CartoDB Positron tiles |
| Deployment | Vercel (frontend + serverless API) |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account *(optional — only needed for search history)*

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bangalore-pincode-explorer.git
cd bangalore-pincode-explorer
```

### 2. Install dependencies

```bash
# Install root deps
npm install

# Install API deps
cd api && npm install && cd ..

# Install client deps
cd client && npm install && cd ..
```

Or use the shortcut:

```bash
npm run install:all
```

### 3. Configure environment variables

**API (`api/.env`):**

```env
# Optional — only for search history feature
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bangalore-pincode-explorer

# Allow requests from your frontend
CLIENT_URL=http://localhost:5173

PORT=5000
```

**Client (`client/.env`):**

```env
VITE_API_URL=http://localhost:5000
```

> Copy from the `.env.example` files provided in each directory.

### 4. Run in development

```bash
# From root — starts both API and client concurrently
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/pincode/:pincode` | Get details for a pincode |
| `GET` | `/api/pincodes` | List all available pincodes |
| `GET` | `/api/suggest?q=<query>` | Autocomplete suggestions |
| `GET` | `/api/recent` | Recent searches (requires MongoDB) |

### Example Response — `/api/pincode/560011`

```json
{
  "pincode": 560011,
  "area": "Koramangala",
  "localities": ["Koramangala", "Sony World Junction", "Forum Mall Area"],
  "district": "Bangalore Urban",
  "state": "Karnataka",
  "country": "India",
  "zone": "South East",
  "coordinates": { "lat": 12.9279, "lng": 77.6271 },
  "boundaryApprox": [
    [12.942, 77.614],
    [12.942, 77.642],
    [12.914, 77.642],
    [12.914, 77.614]
  ],
  "source": "local"
}
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects the `vercel.json` config.

### Option B — Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Set the following **Environment Variables** in the Vercel dashboard:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://blr-pincode.vercel.app`) |

5. Click **Deploy** — done!

> The `vercel.json` file in the root handles routing between the Express API (`/api/*`) and the React frontend automatically.

---

## 📁 Project Structure

```
bangalore-pincode-explorer/
├── api/                        # Express.js backend
│   ├── index.js                # Main server + all routes + pincode data
│   ├── package.json
│   └── .env.example
│
├── client/                     # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx   # Input + suggestions + quick pills
│   │   │   ├── ResultCard.jsx  # Area info card
│   │   │   └── MapView.jsx     # Leaflet map + boundary overlay
│   │   ├── hooks/
│   │   │   └── usePincodeSearch.js  # Search logic hook
│   │   ├── utils/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles + design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── vercel.json                 # Vercel deployment config
├── package.json                # Root scripts
├── .gitignore
└── README.md
```

---

## 🗺️ Pincode Coverage

The app includes built-in data for 80+ Bangalore pincodes across all zones:

| Zone | Example Areas |
|---|---|
| Central | MG Road (560001), Shivajinagar (560002), Richmond Town (560005) |
| North | Malleshwaram (560006), RT Nagar (560015), Yelahanka (560076) |
| South | Jayanagar (560010), Basavangudi (560008), Banashankari (560019) |
| East | Indiranagar (560014), Whitefield (560029), Marathahalli (560027) |
| West | Rajajinagar (560009), Vijayanagar (560016), Kengeri (560032) |
| South East | Koramangala (560011), HSR Layout (560072), Bellandur (560092) |
| South | Electronic City (560042), BTM Layout (560028), Bommanahalli (560041) |
| North West | Peenya (560037), Yeshwanthpur (560017), Dasarahalli (560090) |

For pincodes not in the local dataset, the app automatically falls back to the **India Post API**.

---

## 🔧 Development Notes

- The backend uses **in-memory caching** (`node-cache`) with a 24-hour TTL to avoid repeated API calls
- MongoDB is **entirely optional** — the app works fully without it (search history is skipped)
- The map **boundary polygons** are approximations — they represent the general area of each pincode, not exact cadastral boundaries
- All styles use **CSS custom properties** (no external CSS framework needed)

---

## 🤝 Contributing

Contributions are welcome! To add more pincode data or improve boundary accuracy:

1. Fork the repo
2. Edit the `bangalorePincodes` object in `api/index.js`
3. Submit a pull request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/) contributors
- [CARTO](https://carto.com/) for the map tiles
- [India Post](https://www.indiapost.gov.in/) for pincode data
- [Leaflet.js](https://leafletjs.com/) for the mapping library

---

<p align="center">Built with ♥ for Bangalore</p>
