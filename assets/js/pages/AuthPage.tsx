// import HexMix from "../utils/hexmix";
// const fragmentData = window.location.hash.split('.');
//     if (fragmentData.length <= 0) {
//       alert("No key found in fragment URI");
//       return;
//     }
//     const key = HexMix.hexToUint8(fragmentData[0]);
//     const iv = HexMix.hexToUint8(fragmentData[1]);

//     const importedKey = await window.crypto.subtle.importKey(
//       'raw',
//       key,
//       'AES-GCM',
//       true,
//       ['encrypt', 'decrypt']
//     );