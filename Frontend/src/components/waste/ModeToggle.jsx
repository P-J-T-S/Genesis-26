import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode, selectCurrentMode } from '../../store/slices/waste/wasteSlice';
import { getModeConfig } from '../../utils/helpers';

const ModeToggle = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectCurrentMode);

  const modes = ['normal', 'event', 'emergency'];

  const handleModeChange = (mode) => {
    dispatch(setMode(mode));
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-1 text-md border border-secondary-200">
      {modes.map((mode) => {
        const config = getModeConfig(mode);
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`
              px-4 py-2 w-48 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                ? `bg-secondary-100 shadow-sm ${config.textClass}`
                : 'text-black hover:bg-secondary-200'
              }
            `}
          >
            <span className="mr-2">{config.icon}</span>
            {config.name}
          </button>
        );
      })}
    </div>
  );
};

export default ModeToggle;
