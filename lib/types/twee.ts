export interface TweeJSON {
    metadata: Metadata;
    variables: { [key: string]: any };
    passages: Passage[];
}

export interface Metadata {
    title: string | undefined;
    init: Init | null;
    data?: StoryData | null;
}

export interface Init {
    [key: string]: any;
}

export interface StoryData {
    start: string;
    ifid: string;
    zoom: number;
    creator?: string;
    format: string;
    'format-version': string;
    'tag-colors'?: { [key: string]: string };
}

export interface Passage {
    name: string;
    metadata: Metadata | null;
    content: string;
    choices: Choice[];
    comments?: string[];
    variables?: { [key: string]: any };
    tags?: string[];
}

export interface Choice {
    text: string;
    link: string;
}

export interface StoryInit {
    files: {
        image: {
            source: {
                [key: string]: string;
            };
        };
        audio: {
            source: {
                [key: string]: string;
            };
        };
    };
}
