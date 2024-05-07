// async function stringComparisonPercentage(given, expected) {
//     return new Promise((resolve, reject) => {
//         // Convert the strings to lowercase and split the string into arrays of words
//         const givenWords = given.toLowerCase().split(" ");
//         const expectedWords = expected.toLowerCase().split(" ");
//         const wordCount = Math.min(givenWords.length, expectedWords.length);
//         if (wordCount === 0) {
//             resolve(0);
//         }
//         const totalSimilarity = givenWords.slice(0, wordCount).map((word, index) => {
//             return similarity(word, expectedWords[index]) / wordCount;
//         }).reduce((acc, val) => acc + val, 0);
//         const percentage = 100 * (totalSimilarity - Math.abs(givenWords.length - expectedWords.length)/expectedWords.length);
//         if (percentage < 0) {
//             resolve(0);
//         }
//         resolve(parseFloat(percentage.toFixed(2)));
//     })
// }

// function similarity(given, expected) {
//     // Used Equation: x = (sequenceCount - absolute(given.length - expected.length)) / expected.length
//     // Get the maximum number of sequence
//     sequenceCount = 0;
//     for (i = 0; i < given.length; i++) {
//         for (j = i+1; j <= given.length; j++) {
//             sub = given.substring(i, j);
//             if (expected.indexOf(sub) != -1) {
//                 if (sequenceCount < sub.length) {
//                     sequenceCount = sub.length;
//                 }
//             }
//         }
//     }
//     const similarityRate = parseFloat(((sequenceCount - Math.abs(given.length - expected.length)) / expected.length).toFixed(5));
//     return similarityRate < 0 ? 0 : similarityRate;
// }
function normalizeString(str) {
    return str.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

function similarity(given, expected) {
    if (given === expected) return 1;
    const maxLen = Math.max(given.length, expected.length);
    const editDistance = levenshteinDistance(given, expected);
    return (maxLen - editDistance) / maxLen;
}

function levenshteinDistance(s1, s2) {
    const costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

async function stringComparisonPercentage(given, expected) {
    return new Promise((resolve, reject) => {
        const givenNormalized = normalizeString(given);
        const expectedNormalized = normalizeString(expected);

        if (expectedNormalized.length === 0) {
            resolve(0);
            return;
        }

        const similarityScore = similarity(givenNormalized, expectedNormalized);
        const percentage = 100 * similarityScore;
        resolve(parseFloat(percentage.toFixed(2)));
    });
}

module.exports = { similarity, stringComparisonPercentage};