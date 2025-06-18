import { convertTweeToJson } from './twee2json.js';
import { readFileContent } from './utils/fileHandler.js';

describe('convertTweeToJson', () => {
    it('converts StoryTitle correctly', () => {
        const tweeContent = `:: StoryTitle
Spy Mission: The Secret of the Hidden Treasure
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.metadata.title).toBe(
            'Spy Mission The Secret of the Hidden Treasure'
        );
    });

    it('converts StoryData correctly', () => {
        const tweeContent = `:: StoryData
{
  "ifid": "F84DACAA-11AB-43E3-8AD4-483BDDA4B134",
  "format": "Harlowe",
  "format-version": "3.3.9",
  "start": "Start",
  "zoom": 1
}
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.metadata.data).toEqual({
            ifid: 'F84DACAA-11AB-43E3-8AD4-483BDDA4B134',
            format: 'Harlowe',
            'format-version': '3.3.9',
            start: 'Start',
            zoom: 1
        });
    });

    it('converts StoryInit and variables correctly', () => {
        const tweeContent = `:: StoryInit
(set: $customProperty to "My custom value")
(set: $anotherVar to 42)
(set: $resumeTimeout to 3000)
(set: $defaultVoiceId to "XB0fDUnXU5powFXDhCwa")
(set: $myMap to (datamap: "key1", "value1", "key2", 100))
(set: $cover to "https://cdn.yoto.io/myo-cover/star_green.gif")
(set: $lhbTemplate to ", press the left button");
(set: $rhbTemplate to ", press the right button");
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.variables).toEqual({
            customProperty: 'My custom value',
            anotherVar: 42,
            resumeTimeout: 3000,
            defaultVoiceId: 'XB0fDUnXU5powFXDhCwa',
            cover: 'https://cdn.yoto.io/myo-cover/star_green.gif',
            myMap: {
                key1: 'value1',
                key2: 100
            },
            lhbTemplate: ', press the left button',
            rhbTemplate: ', press the right button'
        });
    });

    it('handles passages with choices correctly', () => {
        const tweeContent = `:: Start
This is the start of your adventure.
[[Go to next passage|Next]]

:: Next
This is the next passage.
[[Go back to start|Start]]
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.passages).toEqual([
            {
                name: 'Start',
                metadata: null,
                content: 'This is the start of your adventure.',
                choices: [{ text: 'Go to next passage', link: 'Next' }],
                comments: [],
                variables: {},
                tags: []
            },
            {
                name: 'Next',
                metadata: null,
                content: 'This is the next passage.',
                choices: [{ text: 'Go back to start', link: 'Start' }],
                comments: [],
                variables: {},
                tags: []
            }
        ]);
    });

    it('handles passages with audio play tags, and leaves them in place', () => {
        const tweeContent = `:: Start
This is the start of your adventure.
[[Go to next passage|Next]]
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.passages).toEqual([
            {
                name: 'Start',
                metadata: null,
                content: 'This is the start of your adventure.',
                choices: [{ text: 'Go to next passage', link: 'Next' }],
                comments: [],
                variables: {},
                tags: []
            }
        ]);
    });

    it('handles multiple choices', () => {
        const tweeContent = `:: Start
This is the start of your adventure.
[[Go to next passage|Next]]
[[Go to different passage|Different]]
[[|End]]
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.passages).toEqual([
            {
                name: 'Start',
                metadata: null,
                content: 'This is the start of your adventure.',
                choices: [
                    {
                        text: 'Go to next passage',
                        link: 'Next'
                    },
                    {
                        text: 'Go to different passage',
                        link: 'Different'
                    },
                    {
                        text: '',
                        link: 'End'
                    }
                ],
                comments: [],
                variables: {},
                tags: []
            }
        ]);
    });

    it('handles variables', () => {
        const tweeContent = `:: Start
This is the start of your adventure.
[[Go to next passage|Next]]
[[]]
[[$wait:8|End]]
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.passages).toEqual([
            {
                name: 'Start',
                metadata: null,
                content: 'This is the start of your adventure.',
                choices: [
                    {
                        text: 'Go to next passage',
                        link: 'Next'
                    },
                    {
                        text: '',
                        link: ''
                    },
                    {
                        text: '$wait:8',
                        link: 'End'
                    }
                ],
                comments: [],
                variables: {},
                tags: []
            }
        ]);
    });

    it('supports harlowe -> syntax', () => {
        const tweeContent = `:: Start
This is the start of your adventure.
[[Go to next passage|Next]]
[[->]]
[[|]]
    [[]]
[[$wait:8->End]]
`;
        const result = convertTweeToJson(tweeContent);
        expect(result.passages).toEqual([
            {
                name: 'Start',
                metadata: null,
                content: 'This is the start of your adventure.',
                choices: [
                    {
                        text: 'Go to next passage',
                        link: 'Next'
                    },
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
                        link: ''
                    },
                    {
                        text: '$wait:8',
                        link: 'End'
                    }
                ],
                comments: [],
                variables: {},
                tags: []
            }
        ]);
    });

    describe('HTML comments in twee', () => {
        it('ignores HTML comments', () => {
            const tweeContent = `:: Start
This is the start of your adventure.
<!-- This is a comment -->
[[Go to next passage|Next]]
<!-- This is another comment -->
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [{ text: 'Go to next passage', link: 'Next' }],
                    comments: ['This is a comment', 'This is another comment'],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });

    describe('Harlowe variables and print expressions in twee', () => {
        it('adds variables to the passage and strips out print expressions', () => {
            const tweeContent = `:: Guitar
    You take a seat on the small stage, your guitar resting on your knee. As your fingers dance across the strings, the crowd seems to forget their troubles, swaying to the rhythm of the tango. Among the faces, you spot a familiar one—Rosario, a dancer known for her connections to political dissenters.
    
    [[To Ask Rosario for more information about the revolutionaries|AskRosario]] 
    [[To Leave the bar with Rosario and see where her loyalties lie|FollowRosario]]
    
    (set: $passage to "Guitar")
    (set: $imgFormat to ".gif")
    (set: $audioFormat to ".mp3")
    
    (print: "<img src='icons/" + $passage + $imgFormat + "' width='400' height='400' style='image-rendering: pixelated;'>")
    (print: "<audio autoplay><source src='audio/" + $passage + $audioFormat + "'></audio>")
    `;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Guitar',
                    metadata: null,
                    content:
                        'You take a seat on the small stage, your guitar resting on your knee. As your fingers dance across the strings, the crowd seems to forget their troubles, swaying to the rhythm of the tango. Among the faces, you spot a familiar one—Rosario, a dancer known for her connections to political dissenters.',
                    choices: [
                        {
                            text: 'To Ask Rosario for more information about the revolutionaries',
                            link: 'AskRosario'
                        },
                        {
                            text: 'To Leave the bar with Rosario and see where her loyalties lie',
                            link: 'FollowRosario'
                        }
                    ],
                    variables: {
                        passage: 'Guitar',
                        imgFormat: '.gif',
                        audioFormat: '.mp3'
                    },
                    comments: [],
                    tags: []
                }
            ]);
        });
    });

    describe('Spaces in passage names', () => {
        it('can handle spaces in passage names', () => {
            const tweeContent = `:: Start of Adventure
This is the start of your adventure.
[[Go to next passage|Next]]
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start of Adventure',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [{ text: 'Go to next passage', link: 'Next' }],
                    comments: [],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });

    describe('Tags in passage names', () => {
        it('can handle tags in passage names and add them to a tags array', () => {
            const tweeContent = `:: Start of Adventure [test-tag another-tag a-third-tag]
This is the start of your adventure.
[[Go to next passage|Next]]
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start of Adventure',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [{ text: 'Go to next passage', link: 'Next' }],
                    comments: [],
                    variables: {},
                    tags: ['test-tag', 'another-tag', 'a-third-tag']
                }
            ]);
        });

        it('strips Twine positioning data (stored in curly braces)', () => {
            const tweeContent = `:: Start of Adventure {"position":"175,150","size":"100,100"}
This is the start of your adventure.
[[Go to next passage|Next]]
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start of Adventure',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [{ text: 'Go to next passage', link: 'Next' }],
                    comments: [],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });

    describe('ensuring passage in StoryData.start is returning first in the list of passages', () => {
        it('handles passages with choices correctly', () => {
            const tweeContent = `:: StoryData
{
    "ifid": "F84DACAA-11AB-43E3-8AD4-483BDDA4B134",
    "format": "Harlowe",
    "format-version": "3.3.9",
    "start": "Start",
    "zoom": 1
}

:: StoryInit
(set: $cover to "https://cdn.yoto.io/myo-cover/bee_green.gif")
(set: $defaultVoiceId to "cgSgspJ2msm6clMCkdW9")
(set: $auto to true)

:: Next
This is the next passage.

[[Go back to start|Start]]

:: Start
This is the start of your adventure.
[[Go to next passage|Next]]
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.variables).toEqual({
                auto: true,
                cover: 'https://cdn.yoto.io/myo-cover/bee_green.gif',
                defaultVoiceId: 'cgSgspJ2msm6clMCkdW9'
            });
            expect(result.passages).toEqual([
                {
                    name: 'Start',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [{ text: 'Go to next passage', link: 'Next' }],
                    comments: [],
                    variables: {},
                    tags: []
                },
                {
                    name: 'Next',
                    metadata: null,
                    content: 'This is the next passage.',
                    choices: [{ text: 'Go back to start', link: 'Start' }],
                    comments: [],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });

    describe('support for Choice syntax without the delimeter', () => {
        it('handles passages with choices correctly', () => {
            const tweeContent = `:: Start
This is the start of your adventure.
[[Next]]
[[Different]]`;

            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [
                        {
                            text: '',
                            link: 'Next'
                        },
                        {
                            text: '',
                            link: 'Different'
                        }
                    ],
                    comments: [],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });

    describe('errors in twee', () => {
        it('trims any leftovers out of the passage content if the choice syntax is not correct', () => {
            const tweeContent = `:: Start
This is the start of your adventure.  
[[Go to next passage|Next]]
        [[]]
[[$wait:8|End]]
`;
            const result = convertTweeToJson(tweeContent);
            expect(result.passages).toEqual([
                {
                    name: 'Start',
                    metadata: null,
                    content: 'This is the start of your adventure.',
                    choices: [
                        {
                            text: 'Go to next passage',
                            link: 'Next'
                        },
                        {
                            text: '',
                            link: ''
                        },
                        {
                            text: '$wait:8',
                            link: 'End'
                        }
                    ],
                    comments: [],
                    variables: {},
                    tags: []
                }
            ]);
        });
    });
});

describe('full twee to json conversion, using reference samples', () => {
    it('converts as expected', async () => {
        const file = readFileContent('./__tests__/data/spy2.twee');
        const result = convertTweeToJson(file);

        expect(result.metadata.title).toEqual('Spy Club Card 2');
        expect(result.metadata).toEqual({
            title: 'Spy Club Card 2',
            data: {
                ifid: '8DD48121-709A-4B3B-919A-796D8335AF5F',
                format: 'Harlowe',
                'format-version': '3.3.9',
                start: '20001',
                'tag-colors': {
                    'assets-complete': 'green',
                    'design-complete': 'purple',
                    'issues-fixed': 'orange',
                    'issues-found': 'red',
                    'narrative-complete': 'blue',
                    'tested-ready': 'yellow'
                },
                zoom: 1
            },
            init: null
        });

        expect(result.variables).toEqual({});

        const passage = result.passages[0];

        expect(passage.choices).toEqual([
            { text: '', link: '' },
            { text: '', link: '' },
            { text: '', link: '20002' }
        ]);

        expect(passage.comments).toEqual([]);

        expect(passage.tags).toEqual(['narrative-complete', 'assets-complete']);

        expect(passage.metadata).toEqual({
            position: '100,200',
            size: '100,100'
        });
        expect(passage.name).toEqual('20001');
        expect(passage.variables).toEqual({
            audioFormat: '.mp3',
            imgFormat: '.png',
            passage: '20001'
        });
    });
});
