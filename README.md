# Koin Expenses

A mobile expense tracking application built using **React Native, Expo, and TypeScript** as part of the Koin Software Engineering Intern take-home assessment.

The application provides an expense dashboard and a receipt review experience where users can select receipt images, edit expense details, manage individual line items, and automatically recalculate the total before saving an expense.

---

## Demo & Testing

### Demo Videos

Screen recordings demonstrating the application on both platforms:

- **iOS Demo:** (https://drive.google.com/file/d/1g-3KEFxXZffB7cmu5UCjGm9DdEI45iFO/view?usp=sharing)
- **Android Demo:** (https://drive.google.com/file/d/12FhuywrSiL5cKqxEk2dqL8VEGsnbHabH/view?usp=sharing)

### Application Preview

- **Expo EAS Update:** (https://expo.dev/accounts/mathusa/projects/koin-expenses/updates/1b21c39d-09c3-4422-bcec-55971d3f0380)
- **Android APK:** (https://expo.dev/accounts/mathusa/projects/koin-expenses/builds/c6be07cb-db57-4656-8e31-8ddc7b25cf00)
- **iOS Testing:** https://c-mathusa-q27n68-mwv6o33elq796w71.on.expo.app

- **Expo Go Testing (iOS & Android)**

Scan the QR code below using Expo Go to test Koin Expenses on Android or iOS.

![Koin Expenses Expo Go QR Code](./assets/expo-qr-code.png)

Testing instructions:

1. Install Expo Go from the Google Play Store or Apple App Store.

2. Make sure the developer's computer is connected to the internet.

3. Start the development server using npx expo start --tunnel.

4. Scan the QR code using your mobile device.

5. Open Koin Expenses in Expo Go.

Note: The development server must remain running while testing.

> Note: The Expo Go development server requires the developer's computer to remain running. For independent testing, use the distributed application builds or a compatible installed Expo Go build with the published EAS Update.

---

## Features

### Expenses Dashboard

- Displays recent expenses.
- Shows merchant names, dates, categories, and expense amounts.
- Provides a receipt scanning entry point.
- Supports selecting receipt images from the camera or gallery.

### Receipt Review

- Displays the selected receipt image when available.
- Allows editing the merchant name.
- Allows editing the expense date.
- Supports expense category selection.
- Allows users to add and remove expense line items.
- Allows editing individual item names and prices.
- Automatically recalculates the total whenever item prices change.

### Input Validation

- Merchant name is required.
- Item names are required.
- Item prices must be valid, non-negative numbers.
- Expenses with an invalid or zero total cannot be saved.

### Expense Management

- Saves reviewed expenses to the expense list.
- Displays newly added expenses in recent activity.
- Uses shared application state through React Context.

---

## Technology Stack

React Native - Cross-platform mobile application development
Expo - Development and application tooling TypeScript - Type safety  
Expo Router - File-based navigation  
React Context API - Shared expense state management  
React Hooks - Component state and application logic  
Expo Image Picker - Camera and gallery image selection  
EAS Update - Publishing application updates  
EAS Build - Cloud application builds

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- Visual Studio Code (recommended)
- Expo Go on an Android or iOS device

### 1. Clone the repository

```bash
git clone https://github.com/mathuthev6/Koin_Expense.git
```

### 2. Navigate to the project directory

```bash
cd Koin_Expense
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npx expo start
```

To start using a tunnel connection:

```bash
npx expo start --tunnel
```

### 5. Run on a mobile device

- Install Expo Go from the Google Play Store or Apple App Store.
- Start the Expo development server.
- Scan the QR code using your device.
- The application will open in Expo Go.

---

## Project Structure

```text
koin-expenses/
│
├── assets/
│
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── review.tsx
│   │   └── explore.tsx
│   │
│   ├── components/
│   │
│   ├── constants/
│   │
│   ├── context/
│   │   └── ExpensesContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │   └── expense.ts
│   │
│   └── global.css
│
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

### Directory Responsibilities

- `src/app/` – Application screens and navigation.
- `src/components/` – Reusable UI components.
- `src/context/` – Shared expense state and context provider.
- `src/types/` – TypeScript type definitions.
- `src/hooks/` – Custom React hooks.
- `src/constants/` – Application constants.
- `assets/` – Static assets such as images and icons.

---

## Architecture & Technical Decisions

### 1. Component-Based Architecture

The application uses React Native components to organize the interface into manageable and reusable sections.

Expo Router provides file-based navigation between the Expenses dashboard and Receipt Review screen.

### 2. State Management

React Context API is used to manage shared expense data.

The `ExpensesProvider` makes expense information available across application screens.

The `useExpenses` custom hook provides access to the shared expense state and the function used to add new expenses.

### 3. TypeScript

TypeScript is used to define the application's data structures and improve type safety.

The expense data model includes:

- Expense ID
- Merchant
- Date
- Category
- Expense items
- Total amount
- Creation date

Individual expense items contain an ID, name, and price.

### 4. Automatic Total Calculation

Expense totals are calculated from the individual line item prices.

Prices are converted into integer cents for calculation to reduce floating-point precision issues.

Whenever a user edits, adds, or removes an item, the total is recalculated.

### 5. Input Validation

Validation is performed before saving an expense.

This prevents incomplete or invalid expense information from being added to the expense list.

---

## AI Tooling & Development Workflow

AI-assisted development tools were used during the development process to improve productivity, support implementation, and troubleshoot issues.

### Tools Used

**ChatGPT**

ChatGPT was used as an AI development assistant throughout the project.

Key use cases included:

- Understanding the assignment requirements and breaking them into smaller development tasks.
- Helping structure the application screens and navigation.
- Troubleshooting TypeScript and import-related issues.
- Reviewing implementation logic and identifying potential improvements.

### AI-Assisted Workflow

The development process followed an iterative approach:

1. Break the requirements into individual features.
2. Implement each feature with AI assistance.
3. Integrate the implementation into the project.
4. Run the application and test it on a physical Android device.
5. Test the application on a physical iPhone.
6. Identify and resolve issues through debugging.
7. Verify the final user flow on both platforms.

### Human Verification

AI-generated suggestions and code were not treated as automatically correct.

The application was manually tested on physical Android and iOS devices to verify navigation, image selection, editable line items, total recalculation, validation, and expense saving.

AI tools were used to accelerate development, while implementation decisions and testing were reviewed throughout the process.

---

## Current Implementation Notes & Limitations

- Receipt image selection is implemented using Expo Image Picker.
- Automatic receipt text recognition (OCR) is not implemented.
- The receipt review screen currently uses sample line items rather than automatically extracting information from the selected receipt.
- Expense state is currently managed in memory using React Context.
- Expense data is not persisted across application restarts.
- No external API or backend service is currently required.

These are known limitations of the current assessment implementation.

---

## Environment Configuration

This project currently does not require external API keys or environment variables.

Therefore, an `.env.example` file is not required.

If an external API is introduced in the future, environment configuration can be added as needed.

---

## Running the Project

Start the development server:

```bash
npx expo start
```

Create an Android preview build:

```bash
npx eas-cli build --platform android --profile preview
```

Create an iOS preview build:

```bash
npx eas-cli build --platform ios --profile preview
```

Publish an application update:

```bash
npx eas-cli update --channel preview --message "Assessment preview"
```

For iOS distribution, Apple Developer account requirements and distribution configuration may apply.

---

## Author

Developed as part of the Koin Software Engineering Intern take-home assessment.

**Project:** Koin Expenses  
**Framework:** React Native + Expo  
**Language:** TypeScript

---
