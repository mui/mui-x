export interface TreeItem2LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /**
   * Used to determine if the target of keydown or blur events is the input and prevent the event from propagating to the root.
   */
  'data-element'?: 'labelInput';
}
