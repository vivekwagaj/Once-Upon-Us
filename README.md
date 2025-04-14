# Once-Upon-Us

**Once Upon Us** is a private digital memory library for couples to document and relive their journey together. With support for media uploads (photos and videos), personalized voiceovers, and descriptive text entries, the app serves as a secure and intimate space for shared memories.
Built with React, Tailwind CSS, and Firebase.

## Features

- Upload and store memorable moments as images or videos
- Add voiceovers to media files to narrate the story behind them
- Organize entries chronologically or by category
- Secure, private access with Firebase Authentication
- Simple and elegant UI with a focus on user experience

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend & Hosting:** Firebase (Authentication, Firestore, Storage, Hosting)
- **Optional Enhancements:**
    - Speech-to-text or text-to-speech integration
    - Shareable links or export options

## Folder Structure

once-upon-us/ 
├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ ├── App.js
│ └── index.js
├── .gitignore
├── firebase.json
├── tailwind.config.js
├── package.json
└── README.md


## Setup Instructions

1. **Clone the repository**
   git clone <project-link>

2. **Install dependencies**
   npm install


3. **Firebase Setup**
- Create a new Firebase project
- Enable **Authentication** (Email/Password)
- Enable **Firestore** and **Storage**
- Add your Firebase configuration to a `.env` file:
  ```
  REACT_APP_API_KEY=your_key
  REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
  REACT_APP_PROJECT_ID=your_project_id
  REACT_APP_STORAGE_BUCKET=your_project.appspot.com
  REACT_APP_MESSAGING_SENDER_ID=your_id
  REACT_APP_APP_ID=your_app_id
  ```

4. **Start the development server**
   npm start

## License

This project is licensed for personal and educational use only. All rights reserved.

---

Built with love and code, to celebrate the stories that matter most.

