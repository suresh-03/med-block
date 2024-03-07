import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useCallback,useContext } from 'react'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import ResearchEntity from '../../components/ResearchEntity'
import AdminAccess from '../../components/access/adminAccess'





const SearchEntity = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [entityExist, setEntityExist] = useState(false)
  const [searchEntityAddress, setSearchEntityAddress] = useState('')
  const [entityDetails,setEntityDetails] = useState([])
  
  

  const searchEntity = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchEntityAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const entityExists = await contract.methods.getResearchEntityExists(searchEntityAddress).call({ from: accounts[0] })
      if (entityExists) {
        setEntityExist(true)
    
        
        // setAlert("you have access","success")
        const entityDetails = await contract.methods.getResearchEntity(searchEntityAddress).call({ from: accounts[0] })
        console.log(' details :>> ', entityDetails)
        setEntityDetails(entityDetails)
      }
      else{
        setAlert("Entity not exist, register Entity!","error")
        // setAccess(false)

      }

      
    } catch (err) {
      console.log(err)
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
             
              {role === 'admin' && (
                <>

                  <Typography variant='h4'>Research Entity Details</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search Entity by wallet address'
                        value={searchEntityAddress}
                        onChange={e => setSearchEntityAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => {searchEntity()}}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  {entityExist && entityDetails.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {entityExist && entityDetails.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      
                        <Box mb={2}>
                          <ResearchEntity  entity={entityDetails}/>
                        </Box>
                      
                    </Box>
                  )}
                </>
              )}
              <AdminAccess role={role}/>
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default SearchEntity
