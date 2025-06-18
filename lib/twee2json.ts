import { Metadata, TweeJSON } from './types/twee.js';

export function convertTweeToJson(tweeContent: string): TweeJSON {
    const passages = [];
    const metadata: Metadata = {
        title: undefined,
        init: null
    };
    let variables: any = {};
    const passagePattern =
        /:: ([^\n[]+)\s*((?:\[[^\]]+\]\s*)*)({.*})?\n([\s\S]*?)(?=\n::|$)/g;
    let match;

    while ((match = passagePattern.exec(tweeContent)) !== null) {
        const [, name, tagsString, metadataString, content] = match;
        const passageName = name.replace(/\{[^}]*\}/, '').trim();
        const tags = extractTags(tagsString);
        const { cleanedContent, choices, comments } = processContent(content);
        const passageVariables = extractVariables(content);

        if (passageName === 'StoryTitle') {
            metadata.title = cleanedContent.replace(':', '').trim();
        } else if (passageName === 'StoryInit') {
            variables = passageVariables;
        } else if (passageName === 'StoryData') {
            metadata.data = JSON.parse(cleanedContent.trim());
        } else {
            passages.push({
                name: passageName,
                metadata: metadataString ? JSON.parse(metadataString) : null,
                content: cleanedContent,
                choices,
                comments,
                variables: passageVariables,
                tags
            });
        }
    }

    if (metadata.data?.start) {
        moveStartNodeToFront(passages, metadata.data.start);
    }

    return { metadata, variables, passages };
}

function extractTags(tagsString: string): string[] {
    return [...tagsString.matchAll(/\[([^\]]+)\]/g)]
        .map((tag) => tag[1].trim().split(' '))
        .reduce((x, y) => x.concat(y), []);
}

function processContent(content: string) {
    const htmlCommentPattern = /<!--(.*?)-->/g;
    const setVariablePattern = /\(set:\s*\$(\w+)\s*to\s*(.*)\)/g;
    const printPattern = /\(print:.*?\)/g;
    const comments: string[] = [];
    const choices: any[] = [];

    const cleanedContent = content
        .replace(htmlCommentPattern, (comment, commentText) => {
            comments.push(commentText.trim());
            return '';
        })
        .replace(setVariablePattern, '')
        .replace(printPattern, '')
        .trim();

    const finalContent = extractChoices(cleanedContent, choices);

    return { cleanedContent: finalContent, choices, comments };
}

function extractChoices(content: string, choices: any[]) {
    const lines = content.split('\n').map((line) => line.trim());
    let finalContent = content;

    lines.forEach((line) => {
        if (line === '[[]]') {
            choices.push({
                text: '',
                link: ''
            });
            finalContent = finalContent.replace(line, '').trim();
        } else {
            const choiceRegex = /\[\[(.*?)(?:\s*(\||->)\s*(.*?))?\]\]/g;
            const choiceMatch = choiceRegex.exec(line);
            if (choiceMatch) {
                const [content, text, delimeter, link] = choiceMatch;
                if (delimeter) {
                    choices.push({
                        text: text.trim(),
                        link: link.trim()
                    });
                } else {
                    choices.push({
                        text: '',
                        link: text.trim()
                    });
                }
                finalContent = finalContent.replace(content, '').trim();
            }
        }
    });

    return finalContent;
}

function extractVariables(content: string) {
    const setVariablePattern = /\(set:\s*\$(\w+)\s*to\s*(.*)\)/g;
    const passageVariables: { [key: string]: any } = {};

    content.replace(setVariablePattern, (setExpr, varName, value) => {
        passageVariables[varName] = parseValue(value.trim());
        return '';
    });

    return passageVariables;
}

function parseValue(value: string) {
    value = value.trim();

    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1); // Remove quotes
    }

    if (!isNaN(Number(value))) {
        return Number(value);
    }

    const datamapPattern = /\(datamap:\s*(.*?)\)/;
    if (datamapPattern.test(value)) {
        const datamapContent = value.match(datamapPattern)?.[1];
        if (datamapContent) {
            return parseDatamap(datamapContent);
        }
    }

    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
}

function parseDatamap(content: string) {
    const pairs = content.split(',').map((pair) => pair.trim());
    const datamap: { [key: string]: any } = {};

    for (let i = 0; i < pairs.length; i += 2) {
        const key = pairs[i].trim().replace(/"/g, '');
        const value = parseValue(pairs[i + 1].trim());
        datamap[key] = value;
    }

    return datamap;
}

function moveStartNodeToFront(passages: any[], startNodeName: string) {
    const startIndex = passages.findIndex(
        (passage) => passage.name === startNodeName
    );
    if (startIndex > 0) {
        const [startNode] = passages.splice(startIndex, 1);
        passages.unshift(startNode);
    }
}
