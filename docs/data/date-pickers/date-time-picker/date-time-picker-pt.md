---
title: Componente React Seletor de data e hora
components: DateTimePicker,DesktopDateTimePicker,MobileDateTimePicker,StaticDateTimePicker
githubLabel: 'component: DateTimePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://material.io/components/date-pickers
---

# Seletor de data e hora

<p class="description">Seletor de data & hora combinados.</p>

Este componente combina os seletores de data & hora. Ele permite que o usuário selecione data e hora com o mesmo controle.

Note que este componente é cobinação dos componentes [DatePicker](/x/react-date-pickers/date-picker/) e[TimePicker](/x/react-date-pickers/time-picker/), então qualquer uma das propriedades desses componentes pode ser passada para o DateTimePicker.

## Utilização Básica

Permite escolher a data e hora. Existem 4 etapas disponíveis (ano, data, hora e minuto), então as abas são necessárias para distinguir visualmente os passos de data/hora.

{{"demo": "BasicDateTimePicker.js"}}

## Responsividade

O componente `DateTimePicker` é projetado e otimizado para o dispositivo em que ele é executado.

- The `MobileDateTimePicker` component works best for touch devices and small screens.
- The `DesktopDateTimePicker` component works best for mouse devices and large screens.

By default, the `DateTimePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches. Isto pode ser customizado com a propriedade `desktopModeMediaQuery`.

{{"demo": "ResponsiveDateTimePickers.js"}}

## Propriedades de formulário

The date time picker component can be disabled or read-only.

{{"demo": "FormPropsDateTimePickers.js"}}

## Validação de data e hora

É possível restringir a seleção de data e hora de duas maneiras:

- por meio de `minDateTime`/`maxDateTime` é possível restringir a seleção de tempo para antes ou após um determinado momento no tempo
- usando `minTime`/`maxTime`, você pode desabilitar selecionar horas antes ou depois de um certo tempo a cada dia, respectivamente

{{"demo": "DateTimeValidation.js"}}

## Modo estático

It's possible to render any date & time picker inline. Isto permitirá construir contêineres customizados de popover/modal.

{{"demo": "StaticDateTimePickerDemo.js", "bg": true}}

## Customização

Aqui estão alguns exemplos de seletores de data & hora fortemente customizados:

{{"demo": "CustomDateTimePicker.js"}}
