import * as React from 'react';

import TextField from '@mui/material/TextField';
import { CssBaseline } from '@mui/material';

const useDigitControled = () => {
  const inputRef = React.useRef();
  const mask = '__/__/____';
  const [inputValue, setInputValue] = React.useState('01/34/6789');
  const [focussedIndex, setFocussedIndex] = React.useState(0);

  const onFocus = () => {
    setFocussedIndex(0);
    inputRef.current?.setSelectionRange(0, 1);
  };
  const onSelect = (event) => {
    if (event.currentTarget.selectionStart !== focussedIndex) {
      const newIndex = mask.lastIndexOf('_', event.currentTarget.selectionStart);

      setFocussedIndex(newIndex);
    }
    // inputRef.current?.setSelectionRange(focussedIndex, focussedIndex + 1)
  };

  React.useLayoutEffect(() => {
    inputRef.current?.setSelectionRange(focussedIndex, focussedIndex + 1);
  }, [inputValue, focussedIndex]);

  const onKeyDown = (event) => {
    if (event.key === 'Tab') {
      return;
    }
    event.preventDefault();
    const key = event.key;
    if (/^[0-9]/.test(key)) {
      setInputValue(
        (prevValue) =>
          `${prevValue.slice(0, focussedIndex)}${key}${prevValue.slice(focussedIndex + 1)}`,
      );
      return;
    }
    switch (key) {
      case 'ArrowDown': {
        const value =
          inputValue[focussedIndex] === '_' ? 0 : parseInt(inputValue[focussedIndex], 10);
        const newValue = (value + 9) % 10;
        setInputValue(
          (prevValue) =>
            `${prevValue.slice(0, focussedIndex)}${newValue}${prevValue.slice(focussedIndex + 1)}`,
        );
        inputRef.current?.setSelectionRange(focussedIndex, focussedIndex + 1);
        break;
      }
      case 'ArrowUp': {
        const value =
          inputValue[focussedIndex] === '_' ? 0 : parseInt(inputValue[focussedIndex], 10);
        const newValue = (value + 1) % 10;
        setInputValue(
          (prevValue) =>
            `${prevValue.slice(0, focussedIndex)}${newValue}${prevValue.slice(focussedIndex + 1)}`,
        );
        inputRef.current?.setSelectionRange(focussedIndex, focussedIndex + 1);
        break;
      }
      case 'ArrowLeft': {
        const newIndex = mask.lastIndexOf('_', focussedIndex - 1);

        if (newIndex === focussedIndex) {
          return;
        }
        setFocussedIndex(newIndex);
        inputRef.current?.setSelectionRange(newIndex, newIndex + 1);

        break;
      }
      case 'ArrowRight': {
        const newIndex = mask.indexOf('_', focussedIndex + 1);
        if (newIndex === -1) {
          return;
        }

        setFocussedIndex(newIndex);
        inputRef.current?.setSelectionRange(newIndex, newIndex + 1);
        // Faire quelque chose pour la touche "right arrow" pressée.
        break;
      }
      case 'Backspace':
      case 'Delete': {
        setInputValue(
          (prevValue) =>
            `${prevValue.slice(0, focussedIndex)}_${prevValue.slice(focussedIndex + 1)}`,
        );
      }
      default:
        return;
    }
  };

  const onChange = (event) => {
    console.log('onChange');
    console.log(event);
    inputRef.current?.setSelectionRange(focussedIndex, focussedIndex + 1);
  };
  return [inputRef, inputValue, onFocus, onSelect, onKeyDown, onChange];
};
export default function Playground() {
  const [inputRef, inputValue, onFocus, onSelect, onKeyDown, onChange] = useDigitControled();

  return (
    <CssBaseline>
      <TextField
        inputRef={inputRef}
        value={inputValue}
        onFocus={onFocus}
        inputProps={{ onSelect }}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
      <TextField />
    </CssBaseline>
  );
}
