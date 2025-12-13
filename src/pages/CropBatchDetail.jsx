import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { mockCropBatches, mockStatusHistory, mockIrrigationEvents, mockNotes, mockFields } from '../data/mockData';
import {
  getCurrentStatus,
  getStatusHistoryForBatch,
  getIrrigationEventsForBatch,
  getNotesForBatch,
  groupNotesByType,
  getIrrigationDelayLevel,
  getActiveCropBatches,
  getActiveFields,
} from '../utils/calculations';
import AddStatusChangeModal from '../components/AddStatusChangeModal';
import AddIrrigationModal from '../components/AddIrrigationModal';
import AddNoteModal from '../components/AddNoteModal';
import { saveStatusChange, saveIrrigationEvent, saveNote } from '../services/blockchain';

function CropBatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const activeCropBatches = getActiveCropBatches(mockCropBatches);
  const activeFields = getActiveFields(mockFields);
  const batch = activeCropBatches.find(b => b.id === batchId);
  const field = batch ? activeFields.find(f => f.id === batch.fieldId) : null;
  const statusHistory = getStatusHistoryForBatch(batchId, mockStatusHistory);
  const irrigationEvents = getIrrigationEventsForBatch(batchId, mockIrrigationEvents);
  const notes = getNotesForBatch(batchId, mockNotes);
  const notesByType = groupNotesByType(notes);
  const currentStatus = getCurrentStatus(batchId, mockStatusHistory);

  const handleAddStatusChange = () => {
    setActiveModal('status');
  };

  const handleAddIrrigation = () => {
    setActiveModal('irrigation');
  };

  const handleAddNote = () => {
    setActiveModal('note');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSaveStatusChange = async (data) => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      await saveStatusChange(data);
      setSaveStatus({ type: 'success', message: `Status dəyişikliyi saxlanıldı!` });
      setTimeout(() => {
        setSaveStatus(null);
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Xəta: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveIrrigation = async (data) => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      await saveIrrigationEvent(data);
      setSaveStatus({ type: 'success', message: `Su vermə hadisəsi saxlanıldı!` });
      setTimeout(() => {
        setSaveStatus(null);
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Xəta: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNote = async (data) => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      await saveNote(data);
      setSaveStatus({ type: 'success', message: `Qeyd saxlanıldı!` });
      setTimeout(() => {
        setSaveStatus(null);
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Xəta: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!batch) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">Məhsul partiyası tapılmadı</p>
        <button
          onClick={() => navigate('/fields')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Sahələrə qayıt
        </button>
      </div>
    );
  }

  const handleBack = () => {
    if (field) {
      navigate(`/fields?fieldId=${field.id}`);
    } else {
      navigate('/fields');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      healthy: 'Sağlam',
      risk: 'Risk',
      sick: 'Xəstə',
      critical: 'Kritik',
    };
    return labels[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      healthy: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      risk: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      sick: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      critical: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };
    return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  const getNoteTypeLabel = (type) => {
    const labels = {
      watering: 'Suvarma',
      disease: 'Xəstəlik',
      fertilizer: 'Gübrə',
      observation: 'Müşahidə',
    };
    return labels[type] || type;
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            ← Geri
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {batch.cropType} - {field?.name}
          </h1>
        </div>

        {saveStatus && (
          <div className={`p-3 rounded-lg ${
            saveStatus.type === 'success' 
              ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
          }`}>
            {saveStatus.message}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Xülasə</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>Əkilmə tarixi:</strong> {new Date(batch.plantedDate).toLocaleDateString('az-AZ')}</p>
            <p className="flex items-center gap-2">
              <strong>Mövcud status:</strong>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(currentStatus?.status || 'unknown')}`}>
                {getStatusLabel(currentStatus?.status || 'unknown')}
              </span>
            </p>
            {currentStatus && (
              <p><strong>Status tarixi:</strong> {new Date(currentStatus.date).toLocaleDateString('az-AZ')}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Status Tarixçəsi</h2>
            <button
              onClick={handleAddStatusChange}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Status dəyişikliyi əlavə et
            </button>
          </div>
          <div className="relative pl-8 border-l-2 border-gray-300 dark:border-gray-600 space-y-6">
            {statusHistory.map((status, index) => (
              <div key={status.id} className="relative">
                <div className="absolute -left-11 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-800"></div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(status.status)}`}>
                      {getStatusLabel(status.status)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(status.date).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{status.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suvarma Hadisələri</h2>
            <button
              onClick={handleAddIrrigation}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Suvarma hadisəsi əlavə et
            </button>
          </div>
          <div className="space-y-3">
            {irrigationEvents.map(event => {
              const isOverdue = !event.executed && new Date(event.date) < new Date();
              const delayLevel = !event.executed ? getIrrigationDelayLevel(event.date) : null;
              const overdueClass = delayLevel === 'critical' ? 'border-red-500' : delayLevel === 'overdue' ? 'border-orange-500' : '';
              
              return (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    event.executed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : `bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 ${overdueClass}`
                  }`}
                >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${event.executedDate ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {event.executedDate ? <><Check size={16} className="inline mr-1" /> Həyata keçirilmiş</> : <><Circle size={16} className="inline mr-1" /> Planlaşdırılmış</>}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {event.executedDate 
                      ? `Həyata keçirildi: ${new Date(event.executedDate).toLocaleDateString('az-AZ')}`
                      : `Planlaşdırıldı: ${new Date(event.plannedDate).toLocaleDateString('az-AZ')}`
                    }
                  </span>
                </div>
                {isOverdue && (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                    {delayLevel === 'critical' ? 'Kritik' : 'Gecikmiş'} - {Math.floor((new Date() - new Date(event.plannedDate)) / (1000 * 60 * 60 * 24))} gün gecikmə
                  </span>
                )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Qeydlər</h2>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Qeyd əlavə et
            </button>
          </div>
          
          {Object.entries(notesByType).map(([type, typeNotes]) => {
            if (typeNotes.length === 0) return null;
            
            return (
              <div key={type} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {getNoteTypeLabel(type)}
                </h3>
                <div className="space-y-3">
                  {typeNotes.map(note => (
                    <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(note.date).toLocaleDateString('az-AZ')}
                        </span>
                        {note.linkedEventId && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            Hadisə ilə bağlı
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {notes.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 italic py-8">
              Hələ qeyd yoxdur
            </p>
          )}
        </div>
      </div>

      {activeModal === 'status' && (
        <AddStatusChangeModal
          cropBatchId={batchId}
          onClose={handleCloseModal}
          onSave={handleSaveStatusChange}
          isSaving={isSaving}
        />
      )}

      {activeModal === 'irrigation' && (
        <AddIrrigationModal
          cropBatchId={batchId}
          onClose={handleCloseModal}
          onSave={handleSaveIrrigation}
          isSaving={isSaving}
        />
      )}

      {activeModal === 'note' && (
        <AddNoteModal
          cropBatchId={batchId}
          onClose={handleCloseModal}
          onSave={handleSaveNote}
          isSaving={isSaving}
        />
      )}
    </>
  );
}

export default CropBatchDetail;
