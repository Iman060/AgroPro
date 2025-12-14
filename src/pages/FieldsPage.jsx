import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Trash2, X } from 'lucide-react';
import { mockFields, mockCropBatches } from '../data/mockData';
import { getActiveCropBatchesForField, getActiveFields } from '../utils/calculations';
import DeleteFieldModal from '../components/DeleteFieldModal';

function FieldsPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([...mockFields]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModalField, setDeleteModalField] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRefs = useRef({});

  const activeFields = fields.filter(f => !f.archived);
  const archivedFields = fields.filter(f => f.archived);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(menuRefs.current).forEach(([fieldId, ref]) => {
        if (ref && !ref.contains(event.target)) {
          setOpenMenuId(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldClick = (fieldId, e) => {
    // Don't navigate if clicking on the menu button
    if (e.target.closest('.menu-button') || e.target.closest('.menu-dropdown')) {
      return;
    }
    navigate(`/fields?fieldId=${fieldId}`);
  };

  const handleMenuClick = (fieldId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === fieldId ? null : fieldId);
  };

  const handleDeleteClick = (field, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteModalField(field);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalField) return;
    
    setIsDeleting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Archive the field
    setFields(prevFields => 
      prevFields.map(field => 
        field.id === deleteModalField.id
          ? { ...field, archived: true, archivedAt: new Date().toISOString() }
          : field
      )
    );
    
    setIsDeleting(false);
    setDeleteModalField(null);
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModalField(null);
    }
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-[#142210] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">Sahələr</h1>
      </div>
      
      {/* Active Fields Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Aktiv Sahələr</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFields.map(field => {
            const batchCount = getActiveCropBatchesForField(field.id, mockCropBatches).length;
            const isMenuOpen = openMenuId === field.id;
            
            return (
              <div
                key={field.id}
                className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-[#46ec13]/40 hover:shadow-lg relative group"
                onClick={(e) => handleFieldClick(field.id, e)}
              >
                {/* 3-dot Menu Button */}
                <div className="absolute top-4 right-4">
                  <button
                    className="menu-button p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    onClick={(e) => handleMenuClick(field.id, e)}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      ref={el => menuRefs.current[field.id] = el}
                      className="menu-dropdown absolute right-0 top-10 bg-[#24381e] border border-white/10 rounded-lg shadow-xl z-50 min-w-[160px] overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleDeleteClick(field, e)}
                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        <span>Sahəni Sil</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{field.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {batchCount} aktiv məhsul partiyası
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activeFields.length === 0 && (
          <div className="bg-[#1c2e17] border border-white/5 rounded-2xl p-8 text-center text-gray-400">
            Aktiv sahə yoxdur
          </div>
        )}
      </section>

      {/* Deleted/Archived Fields Section */}
      {archivedFields.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Silinmiş Sahələr</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedFields.map(field => {
              const batchCount = getActiveCropBatchesForField(field.id, mockCropBatches).length;
              
              return (
                <div
                  key={field.id}
                  className="bg-[#1c2e17] border border-white/5 rounded-2xl p-6 opacity-60"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{field.name}</h3>
                      <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-500/30">
                        Arxivlənmiş
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {batchCount} məhsul partiyası
                    </p>
                    {field.archivedAt && (
                      <p className="text-gray-500 text-xs">
                        Silinmə tarixi: {new Date(field.archivedAt).toLocaleDateString('az-AZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Delete Modal */}
      {deleteModalField && (
        <DeleteFieldModal
          field={deleteModalField}
          onClose={handleCloseModal}
          onDelete={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default FieldsPage;
