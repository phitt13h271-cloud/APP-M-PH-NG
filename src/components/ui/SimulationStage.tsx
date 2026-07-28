import React, { Suspense, lazy } from 'react';
import { Lesson } from '../../types';

import { PCAssemblySimulator } from '../simulators/PCAssemblySimulator';
import { Topic1IntegratedSimulator } from '../simulators/Topic1IntegratedSimulator';

// We will build these iteratively. Using simple placeholders for those not yet fully built.
const TempPlaceholder: React.FC<{name: string}> = ({name}) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 absolute inset-0">
        <span className="text-2xl text-slate-500 font-bold animate-pulse">🛠 {name} Simulator Loading...</span>
    </div>
);

export const SimulationStage: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const renderSim = () => {
    switch (lesson.simulatorType) {
      case 'topic1_integrated': return <Topic1IntegratedSimulator />;
      case 'pc_assembly': return <PCAssemblySimulator data={lesson.simulatorData} />;
      case 'keyboard_hands': return <TempPlaceholder name="Keyboard" />;
      case 'browser_sim': return <TempPlaceholder name="Browser" />;
      case 'file_explorer': return <TempPlaceholder name="File Explorer" />;
      case 'software_install': return <TempPlaceholder name="Installer" />;
      case 'office_sim': return <TempPlaceholder name="Office" />;
      case 'media_player': return <TempPlaceholder name="Media Player" />;
      case 'scratch_sim': return <TempPlaceholder name="Scratch" />;
      default: return <TempPlaceholder name="Unknown" />;
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-950/80 rounded-2xl border-2 border-slate-700/50 shadow-2xl overflow-hidden relative flex flex-col backdrop-blur-md min-h-[400px]">
       {renderSim()}
    </div>
  );
};
