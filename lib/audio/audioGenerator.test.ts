import MockAdapter from 'axios-mock-adapter';
import { Passage } from '../types/twee.js';
import {
    autoGenerateAudioTracks,
    getPassagesWithoutAudio
} from './audioGenerator.js';
import { client } from '../apis/api.elevenlabs.js';

describe('Given a list of pregenerated audio files', () => {
    const audioFiles = ['Start.mp3', 'Next.mp3', 'Next_choices.mp3'];

    describe('and a tweeJSON containing a list of passages', () => {
        const passages: Passage[] = [
            {
                name: 'Start',
                content: 'This is the start of your adventure.',
                metadata: null,
                choices: [
                    { text: 'Go to next passage', link: 'Next' },
                    { text: 'Go back to start', link: 'Start' }
                ]
            },
            {
                name: 'Next',
                content: 'This is the next passage.',
                metadata: null,
                choices: [
                    { text: 'Go back to start', link: 'Start' },
                    { text: 'Go to next passage', link: 'Next' }
                ]
            },
            {
                name: 'End',
                content: 'This is the end - no audio',
                metadata: null,
                choices: [{ text: 'Go back to start', link: 'Start' }]
            }
        ];

        it('can compare the 2 and return a list of passages without audio', () => {
            const { passagesWithoutAudio } = getPassagesWithoutAudio(
                passages,
                audioFiles
            );
            expect(passagesWithoutAudio).toEqual([
                {
                    name: 'End',
                    content: 'This is the end - no audio',
                    metadata: null,
                    choices: [{ text: 'Go back to start', link: 'Start' }]
                }
            ]);
        });
    });
});

describe('audioGenerator', () => {
    const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
    let mock: any;

    const dummyPassages: {
        passagesWithoutAudio: Passage[];
    } = {
        passagesWithoutAudio: [
            {
                name: 'Start',
                content: 'This is the start of your adventure.',
                metadata: null,
                choices: [
                    { text: 'To go to next passage', link: 'Next' },
                    { text: 'To go back to start', link: 'Start' }
                ]
            },
            {
                name: 'Next',
                content: 'This is the next passage.',
                metadata: null,
                choices: [
                    { text: 'To go back to start', link: 'Start' },
                    { text: 'To go to next passage', link: 'Next' }
                ]
            },
            {
                name: 'End',
                content: 'This is the end - no audio',
                metadata: null,
                choices: [{ text: 'To go back to start', link: 'Start' }]
            }
        ]
    };

    beforeEach(() => {
        mock = new MockAdapter(client);
    });

    afterEach(() => {
        mock.reset();
    });

    it.skip('allows the voiceId to be specified amd returns the text-to-speech data', async () => {
        const voiceId = 'mock-voice-id';
        process.env.ELEVENLABS_API_KEY = 'mocked-api-key';
        mock.onPost(
            `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`
        ).reply(200, Buffer.from('mock-audio-data'));

        const generated = await autoGenerateAudioTracks(
            voiceId,
            dummyPassages,
            [],
            '.out'
        );
        expect(generated).toHaveLength(3);
        expect(generated).toMatchObject([
            {
                key: 'Start',
                content:
                    'This is the start of your adventure. To go to next passage To go back to start',
                choices: [
                    { text: 'To go to next passage', link: 'Next' },
                    { text: 'To go back to start', link: 'Start' }
                ],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            },
            {
                key: 'Next',
                content:
                    'This is the next passage. To go back to start To go to next passage',
                choices: [
                    { text: 'To go back to start', link: 'Start' },
                    { text: 'To go to next passage', link: 'Next' }
                ],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            },
            {
                key: 'End',
                content: 'This is the end - no audio To go back to start',
                choices: [{ text: 'To go back to start', link: 'Start' }],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            }
        ]);
    });
    it.skip('allows you to append some audio to the end of the choices', async () => {
        const voiceId = 'mock-voice-id';
        process.env.ELEVENLABS_API_KEY = 'mocked-api-key';
        mock.onPost(
            `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`
        ).reply(200, Buffer.from('mock-audio-data'));

        const generated = await autoGenerateAudioTracks(
            voiceId,
            dummyPassages,
            [', push the Left Button.', ', push the Right Button.'],
            '.out'
        );
        expect(generated).toHaveLength(3);
        expect(generated).toMatchObject([
            {
                key: 'Start',
                content:
                    'This is the start of your adventure. To go to next passage, push the Left Button. To go back to start, push the Right Button.',
                choices: [
                    { text: 'To go to next passage', link: 'Next' },
                    { text: 'To go back to start', link: 'Start' }
                ],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            },
            {
                key: 'Next',
                content:
                    'This is the next passage. To go back to start, push the Left Button. To go to next passage, push the Right Button.',
                choices: [
                    { text: 'To go back to start', link: 'Start' },
                    { text: 'To go to next passage', link: 'Next' }
                ],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            },
            {
                key: 'End',
                content:
                    'This is the end - no audio To go back to start, push the Left Button.',
                choices: [{ text: 'To go back to start', link: 'Start' }],
                contentAudioUrl: expect.stringMatching(/^.{43}$/)
            }
        ]);
    });
});
