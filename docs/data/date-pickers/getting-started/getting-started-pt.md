---
title: Componente React para Data e Hora
components: TextField
githubLabel: 'component: DatePicker'
materialDesign: https://material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
packageName: '@mui/x-date-pickers'
---

# Seletores Data / Hora

<p class="description">Seletores de data e seletores de hora fornecem uma maneira simples de selecionar um único valor de um conjunto pré-determinado.</p>

- Em dispositivos móveis, seletores são melhores aplicados quando mostrados em diálogos de confirmação.
- Para exibição em linha, como em um formulário, considere usar controles compactos, como botões suspensos segmentados.

## Componentes React

{{"demo": "MaterialUIPickers.js"}}

### Seletor de data

⚠️ O suporte dos navegadores aos controles de entrada nativos [não é perfeito](https://caniuse.com/#feat=input-datetime).

Um exemplo de seletor de data nativo com `type="date"`.

- [date-fns](https://date-fns.org/)
- [Day.js](https://day.js.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

{{"demo": "DatePickers.js"}}

```sh
// date-fns
npm install @date-io/date-fns
// or for Day.js
npm install @date-io/dayjs
// or for Luxon
npm install @date-io/luxon
// or for Moment.js
npm install @date-io/moment
```

Um exemplo de seletor de data & hora nativo com `type="datetime-local"`.

```js
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// or for Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// or for Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

function App({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </LocalizationProvider>
  );
}
```

## Seletores nativos

⚠️ O suporte dos navegadores aos controles de entrada nativos [não é perfeito](https://caniuse.com/#feat=input-datetime).

Um exemplo de seletor de hora nativo com `type="time"`.

{{"demo": "TimePickers.js"}}
