# GridPrintExportOptions Interface

<p class="description">The options to apply on the Print export.</p>

## Import

```js
import { GridPrintExportOptions } from '@mui/x-data-grid-pro';
// or
import { GridPrintExportOptions } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                            | Type                                              | Default                                                        | Description                                                                                                                                |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------ | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">boolean</span>            | <span class="prop-default">false<br /></span>                  | If `true`, the hidden columns will also be printed.                                                                                        |
| <span class="prop-name optional">bodyClassName<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">string</span>             |                                                                | One or more classes passed to the print window.                                                                                            |
| <span class="prop-name optional">copyStyles<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">boolean</span>            | <span class="prop-default">true<br /></span>                   | If `false`, all &lt;style&gt; and &lt;link type="stylesheet" /&gt; tags from the &lt;head&gt; will not be copied<br />to the print window. |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">string[]</span>           |                                                                | The columns to be printed.<br />This should only be used if you want to restrict the columns exported.                                     |
| <span class="prop-name optional">fileName<sup><abbr title="optional">?</abbr></sup></span>      | <span class="prop-type">string</span>             | <span class="prop-default">The title of the page.<br /></span> | The value to be used as the print window title.                                                                                            |
| <span class="prop-name optional">hideFooter<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">boolean</span>            | <span class="prop-default">false<br /></span>                  | If `true`, the footer is removed for when printing.                                                                                        |
| <span class="prop-name optional">hideToolbar<sup><abbr title="optional">?</abbr></sup></span>   | <span class="prop-type">boolean</span>            | <span class="prop-default">false<br /></span>                  | If `true`, the toolbar is removed for when printing.                                                                                       |
| <span class="prop-name optional">pageStyle<sup><abbr title="optional">?</abbr></sup></span>     | <span class="prop-type">string \| Function</span> |                                                                | Provide Print specific styles to the print window.                                                                                         |
