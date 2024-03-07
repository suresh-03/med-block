import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { grey } from '@mui/material/colors'
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import CryptoJS from "crypto-js";
import CustomButton from './CustomButton'




const Proof = ({ proof }) => {
  const [proofCID,filename] = proof
  // alert(proofCID)
  // const [b64,setb64] = useState("")

  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}


 const fetchData = async () => {
      try {
        alert('Encrypted Content Identifier(CID):\n\n'+proofCID)
        const keyCID = "oiewrhg5623475vbeihc39873948^&%E@ZfytfE#&@^ tf1wufhx231277!*YE2uygdwfyq64r%$Eyt324yrg"
       const decryptedBytes = await CryptoJS.AES.decrypt(proofCID, keyCID);
        const decryptedCID = await decryptedBytes.toString(CryptoJS.enc.Utf8);              // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        const response = await fetch(`https://med-chain.infura-ipfs.io/ipfs/${decryptedCID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
          const key = "askfalq234234123kl4jlkfjalkdsfjq4j!@#LK%Ds#";
         const textData = await response.text()
        
       var decrypted = await CryptoJS.AES.decrypt(textData, key);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = await convertWordArrayToUint8Array(decrypted); 
        

        var fileDec = new Blob([typedArray]);
                     // Convert: WordArray -> typed array


        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var fileName = filename;
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);

        
        console.log(response)

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <DescriptionRoundedIcon style={{ fontSize: 40, color: grey[700] }} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant='h6' color={grey[600]}>
                Participant Proof
              </Typography>
              <Typography variant='h6'>{filename}</Typography>
          </Grid>
          <Grid item xs={9}>
            <CustomButton handleClick={() => fetchData()}>
                      <CloudDownloadRoundedIcon style={{ color: 'white' }} />
            </CustomButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}


export default Proof
