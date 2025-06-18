import MockAdapter from 'axios-mock-adapter';
import {
    client,
    uploadIcon,
    startDeviceCodeFlow,
    pollDeviceCode
} from './api.yoto.js';

const YOTO_API_URL = 'https://api.yotoplay.com';
const YOTO_AUTH_URL = 'https://login.yotoplay.com';

// Use the custom axios client instance for all tests
const mock = new MockAdapter(client);

describe('Device Code Flow', () => {
    const client_id = 'test-client-id';
    const device_code = 'test-device-code';

    beforeEach(() => {
        mock.reset();
    });

    it('starts device code flow successfully', async () => {
        const mockResponse = {
            device_code: 'test-device-code',
            user_code: 'TEST-CODE',
            verification_uri: 'https://verify.test',
            verification_uri_complete:
                'https://verify.test?user_code=TEST-CODE',
            expires_in: 300,
            interval: 5
        };

        mock.onPost(`${YOTO_AUTH_URL}/oauth/device/code`).reply(
            200,
            mockResponse
        );

        const result = await startDeviceCodeFlow(client_id);

        expect(result).toEqual(mockResponse);
        const postHistory = mock.history.post[0];
        expect(postHistory).toBeDefined();
        expect(postHistory.url).toBe(`${YOTO_AUTH_URL}/oauth/device/code`);
        const headers = postHistory.headers as Record<string, string>;
        expect(headers['Content-Type']).toBe(
            'application/x-www-form-urlencoded'
        );
    });

    it('handles authorization pending state', async () => {
        mock.onPost(`${YOTO_AUTH_URL}/oauth/token`).reply(400, {
            error: 'authorization_pending'
        });

        await expect(
            pollDeviceCode(device_code, client_id)
        ).rejects.toMatchObject({
            response: {
                data: {
                    error: 'authorization_pending'
                }
            }
        });
    });

    it('handles expired device code', async () => {
        mock.onPost(`${YOTO_AUTH_URL}/oauth/token`).reply(400, {
            error: 'expired_token'
        });

        await expect(
            pollDeviceCode(device_code, client_id)
        ).rejects.toMatchObject({
            response: {
                data: {
                    error: 'expired_token'
                }
            }
        });
    });

    it('handles successful token response', async () => {
        const mockResponse = {
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
            expires_in: 3600
        };

        mock.onPost(`${YOTO_AUTH_URL}/oauth/token`).reply(200, mockResponse);

        const result = await pollDeviceCode(device_code, client_id);

        expect(result).toEqual(mockResponse);
        const postHistory = mock.history.post[0];
        expect(postHistory).toBeDefined();
        expect(postHistory.url).toBe(`${YOTO_AUTH_URL}/oauth/token`);
        const data = postHistory.data as string;
        expect(data).toContain(
            'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code'
        );
        expect(data).toContain('device_code=test-device-code');
        expect(data).toContain('client_id=test-client-id');
    });
});

describe('uploadIcon', () => {
    // Remove the duplicate mock declaration and reuse the one above
    beforeEach(() => {
        mock.reset();
    });

    afterEach(() => {
        mock.reset();
    });

    it('uploads the icon successfully and return data for a PNG image', async () => {
        const access_token = 'mock-token';
        const iconFile = Buffer.from('mock-image-data');
        const mimetype = 'image/png';
        const responseData = { success: true };

        mock.onPost(
            `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=true`
        ).reply(200, responseData);

        const result = await uploadIcon(access_token, iconFile, mimetype);

        expect(result).toEqual(responseData);
        const postHistory = mock.history.post[0];
        expect(postHistory).toBeDefined();
        expect(postHistory.url).toBe(
            'https://api.yotoplay.com/media/displayIcons/user/me/upload?autoConvert=true'
        );
        const headers = postHistory.headers as Record<string, string>;
        expect(headers.Authorization).toBe(`Bearer ${access_token}`);
        expect(headers['Content-Type']).toBe(mimetype);
    });

    it('uploads the icon successfully and return data for a GIF image', async () => {
        const access_token = 'mock-token';
        const iconFile = Buffer.from('mock-image-data');
        const mimetype = 'image/gif';
        const responseData = { success: true };

        mock.onPost(
            `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=false`
        ).reply(200, responseData);

        const result = await uploadIcon(access_token, iconFile, mimetype);

        expect(result).toEqual(responseData);
        const postHistory = mock.history.post[0];
        expect(postHistory).toBeDefined();
        expect(postHistory.url).toBe(
            'https://api.yotoplay.com/media/displayIcons/user/me/upload?autoConvert=false'
        );
        const headers = postHistory.headers as Record<string, string>;
        expect(headers.Authorization).toBe(`Bearer ${access_token}`);
        expect(headers['Content-Type']).toBe(mimetype);
    });

    it('throws an error if the API request fails', async () => {
        const access_token = 'mock-token';
        const iconFile = Buffer.from('mock-image-data');
        const mimetype = 'image/png';

        mock.onPost(
            `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=true`
        ).reply(500, { message: 'Internal Server Error' });

        await expect(
            uploadIcon(access_token, iconFile, mimetype)
        ).rejects.toThrow();
    });
});
