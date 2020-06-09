
//license info separated with comma
//followed by expiry date clear
//followed by version in [v2.1.2]
//followed by base64 encoded expiry date timestamp
//Followed by all above md5 hashed
//ie: CompanyName=HACKED,LicensedGroup=Multi,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=9,LicensedProductionInstancesCount=3,AssetReference=AG-0,ExpiryDate=5_August_2023_[v2]_MTY5MTIyOTg4NjcyNg==8406da7d9e60903f558cd078aae5c155
/*
*
*  MUI License Details
*  Name: Damien Tassone
*  DeveloperCount: 9
*  Expiry Date: 24/6/2012
*  Version: 2.1.2.3
*
*
* */

// const clearLicense = 'NAME=DAMIEN_TASSONE,DEVELOPER_COUNT=9,EXPIRY=20/01/2021,VERSION=232'
// const encodedLicence = `${MD5(base64Encode(clearLicense))}${base64Encode(clearLicense)}`
// => 7f4bf70a5169db5bc60d8bd34533ccd4TkFNRT1EQU1JRU5fVEFTU09ORSxERVZFTE9QRVJfQ09VTlQ9OSxFWFBJUlk9MjAvMDEvMjAyMSxWRVJTSU9OPTIzMg==
//CHECKS TO VALIDATE
//extract md5 value = encodedLicence.substr(0, 32) => Check === MD5(encodedLicense.substr(32))
//base64 decode encodedLicense.substr(32), extract expiry date and check is less than now