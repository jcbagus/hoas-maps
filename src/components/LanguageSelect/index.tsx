import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconButton, chakra, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from '../../context/Translations';
import { CloseIcon, LanguagesIcon } from '../Icon';
import RadioButton from '../RadioButton';

import './LanguageSelect.scss';

type LanguageItem = {
  code: string;
  title: string;
};

const LANGUAGES: LanguageItem[] = [
  {
    code: 'fi',
    title: 'suomi',
  },
  {
    code: 'sv',
    title: 'svenska',
  },
  {
    code: 'en',
    title: 'english',
  },
];

function LanguageItem({
  language,
  onChange,
  current,
}: {
  language: LanguageItem;
  onChange: (e: any) => void;
  current: string;
}) {
  return (
    <li className="language-select__item">
      <RadioButton
        onChange={onChange}
        id={language.code}
        value={language.code}
        name="language"
        label={language.title}
        checked={
          current === language.code || (!current && language.code === 'fi')
        }
      />
    </li>
  );
}

function LanguageSelect() {
  const [showList, setShowList] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLanguage } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onChange = (e: any) => {
    searchParams.set('lang', e.target.value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    function handleClickOutside(event: any): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        showList
      ) {
        setShowList(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, showList]);
  const bg = useColorModeValue('white', 'black.200');
  return (
    <div ref={wrapperRef} className="language-select">
      <chakra.ul
        bg={bg}
        className={`language-select__list ${
          showList ? 'language-select__list--open' : ''
        }`}
      >
        {LANGUAGES.map((language) => (
          <LanguageItem
            key={language.code}
            onChange={onChange}
            language={language}
            current={currentLanguage}
          />
        ))}
      </chakra.ul>

      <div className="language-select__toggle-btn-wrap">
        <IconButton
          bg="white"
          h="47px"
          w="47px"
          aria-label="Language Select"
          variant="buttonWithIcon"
          onClick={() => setShowList((current) => !current)}
          type="button"
          className={`button language-select__toggle-btn ${
            showList ? 'language-select__toggle-btn--close' : ''
          }`}
        >
          {showList ? (
            <CloseIcon />
          ) : (
            <div>
              <div className="selectedLanguage">{currentLanguage}</div>
            </div>
          )}
        </IconButton>
      </div>
    </div>
  );
}

export default LanguageSelect;
