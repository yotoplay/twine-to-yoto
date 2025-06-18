import { Choice, Passage, TweeJSON } from './types/twee';
import { GeneratedAudio, TrackEvent, YotoJSON } from './types/yoto';

const generateEvents = (
    choices: Choice[]
): Record<string, TrackEvent | undefined> => {
    const events: Record<string, TrackEvent | undefined> = {};
    choices.forEach((choice, index) => {
        if (index === 0 && choice.link !== '') {
            events.onLhb = {
                cmd: 'goto',
                params: {
                    chapterKey: choice.link,
                    trackKey: choice.link
                }
            };
        } else if (index === 1 && choice.link !== '') {
            events.onRhb = {
                cmd: 'goto',
                params: {
                    chapterKey: choice.link,
                    trackKey: choice.link
                }
            };
        } else if (index === 2 && choice.link !== '') {
            events.onEnd = {
                cmd: 'goto',
                params: {
                    chapterKey: choice.link,
                    trackKey: choice.link
                }
            };
        }
    });

    if (events.onEnd === undefined) {
        events.onEnd = {
            cmd: 'stop'
        };
    }

    return events;
};

export function generateTracks(audios: GeneratedAudio[], format = 'aac') {
    return audios.flatMap((audio) => {
        return [
            {
                key: `${audio.key}`,
                title: `${audio.key}`,
                type: 'audio',
                format,
                trackUrl: audio.contentAudioUrl,
                events: generateEvents(audio.choices)
            }
        ];
    });
}

function appendTags(useTags: boolean, passage: Passage) {
    return useTags
        ? ` ${passage.tags
              ?.map((t) => `[${t}]`)
              .join(' ')
              .trim()}`
        : '';
}

export function convertTweeToYoto(
    tweeJson: TweeJSON,
    options: { useTags: boolean }
): YotoJSON {
    const { useTags } = options;
    const yotoJson = {
        title: tweeJson.metadata.title,
        slug:
            tweeJson.metadata?.title?.toLowerCase().replace(/ /g, '-') ||
            'untitled',
        sortkey:
            tweeJson.metadata?.title?.toLowerCase().replace(/ /g, '-') ||
            'untitled',
        metadata: {
            author: tweeJson.metadata.data?.creator || 'Unknown',
            category: 'activities',
            cover: {
                imageL:
                    tweeJson.variables?.cover ||
                    'https://cdn.yoto.io/myo-cover/star_green.gif'
            },
            description: tweeJson.metadata.title || 'Untitled',
            media: {
                duration: 0,
                fileSize: 0,
                hasStreams: false
            }
        },
        updatedAt: new Date().toISOString(),
        content: {
            playbackType: 'interactive',
            cover: {
                imageL: 'https://cdn.yoto.io/myo-cover/star_green.gif'
            },
            editSettings: {
                autoOverlayLabels: 'chapters',
                editKeys: false,
                interactiveContent: true
            },
            chapters: tweeJson.passages.map((passage) => ({
                title: `${passage.name}${appendTags(useTags, passage)}`,
                key: passage.name,
                display: {
                    icon16x16:
                        'yoto:#jmpBDOfiG-5QDXND7NMAy9COAy1QJbM3AofqCy_BYX4'
                },
                tracks: [
                    {
                        key: passage.name,
                        title: passage.name,
                        type: 'audio',
                        format: 'aac',
                        trackUrl: '[placeholder]',
                        events: generateEvents(passage.choices)
                    }
                ]
            })),
            config: {
                resumeTimeout: tweeJson.variables?.resumeTimeout || 2592000,
                disableTrackNav: true,
                disableChapterNav: true,
                autoadvance: 'none'
            }
        }
    };

    return yotoJson;
}
