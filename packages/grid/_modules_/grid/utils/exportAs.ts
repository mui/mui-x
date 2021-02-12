// export const exportAs = (blob: Blob, extension: string, filename: string): void => {
//   /* taken from react-csv */
//   if (navigator && navigator.msSaveOrOpenBlob) {
//     navigator.msSaveOrOpenBlob(blob, filename);
//   } else {
//     let dataURI = '';
//     // TODO: Handle more export cases in future
//     if (extension === 'csv') {
//       dataURI = `data:text/csv;charset=utf-8,${'csv'}`;
//     }

//     const URL = window.URL || window.webkitURL;
//     const downloadURI =
//       typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.setAttribute('href', downloadURI);
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
// };

/**
 * I have hesitate to use https://github.com/eligrey/FileSaver.js.
 * If we get bug reports that this project solves, we should consider using it.
 *
 * Related resources.
 * https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
 * https://github.com/mbrn/filefy/blob/ec4ed0b7415d93be7158c23029f2ea1fa0b8e2d9/src/core/BaseBuilder.ts
 * https://unpkg.com/browse/@progress/kendo-file-saver@1.0.7/dist/es/save-as.js
 * https://github.com/ag-grid/ag-grid/blob/9565c219b6210aa85fa833c929d0728f9d163a91/community-modules/csv-export/src/csvExport/downloader.ts
 */
export function exportAs(blob: Blob, extension: string = 'txt', filename: string = document.title): void {
  const fullName = `${filename}.${extension}`;

  // Test download attribute first
  // https://github.com/eligrey/FileSaver.js/issues/193
  if ('download' in HTMLAnchorElement.prototype) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = fullName;

    // Programmatically trigger a click on the anchor element
    // Useful if you want the download to happen automatically
    // Without attaching the anchor element to the DOM
    a.click();

    // https://github.com/eligrey/FileSaver.js/issues/205
    setTimeout(() => {
      URL.revokeObjectURL(url);
    });
    return;
  }

  throw new Error('exportAs not supported');
}