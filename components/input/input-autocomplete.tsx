'use client';
import {
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';
import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { Company } from '@/src/model/company';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  options: Company[];
  name: string;
  setCompanySelected: Dispatch<SetStateAction<Company | undefined>>;
  companySelected: Company | undefined;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (row: Company) => Promise<void>;
  setValue: Dispatch<SetStateAction<string>>;
  value: string;
  universalDictionary: Record<string, string[]>;
};

function removeAccents(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapa caracteres especiais
}

function highlightMatch(word: string, query: string) {
  const escapedQuery = escapeRegExp(query); // Escapa os caracteres especiais
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return word.replace(regex, '<mark>$1</mark>');
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

      // Também busca por fragmentos dentro dos sinônimos
      const matchingSynonyms = synonyms.filter((synonym) =>
        removeAccents(synonym.toLowerCase()).includes(fragment)
      );
      if (matchingSynonyms.length > 0) {
        return [key, ...matchingSynonyms];
      }

      return [];
    }
  );

  // Se nada foi encontrado no dicionário, retorna o fragmento original
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
      universalDictionary,
      ...props
    },
    ref
  ) => {
    const [filteredOptions, setFilteredOptions] = useState<Company[]>([]);
    const [notFind, setNotFind] = useState(false);
    const inputId = useId();

    const handleChange = (inputValue: string) => {
      setValue(inputValue);

      if (inputValue === '') {
        setFilteredOptions([]);
        return;
      }

      const cleanedInput = removeAccents(inputValue.toLowerCase());
      const inputWords = cleanedInput.split(' ').filter(Boolean);

      const filtered = options.filter(({ trade_name, company_name }) => {
        const cleanTradeName = removeAccents(trade_name.toLowerCase());
        const cleanCompanyName = removeAccents(
          (company_name || '').toLowerCase()
        );

        // Verifica se todos os fragmentos têm correspondências parciais
        const matchesAllInputs = inputWords.every((inputFragment) => {
          const expandedFragment = expandWithUniversalDictionary(
            inputFragment,
            universalDictionary
          );

          return expandedFragment.some((expInput) => {
            return (
              cleanTradeName.includes(expInput) ||
              cleanCompanyName.includes(expInput)
            );
          });
        });

        return matchesAllInputs;
      });

      setFilteredOptions(filtered);
      setNotFind(filtered.length === 0);
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
      filteredOptions.sort((a, b) => a.trade_name.localeCompare(b.trade_name));
      return filteredOptions.slice(0, 1000).map((company) => {
        const highlightedWord = highlightMatch(
          company.trade_name,
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
                className={`absolute max-h-52 z-40 overflow-y-auto bg-[#272727] w-5/6 rounded-md top-full`}
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
