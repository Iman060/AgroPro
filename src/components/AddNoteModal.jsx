import { useState } from 'react';
import { mockIrrigationEvents, mockStatusHistory } from '../data/mockData';

const NOTE_TYPES = [
  { value: 'watering', label: 'Suvarma' },
  { value: 'disease', label: 'Xəstəlik' },
  { value: 'fertilizer', label: 'Gübrə' },
  { value: 'observation', label: 'Müşahidə' },
];

function AddNoteModal({ cropBatchId, onClose, onSave, isSaving = false }) {
  const [type, setType] = useState('observation');
  const [text, setText] = useState('');
  const [linkedEventId, setLinkedEventId] = useState('');

  // Get available events for this crop batch
  const irrigationEvents = mockIrrigationEvents.filter(e => e.cropBatchId === cropBatchId);
  const statusHistory = mockStatusHistory.filter(s => s.cropBatchId === cropBatchId);
  
  const availableEvents = [
    ...irrigationEvents.map(e => ({
      id: e.id,
      type: 'irrigation',
      label: `${e.type === 'planned' ? 'Planlaşdırılmış' : 'Həyata keçirilmiş'} suvarma - ${new Date(e.date).toLocaleDateString('az-AZ')}`
    })),
    ...statusHistory.map(s => ({
      id: s.id,
      type: 'status',
      label: `Status: ${s.status} - ${new Date(s.date).toLocaleDateString('az-AZ')}`
    })),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      cropBatchId,
      type,
      text,
      date: new Date().toISOString().split('T')[0],
      linkedEventId: linkedEventId || null,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Qeyd Əlavə Et</h2>
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none transition-colors duration-300"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="note-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qeyd Növü
            </label>
            <select
              id="note-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            >
              {NOTE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="note-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qeyd Mətni
            </label>
            <textarea
              id="note-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
              required
              rows="4"
            />
          </div>
          
          <div>
            <label htmlFor="linked-event" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hadisə ilə bağla (İstəyə bağlı)
            </label>
            <select
              id="linked-event"
              value={linkedEventId}
              onChange={(e) => setLinkedEventId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Yoxdur</option>
              {availableEvents.map(event => (
                <option key={event.id} value={event.id}>{event.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
                isSaving
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isSaving ? 'Yazılır...' : 'Saxla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoteModal;
