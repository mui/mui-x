import NextDocument from 'next/document';
import { Document, createGetInitialProps } from '@mui/internal-core-docs/Document';
import type { DocumentProps } from '@mui/internal-core-docs/Document';

export default class MuiXDocument extends NextDocument {
  static getInitialProps = createGetInitialProps();

  render() {
    return <Document {...(this.props as unknown as DocumentProps)} />;
  }
}
