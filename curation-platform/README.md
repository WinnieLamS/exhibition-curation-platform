# Exhibition Curation Platform

## Overview
The **Exhibition Curation Platform** is a web application designed to help users explore and curate exhibitions using artwork collections from **The Harvard Art Museums** and **The Metropolitan Museum of Art**. It allows users to browse collections, save artworks to their exhibitions, and manage their profiles.

This project is built using **React (Vite) + TypeScript** and integrates **Firebase** for authentication, Firestore for database management, and Firebase Storage for user avatars.

---
## Hosted Version

The deployed version of this frontend can be accessed at [Exhibition Curation Platform](https://exhibition-curation-platform.firebaseapp.com/ ).

#### For functional testing, you can use:
Email: `test@gmail.com` 
Password: `testing`

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
# Clone this repository to your local machine
git clone https://github.com/WinnieLamS/exhibition-curation-platform.git
cd exhibition-curation-platform
```

### 2️⃣ Install Dependencies

Then install the dependencies:
```sh
npm install
```
### 3️⃣ Set Up Environment Variables
1. Generate Firebase API Keys

        How to Regenerate Firebase API Keys:
        1. Go to Firebase Console → Firebase Settings
        2. Click Project Settings (gear icon ⚙️)
        3. Scroll down to "Web API Key"
        4. Click Regenerate Key (this will invalidate the exposed one).
        5. Update your .env file with the new key.

2. Create a **`.env`** file in the root directory and add your **Firebase configuration** and **Harvard Art Museums API Key**:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

VITE_HARVARD_API_KEY=YOUR_HARVARD_API_KEY
```
You can find these values in your **Firebase Console** under **Project Settings > General > Your apps**.


### 4️⃣ Run the App Locally
```sh
npm run dev
```
Open your browser and navigate to [http://localhost:5173](http://localhost:5173) (or the URL provided by Vite) to view the app locally.

---

## 🔥 Features
- **Explore Artwork Collections** from The Harvard Art Museums & The Metropolitan Museum of Art.
- **User Authentication** (Sign Up, Login) with Firebase.
- **Create & Manage Exhibitions** to store curated artworks.
- **Upload User Avatars** using Firebase Storage.
- **Pagination & Sorting** for better browsing.

---

## 🔧 Project Structure
```
├── src/
│   ├── api/               # API calls to Harvard & Met Museum
│   ├── components/        # Reusable UI components
│   ├── contexts/         # Global context providers (User, Loading)
│   ├── pages/            # Main pages (Home, User, Collections, Exhibitions)
│   ├── firebase/         # Firebase configuration and Firestore setup
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # App entry point
│   ├── routes.tsx        # Application routes
│   └── styles/           # CSS & styles
├── public/               # Static assets
├── .env                  # Environment variables
├── package.json          # Dependencies & scripts
└── README.md             # Project documentation
```

---

## 🛠 Firebase Setup
This project uses **Firebase Authentication, Firestore Database, and Storage**.

### ✅ Authentication
Users can **sign up and log in** using email/password authentication.
- Sign-up and login functions are in `firebase/auth.ts`.
- User state is managed with **React Context API** (`contexts/UserContext.tsx`).

### ✅ Firestore Database
- **Users**: Stored under `users/{userId}`.
- **Exhibitions**: Stored under `users/{userId}/exhibitions/{exhibitionId}`.
- **Objects (Artworks)**: Stored within exhibitions.

Example Firestore structure:
```
users/
  ├── userId1/
  │   ├── exhibitions/
  │   │   ├── exhibitionId1/
  │   │   │   ├── objects/
  │   │   │   │   ├── objectId1
  │   │   │   │   ├── objectId2
  │   │   │
  │   ├── avatar: "https://firebase.storage.url"
  │   ├── email: "user@example.com"
  │   ├── name: "John Doe"
```
---

## 📚 Useful Links
- 🔗 [Harvard Art Museums API](https://api.harvardartmuseums.org/)
- 🔗 [The Metropolitan Museum of Art API](https://metmuseum.github.io/)
- 🔗 [React Documentation](https://react.dev/)
- 🔗 [Firebase Documentation](https://firebase.google.com/docs)


---

## 🏆 Credits
This project was built by **Winnie Lin**. 🎨🚀
