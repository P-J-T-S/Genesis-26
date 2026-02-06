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
    <div className="flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
      {modes.map((mode) => {
        const config = getModeConfig(mode);
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                ? `bg-white dark:bg-secondary-700 shadow-sm ${config.textClass}`
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200'
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
