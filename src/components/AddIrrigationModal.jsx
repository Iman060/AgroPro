import { useState } from 'react';

function AddIrrigationModal({ cropBatchId, onClose, onSave, isSaving = false }) {
  const [type, setType] = useState('planned');
  const [plannedDate, setPlannedDate] = useState(new Date().toISOString().split('T')[0]);
  const [executedDate, setExecutedDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      cropBatchId,
      type,
      plannedDate,
      executedDate: type === 'executed' ? (executedDate || plannedDate) : null,
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suvarma Hadisəsi Əlavə Et</h2>
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none transition-colors duration-300"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="irrigation-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Növ
            </label>
            <select
              id="irrigation-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            >
              <option value="planned">Planlaşdırılmış</option>
              <option value="executed">Həyata keçirilmiş</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="irrigation-planned-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Planlaşdırılmış Tarix
            </label>
            <input
              id="irrigation-planned-date"
              type="date"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          
          {type === 'executed' && (
            <div>
              <label htmlFor="irrigation-executed-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Həyata Keçirilmiş Tarix (Boş buraxılsa, planlaşdırılmış tarix istifadə olunacaq)
              </label>
              <input
                id="irrigation-executed-date"
                type="date"
                value={executedDate}
                onChange={(e) => setExecutedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          )}
          
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
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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

export default AddIrrigationModal;
