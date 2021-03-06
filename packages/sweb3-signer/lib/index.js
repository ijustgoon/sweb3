"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('sweb3-eth');
const EC = require('elliptic').ec;
const utils = require('sweb3-utils');
const blockchainPb = require('../proto-js/blockchain_pb');
const MAX_VALUE = '0x' + 'f'.repeat(32);
exports.unsigner = require('./unsigner').default;
exports.ec = new EC('secp256k1');
exports.sha3 = utils.sha3;
exports.getNonce = () => {
    return utils.randomHex(5);
};
exports.hex2bytes = (num) => {
    return utils.hexToBytes(num.startsWith('0x') ? num : '0x' + num);
};
exports.bytes2hex = (bytes) => {
    return utils.bytesToHex(bytes);
};
const signer = ({ from, privateKey, data = '', nonce = exports.getNonce(), quota, validUntilBlock, value = '', version = 0, chainId = 1, to = '', }, externalKey) => {
    if (!privateKey && !externalKey) {
        console.warn(`No private key found`);
        return {
            data,
            from,
            nonce,
            quota,
            validUntilBlock,
            value,
            version,
            chainId,
            to,
        };
    }
    const tx = new blockchainPb.Transaction();
    if (nonce === undefined) {
        tx.setNonce(exports.getNonce());
    }
    else if (nonce.length > 128) {
        throw new Error(`Nonce should be random string with max length of 128`);
    }
    else {
        tx.setNonce(nonce);
    }
    if (typeof quota === 'number' && quota > 0) {
        tx.setQuota(quota);
    }
    else {
        throw new Error('Quota should be larger than 0');
    }
    value = typeof value === 'number' ? '0x' + value.toString(16) : value || '0x0';
    if (value.length > MAX_VALUE.length) {
        throw new Error(`Value should not be larger than ${MAX_VALUE}`);
    }
    if (+value < 0) {
        throw new Error(`Value should not be negative`);
    }
    if (value) {
        try {
            value = value.replace(/^0x/, '');
            if (value.length % 2) {
                value = '0' + value;
            }
            const _value = exports.hex2bytes(value);
            const valueBytes = new Uint8Array(32);
            valueBytes.set(_value, 32 - _value.length);
            tx.setValue(valueBytes);
        }
        catch (err) {
            throw err;
        }
    }
    if (to) {
        if (utils.isAddress(to)) {
            tx.setTo(to.toLowerCase().replace(/^0x/, ''));
        }
        else {
            throw new Error(`Invalid to address`);
        }
    }
    if (validUntilBlock === undefined || isNaN(+validUntilBlock)) {
        throw new Error(`ValidUntilBlock should be set`);
    }
    else {
        tx.setValidUntilBlock(+validUntilBlock);
    }
    if (chainId === undefined) {
        throw new Error(`Chain Id should be set`);
    }
    else {
        tx.setChainId(chainId);
    }
    try {
        if(data){
            const _data = exports.hex2bytes(data);
            tx.setData(new Uint8Array(_data));
        }

    }
    catch (err) {
        throw err;
    }
    tx.setVersion(version);
    const txMsg = tx.serializeBinary();
    const hashedMsg = exports.sha3(txMsg).slice(2);
    var key = exports.ec.keyFromPrivate((externalKey || privateKey).replace(/^0x/, ''), 'hex');
    var sign = key.sign(new Buffer(hashedMsg.toString(), 'hex'), { canonical: true });
    var sign_r = sign.r.toString(16);
    var sign_s = sign.s.toString(16);
    if (sign_r.length == 63)
        sign_r = '0' + sign_r;
    if (sign_s.length == 63)
        sign_s = '0' + sign_s;
    var signature = sign_r + sign_s;
    var sign_buffer = new Buffer(signature, 'hex');
    var sigBytes = new Uint8Array(65);
    sigBytes.set(sign_buffer);
    sigBytes[64] = sign.recoveryParam;
    const unverifiedTx = new blockchainPb.UnverifiedTransaction();
    unverifiedTx.setTransaction(tx);
    unverifiedTx.setCrypto(blockchainPb.Crypto.SECP);
    unverifiedTx.setSignature(sigBytes);
    const serializedUnverifiedTx = unverifiedTx.serializeBinary();
    const hexUnverifiedTx = utils.bytesToHex(serializedUnverifiedTx);
    return hexUnverifiedTx;
};
exports.default = signer;
