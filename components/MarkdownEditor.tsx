import { useSelector } from 'react-redux';
import Editor from 'rich-markdown-editor';

import { getTheme } from '../redux/selectors/settings.selectors';

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
  const globalTheme = useSelector(getTheme);
  const modifiedDark = { ...dark, background: 'transparent' };
  const markdownTheme = globalTheme === 'dark' ? modifiedDark : light;

  return (
    <Editor
      defaultValue={defaultValue}
      placeholder={placeholder}
      dark={globalTheme === 'dark'}
      onChange={value => {
        const changedValue = value();
        onChange(changedValue);
      }}
      theme={{ ...markdownTheme, zIndex: 10000 }}
    />
  );
};

export default MarkdownEditor;
