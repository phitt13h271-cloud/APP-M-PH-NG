export type SimulatorType = 
  | 'topic1_integrated'
  | 'pc_assembly'
  | 'keyboard_hands'
  | 'browser_sim'
  | 'file_explorer'
  | 'software_install'
  | 'office_sim'
  | 'media_player'
  | 'scratch_sim';

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  simulatorType: SimulatorType;
  simulatorData?: any;
}

export interface Topic {
  id: string;
  title: string;
  lessons: Lesson[];
}
