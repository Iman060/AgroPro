import { useNavigate } from 'react-router-dom';
import { mockFields, mockCropBatches } from '../data/mockData';
import { getActiveCropBatchesForField, getActiveFields } from '../utils/calculations';

function FieldsPage() {
  const navigate = useNavigate();
  const activeFields = getActiveFields(mockFields);

  const handleFieldClick = (fieldId) => {
    navigate(`/fields?fieldId=${fieldId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sahələr</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeFields.map(field => {
          const batchCount = getActiveCropBatchesForField(field.id, mockCropBatches).length;
          
          return (
            <div
              key={field.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
              onClick={() => handleFieldClick(field.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{field.name}</h3>
                {field.archived && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">Arxivlənmiş</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {batchCount} aktiv məhsul partiyası
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FieldsPage;
