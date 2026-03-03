import NextDocument from 'next/document';
import { Document, createGetInitialProps } from '@mui/docs/Document';

export default class MuiXDocument extends NextDocument {
  static getInitialProps = createGetInitialProps({ setupStyledComponents: false });

  render() {
    return <Document {...this.props} />;
  }
}
