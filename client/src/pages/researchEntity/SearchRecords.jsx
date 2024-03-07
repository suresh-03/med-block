import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useCallback,useContext } from 'react'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Record from '../../components/Record'
import CryptoJS from "crypto-js";




const SearchRecords = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [doctorExist, setDoctorExist] = useState(false)
  const [searchDoctorAddress, setSearchDoctorAddress] = useState('')
  const [records, setRecords] = useState([])
  const [requestDoctorAddress,setRequestDoctorAddress] = useState('')
  const [access,setAccess] = useState(false)


  

  const searchDoctor = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchDoctorAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const doctorExists = await contract.methods.getDoctorExists(searchDoctorAddress).call({ from: accounts[0] })
      if (doctorExists) {
        setDoctorExist(true)
        const access = await contract.methods.verifyResearchAccess(searchDoctorAddress).call({ from: accounts[0] })
        setAccess(access)
        if(access){
        // setAlert("you have access","success")
        const records = await contract.methods.researchAccessRecords(searchDoctorAddress).call({ from: accounts[0] })
        console.log('records :>> ', records)
        setRecords(records)
      }
      else{
        setAlert("Access Denied, request Doctor!","error")
        // setAccess(false)

      }

      }
       else if(!doctorExists) {
        setAlert('Doctor does not exist', 'error')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getRequestAccess = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(requestDoctorAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const doctorExists = await contract.methods.getDoctorExists(requestDoctorAddress).call({ from: accounts[0] })
      // console.log(requestPatientAddress)
      if(doctorExists){
        try{
        await contract.methods.giveResearchRequest(requestDoctorAddress).send({ from : accounts[0] })
        setAlert('request sent successfully!','success')
      }catch(err){
        setAlert("request already sent!",'error')
        console.error(err)
      }
      
    }
    else{
      setAlert("Doctor does not exist!","error")
    }
  }
    catch(err){
      console.error(err)
    }
  }


  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
      <Box display='flex' justifyContent='center' width='100vw'>
        <Box width='60%' my={5}>
          {!accounts ? (
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Open your MetaMask wallet to get connected, then refresh this page</Typography>
            </Box>
          ) : (
            <>
              {role === 'researchEntity' ? (
                <>

                  <Typography variant='h4'>Search Doctor</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search patient by wallet address'
                        value={searchDoctorAddress}
                        onChange={e => setSearchDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => {searchDoctor()}}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  {doctorExist && !access && (
                    <>
                     <Typography variant='h4'>Request Doctor</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Enter Doctor Address to request'
                        value={requestDoctorAddress}
                        onChange={e => setRequestDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Request'} handleClick={() => getRequestAccess()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    </Box>
                    </>

                    )}
                 
                  {doctorExist && records.length === 0 && access && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {doctorExist && records.length > 0 && access && (
                    <>
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h4'>Patients Records for Research</Typography>
                    </Box>
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      {records.map((record, index) => (
                        record.map((eachRecord,index) => (
                          <Box mb={2}>
                          <Record key={index} record={eachRecord} />
                        </Box>
                          ))
                        
                      ))}
                    </Box>
                    </>
                  )}
                </>
              ) : (

                  <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Research Entity can only access this page</Typography>
            </Box>


              )}
              
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default SearchRecords
