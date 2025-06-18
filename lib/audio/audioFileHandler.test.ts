import { convertTweeToYoto } from '../twee2yoto.js';
import { updateTrackUrls } from './audioFileHandler.js';

describe('Given a YotoJSON I can update trackUrls', () => {
    const mockTweeJson = {
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
            }
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
                ]
            }
        ]
    };

    it('can update the content audio url', () => {
        const yotoJSON = convertTweeToYoto(mockTweeJson, { useTags: false });

        expect(yotoJSON.content.chapters[0].tracks[0].trackUrl).toEqual(
            '[placeholder]'
        );

        updateTrackUrls('Start', 'passagetrack', yotoJSON);

        expect(yotoJSON.content.chapters[0].tracks[0].trackUrl).toEqual(
            'yoto:#passagetrack'
        );
    });
});
