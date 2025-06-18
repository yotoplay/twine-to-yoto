import { convertTweeToYoto } from './twee2yoto.js';
import { TweeJSON } from './types/twee.js';
import { YotoJSON } from './types/yoto.js';

describe('Converting TweeJSON to YotoJSON (aka card.json)', () => {
    const mockTweeJson: TweeJSON = {
        metadata: {
            title: 'Spy Mission',
            init: null,
            data: {
                ifid: 'F84DACAA-11AB-43E3-8AD4-483BDDA4B134',
                format: 'Harlowe',
                creator: 'Twine',
                'format-version': '3.3.9',
                start: 'Start',
                zoom: 1
            }
        },
        variables: {
            cover: 'https://cdn.yoto.io/myo-cover/star_green.gif',
            customProperty: 'My custom value',
            resumeTimeout: 1,
            anotherVar: 42,
            myMap: {
                key1: 'value1',
                key2: 100
            },
            defaultVoiceId: 'XB0fDUnXU5powFXDhCwa',
            lhbTemplate: ', press the left button',
            rhbTemplate: ', press the right button'
        },
        passages: [
            {
                name: 'Start',
                metadata: null,
                content:
                    'You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.',
                choices: [
                    {
                        text: 'Go to the old library to search for clues',
                        link: 'OldLibrary'
                    },
                    {
                        text: 'Investigate the mysterious cave near the beach',
                        link: 'MysteriousCave'
                    }
                ],
                tags: ['start', 'category:activity']
            }
        ]
    };

    it('converts metadata correctly', () => {
        const result: YotoJSON = convertTweeToYoto(mockTweeJson, {
            useTags: false
        });
        expect(result.metadata).toEqual({
            author: 'Twine',
            description: 'Spy Mission',
            category: 'activities',
            cover: {
                imageL: 'https://cdn.yoto.io/myo-cover/star_green.gif'
            },
            media: {
                duration: 0,
                fileSize: 0,
                hasStreams: false
            }
        });
    });

    it('converts content correctly', () => {
        const result: YotoJSON = convertTweeToYoto(mockTweeJson, {
            useTags: false
        });
        expect(result.content).toMatchObject({
            cover: {
                imageL: 'https://cdn.yoto.io/myo-cover/star_green.gif'
            },
            playbackType: 'interactive',
            editSettings: {
                autoOverlayLabels: 'chapters',
                editKeys: false,
                interactiveContent: true
            },
            config: {
                resumeTimeout: 1
            }
        });
    });

    it('converts chapters correctly, beingnning with the passage specified in data.startnode', () => {
        const result: YotoJSON = convertTweeToYoto(mockTweeJson, {
            useTags: false
        });
        expect(result.content.chapters).toHaveLength(1);
        const chapter = result.content.chapters[0];
        expect(chapter).toMatchObject({
            title: 'Start',
            key: 'Start'
        });
        expect(chapter.tracks).toHaveLength(1);
        expect(chapter.tracks).toEqual([
            {
                key: 'Start',
                title: 'Start',
                type: 'audio',
                format: 'aac',
                trackUrl: '[placeholder]',
                events: {
                    onLhb: {
                        cmd: 'goto',
                        params: {
                            chapterKey: 'OldLibrary',
                            trackKey: 'OldLibrary'
                        }
                    },
                    onRhb: {
                        cmd: 'goto',
                        params: {
                            chapterKey: 'MysteriousCave',
                            trackKey: 'MysteriousCave'
                        }
                    },
                    onEnd: {
                        cmd: 'stop'
                    }
                }
            }
        ]);
    });

    it('honours the useTags option, and appends tags to the passage chapter name', () => {
        const options = { useTags: true };
        const result: YotoJSON = convertTweeToYoto(mockTweeJson, options);
        expect(result.content.chapters).toHaveLength(1);
        const chapter = result.content.chapters[0];
        expect(chapter).toMatchObject({
            title: 'Start [start] [category:activity]',
            key: 'Start'
        });
        expect(chapter.tracks).toMatchObject([
            {
                title: 'Start'
            }
        ]);
    });

    it('populates choices as lhb and rhb events correctly', () => {
        const result: YotoJSON = convertTweeToYoto(mockTweeJson, {
            useTags: false
        });
        const chapter = result.content.chapters[0];
        expect(chapter.tracks[0].events?.onLhb).toEqual({
            cmd: 'goto',
            params: {
                chapterKey: 'OldLibrary',
                trackKey: 'OldLibrary'
            }
        });
        expect(chapter.tracks[0].events?.onRhb).toEqual({
            cmd: 'goto',
            params: {
                chapterKey: 'MysteriousCave',
                trackKey: 'MysteriousCave'
            }
        });
        expect(chapter.tracks[0].events?.onEnd).toEqual({
            cmd: 'stop'
        });
    });

    describe('when there are more than 2 choices', () => {
        const passages = [
            {
                name: 'Start',
                metadata: null,
                content:
                    'You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.',
                choices: [
                    {
                        text: 'Go to the old library to search for clues',
                        link: 'OldLibrary'
                    },
                    {
                        text: 'Investigate the mysterious cave near the beach',
                        link: 'MysteriousCave'
                    },
                    {
                        text: 'Follow the map to the secret garden',
                        link: 'SecretGarden'
                    }
                ]
            }
        ];

        it('populates choices as onLhb, onRhb, and onEnd events correctly', () => {
            const twee = { ...mockTweeJson };
            twee.passages = passages;
            const result: YotoJSON = convertTweeToYoto(twee, {
                useTags: false
            });
            const chapter = result.content.chapters[0];
            expect(chapter.tracks[0].events?.onLhb?.params?.trackKey).toBe(
                'OldLibrary'
            );
            expect(chapter.tracks[0].events?.onRhb?.params?.trackKey).toBe(
                'MysteriousCave'
            );
            expect(chapter.tracks[0].events?.onEnd?.params?.trackKey).toBe(
                'SecretGarden'
            );
        });
    });

    describe('when there are more than 2 choices', () => {
        const passages = [
            {
                name: 'Start',
                metadata: null,
                content:
                    'You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.',
                choices: [
                    {
                        text: 'Go to the old library to search for clues',
                        link: 'OldLibrary'
                    },
                    {
                        text: 'Investigate the mysterious cave near the beach',
                        link: 'MysteriousCave'
                    },
                    {
                        text: '$wait:10',
                        link: 'SecretGarden'
                    }
                ]
            }
        ];

        it('populates choices as onLhb, onRhb, and onEnd events correctly', () => {
            const twee = { ...mockTweeJson };
            twee.passages = passages;
            const result: YotoJSON = convertTweeToYoto(twee, {
                useTags: false
            });
            const chapter = result.content.chapters[0];
            expect(chapter.tracks[0].events?.onLhb?.params?.trackKey).toBe(
                'OldLibrary'
            );
            expect(chapter.tracks[0].events?.onRhb?.params?.trackKey).toBe(
                'MysteriousCave'
            );
            expect(chapter.tracks[0].events?.onEnd).toEqual({
                cmd: 'goto',
                params: {
                    chapterKey: 'SecretGarden',
                    trackKey: 'SecretGarden'
                }
            });
        });
    });

    describe('when a choice has been skipped', () => {
        const passages = [
            {
                name: 'Start',
                metadata: null,
                content:
                    'You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.',
                choices: [
                    {
                        text: 'Go to the old library to search for clues',
                        link: 'OldLibrary'
                    },
                    {
                        text: '',
                        link: ''
                    },
                    {
                        text: '',
                        link: ''
                    }
                ]
            }
        ];

        it('populates choices as onLhb and onRhb events correctly', () => {
            const twee = { ...mockTweeJson };
            twee.passages = passages;
            const result: YotoJSON = convertTweeToYoto(twee, {
                useTags: false
            });
            const chapter = result.content.chapters[0];
            expect(chapter.tracks[0].events?.onLhb).toEqual({
                cmd: 'goto',
                params: {
                    chapterKey: 'OldLibrary',
                    trackKey: 'OldLibrary'
                }
            });
            expect(chapter.tracks[0].events?.onRhb).toBeUndefined();
            expect(chapter.tracks[0].events?.onEnd).toEqual({
                cmd: 'stop'
            });
        });
    });

    describe('when end is the only choice', () => {
        const passages = [
            {
                name: 'Start',
                metadata: null,
                content:
                    'You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.',
                choices: [
                    {
                        text: '',
                        link: ''
                    },
                    {
                        text: '',
                        link: ''
                    },
                    {
                        text: '',
                        link: 'Continue'
                    }
                ]
            }
        ];

        it('populates choices as onLhb and onRhb events correctly', () => {
            const twee = { ...mockTweeJson };
            twee.passages = passages;
            const result: YotoJSON = convertTweeToYoto(twee, {
                useTags: false
            });
            const chapter = result.content.chapters[0];
            expect(chapter.tracks[0].events?.onLhb).toBeUndefined();
            expect(chapter.tracks[0].events?.onRhb).toBeUndefined();
            expect(chapter.tracks[0].events?.onEnd).toEqual({
                cmd: 'goto',
                params: {
                    chapterKey: 'Continue',
                    trackKey: 'Continue'
                }
            });
        });
    });
});
