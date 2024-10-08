import { style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 262px)',
  boxSizing: 'border-box',
  paddingTop: '50px',
  alignItems: 'center',
});

export const title = style({
  color: 'black ',
  textAlign: 'center',
  fontSize: '32px',
});

export const inputSection = style({
  paddingTop: '50px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const inputLabel = style({ display: 'flex', flexDirection: 'column', gap: '6px' });

export const joinInput = style({
  display: 'flex',
  maxWidth: '368px',
  width: '100%',
  borderRadius: '4px',
  padding: '12px 16px',
  alignItems: 'flex-start',
  gap: '8px',
  border: '1.5px solid black',
  background: '#FFF',
});

export const inputValidation = style({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  color: '#FF0000',
  fontSize: '14px',
  marginLeft: '8px',
});

export const error = style({
  color: '#FF0000',
});

export const correct = style({
  color: 'green',
});

export const submitButton = style({
  marginTop: '30px',
  width: '402px',
  padding: '15px 62px',
  background: 'black ',
  color: '#FFF',
  fontSize: '16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
});

const buttonBase = style({
  display: 'flex',
  color: '#FFF',
  fontSize: '14px',
  width: '80px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  cursor: 'pointer',
});

export const checkButton = styleVariants({
  default: [
    buttonBase,
    {
      background: 'black',
    },
  ],
  disabled: [
    buttonBase,
    {
      background: '#C4C4C4',
      cursor: 'not-allowed',
    },
  ],
  confirm: [
    buttonBase,
    {
      background: '#C4C4C4',
      cursor: 'not-allowed',
    },
  ],
});

export const checkInputWrapper = style({
  display: 'flex',
  justifyContent: 'center ',
  gap: '8px',
});
