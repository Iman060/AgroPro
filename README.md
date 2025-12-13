# 🌾 AgroPro İdarəetmə Sistemi (Smart Farm Management System)

A modern, comprehensive farm management system built with React that helps farmers efficiently manage their fields, crops, irrigation schedules, and agricultural notes from a single dashboard.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [Pages & Views](#pages--views)
- [Data Model](#data-model)
- [License](#license)

## 🎯 Overview

AgroPro is a logic-heavy, event-based farm management system designed to help farmers:

- **Track multiple fields and crop batches** with detailed history
- **Monitor crop health** using status history (not just current status)
- **Plan and track irrigation** as events (planned vs executed)
- **Keep detailed notes** (disease, fertilizer, observation, watering)
- **Visualize farm data** through dynamic dashboards with charts
- **Import external data** from JSON files with conflict resolution

The system follows real agricultural workflows and maintains complete audit trails for all operations.

## ✨ Features

### Core Functionality

- **Field & Crop Management**
  - Multiple fields per farmer
  - Crop batches as smallest manageable unit (same crop type, same field, same planting date)
  - Soft delete/archive functionality (archived entities remain in history)
  - Complete timestamp tracking (createdAt, updatedAt, archivedAt)

- **Status History System**
  - History-based status tracking (not a single status field)
  - Each status change includes: status value, date, changedBy, reason
  - Priority system for same-day status changes
  - Current status = most recent entry with priority resolution

- **Event-Based Irrigation**
  - Irrigation treated as events (planned vs executed)
  - Delay calculation: 0-1 days late → normal, 2-3 days late → overdue, 4+ days late → critical
  - Clear separation between planned and executed waterings
  - Automatic next watering date calculation

- **Notes & Logs**
  - Multiple note types: watering, disease, fertilizer, observation
  - Tags for filtering
  - Optional event linking
  - Soft delete support (notes remain in audit history)

- **Dynamic Dashboard**
  - All metrics calculated from active data (no hardcoded values)
  - Real-time statistics: active crop batches, overdue irrigation, critical status
  - Crop count grouped by field
  - Interactive charts (bar charts, donut charts)
  - Trend analysis ready

- **JSON Data Import**
  - Import daily data from JSON files
  - Conflict resolution: won't overwrite existing status/notes for same date
  - Duplicate detection
  - Inconsistency logging
  - Complete audit trail

### UI/UX Features

- **Modern Dark Theme** - Beautiful dark mode interface
- **Responsive Design** - Works on all devices
- **Interactive Charts** - ApexCharts integration for data visualization
- **Smooth Animations** - Transitions and hover effects
- **Azerbaijani Language** - Fully translated interface
- **Toast Notifications** - User feedback for actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crovex
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
crovex/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AddIrrigationModal.jsx
│   │   ├── AddNoteModal.jsx
│   │   ├── AddStatusChangeModal.jsx
│   │   └── JsonImport.jsx
│   ├── data/                # Mock data
│   │   └── mockData.js
│   ├── layout/              # Layout components
│   │   ├── MainLayout.jsx
│   │   └── PublicLayout.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── FieldsPage.jsx
│   │   ├── FieldDetail.jsx
│   │   ├── CropBatchDetail.jsx
│   │   ├── LandingPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── ProfilePage.jsx
│   ├── route/               # Routing configuration
│   │   └── index.jsx
│   ├── store/               # Redux store
│   │   ├── store.js
│   │   └── themeSlice.js
│   ├── utils/               # Utility functions
│   │   ├── calculations.js
│   │   └── walletFilter.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

## 🔑 Key Concepts

### Data Modeling

- **Fields**: Top-level entity representing a physical field
- **Crop Batches**: Smallest manageable unit (same crop type, same field, same planting date)
- **Status History**: Array of status events, not a single status field
- **Irrigation Events**: Event-based system with planned/executed types
- **Notes**: Contextual notes that can link to events

### Soft Delete

All entities support soft delete:
- `archived: true/false`
- `archivedAt: timestamp`
- Archived entities remain in history but excluded from active views

### Derived State

Dashboard metrics are calculated dynamically:
- No hardcoded values
- Based on active (non-archived) entities
- Derived from status history and irrigation events
- Updates when filters are applied

### Event-Based Architecture

- Status changes are events in history
- Irrigation is event-based (planned vs executed)
- Notes can link to events
- Complete audit trail maintained

## 📄 Pages & Views

### Public Pages

- **Landing Page** (`/`) - Marketing homepage with features and CTA
- **About Page** (`/about`) - Information about the system
- **Contact Page** (`/contact`) - Contact form and information

### App Pages

- **Profile Page** (`/profile`) - User profile and quick access to farm management
- **Dashboard** (`/dashboard`) - Overview with statistics and charts
- **Fields Page** (`/fields`) - List of all active fields
- **Field Detail** (`/fields/:fieldId`) - Crop batches in a specific field
- **Crop Batch Detail** (`/crop-batches/:batchId`) - Detailed view with history, irrigation, and notes

## 🗄️ Data Model

### Field
```javascript
{
  id: string,
  name: string,
  archived: boolean,
  archivedAt: string | null,
  createdAt: string,
  updatedAt: string,
  ownerWallet: string
}
```

### Crop Batch
```javascript
{
  id: string,
  fieldId: string,
  cropType: string,
  plantedDate: string,
  archived: boolean,
  archivedAt: string | null,
  createdAt: string,
  updatedAt: string,
  ownerWallet: string
}
```

### Status History Entry
```javascript
{
  id: string,
  cropBatchId: string,
  status: 'healthy' | 'risk' | 'sick' | 'critical',
  date: string,
  changedBy: 'farmer' | 'system' | 'import',
  reason: string,
  createdAt: string,
  updatedAt: string,
  ownerWallet: string
}
```

### Irrigation Event
```javascript
{
  id: string,
  cropBatchId: string,
  type: 'planned' | 'executed',
  plannedDate: string,
  executedDate: string | null,
  createdAt: string,
  ownerWallet: string
}
```

### Note
```javascript
{
  id: string,
  cropBatchId: string,
  type: 'watering' | 'disease' | 'fertilizer' | 'observation',
  text: string,
  date: string,
  tags: string[],
  linkedEventId: string | null,
  archived: boolean,
  archivedAt: string | null,
  createdAt: string,
  updatedAt: string,
  ownerWallet: string
}
```

## 🎨 Design Principles

- **History-Based**: Status is stored as history, not a single field
- **Event-Driven**: Irrigation and status changes are events
- **Soft Delete**: All deletions are soft (archived, not removed)
- **Derived State**: Dashboard calculations are dynamic
- **Audit Trail**: Complete history maintained for all operations

## 📝 License

This project is private and proprietary.

---

**Built with ❤️ for modern agriculture management**
