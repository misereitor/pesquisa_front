'use client';
import {
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect
} from 'react';
import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { Company } from '@/model/company';
import { DictionaryEntry } from '@/model/dictionary';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  options: Company[];
  name: string;
  setCompanySelected: Dispatch<SetStateAction<Company | undefined>>;
  companySelected: Company | undefined;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (row: Company) => Promise<void>;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  dictionaryFromService: DictionaryEntry[];
};

function removeAccents(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function highlightMatch(word: string, query: string) {
  const regex = new RegExp(`(${query})`, 'gi');
  return word.replace(regex, '<mark>$1</mark>');
}

function buildUniversalDictionary(
  dictionary: { key_word: string; synonyms: string[] }[]
): Record<string, string[]> {
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

function expandWithUniversalDictionary(
  fragment: string,
  dictionary: Record<string, string[]>
): string[] {
  const expandedWords = Object.entries(dictionary).flatMap(
    ([key, synonyms]) => {
      const cleanKey = removeAccents(key.toLowerCase());
      if (cleanKey.includes(fragment)) {
        return [key, ...synonyms];
      }
      return [];
    }
  );
  return expandedWords.length > 0 ? expandedWords : [fragment];
}

const InputAutocomplete = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      options,
      companySelected,
      setCompanySelected,
      handleSubmit,
      setValue,
      value,
      dictionaryFromService,
      ...props
    },
    ref
  ) => {
    const [filteredOptions, setFilteredOptions] = useState<Company[]>([]);
    const [notFind, setNotFind] = useState(false);
    const [showAbove, setShowAbove] = useState(false);
    const inputId = useId();

    useEffect(() => {
      const calculateDropdownPosition = () => {
        const inputElement = document.getElementById(inputId);
        const dropdownElement = document.getElementById(`${inputId}-dropdown`);

        if (inputElement && dropdownElement) {
          const inputRect = inputElement.getBoundingClientRect();
          const dropdownHeight = dropdownElement.offsetHeight;

          // Tamanho customizado (ex: 200px de espaço mínimo)
          const minSpaceBelow = 100;

          // Verifica se há espaço suficiente abaixo do campo
          const isCloseToBottom =
            window.innerHeight - inputRect.bottom <
            dropdownHeight + minSpaceBelow;

          setShowAbove(isCloseToBottom);
        }
      };
      // Calcular posição inicialmente
      calculateDropdownPosition();

      // Adicionar listener de scroll e resize
      const handleScrollOrResize = () => {
        calculateDropdownPosition();
      };

      window.addEventListener('scroll', handleScrollOrResize);
      window.addEventListener('resize', handleScrollOrResize);

      return () => {
        // Remover listeners ao desmontar
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }, [value, filteredOptions, inputId]);

    const universalDictionary = useMemo(
      () => buildUniversalDictionary(dictionaryFromService),
      [dictionaryFromService]
    );

    const handleChange = (inputValue: string) => {
      setValue(inputValue);

      if (inputValue === '') {
        setFilteredOptions([]);
        return;
      }

      const cleanedInput = removeAccents(inputValue.toLowerCase());
      const inputWords = cleanedInput.split(' ').filter(Boolean);

      const uniqueWords = new Set(inputWords);
      if (uniqueWords.size < inputWords.length) {
        setFilteredOptions([]);
        return;
      }

      const filteredByWords = options.filter(({ trade_name }) => {
        const cleanWord = removeAccents(trade_name.toLowerCase());
        return inputWords.every((inputFragment) =>
          cleanWord.includes(inputFragment)
        );
      });

      if (filteredByWords.length > 0) {
        setFilteredOptions(filteredByWords);

        return;
      }
      setNotFind(true);

      const filtered = options.filter(({ trade_name, company_name }) => {
        const cleanWord = removeAccents(trade_name.toLowerCase());

        const matchesAllInputs = inputWords.every((inputFragment) => {
          const expandedFragment = expandWithUniversalDictionary(
            inputFragment,
            universalDictionary
          );

          const matchesWord = expandedFragment.some((expInput) =>
            cleanWord.includes(expInput)
          );
          let matchesSynonym = false;
          if (company_name) {
            const cleanSynonym = removeAccents(company_name?.toLowerCase());
            matchesSynonym = expandedFragment.some((expInput) =>
              cleanSynonym.includes(expInput)
            );
          }

          return matchesWord || matchesSynonym;
        });

        return matchesAllInputs;
      });
      setFilteredOptions(filtered);
    };

    const handleBlur = () => {
      setFilteredOptions([]);
      setNotFind(false);
      if (!companySelected) {
        setValue('');
        return;
      }
      if (companySelected.trade_name !== value)
        setValue(companySelected.trade_name);
      return;
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
      return filteredOptions.map((company) => {
        const highlightedWord = highlightMatch(
          removeAccents(company.trade_name),
          cleanedInput
        );
        return (
          <li
            key={company.trade_name}
            className="hover:bg-[#4d4d4d] cursor-pointer"
            dangerouslySetInnerHTML={{ __html: highlightedWord }}
            onMouseDown={() => {
              handleOptionClick(company.trade_name);
              setCompanySelected(company);
              setNotFind(false);
              handleSubmit(company);
            }}
          />
        );
      });
    }, [
      filteredOptions,
      handleOptionClick,
      handleSubmit,
      setCompanySelected,
      value
    ]);

    return (
      <div className="w-full">
        <div className="w-full">
          <div className="w-full">
            <input
              id={inputId}
              name={name}
              type={type}
              autoComplete="off"
              autoFocus
              onFocusCapture={() => handleChange(value)}
              onBlur={handleBlur}
              ref={ref}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              {...props}
              className="w-5/6 rounded-md h-10"
            />
          </div>
          {value && (
            <div className="relative min-w-full">
              <ul
                id={`${inputId}-dropdown`}
                className={`absolute max-h-52 z-40 overflow-y-auto bg-[#272727] w-5/6 rounded-md ${
                  showAbove ? 'bottom-12' : 'top-full'
                }`}
              >
                {renderedOptions.length > 0
                  ? renderedOptions
                  : notFind && <li>Não encontrado</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputAutocomplete.displayName = 'InputAutocomplete';

export default InputAutocomplete;
