import { Choice } from "@yotoplay/twee2json";

export interface AudioTrack {
  key: string;
  type: "content" | "choices";
  choices: Choice[];
  content: string;
  audioUrl: string;
}
