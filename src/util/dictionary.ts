export function buildUniversalDictionary(
  dictionary: { key_word: string; synonyms: string[] }[]
): Record<string, string[]> {
  if (!dictionary) return {};
  const universalDict: Record<string, Set<string>> = {};

  const connectWords = (word: string, synonyms: string[]) => {
    if (!universalDict[word]) {
      universalDict[word] = new Set();
    }
    universalDict[word].add(word);

    synonyms.forEach((synonym) => {
      if (!universalDict[synonym]) {
        universalDict[synonym] = new Set();
      }
      universalDict[synonym].add(word);
      universalDict[word].add(synonym);
    });
  };

  dictionary.forEach(({ key_word, synonyms }) => {
    connectWords(key_word, synonyms);
    synonyms.forEach((synonym) =>
      connectWords(synonym, [
        key_word,
        ...synonyms.filter((v) => v !== synonym)
      ])
    );
  });

  const universalDictAsArrays: Record<string, string[]> = {};
  Object.entries(universalDict).forEach(([key, values]) => {
    universalDictAsArrays[key] = Array.from(values);
  });

  return universalDictAsArrays;
}
