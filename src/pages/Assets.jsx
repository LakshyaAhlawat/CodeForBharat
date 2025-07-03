// src/pages/Assets.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const Assets = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [assets, setAssets] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock assets data (you can replace this with actual API calls)
  const mockAssets = [
    {
      id: 1,
      name: 'player-sprite.png',
      type: 'image',
      size: '15KB',
      url: 'https://via.placeholder.com/64x64/00ff00/ffffff?text=P',
      uploadDate: '2025-01-02'
    },
    {
      id: 2,
      name: 'background.jpg',
      type: 'image',
      size: '120KB',
      url: 'https://via.placeholder.com/64x64/0066ff/ffffff?text=BG',
      uploadDate: '2025-01-01'
    },
    {
      id: 3,
      name: 'game-music.mp3',
      type: 'audio',
      size: '2.5MB',
      url: '#',
      uploadDate: '2024-12-30'
    }
  ];

  useEffect(() => {
    // Load assets (replace with actual API call)
    setAssets(mockAssets);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    setIsUploading(true);
    
    // Mock upload process
    setTimeout(() => {
      const newAssets = Array.from(files).map((file, index) => ({
        id: assets.length + index + 1,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'other',
        size: `${(file.size / 1024).toFixed(1)}KB`,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '#',
        uploadDate: new Date().toISOString().split('T')[0]
      }));
      
      setAssets(prev => [...prev, ...newAssets]);
      setIsUploading(false);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    }, 2000);
  };

  const handleDelete = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
      toast.success('Asset deleted successfully!');
    }
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'audio':
        return '🎵';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Asset Manager</h1>
          <p className="text-indigo-200">Upload and manage your game assets</p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">
              {isUploading ? '⏳' : '📁'}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
            </h3>
            <p className="text-indigo-200 mb-4">
              {isUploading ? 'Please wait while we upload your files' : 'Supports images, audio, and other game assets'}
            </p>
            <input
              type="file"
              multiple
              accept="image/*,audio/*,.json,.txt"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`inline-block px-6 py-3 rounded-lg font-semibold transition cursor-pointer ${
                isUploading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </label>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white/10 rounded-xl p-4 backdrop-blur hover:bg-white/20 transition-all duration-300">
              <div className="text-center mb-4">
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-16 h-16 mx-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {getAssetIcon(asset.type)}
                  </div>
                )}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="font-semibold text-sm mb-1 truncate" title={asset.name}>
                  {asset.name}
                </h3>
                <p className="text-xs text-indigo-300">
                  {asset.size} • {asset.uploadDate}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(asset.url)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium transition"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-xs font-medium transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {assets.length === 0 && !isUploading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-bold mb-2">No assets uploaded yet</h3>
            <p className="text-indigo-200">Upload your first asset to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;