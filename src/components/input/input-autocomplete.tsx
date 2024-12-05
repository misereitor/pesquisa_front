'use client';
import {
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';
import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { substitutionDictionary } from '@/util/dictionary';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errortext?: string;
  options: Option[];
  setValue: Dispatch<SetStateAction<string>>;
  name: string;
  value: string;
};

interface Option {
  word: string;
  synonyms: string[];
}

// Função para remover acentos de uma string
function removeAccents(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Função para realçar correspondências com a consulta do usuário
function highlightMatch(word: string, query: string) {
  const regex = new RegExp(`(${query})`, 'gi');
  return word.replace(regex, '<mark>$1</mark>');
}

// Função para expandir o dicionário de forma bidirecional
function buildUniversalDictionary(
  dictionary: Record<string, string[]>
): Record<string, string[]> {
  const universalDict: Record<string, Set<string>> = {};

  // Função auxiliar para conectar todas as palavras relacionadas
  const connectWords = (word: string, synonyms: string[]) => {
    if (!universalDict[word]) {
      universalDict[word] = new Set();
    }
    universalDict[word].add(word); // Adiciona a própria palavra

    synonyms.forEach((synonym) => {
      if (!universalDict[synonym]) {
        universalDict[synonym] = new Set();
      }
      // Conecta as palavras e sinônimos em ambas as direções
      universalDict[synonym].add(word);
      universalDict[word].add(synonym);
    });
  };

  // Processa o dicionário original
  Object.entries(dictionary).forEach(([key, values]) => {
    connectWords(key, values);
    values.forEach((value) =>
      connectWords(value, [key, ...values.filter((v) => v !== value)])
    );
  });

  // Converte os sets para arrays
  const universalDictAsArrays: Record<string, string[]> = {};
  Object.entries(universalDict).forEach(([key, values]) => {
    universalDictAsArrays[key] = Array.from(values);
  });

  return universalDictAsArrays;
}

// Função para expandir fragmentos de entrada com base no dicionário universal
function expandWithUniversalDictionary(
  fragment: string,
  dictionary: Record<string, string[]>
): string[] {
  const expandedWords = Object.keys(dictionary).flatMap((key) => {
    const cleanKey = removeAccents(key.toLowerCase());
    if (cleanKey.includes(fragment)) {
      return dictionary[cleanKey]; // Retorna todas as palavras relacionadas
    }
    return [];
  });
  return expandedWords.length > 0 ? expandedWords : [fragment]; // Retorna o fragmento se não houver correspondências
}

const InputAutocomplete = forwardRef<HTMLInputElement, InputProps>(
  (
    { type = 'text', name, label = '', options, setValue, value, ...props },
    ref
  ) => {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const inputId = useId();

    // Cria o dicionário universal uma única vez
    const universalDictionary = useMemo(
      () => buildUniversalDictionary(substitutionDictionary),
      []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setValue(inputValue);

      if (inputValue === '') {
        setFilteredOptions([]);
        return;
      }

      // Limpa o valor de entrada e separa em palavras
      const cleanedInput = removeAccents(inputValue.toLowerCase());
      const inputWords = cleanedInput.split(' ').filter(Boolean); // Separa o input em palavras, ignorando fragmentos vazios

      // ** Nova verificação para evitar resultados com palavras repetidas **
      const uniqueWords = new Set(inputWords);
      if (uniqueWords.size < inputWords.length) {
        // Se o número de palavras únicas for menor do que o número total de palavras, não retorna nada.
        setFilteredOptions([]);
        return;
      }

      // Filtra as opções diretamente pelas palavras completas
      const filteredByWords = options.filter(({ word }) => {
        const cleanWord = removeAccents(word.toLowerCase());
        return inputWords.every((inputFragment) =>
          cleanWord.includes(inputFragment)
        );
      });

      // Se as opções filtradas pela palavra não estão vazias, exibe essas opções
      if (filteredByWords.length > 0) {
        setFilteredOptions(filteredByWords);
        return;
      }

      // Filtra as opções baseado em todas as palavras digitadas
      const filtered = options.filter(({ word, synonyms }) => {
        const cleanWord = removeAccents(word.toLowerCase());

        // Para cada opção, todas as palavras digitadas precisam encontrar correspondências
        const matchesAllInputs = inputWords.every((inputFragment) => {
          // Expande o fragmento com o dicionário
          const expandedFragment = expandWithUniversalDictionary(
            inputFragment,
            universalDictionary
          );

          // Verifica se o fragmento corresponde à palavra ou a seus sinônimos
          const matchesWord = expandedFragment.some((expInput) =>
            cleanWord.includes(expInput)
          );
          const matchesSynonym = synonyms.some((synonym) => {
            const cleanSynonym = removeAccents(synonym.toLowerCase());
            return expandedFragment.some((expInput) =>
              cleanSynonym.includes(expInput)
            );
          });

          return matchesWord || matchesSynonym;
        });

        return matchesAllInputs;
      });

      setFilteredOptions(filtered);
    };

    const handleOptionClick = useCallback(
      (selectedWord: string) => {
        setValue(selectedWord);
        setFilteredOptions([]);
      },
      [setValue, setFilteredOptions]
    );

    const renderedOptions = useMemo(() => {
      const cleanedInput = removeAccents(value.toLowerCase());
      return filteredOptions.map(({ word }) => {
        const highlightedWord = highlightMatch(
          removeAccents(word),
          cleanedInput
        );
        return (
          <li
            key={word}
            dangerouslySetInnerHTML={{ __html: highlightedWord }}
            onClick={() => handleOptionClick(word)}
          />
        );
      });
    }, [filteredOptions, handleOptionClick, value]);

    return (
      <div>
        <div>
          <div>
            <label htmlFor={inputId}>{label}</label>
            <input
              id={inputId}
              name={name}
              type={type}
              ref={ref}
              value={value}
              onChange={handleChange}
              {...props}
            />
          </div>
          {value && (
            <ul>
              {renderedOptions.length > 0 ? (
                renderedOptions
              ) : (
                <li>Não encontrado</li>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

InputAutocomplete.displayName = 'InputAutocomplete';

export default InputAutocomplete;
