async function stringComparisonPercentage(given, expected) {
    return new Promise((resolve, reject) => {
        // Convert the strings to lowercase and split the string into arrays of words
        const givenWords = given.toLowerCase().split(" ");
        const expectedWords = expected.toLowerCase().split(" ");
        const wordCount = Math.min(givenWords.length, expectedWords.length);
        if (wordCount === 0) {
            resolve(0);
        }
        const totalSimilarity = givenWords.slice(0, wordCount).map((word, index) => {
            return similarity(word, expectedWords[index]) / wordCount;
        }).reduce((acc, val) => acc + val, 0);
        const percentage = 100 * (totalSimilarity - Math.abs(givenWords.length - expectedWords.length)/expectedWords.length);
        if (percentage < 0) {
            resolve(0);
        }
        resolve(parseFloat(percentage.toFixed(2)));
    })
}

function similarity(given, expected) {
    // Used Equation: x = (sequenceCount - absolute(given.length - expected.length)) / expected.length
    // Get the maximum number of sequence
    sequenceCount = 0;
    for (i = 0; i < given.length; i++) {
        for (j = i+1; j <= given.length; j++) {
            sub = given.substring(i, j);
            if (expected.indexOf(sub) != -1) {
                if (sequenceCount < sub.length) {
                    sequenceCount = sub.length;
                }
            }
        }
    }
    const similarityRate = parseFloat(((sequenceCount - Math.abs(given.length - expected.length)) / expected.length).toFixed(5));
    return similarityRate < 0 ? 0 : similarityRate;
}

module.exports = { similarity, stringComparisonPercentage};