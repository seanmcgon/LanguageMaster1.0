const { audioRecognition } = require('./audioToText.js');
const { similarity, stringComparisonPercentage } = require('./stringSimilarity.js')
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

describe('similarity', () => {
    it('should calculate the similarity between two words', () => {
        const given = "hello";
        const expected = "heaven";
        const result = similarity(given, expected);
        expect(result).toEqual(0.16667);
    });

    it('should calculate the similarity between two words', () => {
        const given = "hello";
        const expected = "hello";
        const result = similarity(given, expected);
        expect(result).toEqual(1);
    });

    it('should calculate the similarity between two words', () => {
        const given = "hello";
        const expected = "world";
        const result = similarity(given, expected);
        expect(result).toEqual(0.2);
    });

    it('should calculate the similarity between two words', () => {
        const given = "hello";
        const expected = "helloworld";
        const result = similarity(given, expected);
        expect(result).toEqual(0);
    });

    it('should calculate the similarity between two words', () => {
        const given = "helloo";
        const expected = "hello";
        const result = similarity(given, expected);
        expect(result).toEqual(0.8);
    });

    it('should calculate the similarity between two words', () => {
        const given = "hello";
        const expected = "hell";
        const result = similarity(given, expected);
        expect(result).toEqual(0.75);
    });
})

describe('stringComparisonPercentage', () => {
    it('should calculate the similarity percentage correctly', async () => {
        const given = "hello this is a test";
        const expected = "hello this is a test";
        expect(await stringComparisonPercentage(given, expected)).toEqual(100);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "hello this is a test";
        const expected = "hello this is a test string";
        expect(await stringComparisonPercentage(given, expected)).toEqual(83.33);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "hello world";
        const expected = "hello world this is a test";
        expect(await stringComparisonPercentage(given, expected)).toEqual(33.33);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "hello world";
        const expected = "world hello";
        expect(await stringComparisonPercentage(given, expected)).toEqual(20.00);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "hello this is a test";
        const expected = "this is a test";
        expect(await stringComparisonPercentage(given, expected)).toEqual(0);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "helloworld this is a test written by shut";
        const expected = "helloworld this is a test written by shuto";
        expect(await stringComparisonPercentage(given, expected)).toEqual(95.00);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "Pneumonoultramicroscopicsilicovolcanoconiosi";
        const expected = "Pneumonoultramicroscopicsilicovolcanoconiosis";
        expect(await stringComparisonPercentage(given, expected)).toEqual(95.56);
    });
    it('should calculate the similarity percentage correctly', async () => {
        const given = "PneumonoultramicroscopicsilicovolcanoconXosis";
        const expected = "Pneumonoultramicroscopicsilicovolcanoconiosis";
        expect(await stringComparisonPercentage(given, expected)).toEqual(88.89);
    });
})
