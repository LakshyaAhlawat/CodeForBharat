import React from 'react';

const BackgroundSelector = ({ selectedBackground, onBackgroundChange, options }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3 text-white">
        🎨 Choose Background Theme
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((bg) => (
          <button
            key={bg.value}
            onClick={() => onBackgroundChange(bg.value)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedBackground === bg.value
                ? 'border-cyan-500 bg-cyan-500/20 scale-105'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            <div
              className="w-full h-16 rounded-md mb-2"
              style={{ backgroundColor: bg.preview }}
            />
            <p className="text-sm text-white font-medium">{bg.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;