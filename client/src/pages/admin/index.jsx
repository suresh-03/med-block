import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React from 'react'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import CustomButton from '../../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../contexts/AlertContext/useAlert'
import { useState,useCallback } from 'react'
import '../../App.css'
import ipfs from '../../ipfs.js'
import CryptoJS from "crypto-js";
import AdminAccess from '../../components/access/adminAccess'
import AddRecordModal from '../doctor/AddRecordModal'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'



const Admin = () => {
const [doctorAddress,setDoctorAddress] = useState('')
const [hospitalAddress,setHospitalAddress] = useState('')
const [proofCID,setProofCID] = useState('')
const [addRecord,setAddRecord] = useState(false);


  const {
    state: { contract, accounts, role, loading },
    dispatch,
  } = useEth()

  const {setAlert} = useAlert()
  const navigate = useNavigate()

  const addRecordCallback = useCallback(
    async (buffer, fileName, patientAddress) => {
      if (!patientAddress) {
        setAlert('Please search for a patient first', 'error')
        return
      }
      try {
        const key = "oiewrhg5623475vbeihc39873948^&%E@ZfytfE#&@^ tf1wufhx231277!*YE2uygdwfyq64r%$Eyt324yrg"
        const res = await ipfs.add(buffer)
        const ipfsHashValue = res[0].hash
        const ipfsBytes = CryptoJS.enc.Utf8.parse(ipfsHashValue);
        var ipfsHash = CryptoJS.AES.encrypt(ipfsBytes, key).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL)
        // console.log(ipfsHash)
        // console.log(ipfsHashValue)
       

        if (ipfsHash) {
          setProofCID(ipfsHash)
          setAlert('New Proof uploaded', 'success')
          setAddRecord(true)

          // refresh records
        }
        
      } catch (err) {
        setAlert('Proof upload failed', 'error')
        console.error(err)
      }
    },
    [doctorAddress, accounts, contract]
  )

  const registerDoctor = async () => {
    try {
       if (!/^(0x)?[0-9a-f]{40}$/i.test(doctorAddress)) {
        setAlert('Please enter a valid doctor address', 'error')
        return
      }
       if (!/^(0x)?[0-9a-f]{40}$/i.test(hospitalAddress)) {
        setAlert('Please enter a valid hospital address', 'error')
        return
      }
      if(proofCID == ''){
        setAlert('Please add proof','error');
        return
      }
    
      await contract.methods.addDoctor(doctorAddress,hospitalAddress,proofCID).send({ from: accounts[0] })
      setAlert('Doctor Added Successfully!','success')
      dispatch({
        type: 'ADD_DOCTOR',
      })
    } catch (err) {
      setAlert("transaction failed!",'error')
      console.error(err)
    }
  }

   if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }
  else{

   return (
    <>
      {role === 'admin' && (
          <div className='register-doctor'>
          <Box display='flex' flexDirection='column' alignItems='center'>
            {/*<Box mb={2}>*/}
              <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        color='secondary'
                        variant='outlined'
                        placeholder='Register Doctor by wallet address'
                        value={doctorAddress}
                        onChange={e => setDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px'} }}
                        InputLabelProps={{ style: { fontSize: '15px'} }}
                        size='small'
                      />
                    </FormControl>
                  </Box>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        color='secondary'
                        variant='outlined'
                        placeholder='Enter hospital address'
                        value={hospitalAddress}
                        onChange={e => setHospitalAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px'} }}
                        InputLabelProps={{ style: { fontSize: '15px'} }}
                        size='small'
                      />
                    </FormControl>
                  </Box>
                  <Modal open={addRecord} onClose={() => setAddRecord(false)}>
                    <AddRecordModal
                      handleClose={() => setAddRecord(false)}
                      handleUpload={addRecordCallback}
                      patientAddress={doctorAddress}
                    />
                  </Modal>
                   <CustomButton text={'Add Proof'} handleClick={() => setAddRecord(true)} disabled={!doctorAddress}>
                      <CloudUploadRoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
              <CustomButton text='Doctor Register' handleClick={() => registerDoctor()}>
                <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            {/*</Box>*/}
            <Typography variant='h5' color='black'>
              If you are a patient, ask your doctor to register for you
            </Typography>
          </Box>
          </div> 

        )}
              <AdminAccess role={role}/>
     
          </>
        )
}

}

export default Admin