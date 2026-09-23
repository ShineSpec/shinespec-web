import QRCode from 'qrcode';

/**
 * Generate QR code for SnapScan payment
 * @param {string} merchantId - PayFast Merchant ID
 * @param {number} amount - Payment amount in ZAR
 * @returns {Promise<string>} - QR code data URL
 */
export const generateSnapScanQR = async (merchantId, amount) => {
  try {
    const snapScanUrl = `https://snapscan.io/pay/${merchantId}/${amount.toFixed(2)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(snapScanUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code for any URL
 * @param {string} url - URL to encode
 * @returns {Promise<string>} - QR code data URL
 */
export const generateQRCode = async (url) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};
