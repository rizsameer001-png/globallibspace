import { useState, useEffect } from 'react';
import api from '../../utils/api';
import CloudinaryUploader from '../../components/ui/CloudinaryUploader';
import { getImageUrl, imgOnError } from '../../utils/image';
import toast from 'react-hot-toast';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function ManageSettings() {
  const [settings, setSettings] = useState({
    siteName:'My Library', tagline:'', logo:'', logoPublicId:'',
    currency:'USD', contactEmail:'', issueDays:14, reserveDays:3,
    maxBooksPerMember:5, primaryColor:'#2563eb',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(()=>{
    api.get('/cms/settings').then(({data})=>{ if(data.settings) setSettings(s=>({...s,...data.settings})); })
      .catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const set = (k,v) => setSettings(s=>({...s,[k]:v}));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put('/cms/settings', settings);
      toast.success('Settings saved!');
    } catch(err){ toast.error(err.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"/></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <Cog6ToothIcon className="h-6 w-6 text-primary-600"/><span>System Settings</span>
      </h1>
      <form onSubmit={handleSave} className="space-y-6">

        {/* Logo */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Site Logo</h2>
          <CloudinaryUploader
            folder="lms/settings"
            resourceType="image"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            multiple={false}
            showUrlInput
            currentUrl={settings.logo}
            onRemove={()=>set('logo','')}
            onUploaded={results=>{
              set('logo', results[0].secureUrl);
              set('logoPublicId', results[0].publicId||'');
            }}
          />
          {settings.logo && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl flex items-center space-x-3">
              <img src={getImageUrl(settings.logo)} alt="Logo preview"
                className="h-12 object-contain rounded" onError={imgOnError}/>
              <div>
                <p className="text-xs font-medium text-gray-700">Current Logo</p>
                <p className="text-xs text-gray-400 truncate max-w-xs">{settings.logo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Site info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Site Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Site Name</label>
              <input className="input" value={settings.siteName} onChange={e=>set('siteName',e.target.value)}/>
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={settings.tagline} onChange={e=>set('tagline',e.target.value)}/>
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input type="email" className="input" value={settings.contactEmail} onChange={e=>set('contactEmail',e.target.value)}/>
            </div>
            <div>
              <label className="label">Currency</label>
              <select className="input" value={settings.currency} onChange={e=>set('currency',e.target.value)}>
                {['USD','EUR','GBP','INR','PKR','AED','SAR'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Circulation */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Circulation Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Issue Days</label>
              <input type="number" className="input" value={settings.issueDays} onChange={e=>set('issueDays',parseInt(e.target.value)||14)}/>
            </div>
            <div>
              <label className="label">Reserve Days</label>
              <input type="number" className="input" value={settings.reserveDays} onChange={e=>set('reserveDays',parseInt(e.target.value)||3)}/>
            </div>
            <div>
              <label className="label">Max Books / Member</label>
              <input type="number" className="input" value={settings.maxBooksPerMember} onChange={e=>set('maxBooksPerMember',parseInt(e.target.value)||5)}/>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-base">
          {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
