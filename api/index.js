require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const axios = require("axios");

const app = express();
const cache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// MongoDB connection (optional - for caching search history)
let dbConnected = false;
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      dbConnected = true;
      console.log("MongoDB connected");
    })
    .catch((err) => console.log("MongoDB connection error:", err));
}

// Search History Schema
const searchHistorySchema = new mongoose.Schema({
  pincode: { type: String, required: true },
  areaName: String,
  district: String,
  state: String,
  searchedAt: { type: Date, default: Date.now },
});
const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

// Comprehensive Bangalore Pincode Data
const bangalorePincodes = {
  560001: {
    area: "Bangalore GPO / MG Road",
    localities: ["MG Road", "Brigade Road", "Cubbon Park", "Vidhana Soudha"],
    lat: 12.9716,
    lng: 77.5946,
    zone: "Central",
    boundaryApprox: [
      [12.983, 77.582],
      [12.983, 77.61],
      [12.96, 77.61],
      [12.96, 77.582],
    ],
  },
  560002: {
    area: "Shivajinagar",
    localities: ["Shivajinagar", "Queens Road", "Vasanth Nagar"],
    lat: 12.9845,
    lng: 77.6003,
    zone: "Central",
    boundaryApprox: [
      [12.995, 77.589],
      [12.995, 77.615],
      [12.972, 77.615],
      [12.972, 77.589],
    ],
  },
  560003: {
    area: "Chamrajpet",
    localities: ["Chamrajpet", "Mysore Road", "Sultanpet"],
    lat: 12.9559,
    lng: 77.5619,
    zone: "South",
    boundaryApprox: [
      [12.967, 77.55],
      [12.967, 77.575],
      [12.944, 77.575],
      [12.944, 77.55],
    ],
  },
  560004: {
    area: "Cottonpet",
    localities: ["Cottonpet", "Avenue Road", "Chickpet"],
    lat: 12.9706,
    lng: 77.5726,
    zone: "Central",
    boundaryApprox: [
      [12.981, 77.561],
      [12.981, 77.585],
      [12.959, 77.585],
      [12.959, 77.561],
    ],
  },
  560005: {
    area: "Richmond Town",
    localities: ["Richmond Town", "Langford Town", "Richmond Road"],
    lat: 12.9619,
    lng: 77.6016,
    zone: "Central",
    boundaryApprox: [
      [12.972, 77.59],
      [12.972, 77.615],
      [12.95, 77.615],
      [12.95, 77.59],
    ],
  },
  560006: {
    area: "Malleshwaram",
    localities: ["Malleshwaram", "Vyalikaval", "Sadashivanagar"],
    lat: 13.003,
    lng: 77.5714,
    zone: "North",
    boundaryApprox: [
      [13.017, 77.558],
      [13.017, 77.585],
      [12.99, 77.585],
      [12.99, 77.558],
    ],
  },
  560007: {
    area: "Seshadripuram",
    localities: ["Seshadripuram", "Subramanyanagar", "Govindarajanagar"],
    lat: 12.9951,
    lng: 77.5707,
    zone: "North",
    boundaryApprox: [
      [13.006, 77.558],
      [13.006, 77.583],
      [12.983, 77.583],
      [12.983, 77.558],
    ],
  },
  560008: {
    area: "Basavangudi",
    localities: ["Basavangudi", "Shankarapuram", "Gandhi Bazaar"],
    lat: 12.9403,
    lng: 77.5709,
    zone: "South",
    boundaryApprox: [
      [12.952, 77.558],
      [12.952, 77.585],
      [12.928, 77.585],
      [12.928, 77.558],
    ],
  },
  560009: {
    area: "Rajajinagar",
    localities: ["Rajajinagar", "Srinagar", "MC Layout"],
    lat: 12.9916,
    lng: 77.5483,
    zone: "West",
    boundaryApprox: [
      [13.005, 77.534],
      [13.005, 77.562],
      [12.978, 77.562],
      [12.978, 77.534],
    ],
  },
  560010: {
    area: "Jayanagar",
    localities: ["Jayanagar", "JP Nagar", "Tilak Nagar"],
    lat: 12.9299,
    lng: 77.5827,
    zone: "South",
    boundaryApprox: [
      [12.942, 77.57],
      [12.942, 77.598],
      [12.917, 77.598],
      [12.917, 77.57],
    ],
  },
  560011: {
    area: "Koramangala",
    localities: ["Koramangala", "Sony World Junction", "Forum Mall Area"],
    lat: 12.9279,
    lng: 77.6271,
    zone: "South East",
    boundaryApprox: [
      [12.942, 77.614],
      [12.942, 77.642],
      [12.914, 77.642],
      [12.914, 77.614],
    ],
  },
  560012: {
    area: "Shanti Nagar",
    localities: ["Shanti Nagar", "Suddagunte Palya", "Cleveland Town"],
    lat: 12.9578,
    lng: 77.5994,
    zone: "Central",
    boundaryApprox: [
      [12.969, 77.588],
      [12.969, 77.612],
      [12.946, 77.612],
      [12.946, 77.588],
    ],
  },
  560013: {
    area: "Frazer Town",
    localities: ["Frazer Town", "Benson Town", "Pulikeshinagar"],
    lat: 12.9826,
    lng: 77.617,
    zone: "East",
    boundaryApprox: [
      [12.994, 77.605],
      [12.994, 77.631],
      [12.97, 77.631],
      [12.97, 77.605],
    ],
  },
  560014: {
    area: "Indiranagar",
    localities: ["Indiranagar", "HAL 2nd Stage", "CMH Road"],
    lat: 12.9784,
    lng: 77.641,
    zone: "East",
    boundaryApprox: [
      [12.991, 77.628],
      [12.991, 77.656],
      [12.965, 77.656],
      [12.965, 77.628],
    ],
  },
  560015: {
    area: "RT Nagar",
    localities: ["RT Nagar", "Hebbal", "Nagawara"],
    lat: 13.0213,
    lng: 77.5952,
    zone: "North",
    boundaryApprox: [
      [13.035, 77.582],
      [13.035, 77.61],
      [13.007, 77.61],
      [13.007, 77.582],
    ],
  },
  560016: {
    area: "Vijayanagar",
    localities: ["Vijayanagar", "Hampinagar", "Nagarbhavi"],
    lat: 12.9718,
    lng: 77.5205,
    zone: "West",
    boundaryApprox: [
      [12.984, 77.507],
      [12.984, 77.534],
      [12.959, 77.534],
      [12.959, 77.507],
    ],
  },
  560017: {
    area: "Yeshwanthpur",
    localities: ["Yeshwanthpur", "Peenya", "Saneguruvanahalli"],
    lat: 13.0219,
    lng: 77.5407,
    zone: "North West",
    boundaryApprox: [
      [13.037, 77.526],
      [13.037, 77.556],
      [13.007, 77.556],
      [13.007, 77.526],
    ],
  },
  560018: {
    area: "Mathikere",
    localities: ["Mathikere", "Jalahalli", "Okalipuram"],
    lat: 13.0168,
    lng: 77.5591,
    zone: "North",
    boundaryApprox: [
      [13.03, 77.547],
      [13.03, 77.573],
      [13.003, 77.573],
      [13.003, 77.547],
    ],
  },
  560019: {
    area: "Banashankari",
    localities: ["Banashankari", "BSK 2nd Stage", "Uttarahalli"],
    lat: 12.9232,
    lng: 77.5476,
    zone: "South",
    boundaryApprox: [
      [12.937, 77.533],
      [12.937, 77.561],
      [12.909, 77.561],
      [12.909, 77.533],
    ],
  },
  560020: {
    area: "Gandhinagar",
    localities: ["Gandhinagar", "Majestic", "City Railway Station"],
    lat: 12.9767,
    lng: 77.5713,
    zone: "Central",
    boundaryApprox: [
      [12.988, 77.559],
      [12.988, 77.584],
      [12.964, 77.584],
      [12.964, 77.559],
    ],
  },
  560021: {
    area: "Domlur",
    localities: ["Domlur", "Ejipura", "Ayyappa Nagar"],
    lat: 12.9609,
    lng: 77.639,
    zone: "East",
    boundaryApprox: [
      [12.973, 77.626],
      [12.973, 77.654],
      [12.948, 77.654],
      [12.948, 77.626],
    ],
  },
  560022: {
    area: "Hebbal",
    localities: ["Hebbal", "Kempapura", "Kogilu"],
    lat: 13.0358,
    lng: 77.5971,
    zone: "North",
    boundaryApprox: [
      [13.051, 77.583],
      [13.051, 77.613],
      [13.021, 77.613],
      [13.021, 77.583],
    ],
  },
  560023: {
    area: "Sadashivanagar",
    localities: ["Sadashivanagar", "Palace Guttahalli", "Dollars Colony"],
    lat: 13.0068,
    lng: 77.5838,
    zone: "North",
    boundaryApprox: [
      [13.02, 77.571],
      [13.02, 77.598],
      [12.994, 77.598],
      [12.994, 77.571],
    ],
  },
  560024: {
    area: "Bannerghatta Road",
    localities: ["JP Nagar 7th Phase", "Akshayanagar", "Gottigere"],
    lat: 12.8763,
    lng: 77.5972,
    zone: "South",
    boundaryApprox: [
      [12.892, 77.583],
      [12.892, 77.613],
      [12.861, 77.613],
      [12.861, 77.583],
    ],
  },
  560025: {
    area: "Byatarayanapura",
    localities: ["Byatarayanapura", "Sanjay Nagar", "Ganganagar"],
    lat: 13.0454,
    lng: 77.5757,
    zone: "North",
    boundaryApprox: [
      [13.059, 77.562],
      [13.059, 77.59],
      [13.031, 77.59],
      [13.031, 77.562],
    ],
  },
  560026: {
    area: "Ulsoor",
    localities: ["Ulsoor", "Halasuru", "Murphy Town"],
    lat: 12.9762,
    lng: 77.6218,
    zone: "East",
    boundaryApprox: [
      [12.989, 77.609],
      [12.989, 77.636],
      [12.963, 77.636],
      [12.963, 77.609],
    ],
  },
  560027: {
    area: "Marathahalli",
    localities: ["Marathahalli", "Kadubeesanahalli", "Brookefield"],
    lat: 12.9591,
    lng: 77.6971,
    zone: "East",
    boundaryApprox: [
      [12.974, 77.683],
      [12.974, 77.713],
      [12.944, 77.713],
      [12.944, 77.683],
    ],
  },
  560028: {
    area: "BTM Layout",
    localities: ["BTM Layout", "Madiwala", "Hongasandra"],
    lat: 12.9165,
    lng: 77.6101,
    zone: "South",
    boundaryApprox: [
      [12.93, 77.597],
      [12.93, 77.625],
      [12.903, 77.625],
      [12.903, 77.597],
    ],
  },
  560029: {
    area: "Whitefield",
    localities: ["Whitefield", "ITPL", "Hoodi", "Mahadevapura"],
    lat: 12.9698,
    lng: 77.7499,
    zone: "East",
    boundaryApprox: [
      [12.989, 77.733],
      [12.989, 77.768],
      [12.951, 77.768],
      [12.951, 77.733],
    ],
  },
  560030: {
    area: "Basavanagudi",
    localities: ["Wilson Garden", "Suddagunte Palya", "Gurappanapalya"],
    lat: 12.9473,
    lng: 77.5896,
    zone: "South",
    boundaryApprox: [
      [12.96, 77.577],
      [12.96, 77.603],
      [12.934, 77.603],
      [12.934, 77.577],
    ],
  },
  560032: {
    area: "Kengeri",
    localities: ["Kengeri", "Uttarahalli", "Kengeri Satellite Town"],
    lat: 12.9063,
    lng: 77.4845,
    zone: "West",
    boundaryApprox: [
      [12.921, 77.469],
      [12.921, 77.5],
      [12.891, 77.5],
      [12.891, 77.469],
    ],
  },
  560034: {
    area: "Jayanagar 4th Block",
    localities: ["Jayanagar 4th Block", "DVG Road", "National College Area"],
    lat: 12.937,
    lng: 77.5825,
    zone: "South",
    boundaryApprox: [
      [12.95, 77.569],
      [12.95, 77.597],
      [12.924, 77.597],
      [12.924, 77.569],
    ],
  },
  560037: {
    area: "Peenya",
    localities: ["Peenya", "Peenya Industrial Area", "Jalahalli West"],
    lat: 13.0317,
    lng: 77.5162,
    zone: "North West",
    boundaryApprox: [
      [13.047, 77.502],
      [13.047, 77.531],
      [13.017, 77.531],
      [13.017, 77.502],
    ],
  },
  560038: {
    area: "Nagarbhavi",
    localities: ["Nagarbhavi", "BEL Layout", "Chandra Layout"],
    lat: 12.9765,
    lng: 77.5082,
    zone: "West",
    boundaryApprox: [
      [12.99, 77.494],
      [12.99, 77.523],
      [12.963, 77.523],
      [12.963, 77.494],
    ],
  },
  560040: {
    area: "Magadi Road",
    localities: ["Magadi Road", "Kamakshipalya", "Shakthinagar"],
    lat: 12.9696,
    lng: 77.5343,
    zone: "West",
    boundaryApprox: [
      [12.983, 77.52],
      [12.983, 77.549],
      [12.956, 77.549],
      [12.956, 77.52],
    ],
  },
  560041: {
    area: "Bommanahalli",
    localities: ["Bommanahalli", "HSR Layout", "Kudlu"],
    lat: 12.8988,
    lng: 77.641,
    zone: "South",
    boundaryApprox: [
      [12.914, 77.627],
      [12.914, 77.657],
      [12.884, 77.657],
      [12.884, 77.627],
    ],
  },
  560042: {
    area: "Electronic City",
    localities: ["Electronic City", "Neeladri Nagar", "Hebbagodi"],
    lat: 12.8399,
    lng: 77.6769,
    zone: "South",
    boundaryApprox: [
      [12.858, 77.663],
      [12.858, 77.693],
      [12.822, 77.693],
      [12.822, 77.663],
    ],
  },
  560043: {
    area: "Devanahalli",
    localities: ["Devanahalli", "Bangalore International Airport Area"],
    lat: 13.2477,
    lng: 77.7179,
    zone: "North East",
    boundaryApprox: [
      [13.268, 77.703],
      [13.268, 77.734],
      [13.228, 77.734],
      [13.228, 77.703],
    ],
  },
  560045: {
    area: "Rajajinagar West",
    localities: ["Rajajinagar West", "Basaveshwara Nagar", "Chord Road"],
    lat: 12.9987,
    lng: 77.5296,
    zone: "West",
    boundaryApprox: [
      [13.012, 77.516],
      [13.012, 77.544],
      [12.985, 77.544],
      [12.985, 77.516],
    ],
  },
  560047: {
    area: "Shivaji Nagar",
    localities: ["Shivaji Nagar", "Pulakeshi Nagar", "Bharathinagar"],
    lat: 12.9928,
    lng: 77.6149,
    zone: "East",
    boundaryApprox: [
      [13.006, 77.602],
      [13.006, 77.629],
      [12.98, 77.629],
      [12.98, 77.602],
    ],
  },
  560050: {
    area: "Sanjaynagar",
    localities: ["Sanjaynagar", "RMV 2nd Stage", "Dollars Colony"],
    lat: 13.0233,
    lng: 77.5871,
    zone: "North",
    boundaryApprox: [
      [13.037, 77.574],
      [13.037, 77.601],
      [13.009, 77.601],
      [13.009, 77.574],
    ],
  },
  560052: {
    area: "Ramamurthy Nagar",
    localities: ["Ramamurthy Nagar", "Banaswadi", "Kalyan Nagar"],
    lat: 13.0156,
    lng: 77.6572,
    zone: "East",
    boundaryApprox: [
      [13.03, 77.643],
      [13.03, 77.672],
      [13.001, 77.672],
      [13.001, 77.643],
    ],
  },
  560054: {
    area: "Bommanahalli",
    localities: ["Bommanahalli", "Begur", "Hulimavu"],
    lat: 12.8882,
    lng: 77.6319,
    zone: "South",
    boundaryApprox: [
      [12.903, 77.618],
      [12.903, 77.647],
      [12.873, 77.647],
      [12.873, 77.618],
    ],
  },
  560055: {
    area: "Viswaneedam",
    localities: ["Viswaneedam", "Pattanagere", "Rajarajeshwari Nagar"],
    lat: 12.9311,
    lng: 77.5042,
    zone: "West",
    boundaryApprox: [
      [12.946, 77.49],
      [12.946, 77.52],
      [12.916, 77.52],
      [12.916, 77.49],
    ],
  },
  560058: {
    area: "Nagasandra",
    localities: ["Nagasandra", "Chikkabanavara", "Hesaraghatta Main Road"],
    lat: 13.0601,
    lng: 77.5145,
    zone: "North West",
    boundaryApprox: [
      [13.076, 77.5],
      [13.076, 77.529],
      [13.044, 77.529],
      [13.044, 77.5],
    ],
  },
  560060: {
    area: "Jalahalli",
    localities: ["Jalahalli", "BEL Layout", "Dasarahalli"],
    lat: 13.0424,
    lng: 77.5507,
    zone: "North",
    boundaryApprox: [
      [13.057, 77.537],
      [13.057, 77.566],
      [13.027, 77.566],
      [13.027, 77.537],
    ],
  },
  560061: {
    area: "Kanakapura Road",
    localities: ["Kanakapura Road", "Uttarahalli", "Vasanthapura"],
    lat: 12.8786,
    lng: 77.5607,
    zone: "South",
    boundaryApprox: [
      [12.895, 77.546],
      [12.895, 77.576],
      [12.862, 77.576],
      [12.862, 77.546],
    ],
  },
  560062: {
    area: "Hoodi",
    localities: ["Hoodi", "EPIP Zone", "Nallurahalli"],
    lat: 12.9977,
    lng: 77.7122,
    zone: "East",
    boundaryApprox: [
      [13.013, 77.698],
      [13.013, 77.728],
      [12.982, 77.728],
      [12.982, 77.698],
    ],
  },
  560064: {
    area: "Bannerghatta",
    localities: ["Bannerghatta", "Jigani", "Anekal"],
    lat: 12.8004,
    lng: 77.5779,
    zone: "South",
    boundaryApprox: [
      [12.818, 77.563],
      [12.818, 77.594],
      [12.783, 77.594],
      [12.783, 77.563],
    ],
  },
  560068: {
    area: "Konanakunte",
    localities: ["Konanakunte", "JP Nagar 8th Phase", "Arakere"],
    lat: 12.8889,
    lng: 77.5726,
    zone: "South",
    boundaryApprox: [
      [12.904, 77.558],
      [12.904, 77.588],
      [12.874, 77.588],
      [12.874, 77.558],
    ],
  },
  560069: {
    area: "Banaswadi",
    localities: ["Banaswadi", "Kammanahalli", "St. Thomas Town"],
    lat: 13.0076,
    lng: 77.6456,
    zone: "East",
    boundaryApprox: [
      [13.022, 77.632],
      [13.022, 77.661],
      [12.993, 77.661],
      [12.993, 77.632],
    ],
  },
  560070: {
    area: "Hebbal Kempapura",
    localities: ["Kempapura", "Amruthahalli", "Sahakara Nagar"],
    lat: 13.0526,
    lng: 77.5873,
    zone: "North",
    boundaryApprox: [
      [13.067, 77.574],
      [13.067, 77.602],
      [13.038, 77.602],
      [13.038, 77.574],
    ],
  },
  560072: {
    area: "HSR Layout",
    localities: ["HSR Layout", "Agara", "Sector 1-7"],
    lat: 12.9081,
    lng: 77.6476,
    zone: "South East",
    boundaryApprox: [
      [12.924, 77.634],
      [12.924, 77.663],
      [12.893, 77.663],
      [12.893, 77.634],
    ],
  },
  560076: {
    area: "Yelahanka",
    localities: ["Yelahanka", "Yelahanka New Town", "Kogilu"],
    lat: 13.1005,
    lng: 77.5963,
    zone: "North",
    boundaryApprox: [
      [13.117, 77.582],
      [13.117, 77.612],
      [13.084, 77.612],
      [13.084, 77.582],
    ],
  },
  560077: {
    area: "Hoskote",
    localities: ["Hoskote", "Vijayapura", "Anugondanahalli"],
    lat: 13.0709,
    lng: 77.7979,
    zone: "East",
    boundaryApprox: [
      [13.09, 77.782],
      [13.09, 77.815],
      [13.052, 77.815],
      [13.052, 77.782],
    ],
  },
  560078: {
    area: "CV Raman Nagar",
    localities: ["CV Raman Nagar", "New Thippasandra", "Old Airport Road"],
    lat: 12.9966,
    lng: 77.6633,
    zone: "East",
    boundaryApprox: [
      [13.011, 77.65],
      [13.011, 77.678],
      [12.982, 77.678],
      [12.982, 77.65],
    ],
  },
  560079: {
    area: "Uttarahalli",
    localities: ["Uttarahalli", "Subramanyapura", "Konanakunte"],
    lat: 12.9049,
    lng: 77.5303,
    zone: "South",
    boundaryApprox: [
      [12.92, 77.516],
      [12.92, 77.546],
      [12.89, 77.546],
      [12.89, 77.516],
    ],
  },
  560083: {
    area: "Varthur",
    localities: ["Varthur", "Thubarahalli", "Siddapura"],
    lat: 12.9394,
    lng: 77.7354,
    zone: "East",
    boundaryApprox: [
      [12.956, 77.721],
      [12.956, 77.752],
      [12.923, 77.752],
      [12.923, 77.721],
    ],
  },
  560085: {
    area: "Sarjapur Road",
    localities: ["Sarjapur Road", "Carmelaram", "Bellandur"],
    lat: 12.9082,
    lng: 77.6776,
    zone: "South East",
    boundaryApprox: [
      [12.926, 77.663],
      [12.926, 77.694],
      [12.891, 77.694],
      [12.891, 77.663],
    ],
  },
  560086: {
    area: "Chandapura",
    localities: ["Chandapura", "Anekal", "Bommasandra"],
    lat: 12.8136,
    lng: 77.6906,
    zone: "South",
    boundaryApprox: [
      [12.83, 77.676],
      [12.83, 77.707],
      [12.797, 77.707],
      [12.797, 77.676],
    ],
  },
  560087: {
    area: "Akshayanagar",
    localities: ["Akshayanagar", "Arekere", "Meenakshi Layout"],
    lat: 12.8748,
    lng: 77.6134,
    zone: "South",
    boundaryApprox: [
      [12.891, 77.599],
      [12.891, 77.629],
      [12.859, 77.629],
      [12.859, 77.599],
    ],
  },
  560090: {
    area: "Dasarahalli",
    localities: ["Dasarahalli", "Tumkur Road", "Lakshmidevi Nagar"],
    lat: 13.0567,
    lng: 77.5298,
    zone: "North West",
    boundaryApprox: [
      [13.072, 77.515],
      [13.072, 77.545],
      [13.042, 77.545],
      [13.042, 77.515],
    ],
  },
  560091: {
    area: "Kaggadasapura",
    localities: ["Kaggadasapura", "C V Raman Nagar", "Banaswadi"],
    lat: 13.0,
    lng: 77.6554,
    zone: "East",
    boundaryApprox: [
      [13.014, 77.641],
      [13.014, 77.67],
      [12.986, 77.67],
      [12.986, 77.641],
    ],
  },
  560092: {
    area: "Bellandur",
    localities: ["Bellandur", "Outer Ring Road", "Ecospace"],
    lat: 12.9258,
    lng: 77.6769,
    zone: "South East",
    boundaryApprox: [
      [12.942, 77.663],
      [12.942, 77.693],
      [12.91, 77.693],
      [12.91, 77.663],
    ],
  },
  560093: {
    area: "Yelahanka Old Town",
    localities: ["Yelahanka Old Town", "Attur Layout", "Bagalur"],
    lat: 13.1067,
    lng: 77.5948,
    zone: "North",
    boundaryApprox: [
      [13.122, 77.581],
      [13.122, 77.61],
      [13.092, 77.61],
      [13.092, 77.581],
    ],
  },
  560094: {
    area: "Thanisandra",
    localities: ["Thanisandra", "Byrathi", "Kodigehalli"],
    lat: 13.0569,
    lng: 77.6239,
    zone: "North",
    boundaryApprox: [
      [13.072, 77.61],
      [13.072, 77.639],
      [13.042, 77.639],
      [13.042, 77.61],
    ],
  },
  560095: {
    area: "Subramanyapura",
    localities: ["Subramanyapura", "Uttarahalli", "Mylasandra"],
    lat: 12.9021,
    lng: 77.5474,
    zone: "South",
    boundaryApprox: [
      [12.917, 77.533],
      [12.917, 77.563],
      [12.887, 77.563],
      [12.887, 77.533],
    ],
  },
  560096: {
    area: "Bommanahalli II",
    localities: ["Bommanahalli", "Singasandra", "Harlur"],
    lat: 12.8811,
    lng: 77.6502,
    zone: "South",
    boundaryApprox: [
      [12.897, 77.636],
      [12.897, 77.666],
      [12.866, 77.666],
      [12.866, 77.636],
    ],
  },
  560097: {
    area: "Bannerghatta Road II",
    localities: ["Gottigere", "Meenakshi Temple Area", "Vasanthapura"],
    lat: 12.8581,
    lng: 77.584,
    zone: "South",
    boundaryApprox: [
      [12.875, 77.569],
      [12.875, 77.6],
      [12.842, 77.6],
      [12.842, 77.569],
    ],
  },
  560099: {
    area: "Jakkur",
    localities: ["Jakkur", "HMT Layout", "Bagalur"],
    lat: 13.0758,
    lng: 77.5869,
    zone: "North",
    boundaryApprox: [
      [13.091, 77.573],
      [13.091, 77.602],
      [13.061, 77.602],
      [13.061, 77.573],
    ],
  },
  560100: {
    area: "Doddaballapur",
    localities: ["Doddaballapur", "Rajanukunte", "Avathi"],
    lat: 13.2967,
    lng: 77.5387,
    zone: "North",
    boundaryApprox: [
      [13.318, 77.524],
      [13.318, 77.555],
      [13.276, 77.555],
      [13.276, 77.524],
    ],
  },
  560103: {
    area: "Sanjay Nagar",
    localities: ["Sanjay Nagar", "Kavalbyrasandra", "Ganganagar"],
    lat: 13.0388,
    lng: 77.5822,
    zone: "North",
    boundaryApprox: [
      [13.054, 77.568],
      [13.054, 77.597],
      [13.024, 77.597],
      [13.024, 77.568],
    ],
  },
  560105: {
    area: "Nandini Layout",
    localities: ["Nandini Layout", "Herohalli", "Manjunatha Nagar"],
    lat: 12.9896,
    lng: 77.5166,
    zone: "West",
    boundaryApprox: [
      [13.004, 77.502],
      [13.004, 77.532],
      [12.975, 77.532],
      [12.975, 77.502],
    ],
  },
  560107: {
    area: "Kothanur",
    localities: ["Kothanur", "Hesaraghatta Road", "Chikkabanavara"],
    lat: 13.0729,
    lng: 77.5434,
    zone: "North",
    boundaryApprox: [
      [13.088, 77.529],
      [13.088, 77.558],
      [13.058, 77.558],
      [13.058, 77.529],
    ],
  },
  560108: {
    area: "Yelahanka Satellite Town",
    localities: ["Yelahanka Satellite Town", "Attur", "Chokkanahalli"],
    lat: 13.1122,
    lng: 77.5805,
    zone: "North",
    boundaryApprox: [
      [13.128, 77.566],
      [13.128, 77.596],
      [13.097, 77.596],
      [13.097, 77.566],
    ],
  },
  560110: {
    area: "Sarjapur",
    localities: ["Sarjapur", "Attibele", "Dommasandra"],
    lat: 12.8617,
    lng: 77.7838,
    zone: "South East",
    boundaryApprox: [
      [12.879, 77.769],
      [12.879, 77.8],
      [12.844, 77.8],
      [12.844, 77.769],
    ],
  },
};

// Helper: get all pincodes list
const getAllPincodes = () => Object.keys(bangalorePincodes).map(Number);

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", dbConnected });
});

// Get pincode info
app.get("/api/pincode/:pincode", async (req, res) => {
  try {
    const { pincode } = req.params;

    // Validate
    if (!/^\d{6}$/.test(pincode)) {
      return res
        .status(400)
        .json({ error: "Invalid pincode format. Must be 6 digits." });
    }

    const pin = parseInt(pincode);

    // Check cache
    const cached = cache.get(pincode);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Check local data
    const localData = bangalorePincodes[pin];
    if (localData) {
      const result = {
        pincode: pin,
        area: localData.area,
        localities: localData.localities,
        district: "Bangalore Urban",
        state: "Karnataka",
        country: "India",
        zone: localData.zone,
        coordinates: { lat: localData.lat, lng: localData.lng },
        boundaryApprox: localData.boundaryApprox,
        source: "local",
      };

      cache.set(pincode, result);

      // Save to DB if connected
      if (dbConnected) {
        await SearchHistory.create({
          pincode: pincode,
          areaName: localData.area,
          district: "Bangalore Urban",
          state: "Karnataka",
        }).catch(() => {});
      }

      return res.json(result);
    }

    // Fallback: try external API
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
        { timeout: 5000 }
      );
      const data = response.data;

      if (
        data &&
        data[0] &&
        data[0].Status === "Success" &&
        data[0].PostOffice
      ) {
        const postOffice = data[0].PostOffice[0];

        if (
          postOffice.State !== "Karnataka" ||
          !postOffice.District.toLowerCase().includes("bangalore")
        ) {
          return res.status(404).json({
            error: "This pincode does not belong to Bangalore.",
            suggestion: "Please enter a valid Bangalore pincode (560xxx).",
          });
        }

        const result = {
          pincode: pin,
          area: postOffice.Name,
          localities: data[0].PostOffice.map((p) => p.Name),
          district: postOffice.District,
          state: postOffice.State,
          country: "India",
          zone: "Bangalore",
          coordinates: { lat: 12.9716, lng: 77.5946 },
          boundaryApprox: null,
          source: "external",
        };

        cache.set(pincode, result);
        return res.json(result);
      }
    } catch (extErr) {
      console.log("External API error:", extErr.message);
    }

    return res.status(404).json({
      error: "Pincode not found in Bangalore.",
      suggestion:
        "Valid Bangalore pincodes start with 560. Try 560001, 560011, 560029, etc.",
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all available pincodes
app.get("/api/pincodes", (req, res) => {
  const list = Object.entries(bangalorePincodes).map(([pin, data]) => ({
    pincode: parseInt(pin),
    area: data.area,
    zone: data.zone,
  }));
  res.json({ total: list.length, pincodes: list });
});

// Get recent searches (from DB)
app.get("/api/recent", async (req, res) => {
  if (!dbConnected) {
    return res.json({ searches: [] });
  }
  try {
    const recent = await SearchHistory.find()
      .sort({ searchedAt: -1 })
      .limit(10)
      .lean();
    res.json({ searches: recent });
  } catch (err) {
    res.json({ searches: [] });
  }
});

// Search suggestions
app.get("/api/suggest", (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 3) return res.json({ suggestions: [] });

  const suggestions = Object.entries(bangalorePincodes)
    .filter(
      ([pin, data]) =>
        pin.startsWith(q) ||
        data.area.toLowerCase().includes(q.toLowerCase()) ||
        data.localities.some((l) => l.toLowerCase().includes(q.toLowerCase()))
    )
    .slice(0, 8)
    .map(([pin, data]) => ({
      pincode: parseInt(pin),
      area: data.area,
      zone: data.zone,
    }));

  res.json({ suggestions });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
