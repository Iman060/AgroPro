// JSON Import Service for Smart Farm Data
// Handles conflict resolution and audit trails

import { getCurrentDate } from '../data/mockData';

// Import record structure from JSON
// {
//   date: "2024-03-10",
//   fieldName: "North Field",
//   cropType: "Wheat",
//   eventType: "watering" | "observation" | "problem",
//   noteText: "Optional note text"
// }

export const processImportRecord = (record, existingData) => {
  const { date, fieldName, cropType, eventType, noteText } = record;
  const errors = [];
  const warnings = [];
  const created = [];

  // Find matching field
  const field = existingData.fields.find(
    f => f.name === fieldName && !f.archived && !f.archivedAt
  );

  if (!field) {
    errors.push(`Field "${fieldName}" not found or archived`);
    return { errors, warnings, created };
  }

  // Find matching crop batch
  const cropBatch = existingData.cropBatches.find(
    b => b.fieldId === field.id && 
         b.cropType === cropType && 
         !b.archived && 
         !b.archivedAt
  );

  if (!cropBatch) {
    errors.push(`Crop batch "${cropType}" in field "${fieldName}" not found or archived`);
    return { errors, warnings, created };
  }

  // Process based on event type
  switch (eventType) {
    case 'watering':
      // Check if watering event already exists for this date
      const existingWatering = existingData.irrigationEvents.find(
        e => e.cropBatchId === cropBatch.id &&
             e.plannedDate === date &&
             !e.archived &&
             !e.archivedAt
      );

      if (!existingWatering) {
        const newEvent = {
          id: `irr-import-${Date.now()}-${Math.random()}`,
          cropBatchId: cropBatch.id,
          type: 'executed',
          plannedDate: date,
          executedDate: date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archivedAt: null,
          ownerWallet: cropBatch.ownerWallet,
        };
        created.push({ type: 'irrigationEvent', data: newEvent });
      } else {
        warnings.push(`Watering event for ${date} already exists - skipping`);
      }
      break;

    case 'problem':
      // Create status change if status doesn't exist for this date
      const existingStatus = existingData.statusHistory.find(
        s => s.cropBatchId === cropBatch.id &&
             s.date === date &&
             !s.archived &&
             !s.archivedAt
      );

      if (!existingStatus) {
        const newStatus = {
          id: `status-import-${Date.now()}-${Math.random()}`,
          cropBatchId: cropBatch.id,
          status: 'sick', // Default for problems
          date: date,
          changedBy: 'import',
          reason: noteText || 'Problem detected via import',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archivedAt: null,
          ownerWallet: cropBatch.ownerWallet,
        };
        created.push({ type: 'statusChange', data: newStatus });
      } else {
        warnings.push(`Status change for ${date} already exists - skipping`);
      }
      break;

    case 'observation':
      // Create note if text provided
      if (noteText) {
        const newNote = {
          id: `note-import-${Date.now()}-${Math.random()}`,
          cropBatchId: cropBatch.id,
          type: 'observation',
          text: noteText,
          date: date,
          tags: ['imported'],
          linkedEventId: null,
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archivedAt: null,
          ownerWallet: cropBatch.ownerWallet,
        };
        created.push({ type: 'note', data: newNote });
      }
      break;

    default:
      errors.push(`Unknown event type: ${eventType}`);
  }

  return { errors, warnings, created };
};

export const importJsonData = (jsonData, existingData) => {
  const results = {
    total: jsonData.length,
    processed: 0,
    created: [],
    errors: [],
    warnings: [],
    auditTrail: {
      importDate: new Date().toISOString(),
      source: 'json-import',
      records: [],
    },
  };

  jsonData.forEach((record, index) => {
    const result = processImportRecord(record, existingData);
    
    results.processed++;
    results.errors.push(...result.errors.map(e => `Record ${index + 1}: ${e}`));
    results.warnings.push(...result.warnings.map(w => `Record ${index + 1}: ${w}`));
    results.created.push(...result.created);

    // Add to audit trail
    results.auditTrail.records.push({
      recordIndex: index + 1,
      record: record,
      result: result,
      timestamp: new Date().toISOString(),
    });
  });

  return results;
};

// Validate import record structure
export const validateImportRecord = (record) => {
  const errors = [];
  
  if (!record.date) errors.push('Missing required field: date');
  if (!record.fieldName) errors.push('Missing required field: fieldName');
  if (!record.cropType) errors.push('Missing required field: cropType');
  if (!record.eventType) errors.push('Missing required field: eventType');
  
  const validEventTypes = ['watering', 'observation', 'problem'];
  if (record.eventType && !validEventTypes.includes(record.eventType)) {
    errors.push(`Invalid eventType: ${record.eventType}. Must be one of: ${validEventTypes.join(', ')}`);
  }
  
  // Validate date format
  if (record.date && !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
    errors.push(`Invalid date format: ${record.date}. Expected YYYY-MM-DD`);
  }
  
  return errors;
};

