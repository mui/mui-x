---
title: Componente React Seletor intervalo de data
components: DateRangePicker, DateRangePickerDay, DesktopDateRangePicker, MobileDateRangePicker, StaticDateRangePicker
githubLabel: 'component: DateRangePicker'
packageName: '@mui/x-date-pickers-pro'
materialDesign: https://material.io/components/date-pickers
---

# Seletor de intervalo de data [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

<p class="description">Seletores de data permitem ao usuário selecionar um intervalo de datas.</p>

Os seletores de intervalo de datas permitem que o usuário selecione um intervalo de datas.

## Utilização Básica

Note que você pode passar quase qualquer propriedade de [DatePicker](/api/date-picker/).

{{"demo": "BasicDateRangePicker.js"}}

## Modo estático

É possível renderizar qualquer seletor em linha. Isto permitirá construir contêineres customizados de popover/modal.

{{"demo": "StaticDateRangePickerDemo.js", "bg": true}}

## Responsividade

O componente de seletor de intervalo de data é projetado e otimizado para o dispositivo em que ele é executado.

- The `MobileDateRangePicker` component works best for touch devices and small screens.
- The `DesktopDateRangePicker` component works best for mouse devices and large screens.

By default, the `DateRangePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches. This can be customized with the `desktopModeMediaQuery` prop.

{{"demo": "ResponsiveDateRangePicker.js"}}

## Propriedades de formulário

The date range picker component can be disabled or read-only.

{{"demo": "FormPropsDateRangePickers.js"}}

## Número diferente de meses

Observe que a propriedade `calendars` só funciona no modo desktop.

{{"demo": "CalendarsDateRangePicker.js"}}

## Desabilitando datas

Desabilitar datas se comporta da mesma forma que `DatePicker`.

{{"demo": "MinMaxDateRangePicker.js"}}

## Componente de entrada customizado

É possível customizar o componente de entrada renderizado com a propriedade `renderInput`. Para o `DateRangePicker` ele recebe **2** parâmetros– para o campo inicial e final, respectivamente. Se você precisar renderizar campos de entrada customizados, certifique-se de encaminhar `ref` e `inputProps` corretamente para os componentes de entrada.

{{"demo": "CustomDateRangeInputs.js"}}

## Renderização customizada do dia

Os dias exibidos são customizados com uma função na propriedade `renderDay`. You can take advantage of the internal [DateRangePickerDay](/api/date-range-picker-day/) component.

{{"demo": "CustomDateRangePickerDay.js"}}
