import {base64Decode} from "../encoding/base64";

export const decodeLicense = (encodedLicense: string) => {
    const license = base64Decode(encodedLicense);

    return license
}