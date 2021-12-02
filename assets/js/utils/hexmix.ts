export default {
    uint8ToHex(data: Uint8Array): string {
      return Array.prototype.map.call(data, (byte: number) => {
        return ('00' + byte.toString(16)).slice(-2);
      }).join('');
    },  
    hexToUint8(data: string): Uint8Array {
      const hexArray = data.match(/.{1,2}/g);
      if (!hexArray) return new Uint8Array(0);
  
      return Uint8Array.from(hexArray.map((char: string) => {
        return parseInt(char, 16)
      }));
    },
    arrayBufferToString(buf: ArrayBuffer, callback: Function) {
      const reader = new FileReader();
      reader.onload = function (event: ProgressEvent<FileReader>) {
        callback(event?.target?.result);
      };
      reader.onerror = function (event: ProgressEvent<FileReader>) {
        alert(event?.target?.error);
      };
      reader.readAsBinaryString(new Blob([ buf ],
        { type: 'application/octet-stream' }));
    },
    stringToArrayBuffer(str: string) {
      const array = new Uint8Array(str.length);
      for(let i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
      }
      return array.buffer
    }
  }