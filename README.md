# FinCompanion - Financial Goal Tracking App

## Overview

FinCompanion is a mobile-first budgeting and savings application designed to help young adults gain financial confidence through real-time tracking, goal visualization, and timeline-based planning. This high-fidelity prototype is the implementation for CS 4352 – Human Computer Interaction (DP4).

## Features

- **Dashboard Overview** - View your financial snapshot with total savings and active goals
- **Goal Management** - Create, track, and manage multiple savings goals with progress visualization
- **Interactive Timeline** - Track your financial journey with milestone markers and event history
- **Profile Management** - Personalized user profile with settings and account management
- **Password Security** - Secure password change functionality with validation
- **Responsive Design** - Optimized for mobile devices with clean, intuitive UI

## Heuristic Evaluation Changes

As part of improving the overall usability and aligning the app with **Heuristic 4: Consistency & Standards**, the following revisions were implemented throughout the system:

### **Design System & Core Standards**
- Centralized all UI constants into `constants/design.ts`
- Established consistent color rules:
  - **Green** = Income  
  - **Red** = Expense  
  - **Purple** = What-If Scenario  
- Adopted unified terminology (e.g., “Impact Level” replaces “Event Size”)
- Standardized icon mappings (removed emojis, added Feather icons)
- Defined a single date format across the app (**MM/DD/YYYY**)

### **Date Handling Improvements**
- Replaced all text-based date inputs with a standardized `DatePicker` component
- Implemented auto-formatting for date entry  
- Added validation for proper MM/DD/YYYY format  
- Ensured consistent date handling across all modals and screens

### **Navigation & Workflow Consistency**
- Updated create/edit flows to return to the correct originating screen  
  - Creating/editing a goal → returns to **Goals**  
  - Creating/editing an event → returns to **Timeline**
- Ensured consistent use of back buttons and page titles
- Unified modal styling and required-field indicators

### **Iconography & Visual Language**
- Replaced all emoji-based icons in `_layout.tsx` with professional Feather icons  
- Introduced consistent icons for income, expense, editing, deleting, and marking primary goals
- Updated Timeline and Goals screens for cohesive visual structure

### **Form & Modal Standardization**
- Removed redundant fields (e.g., “Title” + “Name” → single **Goal Name**)
- Added clear helper text and optional-field markers
- Applied consistent validation rules across all forms
- Improved Impact Level descriptions for clarity and predictability

### **Timeline & Event Display Updates**
- Added a dedicated **What-If Scenario** badge (instead of text prefixes)
- Standardized amount formatting using both color and minus sign  
- Unified card layout for all event types
- Added confirmation dialogue for delete actions

### **Primary Goal Indicator Improvements**
- Replaced misleading red exclamation mark with a gold **star** icon  
- Updated related displays in `goals.tsx` and `index.tsx` for clarity and consistency


## System Requirements

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Supported Platforms
- **iOS Devices** (iPhone 11 or newer recommended)
- **Android Devices** (Android 10 or higher recommended)
- **Web Browsers** (for development):
  - Google Chrome (v100+) - **Recommended**
  - Safari (v15+)
  - Firefox (v100+)

### Development Environment
- **Expo Go App** (for mobile testing)
  - Download from [App Store](https://apps.apple.com/app/apple-store/id982107779) (iOS)
  - Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)

## Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/akashj-25/HCI-DP-4.git
cd HCI-DP-4
```

### 2. Install Dependencies

Navigate to the frontend directory and install required packages:

```bash
cd frontend
npm install
```

Or if using yarn:

```bash
cd frontend
yarn install
```

### 3. Start the Development Server

```bash
npx expo start
```

Or with npm:

```bash
npm start
```

## Running the Application

### Option 1: Mobile Device (Recommended)

1. **Install Expo Go** on your mobile device (see links above)
2. **Start the development server** (see Installation step 3)
3. **Scan the QR code** displayed in your terminal or browser:
   - **iOS**: Open the Camera app and scan the QR code
   - **Android**: Open the Expo Go app and scan the QR code
4. The app will load automatically on your device

### Option 2: iOS Simulator (macOS only)

1. Install Xcode from the Mac App Store
2. Install iOS Simulator via Xcode
3. Start the development server
4. Press `i` in the terminal to open in iOS Simulator

### Option 3: Android Emulator

1. Install [Android Studio](https://developer.android.com/studio)
2. Set up an Android Virtual Device (AVD) in Android Studio
3. Start the AVD
4. Start the development server
5. Press `a` in the terminal to open in Android Emulator

### Option 4: Web Browser (Limited functionality)

1. Start the development server
2. Press `w` in the terminal to open in web browser
3. **Note**: Some mobile-specific features may not work properly in web view

## Test User Credentials

For demonstration purposes, the app uses mock data. No authentication is currently required.

**Demo User Profile:**
- Name: Akash Jayakumar
- Email: akash.j@email.com
- Avatar: AJ

**Sample Goals:**
- Emergency Fund: $2,000 / $5,000 (40%)
- New Laptop: $800 / $1,500 (53%)
- Vacation Fund: $500 / $1,500 (33%)

## Application Features & Usage

### 1. Dashboard (Home Tab)
- View total savings: $2,300
- See active goals count: 3
- Track overall progress: 29%
- Quick access to primary goal

### 2. Goals Tab
- Browse all savings goals
- View progress bars and target amounts
- Add new goals (Coming soon)
- Edit existing goals (Coming soon)

### 3. Timeline Tab
- Visualize financial journey
- Track milestones and events
- Add new events with date, amount, and category
- Responsive card-based layout

### 4. Profile Tab
- View user information and statistics
- **Change Password**: Click "Change Password" to open modal
  - Enter current password
  - Enter new password (minimum 6 characters)
  - Confirm new password
  - Passwords must match to proceed
- Toggle notifications on/off
- Select preferred currency (USD, EUR, GBP)
- Access Help & Support
- View Privacy Policy and Terms of Service
- Logout functionality

## Known Limitations

### Current Implementation
- **No Backend Integration**: App uses local state management with mock data
- **No Persistent Storage**: Data resets when app is closed
- **Limited Goal Management**: Add/Edit goals shows placeholder alerts
- **No User Authentication**: Login/signup flow not implemented
- **Profile Editing**: Basic profile editing shows placeholder alert
- **Web View Limitations**: Some mobile gestures don't work in browser

### Future Enhancements
- Backend API integration for data persistence
- User authentication and multi-user support
- Full CRUD operations for goals
- Budget categories and expense tracking
- Push notifications for goal milestones
- Data export and reporting features

## Troubleshooting

### Issue: QR Code Won't Scan
**Solution**: Make sure your phone and computer are on the same WiFi network

### Issue: "Module not found" Error
**Solution**: 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Metro Bundler Error
**Solution**:
```bash
npx expo start -c
```
(The `-c` flag clears the cache)

### Issue: App Won't Load on Device
**Solution**: 
- Check firewall settings
- Ensure Expo Go is updated to latest version
- Try restarting the development server

### Issue: Styles Look Different on Web
**Solution**: Use physical device or simulator for accurate representation

## Project Structure

```
HCI-DP-4/
├── frontend/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx          # Dashboard/Home
│   │   │   ├── goals.tsx          # Goals Management
│   │   │   ├── timeline.tsx       # Financial Timeline
│   │   │   └── profile.tsx        # User Profile
│   │   ├── _layout.tsx            # Navigation Layout
│   │   └── +not-found.tsx         # 404 Page
│   ├── components/                 # Reusable Components
│   ├── constants/                  # Theme & Config
│   └── package.json               # Dependencies
└── README.md                      # This file
```

## Technology Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: StyleSheet API
- **Icons**: Expo Vector Icons
- **State Management**: React Hooks (useState)


## License

This is an academic project for educational purposes.

---

**Last Updated**: November 16, 2025
**Version**: 1.0.0
