/*
    * From XMLSERVICEQUICK reference
    * http://yips.idevcloud.com/wiki/index.php/XMLService/XMLSERVICEQuick
    *
    * data       - data value name (tag)
    * values     - value,
    * type
    *     3i0                   int8/byte     D myint8   3i 0
    *     5i0                   int16/short   D myint16  5i 0
    *     10i0                  int32/int     D myint32 10i 0
    *     20i0                  int64/int64   D myint64 20i 0
    *     3u0                   uint8/ubyte   D myint8   3u 0
    *     5u0                   uint16/ushort D myint16  5u 0
    *     10u0                  uint32/uint   D myint32 10u 0
    *     20u0                  uint64/uint64 D myint64 20u 0
    *     32a                   char          D mychar  32a
    *     32a   {varying2} varchar            D mychar  32a   varying
    *     32a   {varying4} varchar4           D mychar  32a   varying(4)
    *     12p2                  packed        D mydec   12p 2
    *     12s2                  zoned         D myzone  12s 2
    *     4f2                   float         D myfloat  4f
    *     8f4                   real/double   D myfloat  8f
    *     3b                    binary        D mybin   (any)
*/

/**
 * @param {number} length - The number of binary characters.
 * @returns {string} - The binary data type format expected by xml service.
 */

function Binary(length) {
  return `${length}b`;
}

/**
 * @param {number} length - The number of characters within the varchar.
 * @returns {string} - The character data type format expected by xml service.
 */
function Char(length) {
  return `${length}a`;
}

/**
 * @returns {string} - The double data type format expected by xml service.
 */
function Double() {
  return '8F4';
}

/**
 * @returns {string} - The float data type format expected by xml service.
 */
function Float() {
  return '4F2';
}

/**
 * @param {number} length - The number of characters.
 * @returns {string} - The long varchar data type format expected by
 * xml service.
 */
function LongVarchar(length) {
  return { type: `${length}a`, varying: '4' };
}

/**
 * @param {number} totalDigits -The number of integer digits.
 * @param {number} decimalDigits - The number of decimal digits.
 * @returns {string} - The packed data type format expected by xml service.
 */
function Packed(totalDigits, decimalDigits) {
  return `${totalDigits}p${decimalDigits}`;
}

/**
 * @returns {string} The signed big int (int64) data type format expected by
 * xml service.
 */
function SignedBigInt() {
  return '20i0';
}

/**
 * @returns {string} The signed byte (int8) data type foramt expected by
 * xml service.
 */
function SignedByte() {
  return '3i0';
}

/**
 * @returns {string} The signed int (int32) data type format expected by xml service.
 */
function SignedInt() {
  return '10i0';
}

/**
 * @returns {string} The signed short (int16) data type format expected by
 * xml service.
 */
function SignedShort() {
  return '5i0';
}

/**
 * @returns {string} The unsigned big int (int64) data type format expected by
 * xml service.
 */
function UnsignedBigInt() {
  return '20u0';
}

/**
 * @returns {string} The unsigned byte (int8) data type foramt expected by
 * xml service.
 */
function UnsignedByte() {
  return '3u0';
}

/**
 * @returns {string} The unsigned int (int32) data type format expected by
 * xml service.
 */
function UnsignedInt() {
  return '10u0';
}


/**
 * @returns {string} The signed short (int16) data type format expected by
 * xml service.
 */
function UnsignedShort() {
  return '5u0';
}

/**
 * @param {number} length - The number of characters.
 * @returns {string} - The varchar data type format expected by xml service.
 */
function Varchar(length) {
  return { type: `${length}a`, varying: '2' };
}

/**
 * @param {number} totalDigits - The number of integer digits.
 * @param {number} decimalDigits - The number of decimal digits.
 * @returns {string} - The zoned data type format expected by xml service.
 */
function Zoned(totalDigits, decimalDigits) {
  return `${totalDigits}s${decimalDigits}`;
}

module.exports = {
  Binary,
  Char,
  Double,
  Float,
  LongVarchar,
  Packed,
  SignedBigInt,
  SignedByte,
  SignedInt,
  SignedShort,
  UnsignedBigInt,
  UnsignedByte,
  UnsignedInt,
  UnsignedShort,
  Varchar,
  Zoned,
};
