const { audioRecognition } = require('./audioToText');
const { SpeechClient } = require('@google-cloud/speech').v1p1beta1;
jest.mock('@google-cloud/speech');

describe('audioRecognition', () => {

    it('should transcribe audio correctly', async () => {
        const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';
        const expectedTranscription = 'we the people of the United States in order to form a more perfect union establish justice insure domestic tranquility provide for the common defense';
        SpeechClient.prototype.recognize.mockResolvedValue([{ alternatives: [{ transcript: expectedTranscription }] }]);
        const transcription = await audioRecognition(audioUrl);

        expect(transcription).toEqual(expectedTranscription);
        expect(axios.get).toHaveBeenCalledWith(audioUrl, { responseType: 'arraybuffer' });
        expect(SpeechClient).toHaveBeenCalledWith({
            projectId: 'your-project-id',
            keyFilename: './key.json'
        });
        // Expect the SpeechClient constructor to have been called with the correct parameters
        expect(SpeechClient).toHaveBeenCalledWith({
            projectID: 'languagemaster-418508',
            keyFilename: './key.json'
        });
        // Expect the recognize method to have been called with the correct parameters
        expect(SpeechClient().recognize).toHaveBeenCalledWith({
            config: {
                languageCode: 'en-US',
                sampleRate: 16600,
                encoding: 'LINEAR16'
            },
            audio: {
                content: expect.any(String)
            }
        });
    });
});
