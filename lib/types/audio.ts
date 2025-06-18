import { Choice } from './twee';

export interface AudioTrack {
    key: string;
    type: 'content' | 'choices';
    choices: Choice[];
    content: string;
    audioUrl: string;
}
