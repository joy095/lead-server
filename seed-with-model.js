// Load environment variables first
require("dotenv").config();

const mongoose = require("mongoose");

// Use the environment variable or default
const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI:", MONGODB_URI); // Debug log

// Sample data for generating realistic leads
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Helen",
  "Mark",
  "Sandra",
  "Donald",
  "Donna",
  "Steven",
  "Carol",
  "Paul",
  "Ruth",
  "Andrew",
  "Sharon",
  "Joshua",
  "Michelle",
  "Kenneth",
  "Laura",
  "Kevin",
  "Sarah",
  "Brian",
  "Kimberly",
  "George",
  "Deborah",
  "Edward",
  "Dorothy",
  "Ronald",
  "Lisa",
  "Timothy",
  "Nancy",
  "Jason",
  "Karen",
  "Jeffrey",
  "Betty",
  "Ryan",
  "Helen",
  "Jacob",
  "Sandra",
  "Gary",
  "Donna",
  "Nicholas",
  "Carol",
  "Eric",
  "Ruth",
  "Jonathan",
  "Sharon",
  "Stephen",
  "Michelle",
  "Larry",
  "Laura",
  "Justin",
  "Sarah",
  "Scott",
  "Kimberly",
  "Brandon",
  "Deborah",
  "Benjamin",
  "Dorothy",
  "Samuel",
  "Lisa",
  "Gregory",
  "Nancy",
  "Alexander",
  "Karen",
  "Patrick",
  "Betty",
  "Frank",
  "Helen",
  "Raymond",
  "Sandra",
  "Jack",
  "Donna",
  "Dennis",
  "Carol",
  "Jerry",
  "Ruth",
  "Tyler",
  "Sharon",
  "Aaron",
  "Michelle",
  "Jose",
  "Laura",
  "Adam",
  "Sarah",
  "Nathan",
  "Kimberly",
  "Henry",
  "Deborah",
  "Douglas",
  "Dorothy",
  "Zachary",
  "Lisa",
  "Peter",
  "Nancy",
  "Kyle",
  "Karen",
  "Ethan",
  "Betty",
  "Walter",
  "Helen",
  "Noah",
  "Sandra",
  "Jeremy",
  "Donna",
  "Christian",
  "Carol",
  "Keith",
  "Ruth",
  "Roger",
  "Sharon",
  "Terry",
  "Michelle",
  "Gerald",
  "Laura",
  "Harold",
  "Sarah",
  "Sean",
  "Kimberly",
  "Austin",
  "Deborah",
  "Carl",
  "Dorothy",
  "Arthur",
  "Lisa",
  "Lawrence",
  "Nancy",
  "Dylan",
  "Karen",
  "Jesse",
  "Betty",
  "Jordan",
  "Helen",
  "Bryan",
  "Sandra",
  "Billy",
  "Donna",
  "Bruce",
  "Carol",
  "Gabriel",
  "Ruth",
  "Joe",
  "Sharon",
  "Logan",
  "Michelle",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
  "Alvarez",
  "Castillo",
  "Sanders",
  "Patel",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Jimenez",
  "Powell",
  "Jenkins",
  "Pierce",
  "Hayes",
];

const companies = [
  "Acme Inc",
  "Globex Corporation",
  "Wayne Enterprises",
  "Stark Industries",
  "Umbrella Corporation",
  "Cyberdyne Systems",
  "Weyland-Yutani",
  "Tyrell Corporation",
  "Virtucon",
  "Gringotts Bank",
  "Oscorp",
  "LexCorp",
  "Daily Planet",
  "S.H.I.E.L.D.",
  "Hydra",
  "Sokovia",
  "Asgard",
  "Xavier Institute",
  "Avengers",
  "Skrull Empire",
  "Kree Empire",
  "Guardians of the Galaxy",
  "Fantastic Four",
  "Spider-Man Inc",
  "Batman Enterprises",
  "Superman Corp",
  "Justice League",
  "S.H.I.E.L.D.",
  "S.T.A.R. Labs",
  "Waydroid Industries",
  "CyberLife",
  "Omni Consumer Products",
  "InGen",
  "Nakatomi Trading Corp",
  "Weyland Corp",
  "Wayne Tech",
  "Queen Consolidated",
  "Stark Solutions",
  "Pym Technologies",
  "Dunbar Armored",
  "Rand Enterprises",
  "Hammer Industries",
  "Roxxon Energy",
  "Aldrich Killian Industries",
  "Sterns Law Firm",
  "Banner Industries",
  "Osborn Industries",
  "Fisk Industries",
  "Silver Sable Intl",
  "Parker Industries",
  "Daily Bugle",
  "Bugle",
  "Clarke Enterprises",
  "Wayne Industries",
  "LuthorCorp",
  "Queen Industries",
  "Stark International",
  "Dodge Industries",
  "Wayne Security",
  "Wayne Enterprises",
  "LexCorp Industries",
  "Daily Planet",
];

const sources = [
  "Website",
  "Social Media",
  "Referral",
  "Event",
  "Advertisement",
  "Cold Call",
  "Email Marketing",
  "Trade Show",
  "Webinar",
  "Podcast",
  "Blog",
  "SEO",
  "PPC",
  "Direct Mail",
  "Telemarketing",
  "Partnership",
  "Conference",
  "Networking Event",
];

const stages = ["new", "contacted", "qualified", "converted", "lost"];

// Function to generate random email
function generateEmail(firstName, lastName) {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "company.com",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

// Function to generate random phone number
function generatePhoneNumber() {
  return `+1 (${Math.floor(Math.random() * 900) + 100}) ${
    Math.floor(Math.random() * 900) + 100
  }-${Math.floor(Math.random() * 9000) + 1000}`;
}

// Function to generate random lead
function generateLead() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];

  return {
    name: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName),
    phone: Math.random() > 0.3 ? generatePhoneNumber() : "", // 70% chance of having a phone
    company: Math.random() > 0.2 ? company : "", // 80% chance of having a company
    stage: stages[Math.floor(Math.random() * stages.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    value:
      Math.random() > 0.3
        ? Math.floor(Math.random() * 50000) + 1000
        : undefined, // 70% chance of having a value
    notes:
      Math.random() > 0.5
        ? `Sample note for ${firstName} ${lastName}. Interested in our services.`
        : "",
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ), // Random date within last 30 days
    updatedAt: new Date(),
  };
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get the collection
    const db = mongoose.connection.db;
    const collection = db.collection("leads");

    // Clear existing data
    await collection.deleteMany({});
    console.log("Cleared existing leads");

    // Generate 500 dummy leads (adjust this number as needed)
    const numLeads = 500; // You can change this to 300-1000
    const leads = [];

    for (let i = 0; i < numLeads; i++) {
      leads.push(generateLead());
    }

    // Insert the leads
    await collection.insertMany(leads);
    console.log(`Inserted ${numLeads} dummy leads`);

    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
