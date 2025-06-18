import crypto from 'node:crypto';

const base64urlHash = (hash: string): string => {
    const replacements: { [key: string]: string } = {
        '+': '-',
        '/': '_',
        '=': ''
    };

    return hash.replace(/[+/=]/g, (m0) => replacements[m0]);
};

export const generateSha256Base64Filename = async (data: Buffer) => {
    const sum = crypto.createHash('sha256').update(data).digest('base64');
    return base64urlHash(sum);
};
