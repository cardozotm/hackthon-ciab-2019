import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const Buffer = require('buffer/').Buffer;
const forge = require('node-forge');
const { util: { binary: { raw } } } = forge;

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  async generateKeyPair() {
    const pair = forge.pki.rsa.generateKeyPair(1024, 0x10001);
    // Obtem chave pública
    const publicKey = forge.pki.publicKeyToPem(pair.publicKey);
    // Obtem chave privada
    const privateKey = forge.pki.privateKeyToPem(pair.privateKey);
    const result = { pubKey: publicKey, privKey: privateKey };
    return result;
  }

  parseKeys(key: string): string {
    // tslint:disable-next-line:max-line-length
    return key.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|-----BEGIN RSA PRIVATE KEY-----|-----END RSA PRIVATE KEY-----|\n|\r/g, '');
  }

  async encrypt(data, secret): Promise<string> {
    // Encrypt plain text data
    const ciphertext = CryptoJS.AES.encrypt(data, secret).toString();
    return ciphertext;
  }

  async decrypt(data, secret): Promise<string> {
    // Decrypt plain text data
    const bytes = CryptoJS.AES.decrypt(data, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  async hash(data): Promise<string> {
    return CryptoJS.SHA256(data).toString();
  }

  async signWithPrivk(privKey: string, data: string): Promise<string> {
    // console.log('sK: ', privKey); // DEVLOG
    // console.log('msg: ', data); // DEVLOG
    // Sign with the private key...

    // const sign = new JsEncryptModule.JSEncrypt();
    // await sign.setPrivateKey(privKey);
    // const signature = await sign.sign(data, CryptoJS.SHA256, 'sha256');


    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = forge.pki.privateKeyFromPem(privKey).sign(md);
    const signatureHex = Buffer.from(raw.decode(signature)).toString('hex');

    return await signatureHex;
  }

  async verifyWithPubk(pubKey, data, signature): Promise<boolean> {
    // Verify with the original Text public key...
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const verified = forge.pki.publicKeyFromPem(pubKey).verify(md.digest().bytes(), Buffer.from(signature, 'hex'));
    return verified;
  }

  generateNonce(): string {
    return Math.floor(Math.random() * 10000).toString();
  }

}
