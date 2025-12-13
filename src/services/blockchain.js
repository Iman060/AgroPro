// Simulated service for async data operations
// In a real app, this would interact with a backend API

export const simulateTransaction = async (action, data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simulate transaction hash
  const txHash = '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  return {
    success: true,
    txHash,
    action,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const saveIrrigationEvent = async (data) => {
  return await simulateTransaction('addIrrigationEvent', data);
};

export const saveStatusChange = async (data) => {
  return await simulateTransaction('addStatusChange', data);
};

export const saveNote = async (data) => {
  return await simulateTransaction('addNote', data);
};
