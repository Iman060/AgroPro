import { useState } from 'react';
import { importJsonData, validateImportRecord } from '../utils/importService';
import { mockFields, mockCropBatches, mockStatusHistory, mockIrrigationEvents, mockNotes } from '../data/mockData';

function JsonImport({ onImportComplete }) {
  const [jsonText, setJsonText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const handleImport = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      // Parse JSON
      const jsonData = JSON.parse(jsonText);

      // Validate it's an array
      if (!Array.isArray(jsonData)) {
        throw new Error('JSON must be an array of records');
      }

      // Validate each record
      const validationErrors = [];
      jsonData.forEach((record, index) => {
        const errors = validateImportRecord(record);
        if (errors.length > 0) {
          validationErrors.push(`Record ${index + 1}: ${errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        setResults({
          success: false,
          errors: validationErrors,
          warnings: [],
          created: [],
        });
        setIsProcessing(false);
        return;
      }

      // Process import
      const existingData = {
        fields: mockFields,
        cropBatches: mockCropBatches,
        statusHistory: mockStatusHistory,
        irrigationEvents: mockIrrigationEvents,
        notes: mockNotes,
      };

      const importResults = importJsonData(jsonData, existingData);

      setResults({
        success: importResults.errors.length === 0,
        total: importResults.total,
        processed: importResults.processed,
        created: importResults.created.length,
        errors: importResults.errors,
        warnings: importResults.warnings,
        auditTrail: importResults.auditTrail,
      });

      if (onImportComplete) {
        onImportComplete(importResults);
      }
    } catch (error) {
      setResults({
        success: false,
        errors: [`JSON parse error: ${error.message}`],
        warnings: [],
        created: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleJson = `[
  {
    "date": "2024-03-11",
    "fieldName": "North Field",
    "cropType": "Wheat",
    "eventType": "watering",
    "noteText": "Irrigation completed"
  },
  {
    "date": "2024-03-11",
    "fieldName": "South Field",
    "cropType": "Soybeans",
    "eventType": "observation",
    "noteText": "Crop growth looking good"
  }
]`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">JSON Məlumat İdxalı</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            JSON Məlumatı
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
            rows="10"
            placeholder="JSON məlumatını buraya yapışdırın..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={isProcessing || !jsonText.trim()}
            className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
              isProcessing || !jsonText.trim()
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'İşlənir...' : 'İdxal Et'}
          </button>
          <button
            onClick={() => setJsonText(exampleJson)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Nümunə Yüklə
          </button>
          <button
            onClick={() => {
              setJsonText('');
              setResults(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Təmizlə
          </button>
        </div>

        {results && (
          <div className={`p-4 rounded-lg ${
            results.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              results.success
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
            }`}>
              {results.success ? 'İdxal Uğurlu' : 'İdxal Xətası'}
            </h3>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                Ümumi: {results.total} | İşlənmiş: {results.processed} | Yaradılan: {results.created}
              </p>

              {results.errors.length > 0 && (
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Xətalar:</p>
                  <ul className="list-disc list-inside text-red-600 dark:text-red-400 space-y-1">
                    {results.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {results.warnings.length > 0 && (
                <div>
                  <p className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">Xəbərdarlıqlar:</p>
                  <ul className="list-disc list-inside text-yellow-600 dark:text-yellow-400 space-y-1">
                    {results.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonImport;

