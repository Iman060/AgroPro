import { getCurrentDate, STATUS_PRIORITY } from '../data/mockData';

// Get current status for a crop batch (most recent status entry, considering priority)
export const getCurrentStatus = (cropBatchId, statusHistory) => {
  const batchStatuses = statusHistory
    .filter(s => s.cropBatchId === cropBatchId && !s.archived)
    .sort((a, b) => {
      // First sort by date (most recent first)
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      
      // If same date, sort by priority (higher priority first)
      const priorityA = STATUS_PRIORITY[a.status] || 0;
      const priorityB = STATUS_PRIORITY[b.status] || 0;
      return priorityB - priorityA;
    });
  
  return batchStatuses.length > 0 ? batchStatuses[0] : null;
};

// Calculate irrigation delay level
// Returns: 'normal' | 'overdue' | 'critical'
export const getIrrigationDelayLevel = (plannedDate) => {
  const currentDate = new Date(getCurrentDate());
  const planned = new Date(plannedDate);
  const diffTime = currentDate - planned;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If planned date is in the future, it's normal
  if (diffDays < 0) return 'normal';
  
  if (diffDays <= 1) return 'normal';
  if (diffDays <= 3) return 'overdue';
  return 'critical';
};

// Get irrigation state for a crop batch
export const getIrrigationState = (cropBatchId, irrigationEvents) => {
  const batchIrrigations = irrigationEvents
    .filter(e => e.cropBatchId === cropBatchId && !e.archived && e.type === 'planned' && !e.executedDate)
    .sort((a, b) => new Date(a.plannedDate) - new Date(b.plannedDate));
  
  if (batchIrrigations.length === 0) return 'normal';
  
  const oldestUnexecuted = batchIrrigations[0];
  return getIrrigationDelayLevel(oldestUnexecuted.plannedDate);
};

// Count active crop batches (non-archived)
export const countActiveCropBatches = (cropBatches) => {
  return cropBatches.filter(b => !b.archived && !b.archivedAt).length;
};

// Count crops with overdue irrigation
export const countOverdueIrrigation = (cropBatches, irrigationEvents) => {
  return cropBatches
    .filter(b => !b.archived && !b.archivedAt)
    .filter(b => {
      const state = getIrrigationState(b.id, irrigationEvents);
      return state === 'overdue' || state === 'critical';
    }).length;
};

// Count crops in critical status
export const countCriticalStatus = (cropBatches, statusHistory) => {
  return cropBatches
    .filter(b => !b.archived && !b.archivedAt)
    .filter(b => {
      const currentStatus = getCurrentStatus(b.id, statusHistory);
      return currentStatus && currentStatus.status === 'critical';
    }).length;
};

// Count crops grouped by field
export const countCropsByField = (fields, cropBatches) => {
  return fields
    .filter(f => !f.archived && !f.archivedAt)
    .map(field => ({
      fieldId: field.id,
      fieldName: field.name,
      count: cropBatches.filter(b => b.fieldId === field.id && !b.archived && !b.archivedAt).length,
    }));
};

// Get active crop batches for a field
export const getActiveCropBatchesForField = (fieldId, cropBatches) => {
  return cropBatches.filter(b => b.fieldId === fieldId && !b.archived && !b.archivedAt);
};

// Get status history for a crop batch (sorted chronologically)
export const getStatusHistoryForBatch = (cropBatchId, statusHistory) => {
  return statusHistory
    .filter(s => s.cropBatchId === cropBatchId && !s.archived && !s.archivedAt)
    .sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      // If same date, sort by priority
      const priorityA = STATUS_PRIORITY[a.status] || 0;
      const priorityB = STATUS_PRIORITY[b.status] || 0;
      return priorityB - priorityA;
    });
};

// Get irrigation events for a crop batch
export const getIrrigationEventsForBatch = (cropBatchId, irrigationEvents) => {
  return irrigationEvents
    .filter(e => e.cropBatchId === cropBatchId && !e.archived && !e.archivedAt)
    .sort((a, b) => {
      const dateA = a.executedDate || a.plannedDate;
      const dateB = b.executedDate || b.plannedDate;
      return new Date(dateB) - new Date(dateA);
    });
};

// Get notes for a crop batch (excluding archived)
export const getNotesForBatch = (cropBatchId, notes) => {
  return notes
    .filter(n => n.cropBatchId === cropBatchId && !n.archived && !n.archivedAt)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get notes grouped by type
export const groupNotesByType = (notes) => {
  const grouped = {
    watering: [],
    disease: [],
    fertilizer: [],
    observation: [],
  };
  
  notes.forEach(note => {
    if (grouped[note.type]) {
      grouped[note.type].push(note);
    }
  });
  
  return grouped;
};

// Calculate next watering date based on events
export const getNextWateringDate = (cropBatchId, irrigationEvents) => {
  const batchEvents = irrigationEvents
    .filter(e => e.cropBatchId === cropBatchId && !e.archived && !e.archivedAt)
    .sort((a, b) => {
      const dateA = a.executedDate || a.plannedDate;
      const dateB = b.executedDate || b.plannedDate;
      return new Date(dateB) - new Date(dateA);
    });
  
  if (batchEvents.length === 0) return null;
  
  const lastEvent = batchEvents[0];
  const lastDate = lastEvent.executedDate || lastEvent.plannedDate;
  
  // Assume 7 days between waterings (can be made configurable)
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 7);
  
  return nextDate.toISOString().split('T')[0];
};

// Get active fields only
export const getActiveFields = (fields) => {
  return fields.filter(f => !f.archived && !f.archivedAt);
};

// Get active crop batches only
export const getActiveCropBatches = (cropBatches) => {
  return cropBatches.filter(b => !b.archived && !b.archivedAt);
};
