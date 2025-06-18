import axios from 'axios';
import axiosDebug from './axiosDebug.js';
import axiosRetry from 'axios-retry';

export const client = axios.create();
axiosDebug(client);
axiosRetry(client, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function textToSpeech(text: string, voiceId: string) {
    if (!process.env.ELEVENLABS_API_KEY) {
        throw new Error('ELEVENLABS_API_KEY is not set');
    }
    const response = await client.post(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`,
        {
            text
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            },
            responseType: 'arraybuffer'
        }
    );
    return { data: response.data };
}
