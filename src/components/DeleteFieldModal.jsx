import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

function DeleteFieldModal({ field, onClose, onDelete, isDeleting = false }) {
  const [confirmText, setConfirmText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmText === field.name) {
      await onDelete();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1c2e17] border border-white/5 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Sahəni Sil</h2>
          </div>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm font-medium mb-2">
              ⚠️ Diqqət: Bu əməliyyat geri alına bilməz
            </p>
            <p className="text-gray-300 text-sm">
              "{field.name}" sahəsi silinəcək və arxivlənmiş sahələr bölməsinə köçürüləcək. 
              Sahə ilə əlaqəli bütün məlumatlar (məhsul partiyaları, suvarma planları, qeydlər) 
              qorunacaq, lakin sahə aktiv siyahıdan çıxacaq.
            </p>
          </div>

          <div>
            <label htmlFor="confirm-text" className="block text-sm font-medium text-gray-300 mb-2">
              Təsdiqləmək üçün sahə adını daxil edin: <span className="font-bold text-white">{field.name}</span>
            </label>
            <input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 border border-white/5 rounded-lg bg-[#142210] text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
              placeholder={field.name}
              required
              disabled={isDeleting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-[#24381e] hover:bg-[#1c2e17] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              disabled={confirmText !== field.name || isDeleting}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
            >
              {isDeleting ? 'Silinir...' : 'Sahəni Sil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteFieldModal;

