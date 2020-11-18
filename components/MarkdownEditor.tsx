import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Editor from 'rich-markdown-editor';

import { getTheme } from '../redux/selectors/settings.selectors';
import PersonsHelper from './PersonsHelper';

interface MarkdownEditorParams {
  defaultValue: string;
  placeholder: string;
  onChange: (description: string) => void;
}

import { dark, light } from 'rich-markdown-editor/dist/theme';

const MarkdownEditor = ({
  defaultValue,
  placeholder,
  onChange,
}: MarkdownEditorParams): JSX.Element => {
  const [showUserHelper, setShowUserHelper] = useState(false);
  const [lastHandlerIndex, setLastHandlerIndex] = useState(null);
  const [editorKey, setEditorKey] = useState(defaultValue);
  const globalTheme = useSelector(getTheme);

  useEffect(() => {
    if (lastHandlerIndex && defaultValue?.length <= lastHandlerIndex) {
      setShowUserHelper(false);
      setLastHandlerIndex(null);
    }
    if (defaultValue?.endsWith('@')) {
      setShowUserHelper(true);
      setLastHandlerIndex(defaultValue?.lastIndexOf('@'));
    }
  }, [defaultValue]);

  const handleUserSelect = userName => {
    const textUntilHandler = defaultValue.slice(0, defaultValue.lastIndexOf('@'));
    const withName = `${textUntilHandler}@${userName} `;
    onChange(withName);
    setShowUserHelper(false);
    setEditorKey(withName);
  };

  const modifiedDark = { ...dark, background: 'transparent' };
  const markdownTheme = globalTheme === 'dark' ? modifiedDark : light;
  const nameBeignAdded =
    defaultValue?.lastIndexOf('@') > 0
      ? defaultValue.slice(defaultValue.lastIndexOf('@') + 1)
      : null;

  return (
    <>
      <Editor
        key={editorKey}
        defaultValue={defaultValue}
        placeholder={placeholder}
        dark={globalTheme === 'dark'}
        onChange={value => {
          const changedValue = value();
          onChange(changedValue);
        }}
        theme={{ ...markdownTheme, zIndex: 10000 }}
      />
      {showUserHelper && (
        <PersonsHelper currentInput={nameBeignAdded} onSelect={handleUserSelect} />
      )}
    </>
  );
};

export default MarkdownEditor;
