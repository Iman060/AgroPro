// Smart Farm Notes & Monitoring System - Mock Data
// Proper data modeling with timestamps and soft delete

// Status priority order (higher number = higher priority)
export const STATUS_PRIORITY = {
  healthy: 1,
  risk: 2,
  sick: 3,
  critical: 4,
};

// Helper to get current timestamp
const getTimestamp = () => new Date().toISOString();

// Helper to create entity with timestamps
const createEntity = (data) => ({
  ...data,
  createdAt: data.createdAt || getTimestamp(),
  updatedAt: data.updatedAt || getTimestamp(),
  archivedAt: data.archivedAt || null,
});

export const mockFields = [
  createEntity({
    id: 'field-1',
    name: 'North Field',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'field-2',
    name: 'South Field',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'field-3',
    name: 'East Field',
    archived: false,
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
  createEntity({
    id: 'field-4',
    name: 'West Field',
    archived: true,
    archivedAt: '2024-01-15T10:00:00Z',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
];

export const mockCropBatches = [
  createEntity({
    id: 'batch-1',
    fieldId: 'field-1',
    cropType: 'Wheat',
    plantedDate: '2024-01-15',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'batch-2',
    fieldId: 'field-1',
    cropType: 'Corn',
    plantedDate: '2024-02-10',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'batch-3',
    fieldId: 'field-2',
    cropType: 'Soybeans',
    plantedDate: '2024-01-20',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'batch-4',
    fieldId: 'field-2',
    cropType: 'Wheat',
    plantedDate: '2024-03-05',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'batch-5',
    fieldId: 'field-3',
    cropType: 'Barley',
    plantedDate: '2024-02-25',
    archived: false,
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
  createEntity({
    id: 'batch-6',
    fieldId: 'field-4',
    cropType: 'Oats',
    plantedDate: '2023-11-10',
    archived: true,
    archivedAt: '2024-01-10T10:00:00Z',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
];

// Status history - each entry is an event
export const mockStatusHistory = [
  createEntity({
    id: 'status-1',
    cropBatchId: 'batch-1',
    status: 'healthy',
    date: '2024-01-15',
    changedBy: 'system',
    reason: 'Seeds planted',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-2',
    cropBatchId: 'batch-1',
    status: 'healthy',
    date: '2024-01-22',
    changedBy: 'farmer',
    reason: 'First sprouts observed',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-3',
    cropBatchId: 'batch-1',
    status: 'risk',
    date: '2024-02-05',
    changedBy: 'farmer',
    reason: 'Minor pest activity detected',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-4',
    cropBatchId: 'batch-1',
    status: 'critical',
    date: '2024-02-20',
    changedBy: 'farmer',
    reason: 'Pest infestation detected - immediate action required',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-5',
    cropBatchId: 'batch-2',
    status: 'healthy',
    date: '2024-02-10',
    changedBy: 'system',
    reason: 'Seeds planted',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-6',
    cropBatchId: 'batch-2',
    status: 'healthy',
    date: '2024-02-17',
    changedBy: 'farmer',
    reason: 'Germination started',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-7',
    cropBatchId: 'batch-2',
    status: 'healthy',
    date: '2024-03-01',
    changedBy: 'farmer',
    reason: 'Normal growth',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-8',
    cropBatchId: 'batch-3',
    status: 'healthy',
    date: '2024-01-20',
    changedBy: 'system',
    reason: 'Seeds planted',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-9',
    cropBatchId: 'batch-3',
    status: 'healthy',
    date: '2024-01-27',
    changedBy: 'farmer',
    reason: 'Germination observed',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-10',
    cropBatchId: 'batch-3',
    status: 'risk',
    date: '2024-02-10',
    changedBy: 'farmer',
    reason: 'Weather concerns',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-11',
    cropBatchId: 'batch-4',
    status: 'healthy',
    date: '2024-03-05',
    changedBy: 'system',
    reason: 'Seeds planted',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-12',
    cropBatchId: 'batch-4',
    status: 'healthy',
    date: '2024-03-12',
    changedBy: 'farmer',
    reason: 'Germination started',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'status-13',
    cropBatchId: 'batch-5',
    status: 'healthy',
    date: '2024-02-25',
    changedBy: 'system',
    reason: 'Seeds planted',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
  createEntity({
    id: 'status-14',
    cropBatchId: 'batch-5',
    status: 'sick',
    date: '2024-03-03',
    changedBy: 'farmer',
    reason: 'Disease symptoms observed',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
  createEntity({
    id: 'status-15',
    cropBatchId: 'batch-5',
    status: 'critical',
    date: '2024-03-15',
    changedBy: 'farmer',
    reason: 'Disease outbreak - treatment applied',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
];

// Watering events - event-based system
export const mockIrrigationEvents = [
  createEntity({
    id: 'irr-1',
    cropBatchId: 'batch-1',
    type: 'planned',
    plannedDate: '2024-02-18',
    executedDate: null,
    createdAt: '2024-02-15T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-2',
    cropBatchId: 'batch-1',
    type: 'executed',
    plannedDate: '2024-02-19',
    executedDate: '2024-02-19',
    createdAt: '2024-02-19T08:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-3',
    cropBatchId: 'batch-1',
    type: 'planned',
    plannedDate: '2024-03-05', // Overdue (today is 2024-03-10, so 5 days late)
    executedDate: null,
    createdAt: '2024-03-01T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-4',
    cropBatchId: 'batch-2',
    type: 'planned',
    plannedDate: '2024-03-08', // Overdue (2 days late)
    executedDate: null,
    createdAt: '2024-03-05T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-5',
    cropBatchId: 'batch-2',
    type: 'executed',
    plannedDate: '2024-02-25',
    executedDate: '2024-02-25',
    createdAt: '2024-02-25T08:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-6',
    cropBatchId: 'batch-3',
    type: 'planned',
    plannedDate: '2024-03-12', // Future
    executedDate: null,
    createdAt: '2024-03-10T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-7',
    cropBatchId: 'batch-3',
    type: 'executed',
    plannedDate: '2024-02-15',
    executedDate: '2024-02-15',
    createdAt: '2024-02-15T08:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-8',
    cropBatchId: 'batch-4',
    type: 'planned',
    plannedDate: '2024-03-06', // Critical (4 days late)
    executedDate: null,
    createdAt: '2024-03-05T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'irr-9',
    cropBatchId: 'batch-5',
    type: 'planned',
    plannedDate: '2024-03-09', // Overdue (1 day late, but let's make it 3 days for overdue)
    executedDate: null,
    createdAt: '2024-03-07T10:00:00Z',
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
];

// Notes - with soft delete support
export const mockNotes = [
  createEntity({
    id: 'note-1',
    cropBatchId: 'batch-1',
    type: 'disease',
    text: 'Found aphids on lower leaves. Applied organic pesticide.',
    date: '2024-02-20',
    tags: ['pest', 'treatment'],
    linkedEventId: 'status-4',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-2',
    cropBatchId: 'batch-1',
    type: 'watering',
    text: 'Irrigation completed successfully. Soil moisture optimal.',
    date: '2024-02-19',
    tags: ['irrigation'],
    linkedEventId: 'irr-2',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-3',
    cropBatchId: 'batch-1',
    type: 'observation',
    text: 'Weather conditions favorable. No immediate concerns.',
    date: '2024-02-25',
    tags: ['weather'],
    linkedEventId: null,
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-4',
    cropBatchId: 'batch-2',
    type: 'fertilizer',
    text: 'Applied nitrogen fertilizer as scheduled.',
    date: '2024-03-02',
    tags: ['fertilizer', 'scheduled'],
    linkedEventId: null,
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-5',
    cropBatchId: 'batch-2',
    type: 'watering',
    text: 'Irrigation system working well.',
    date: '2024-02-25',
    tags: ['irrigation'],
    linkedEventId: 'irr-5',
    archived: false,
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-6',
    cropBatchId: 'batch-3',
    type: 'observation',
    text: 'Crop growth is on track.',
    date: '2024-02-20',
    tags: ['growth'],
    linkedEventId: null,
    archived: true,
    archivedAt: '2024-02-21T10:00:00Z',
    ownerWallet: '0x1234567890123456789012345678901234567890',
  }),
  createEntity({
    id: 'note-7',
    cropBatchId: 'batch-5',
    type: 'disease',
    text: 'Fungal infection detected. Treatment applied.',
    date: '2024-03-15',
    tags: ['disease', 'treatment'],
    linkedEventId: 'status-15',
    archived: false,
    ownerWallet: '0x0987654321098765432109876543210987654321',
  }),
];

// Import audit trail
export const mockImportHistory = [];

// Helper function to get current date (for calculations)
export const getCurrentDate = () => {
  return '2024-03-10'; // Mock current date
};
