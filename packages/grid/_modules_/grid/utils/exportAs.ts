export const exportAs = (blob: Blob, extension: string, filename: string): void => {
  console.log(blob)
  /* taken from react-csv */
  if (navigator && navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    let dataURI = '';
    // TODO: Handle more export cases in future
    if (extension === 'csv') {
      dataURI = `data:text/csv;charset=utf-8,${'csv'}`;
    }

    const URL = window.URL || window.webkitURL;
    const downloadURI = typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', downloadURI);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};