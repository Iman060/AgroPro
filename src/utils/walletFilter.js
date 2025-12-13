// Utility functions to filter data by wallet owner

export const filterByWallet = (items, walletAddress) => {
  if (!walletAddress) return [];
  return items.filter(item => 
    item.ownerWallet && 
    item.ownerWallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const getOwnedFields = (fields, walletAddress) => {
  return filterByWallet(fields, walletAddress);
};

export const getOwnedCropBatches = (cropBatches, fields, walletAddress) => {
  if (!walletAddress) return [];
  const ownedFieldIds = fields && fields.length > 0 
    ? getOwnedFields(fields, walletAddress).map(f => f.id)
    : [];
  return cropBatches.filter(batch => 
    (ownedFieldIds.length === 0 || ownedFieldIds.includes(batch.fieldId)) &&
    batch.ownerWallet &&
    batch.ownerWallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const getOwnedStatusHistory = (statusHistory, cropBatches, walletAddress) => {
  if (!walletAddress) return [];
  const ownedBatchIds = getOwnedCropBatches(
    cropBatches, 
    [], // fields not needed here
    walletAddress
  ).map(b => b.id);
  
  return statusHistory.filter(status => 
    ownedBatchIds.includes(status.cropBatchId) &&
    status.ownerWallet &&
    status.ownerWallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const getOwnedIrrigationEvents = (irrigationEvents, cropBatches, walletAddress) => {
  if (!walletAddress) return [];
  const ownedBatchIds = getOwnedCropBatches(
    cropBatches,
    [],
    walletAddress
  ).map(b => b.id);
  
  return irrigationEvents.filter(event =>
    ownedBatchIds.includes(event.cropBatchId) &&
    event.ownerWallet &&
    event.ownerWallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const getOwnedNotes = (notes, cropBatches, walletAddress) => {
  if (!walletAddress) return [];
  const ownedBatchIds = getOwnedCropBatches(
    cropBatches,
    [],
    walletAddress
  ).map(b => b.id);
  
  return notes.filter(note =>
    ownedBatchIds.includes(note.cropBatchId) &&
    note.ownerWallet &&
    note.ownerWallet.toLowerCase() === walletAddress.toLowerCase()
  );
};

export const isOwner = (item, walletAddress) => {
  if (!walletAddress || !item) return false;
  return item.ownerWallet && 
    item.ownerWallet.toLowerCase() === walletAddress.toLowerCase();
};

